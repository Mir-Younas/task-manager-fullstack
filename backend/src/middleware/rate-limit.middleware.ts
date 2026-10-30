
import { rateLimit } from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 50,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many login requests. Please try again later.",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many authentication requests. Please try again later.",
  },
});

export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many email requests. Please try again later.",
  },
});
