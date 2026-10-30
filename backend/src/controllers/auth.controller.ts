
import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshSession,
  resendVerificationEmail,
  resetPassword,
  signupUser,
  verifyEmail,
} from "../services/auth.service";

import {
  authenticateGoogleUser,
  generateGoogleAuthUrl,
} from "../services/google-auth.service";

import {
  clearAuthCookies,
  clearGoogleOAuthCookies,
  getGoogleOAuthCookies,
  getRefreshToken,
  setAccessTokenCookie,
  setGoogleOAuthCookies,
  setRefreshTokenCookie,
} from "../utils/auth-cookie";

import { asyncHandler } from "../utils/async-handler";

import type {
  ForgotPasswordInput,
  LoginInput,
  ResendVerificationInput,
  ResetPasswordInput,
  SignupInput,
  VerifyEmailInput,
} from "../validation/auth.schema";

export const signupHandler = asyncHandler<SignupInput>(async (req, res) => {
  const { user, emailSent } = await signupUser(req.body);

  res.status(201).json({
    success: true,
    message: emailSent
      ? "Account created successfully. Please check your email to verify your account."
      : "Account created successfully, but we couldn't send the verification email. Please request a new verification email.",
    emailSent,
    data: user,
  });
});

export const loginHandler = asyncHandler<LoginInput>(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body);

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: "Login successful",
    user,
  });
});

export const logoutHandler = asyncHandler(async (req, res) => {
  const refreshToken = getRefreshToken(req);

  await logoutUser(refreshToken);

  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const getMeHandler = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

export const refreshSessionHandler = asyncHandler(async (req, res) => {
  const refreshToken = getRefreshToken(req);

  const { accessToken } = await refreshSession(refreshToken);

  setAccessTokenCookie(res, accessToken);

  res.status(200).json({
    success: true,
    message: "Session refreshed successfully",
  });
});

export const verifyEmailHandler = asyncHandler<VerifyEmailInput>(
  async (req, res) => {
    await verifyEmail(req.body.token);

    res.status(200).json({
      success: true,
      message: "Email verified successfully. Please log in.",
    });
  },
);

export const resendVerificationHandler = asyncHandler<ResendVerificationInput>(
  async (req, res) => {
    await resendVerificationEmail(req.body.email);

    res.status(200).json({
      success: true,
      message: "If your account requires verification, an email has been sent.",
    });
  },
);

export const forgotPasswordHandler = asyncHandler<ForgotPasswordInput>(
  async (req, res) => {
    await forgotPassword(req.body);

    res.status(200).json({
      success: true,
      message:
        "If an eligible account exists with this email, a password reset link has been sent.",
    });
  },
);

export const resetPasswordHandler = asyncHandler<ResetPasswordInput>(
  async (req, res) => {
    await resetPassword(req.body);

    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in again.",
    });
  },
);

export const googleAuthHandler = asyncHandler(async (_req, res) => {
  const { authorizationUrl, state, codeVerifier } = generateGoogleAuthUrl();

  setGoogleOAuthCookies(res, state, codeVerifier);

  res.redirect(authorizationUrl);
});

export const googleAuthCallbackHandler = asyncHandler(async (req, res) => {
  const { state, codeVerifier } = getGoogleOAuthCookies(req);

  clearGoogleOAuthCookies(res);

  const { accessToken, refreshToken } = await authenticateGoogleUser(
    req.query,
    state,
    codeVerifier,
  );

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  res.redirect(process.env.CLIENT_URL!);
});
