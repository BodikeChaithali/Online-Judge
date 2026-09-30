import rateLimit from "express-rate-limit";

export const runRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.email,
  message: {
    success: false,
    error: "Too many runs. Please wait a minute and try again.",
    type: "RATE_LIMIT",
  },
});
