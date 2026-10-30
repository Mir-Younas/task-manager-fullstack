/**
 * Cookie Names
 */
export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

/**
 * Access Token (JWT)
 * Expires in 15 minutes
 */
export const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 15 * 60;

export const ACCESS_TOKEN_COOKIE_MAX_AGE_MS =
  ACCESS_TOKEN_EXPIRES_IN_SECONDS * 1000;

/**
 * Refresh Token (Opaque)
 * Expires in 7 days
 */
export const REFRESH_TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = REFRESH_TOKEN_EXPIRES_IN_MS;

/**
 * Email Verification Token
 * Expires in 24 hours
 */
export const EMAIL_VERIFICATION_EXPIRES_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Password Reset Token
 * Expires in 15 minutes
 */
export const PASSWORD_RESET_EXPIRES_IN_MS = 15 * 60 * 1000;

/**
 * Secure Token Configuration
 * 32 bytes = 256 bits
 */
export const SECURE_TOKEN_BYTE_LENGTH = 32;

/**
 * Google OAuth Temporary Cookies
 * Expire in 10 minutes
 */
export const GOOGLE_OAUTH_STATE_COOKIE_NAME = "google_oauth_state";

export const GOOGLE_OAUTH_VERIFIER_COOKIE_NAME = "google_oauth_verifier";

export const GOOGLE_OAUTH_COOKIE_MAX_AGE_MS = 10 * 60 * 1000;
