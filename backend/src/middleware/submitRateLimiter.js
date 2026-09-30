import rateLimit from "express-rate-limit";

export const submitRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.email,
  message: {
    message: "Too many submissions. Please wait a minute and try again.",
  },
});