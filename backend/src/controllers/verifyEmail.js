import jwt from "jsonwebtoken";
import AuthUser from "../models/authUser.js";
import PendingUser from "../models/pendingUser.js";
import {
  generateOtp,
  hashOtp,
  otpMatches,
  hashVerificationId,
  OTP_TTL_MS,
  RESEND_COOLDOWN_MS,
  MAX_ATTEMPTS,
} from "../utils/otp.js";
import { sendOtpEmail, isRecipientRejected } from "../utils/sendEmail.js";

const isProduction = process.env.NODE_ENV === "production";

const toIdHash = (id) =>
  typeof id === "string" && id.length >= 20 && id.length <= 64
    ? hashVerificationId(id)
    : null;

const expired = (res) =>
  res.status(400).json({
    message: "Verification expired. Please register again.",
    code: "VERIFICATION_EXPIRED",
  });

export const verifyOtpHandler = async (req, res) => {
  try {
    const { verificationId, otp } = req.body || {};
    if (!/^\d{6}$/.test(String(otp ?? ""))) {
      return res.status(400).json({ message: "Enter the 6-digit code" });
    }
    const idHash = toIdHash(verificationId);
    if (!idHash) return expired(res);

    const pending = await PendingUser.findOneAndUpdate(
      { verificationHash: idHash, attempts: { $lt: MAX_ATTEMPTS } },
      { $inc: { attempts: 1 } },
      { new: true },
    );

    if (!pending) {
      const stillThere = await PendingUser.findOne({ verificationHash: idHash });
      if (!stillThere) return expired(res);
      return res.status(429).json({
        message: "Too many incorrect attempts. Please request a new code.",
        code: "TOO_MANY_ATTEMPTS",
      });
    }

    if (pending.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        message: "This code has expired. Please request a new one.",
        code: "OTP_EXPIRED",
      });
    }

    const email = pending.email;
    if (!otpMatches(email, String(otp), pending.otpHash)) {
      const left = MAX_ATTEMPTS - pending.attempts;
      return res.status(400).json({
        message:
          left > 0
            ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.`
            : "Incorrect code. Please request a new code.",
      });
    }

    const emailTaken = () =>
      PendingUser.deleteOne({ email }).then(() =>
        res.status(400).json({
          message: "Email already exists",
          code: "EMAIL_EXISTS",
        }),
      );

    if (await AuthUser.findOne({ email })) return emailTaken();

    let user;
    try {
      user = await AuthUser.create({
        firstName: pending.firstName,
        lastName: pending.lastName,
        email,
        password: pending.password,
      });
    } catch (err) {
      if (err?.code === 11000) return emailTaken();
      throw err;
    }

    try {
      await PendingUser.deleteOne({ email });
    } catch (err) {
      console.error("Could not remove pending sign-up:", err.message); 
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Email verified. Account created.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOtpHandler = async (req, res) => {
  try {
    const idHash = toIdHash((req.body || {}).verificationId);
    if (!idHash) return expired(res);

    const pending = await PendingUser.findOne({ verificationHash: idHash });
    if (!pending) return expired(res);

    const waitMs =
      RESEND_COOLDOWN_MS - (Date.now() - pending.lastSentAt.getTime());
    if (waitMs > 0) {
      const seconds = Math.ceil(waitMs / 1000);
      return res.status(429).json({
        message: `Please wait ${seconds}s before requesting another code.`,
        retryAfter: seconds,
      });
    }

    const otp = generateOtp();
    const now = Date.now();
    await PendingUser.updateOne(
      { email: pending.email },
      {
        $set: {
          otpHash: hashOtp(pending.email, otp),
          otpExpiresAt: new Date(now + OTP_TTL_MS),
          attempts: 0,
          lastSentAt: new Date(now),
        },
      },
    );

    try {
      await sendOtpEmail(pending.email, otp, pending.firstName);
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr.message);
      if (isRecipientRejected(mailErr)) {
        await PendingUser.deleteOne({ email: pending.email });
        return res.status(400).json({
          message:
            "We couldn't deliver an email to that address. Please register again with a valid address.",
          code: "EMAIL_UNDELIVERABLE",
        });
      }
      return res.status(500).json({
        message:
          "We couldn't send the verification email right now. Please try again in a few minutes.",
      });
    }

    return res.status(200).json({ message: "A new code has been sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};