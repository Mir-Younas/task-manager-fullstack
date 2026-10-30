import request from "supertest";
import { expect } from "@jest/globals";

import app from "../../src/app";
import { UserRole, UserStatus } from "../../src/enums/user.enums";
import { User } from "../../src/models/user.model";

export type TestUserCredentials = {
  name: string;
  email: string;
  password: string;
};

export type RegisterTestUserOptions = {
  verified?: boolean;
};

export const registerTestUser = async (
  credentials: TestUserCredentials,
  options: RegisterTestUserOptions = {},
): Promise<void> => {
  await request(app).post("/api/auth/signup").send(credentials).expect(201);

  if (options.verified) {
    const result = await User.updateOne(
      { email: credentials.email },
      {
        $set: {
          isEmailVerified: true,
        },
      },
    );

    expect(result.matchedCount).toBe(1);
  }
};

export const createAuthenticatedAgent = async (
  credentials: TestUserCredentials,
  role: UserRole = UserRole.USER,
) => {
  const agent = request.agent(app);

  await agent.post("/api/auth/signup").send(credentials).expect(201);

  const result = await User.updateOne(
    { email: credentials.email },
    {
      $set: {
        role,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        failedLoginAttempts: 0,
        loginLockedUntil: null,
      },
    },
  );

  expect(result.matchedCount).toBe(1);

  await agent
    .post("/api/auth/login")
    .send({
      email: credentials.email,
      password: credentials.password,
    })
    .expect(200);

  return agent;
};

export type AuthenticatedAgent = Awaited<
  ReturnType<typeof createAuthenticatedAgent>
>;
