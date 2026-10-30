import type { CookieOptions, Request, Response } from "express";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  GOOGLE_OAUTH_STATE_COOKIE_NAME,
  GOOGLE_OAUTH_VERIFIER_COOKIE_NAME,
  GOOGLE_OAUTH_COOKIE_MAX_AGE_MS,
} from "../constants/auth.constants";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

const accessTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  path: "/api/auth",
  maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
};

const googleOAuthCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  sameSite: "lax",
  path: "/api/auth/google",
  maxAge: GOOGLE_OAUTH_COOKIE_MAX_AGE_MS,
};

export const setAccessTokenCookie = (
  res: Response,
  accessToken: string,
): void => {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, accessTokenCookieOptions);
};

export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string,
): void => {
  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    refreshTokenCookieOptions,
  );
};

export const clearAccessTokenCookie = (res: Response): void => {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, baseCookieOptions);
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    ...baseCookieOptions,
    path: "/api/auth",
  });
};

export const clearAuthCookies = (res: Response): void => {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);
};

export const getRefreshToken = (req: Request): string | undefined => {
  const token: unknown = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  return typeof token === "string" ? token : undefined;
};

// Google OAuth

export const setGoogleOAuthCookies = (
  res: Response,
  state: string,
  codeVerifier: string,
): void => {
  res.cookie(GOOGLE_OAUTH_STATE_COOKIE_NAME, state, googleOAuthCookieOptions);

  res.cookie(
    GOOGLE_OAUTH_VERIFIER_COOKIE_NAME,
    codeVerifier,
    googleOAuthCookieOptions,
  );
};

export const getGoogleOAuthCookies = (
  req: Request,
): {
  state?: string;
  codeVerifier?: string;
} => {
  const state: unknown = req.cookies?.[GOOGLE_OAUTH_STATE_COOKIE_NAME];

  const codeVerifier: unknown =
    req.cookies?.[GOOGLE_OAUTH_VERIFIER_COOKIE_NAME];

  return {
    state: typeof state === "string" ? state : undefined,
    codeVerifier: typeof codeVerifier === "string" ? codeVerifier : undefined,
  };
};

export const clearGoogleOAuthCookies = (res: Response): void => {
  const clearOptions: CookieOptions = {
    ...googleOAuthCookieOptions,
    maxAge: undefined,
  };

  res.clearCookie(GOOGLE_OAUTH_STATE_COOKIE_NAME, clearOptions);
  res.clearCookie(GOOGLE_OAUTH_VERIFIER_COOKIE_NAME, clearOptions);
};
