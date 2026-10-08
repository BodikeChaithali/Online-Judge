import crypto from "crypto";

export const OTP_TTL_MS = 10 * 60 * 1000; 
export const RESEND_COOLDOWN_MS = 60 * 1000; 
export const PENDING_TTL_MS = 30 * 60 * 1000; 
export const MAX_ATTEMPTS = 5; 

export const generateOtp = () =>
  String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");

export const hashOtp = (email, otp) =>
  crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(`${email}:${otp}`)
    .digest("hex");

export const otpMatches = (email, otp, storedHash) => {
  const a = Buffer.from(hashOtp(email, otp));
  const b = Buffer.from(String(storedHash));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export const generateVerificationId = () =>
  crypto.randomBytes(24).toString("base64url");

export const hashVerificationId = (id) =>
  crypto.createHash("sha256").update(id).digest("hex");
