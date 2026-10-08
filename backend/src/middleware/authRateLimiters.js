import rateLimit from "express-rate-limit";

const limiter = (limit, message) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });

export const registerLimiter = limiter(
  20,
  "Too many sign-up attempts. Please try again in a few minutes.",
);
export const verifyLimiter = limiter(
  60,
  "Too many verification attempts. Please try again in a few minutes.",
);
export const resendLimiter = limiter(
  20,
  "Too many code requests. Please try again in a few minutes.",
);
