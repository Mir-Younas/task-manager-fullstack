import bcrypt from "bcryptjs";

import {
  EMAIL_VERIFICATION_EXPIRES_IN_MS,
  PASSWORD_RESET_EXPIRES_IN_MS,
  REFRESH_TOKEN_EXPIRES_IN_MS,
} from "../constants/auth.constants";
import { UserStatus } from "../enums/user.enums";
import { EmailVerificationToken } from "../models/email-verification-token.model";
import { PasswordResetToken } from "../models/password-reset-token.model";
import { Session } from "../models/session.model";
import { User } from "../models/user.model";
import { AppError } from "../utils/app-error";
import { generateAccessToken } from "../utils/jwt";
import { createSecureToken, hashToken } from "../utils/secure-token";
import type {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignupInput,
} from "../validation/auth.schema";
import { emailService } from "./email.service";
import {
  checkLoginCooldown,
  registerFailedLogin,
  resetLoginSecurity,
} from "./login-security.service";
import { isDuplicateKeyError } from "../utils/mongo-error";

const createAndSendVerificationEmail = async (
  userId: string,
  email: string,
): Promise<boolean> => {
  const secret = process.env.EMAIL_VERIFICATION_TOKEN_SECRET;

  if (!secret) {
    throw new Error("EMAIL_VERIFICATION_TOKEN_SECRET is missing");
  }

  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new Error("CLIENT_URL is missing");
  }

  const { rawToken, tokenHash, expiresAt } = createSecureToken({
    secret,
    expiresInMs: EMAIL_VERIFICATION_EXPIRES_IN_MS,
  });

  await EmailVerificationToken.deleteMany({ user: userId });

  await EmailVerificationToken.create({
    user: userId,
    tokenHash,
    expiresAt,
  });

  const verificationUrl = new URL("/email-verification", clientUrl);
  verificationUrl.searchParams.set("token", rawToken);

  try {
    await emailService.sendVerificationEmail(email, verificationUrl.toString());

    return true;
  } catch {
    return false;
  }
};

export const createAuthSession = async (userId: string) => {
  const secret = process.env.REFRESH_TOKEN_SECRET_KEY;

  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET_KEY is missing");
  }

  const accessToken = generateAccessToken(userId);

  const { rawToken, tokenHash, expiresAt } = createSecureToken({
    secret,
    expiresInMs: REFRESH_TOKEN_EXPIRES_IN_MS,
  });

  await Session.create({
    user: userId,
    refreshTokenHash: tokenHash,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken: rawToken,
  };
};

export const signupUser = async (body: SignupInput) => {
  const existingUser = await User.findOne({
    email: body.email,
  });

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(body.password, 12);

  let user;

  try {
    user = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      throw new AppError("Email already registered", 409);
    }

    throw error;
  }

  const emailSent = await createAndSendVerificationEmail(user.id, user.email);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    emailSent,
  };
};

export const loginUser = async (body: LoginInput) => {
  const user = await User.findOne({
    email: body.email,
  }).select("+password");

  if (!user || !user.password) {
    throw new AppError("Invalid email or password", 401);
  }

  checkLoginCooldown(user.loginLockedUntil);

  const passwordMatches = await bcrypt.compare(body.password, user.password);

  if (!passwordMatches) {
    await registerFailedLogin(user.id);
    throw new AppError("Invalid email or password", 401);
  }

  if (user.failedLoginAttempts > 0 || user.loginLockedUntil) {
    await resetLoginSecurity(user.id);
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError("Your account has been blocked", 403);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email before logging in", 403);
  }

  const { accessToken, refreshToken } = await createAuthSession(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const logoutUser = async (refreshToken?: string): Promise<void> => {
  if (!refreshToken) {
    return;
  }

  const secret = process.env.REFRESH_TOKEN_SECRET_KEY;

  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET_KEY is missing");
  }

  const refreshTokenHash = hashToken(refreshToken, secret);

  await Session.deleteMany({ refreshTokenHash });
};

export const refreshSession = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is missing", 401);
  }

  const secret = process.env.REFRESH_TOKEN_SECRET_KEY;

  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET_KEY is missing");
  }

  const refreshTokenHash = hashToken(refreshToken, secret);

  const session = await Session.findOne({
    refreshTokenHash,
  });

  if (!session) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  if (session.expiresAt <= new Date()) {
    await Session.deleteOne({ _id: session._id });

    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(session.user);

  if (!user) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError("Your account has been blocked", 403);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email before continuing", 403);
  }

  return {
    accessToken: generateAccessToken(user.id),
  };
};

