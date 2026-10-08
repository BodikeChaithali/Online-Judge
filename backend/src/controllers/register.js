import AuthUser from "../models/authUser.js";
import PendingUser from "../models/pendingUser.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import {
  generateOtp,
  hashOtp,
  generateVerificationId,
  hashVerificationId,
  OTP_TTL_MS,
  RESEND_COOLDOWN_MS,
  PENDING_TTL_MS,
} from "../utils/otp.js";
import {
  sendOtpEmail,
  isRecipientRejected,
  canReceiveMail,
  maskEmail,
} from "../utils/sendEmail.js";

const registerHandler = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};
    if (
      ![firstName, lastName, email, password].every((v) => typeof v === "string") ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    if (
      trimmedFirstName.length > 50 ||
      trimmedLastName.length > 50 ||
      trimmedEmail.length > 254 ||
      password.length > 128
    ) {
      return res.status(400).json({ message: "One of the fields is too long" });
    }
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(trimmedFirstName) || !nameRegex.test(trimmedLastName)) {
      return res.status(400).json({
        message: "First name and last name must contain only letters",
      });
    }
    if (!validator.isEmail(trimmedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol",
      });
    }
    const existingUser = await AuthUser.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (!(await canReceiveMail(trimmedEmail))) {
      return res.status(400).json({
        message:
          "That email address can't receive mail. Please check it for typos.",
      });
    }

    const pending = await PendingUser.findOne({ email: trimmedEmail });
    if (pending) {
      const waitMs =
        RESEND_COOLDOWN_MS - (Date.now() - pending.lastSentAt.getTime());
      if (waitMs > 0) {
        const seconds = Math.ceil(waitMs / 1000);
        return res.status(429).json({
          message: `Please wait ${seconds}s before requesting another code.`,
          retryAfter: seconds,
        });
      }
    }

    const otp = generateOtp();
    const verificationId = generateVerificationId();
    const now = Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);

    await PendingUser.updateOne(
      { email: trimmedEmail },
      {
        $set: {
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          password: hashedPassword,
          verificationHash: hashVerificationId(verificationId),
          otpHash: hashOtp(trimmedEmail, otp),
          otpExpiresAt: new Date(now + OTP_TTL_MS),
          attempts: 0,
          lastSentAt: new Date(now),
          expiresAt: new Date(now + PENDING_TTL_MS),
        },
      },
      { upsert: true },
    );

    try {
      await sendOtpEmail(trimmedEmail, otp, trimmedFirstName);
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr.message);
      await PendingUser.deleteOne({ email: trimmedEmail });
      if (isRecipientRejected(mailErr)) {
        return res.status(400).json({
          message:
            "We couldn't deliver an email to that address. Please check it and try again.",
          code: "EMAIL_UNDELIVERABLE",
        });
      }
      return res.status(500).json({
        message:
          "We couldn't send the verification email right now. Please try again in a few minutes.",
      });
    }

    return res.status(200).json({
      message: "Verification code sent",
      requiresVerification: true,
      verificationId,
      maskedEmail: maskEmail(trimmedEmail),
      resendAfter: RESEND_COOLDOWN_MS / 1000,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerHandler;