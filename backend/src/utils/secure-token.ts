import { createHmac, randomBytes } from "node:crypto";

import { SECURE_TOKEN_BYTE_LENGTH } from "../constants/auth.constants";

interface CreateSecureTokenOptions {
  secret: string;
  expiresInMs: number;
  byteLength?: number;
}

interface SecureTokenResult {
  rawToken: string;
  tokenHash: string;
  expiresAt: Date;
}

export const hashToken = (token: string, secret: string): string => {
  if (!token || !secret) {
    throw new Error("Token and secret are required");
  }

  return createHmac("sha256", secret).update(token).digest("hex");
};

export const createSecureToken = ({
  secret,
  expiresInMs,
  byteLength = SECURE_TOKEN_BYTE_LENGTH,
}: CreateSecureTokenOptions): SecureTokenResult => {
  if (!secret) {
    throw new Error("Token secret is required");
  }

  if (!Number.isSafeInteger(expiresInMs) || expiresInMs <= 0) {
    throw new Error("Invalid token expiration");
  }

  if (!Number.isSafeInteger(byteLength) || byteLength < 32) {
    throw new Error("Invalid token byte length");
  }

  const rawToken = randomBytes(byteLength).toString("hex");

  const tokenHash = hashToken(rawToken, secret);

  const expiresAt = new Date(Date.now() + expiresInMs);

  return {
    rawToken,
    tokenHash,
    expiresAt,
  };
};
