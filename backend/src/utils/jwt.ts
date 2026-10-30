import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_EXPIRES_IN_SECONDS } from "../constants/auth.constants";

export interface AccessTokenPayload {
  userId: string;
}

const JWT_ALGORITHM: jwt.Algorithm = "HS256";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
};

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, getJwtSecret(), {
    algorithm: JWT_ALGORITHM,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, getJwtSecret(), {
    algorithms: [JWT_ALGORITHM],
  });

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string" ||
    decoded.userId.length === 0
  ) {
    throw new Error("Invalid access token payload");
  }

  return {
    userId: decoded.userId,
  };
};
