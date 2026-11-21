import request from "supertest";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import app from "../src/app";
import { User } from "../src/models/user.model";
import { EmailVerificationToken } from "../src/models/email-verification-token.model";
import { emailService } from "../src/services/email.service";
import { registerTestUser } from "./helpers/auth.helper";

jest
  .spyOn(emailService, "sendVerificationEmail")
  .mockImplementation(async () => {});

describe("Auth API", () => {
  const validUser = {
    name: "Test User",
    email: "test@example.com",
    password: "Test@1234",
  };

  const loginCredentials = {
    email: validUser.email,
    password: validUser.password,
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await EmailVerificationToken.deleteMany({});
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new unverified user", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Account created successfully. Please check your email to verify your account.",
      );
      expect(response.body.emailSent).toBe(true);

      expect(response.body.data).toMatchObject({
        name: validUser.name,
        email: validUser.email,
      });

      expect(response.body.data.password).toBeUndefined();

      const user = await User.findOne({
        email: validUser.email,
      });

      expect(user).not.toBeNull();
      expect(user?.isEmailVerified).toBe(false);
    });

    it("should reject an invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({ ...validUser, email: "invalid-email" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject a weak password", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({ ...validUser, password: "password" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject a duplicate email", async () => {
      await registerTestUser(validUser);

      const response = await request(app)
        .post("/api/auth/signup")
        .send(validUser);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email already registered");
    });

    it("should handle concurrent signup requests with the same email", async () => {
      await User.init();

      const requests = Array.from({ length: 10 }, () =>
        request(app).post("/api/auth/signup").send(validUser),
      );

      const responses = await Promise.all(requests);

      expect(responses.filter((res) => res.status === 201)).toHaveLength(1);

      expect(responses.filter((res) => res.status === 409)).toHaveLength(9);

      expect(responses.filter((res) => res.status >= 500)).toHaveLength(0);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should reject login when email is not verified", async () => {
      await registerTestUser(validUser);

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginCredentials);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Please verify your email before logging in",
      );
    });

    it("should login with valid credentials after verification", async () => {
      await registerTestUser(validUser, { verified: true });

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginCredentials);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");

      expect(response.body.user).toMatchObject({
        name: validUser.name,
        email: validUser.email,
      });

      expect(response.body.user.password).toBeUndefined();
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should reject an incorrect password", async () => {
      await registerTestUser(validUser);

      const response = await request(app).post("/api/auth/login").send({
        email: validUser.email,
        password: "Wrong@1234",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid email or password");
    });

    it("should reject a nonexistent user", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "missing@example.com",
        password: "Test@1234",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid email or password");
    });

    it("should reject an invalid login request", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "invalid-email",
        password: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should return the authenticated user", async () => {
      await registerTestUser(validUser, { verified: true });

      const agent = request.agent(app);

      await agent.post("/api/auth/login").send(loginCredentials).expect(200);

      const response = await agent.get("/api/auth/me");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("should reject requests without a refresh token", async () => {
      const response = await request(app).post("/api/auth/refresh");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should refresh an authenticated session", async () => {
      await registerTestUser(validUser, { verified: true });

      const agent = request.agent(app);

      await agent.post("/api/auth/login").send(loginCredentials).expect(200);

      const response = await agent.post("/api/auth/refresh");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Session refreshed successfully");
      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Logout successful",
      });

      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });
});
