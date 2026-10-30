import { Router } from "express";

import {
  signupHandler,
  loginHandler,
  logoutHandler,
  refreshSessionHandler,
  getMeHandler,
  verifyEmailHandler,
  resendVerificationHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  googleAuthHandler,
  googleAuthCallbackHandler,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  authRateLimiter,
  loginRateLimiter,
  emailRateLimiter,
} from "../middleware/rate-limit.middleware";

import {
  signupSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/auth.schema";

const authRouter = Router();

// Registration
authRouter.post(
  "/signup",
  authRateLimiter,
  validate(signupSchema),
  signupHandler,
);

// Login
authRouter.post(
  "/login",
  loginRateLimiter,
  validate(loginSchema),
  loginHandler,
);

// Google OAuth
authRouter.get("/google", authRateLimiter, googleAuthHandler);

authRouter.get("/google/callback", googleAuthCallbackHandler);

// Current authenticated user
authRouter.get("/me", authenticate, getMeHandler);

// Email verification
authRouter.post(
  "/verify-email",
  validate(verifyEmailSchema),
  verifyEmailHandler,
);

authRouter.post(
  "/resend-verification",
  emailRateLimiter,
  validate(resendVerificationSchema),
  resendVerificationHandler,
);

// Password recovery
authRouter.post(
  "/forgot-password",
  emailRateLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordHandler,
);

authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordHandler,
);

// Session management
authRouter.post("/refresh", refreshSessionHandler);
authRouter.post("/logout", logoutHandler);

export default authRouter;