export const verifyEmail = async (rawToken: string): Promise<void> => {
  const secret = process.env.EMAIL_VERIFICATION_TOKEN_SECRET;

  if (!secret) {
    throw new Error("EMAIL_VERIFICATION_TOKEN_SECRET is missing");
  }

  const tokenHash = hashToken(rawToken, secret);

  const verificationToken = await EmailVerificationToken.findOne({
    tokenHash,
  });

  if (!verificationToken) {
    throw new AppError("Invalid or expired verification link", 400);
  }

  if (verificationToken.expiresAt <= new Date()) {
    throw new AppError("Verification link has expired", 400);
  }

  const user = await User.findById(verificationToken.user);

  if (!user) {
    throw new AppError("User no longer exists", 404);
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError("Your account has been blocked", 403);
  }

  user.isEmailVerified = true;
  await user.save();

  await EmailVerificationToken.deleteMany({
    user: user._id,
  });
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });

  if (!user || user.isEmailVerified || user.status === UserStatus.BLOCKED) {
    return;
  }

  const emailSent = await createAndSendVerificationEmail(user.id, user.email);

  if (!emailSent) {
    throw new AppError("Unable to send verification email at this time", 503);
  }
};

export const forgotPassword = async (
  body: ForgotPasswordInput,
): Promise<void> => {
  const user = await User.findOne({
    email: body.email,
  });

  if (!user || user.status === UserStatus.BLOCKED || !user.isEmailVerified) {
    return;
  }

  const secret = process.env.PASSWORD_RESET_TOKEN_SECRET;

  if (!secret) {
    throw new Error("PASSWORD_RESET_TOKEN_SECRET is missing");
  }

  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new Error("CLIENT_URL is missing");
  }

  const { rawToken, tokenHash, expiresAt } = createSecureToken({
    secret,
    expiresInMs: PASSWORD_RESET_EXPIRES_IN_MS,
  });

  await PasswordResetToken.deleteMany({
    user: user._id,
  });

  await PasswordResetToken.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  const resetUrl = new URL("/password-reset", clientUrl);
  resetUrl.searchParams.set("token", rawToken);

  await emailService.sendPasswordResetEmail(user.email, resetUrl.toString());
};

export const resetPassword = async (
  body: ResetPasswordInput,
): Promise<void> => {
  const secret = process.env.PASSWORD_RESET_TOKEN_SECRET;

  if (!secret) {
    throw new Error("PASSWORD_RESET_TOKEN_SECRET is missing");
  }

  const tokenHash = hashToken(body.token, secret);

  const resetToken = await PasswordResetToken.findOne({
    tokenHash,
  });

  if (!resetToken) {
    throw new AppError("Invalid or expired password reset link", 400);
  }

  if (resetToken.expiresAt <= new Date()) {
    throw new AppError("Password reset link has expired", 400);
  }

  const user = await User.findById(resetToken.user);

  if (!user) {
    throw new AppError("User no longer exists", 404);
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError("Your account has been blocked", 403);
  }

  const hashedPassword = await bcrypt.hash(body.password, 12);

  await User.findByIdAndUpdate(user.id, {
    $set: {
      password: hashedPassword,
      failedLoginAttempts: 0,
      loginLockedUntil: null,
    },
  });

  await Session.deleteMany({ user: user._id });

  await PasswordResetToken.deleteMany({
    user: user._id,
  });
};
