import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import { OAuth2Client, CodeChallengeMethod } from "google-auth-library";

import { UserStatus } from "../enums/user.enums";
import { User } from "../models/user.model";
import { AppError } from "../utils/app-error";
import { isDuplicateKeyError } from "../utils/mongo-error";
import { createAuthSession } from "./auth.service";

const getGoogleConfig = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

  if (!clientId || !clientSecret || !callbackUrl) {
    throw new Error("Google OAuth environment variables are missing");
  }

  return { clientId, clientSecret, callbackUrl };
};

const createGoogleClient = () => {
  const { clientId, clientSecret, callbackUrl } = getGoogleConfig();

  return new OAuth2Client(clientId, clientSecret, callbackUrl);
};

export const generateGoogleAuthUrl = () => {
  const client = createGoogleClient();

  const state = randomBytes(32).toString("base64url");
  const codeVerifier = randomBytes(32).toString("base64url");

  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  const authorizationUrl = client.generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    state,
    code_challenge: codeChallenge,
    code_challenge_method: CodeChallengeMethod.S256,
    prompt: "select_account",
  });

  return {
    authorizationUrl,
    state,
    codeVerifier,
  };
};

export const authenticateGoogleUser = async (
  query: Request["query"],
  savedState?: string,
  codeVerifier?: string,
) => {
  const { code, state, error } = query;

  if (error) {
    throw new AppError("Google authentication failed", 401);
  }

  if (
    typeof code !== "string" ||
    typeof state !== "string" ||
    !savedState ||
    !codeVerifier
  ) {
    throw new AppError("Invalid Google OAuth callback", 400);
  }

  const receivedState = Buffer.from(state);
  const expectedState = Buffer.from(savedState);

  if (
    receivedState.length !== expectedState.length ||
    !timingSafeEqual(receivedState, expectedState)
  ) {
    throw new AppError("Invalid Google OAuth callback", 400);
  }

  const client = createGoogleClient();
  const { clientId, callbackUrl } = getGoogleConfig();

  const { tokens } = await client.getToken({
    code,
    codeVerifier,
    redirect_uri: callbackUrl,
  });

  if (!tokens.id_token) {
    throw new AppError("Google identity token is missing", 401);
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: clientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || !payload.email_verified) {
    throw new AppError("Google account identity is not verified", 401);
  }

  const googleId = payload.sub;
  const email = payload.email.toLowerCase();
  const name = payload.name || email.split("@")[0];

  let user = await User.findOne({ googleId });

  if (!user) {
    const existingEmailUser = await User.findOne({ email });

    if (existingEmailUser) {
      throw new AppError(
        "An account with this email already exists. Please sign in using your existing login method.",
        409,
      );
    }

    try {
      user = await User.create({
        name,
        email,
        googleId,
        isEmailVerified: true,
      });
    } catch (error: unknown) {
      if (!isDuplicateKeyError(error)) {
        throw error;
      }

      user = await User.findOne({ googleId });

      if (!user) {
        throw new AppError(
          "An account with this email already exists. Please sign in using your existing login method.",
          409,
        );
      }
    }
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError("Your account has been blocked", 403);
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
