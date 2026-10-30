import request from "supertest";
import mongoose from "mongoose";
import { describe, expect, it, jest } from "@jest/globals";

import app from "../src/app";
import { UserRole } from "../src/enums/user.enums";
import { createAuthenticatedAgent } from "./helpers/auth.helper";
import { createTestTask } from "./helpers/task.helper";
import { emailService } from "../src/services/email.service";

jest
  .spyOn(emailService, "sendVerificationEmail")
  .mockImplementation(async () => {});

describe("Task API", () => {
  const user = {
    name: "Task User",
    email: "taskuser@example.com",
    password: "Test@1234",
  };

  const secondUser = {
    name: "Second User",
    email: "seconduser@example.com",
    password: "Test@1234",
  };

  const adminUser = {
    name: "Admin User",
    email: "admin@example.com",
    password: "Test@1234",
  };

  const validTask = {
    title: "Complete API tests",
    description: "Write integration tests for the task management API.",
  };

  describe("Authentication", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await request(app).get("/api/tasks");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a task for an authenticated user", async () => {
      const agent = await createAuthenticatedAgent(user);

      const response = await agent.post("/api/tasks").send(validTask);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Task created successfully");

      expect(response.body.task).toMatchObject({
        title: validTask.title,
        description: validTask.description,
      });

      expect(response.body.task._id).toBeDefined();
      expect(response.body.task.author).toEqual({
        name: user.name,
      });

      expect(response.body.task.author.email).toBeUndefined();
      expect(response.body.task.author._id).toBeUndefined();
    });

    it("should reject invalid task data", async () => {
      const agent = await createAuthenticatedAgent(user);

      const response = await agent.post("/api/tasks").send({
        title: "Hi",
        description: "Short",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/tasks", () => {
    it("should return the authenticated user's tasks", async () => {
      const agent = await createAuthenticatedAgent(user);

      await agent.post("/api/tasks").send(validTask).expect(201);

      const response = await agent.get("/api/tasks");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks).toHaveLength(1);

      expect(response.body.tasks[0]).toMatchObject({
        title: validTask.title,
        description: validTask.description,
      });

      expect(response.body.tasks[0].author).toEqual({
        name: user.name,
      });
    });

    it("should return only the authenticated user's tasks", async () => {
      const ownerAgent = await createAuthenticatedAgent(user);
      const secondAgent = await createAuthenticatedAgent(secondUser);

      await ownerAgent.post("/api/tasks").send(validTask).expect(201);

      await secondAgent
        .post("/api/tasks")
        .send({
          title: "Second user's task",
          description: "This task belongs to the second user.",
        })
        .expect(201);

      const response = await ownerAgent.get("/api/tasks");

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.tasks[0].title).toBe(validTask.title);
    });

    it("should allow admins to fetch all users' tasks", async () => {
      const ownerAgent = await createAuthenticatedAgent(user);
      const secondAgent = await createAuthenticatedAgent(secondUser);
      const adminAgent = await createAuthenticatedAgent(
        adminUser,
        UserRole.ADMIN,
      );

      await ownerAgent.post("/api/tasks").send(validTask).expect(201);

      await secondAgent
        .post("/api/tasks")
        .send({
          title: "Second user's task",
          description: "This task belongs to the second user.",
        })
        .expect(201);

      const response = await adminAgent.get("/api/tasks");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.tasks).toHaveLength(2);
    });
  });

  describe("GET /api/tasks/:taskId", () => {
    it("should return a task by ID", async () => {
      const agent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(agent, validTask);
      const response = await agent.get(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.task).toMatchObject({
        _id: taskId,
        title: validTask.title,
        description: validTask.description,
      });

      expect(response.body.task.author).toEqual({
        name: user.name,
      });
    });

    it("should return 400 for an invalid task ID", async () => {
      const agent = await createAuthenticatedAgent(user);

      const response = await agent.get("/api/tasks/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid task ID");
    });

    it("should return 404 when the task does not exist", async () => {
      const agent = await createAuthenticatedAgent(user);
      const missingTaskId = new mongoose.Types.ObjectId().toString();

      const response = await agent.get(`/api/tasks/${missingTaskId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Task not found");
    });

    it("should prevent another user from viewing a task", async () => {
      const ownerAgent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(ownerAgent, validTask);
      const secondAgent = await createAuthenticatedAgent(secondUser);

      const response = await secondAgent.get(`/api/tasks/${taskId}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "You do not have permission to view this task",
      );
    });

    it("should allow admins to view another user's task", async () => {
      const ownerAgent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(ownerAgent, validTask);
      const adminAgent = await createAuthenticatedAgent(
        adminUser,
        UserRole.ADMIN,
      );

      const response = await adminAgent.get(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task._id).toBe(taskId);
    });
  });

  describe("PATCH /api/tasks/:taskId", () => {
    it("should allow the author to update their task", async () => {
      const agent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(agent, validTask);

      const response = await agent
        .patch(`/api/tasks/${taskId}`)
        .send({ title: "Updated task title" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Task updated successfully");
      expect(response.body.task.title).toBe("Updated task title");

      expect(response.body.task.author).toEqual({
        name: user.name,
      });
    });

    it("should reject an empty update", async () => {
      const agent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(agent, validTask);

      const response = await agent.patch(`/api/tasks/${taskId}`).send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should reject an update when no values have changed", async () => {
      const agent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(agent, validTask);

      const response = await agent.patch(`/api/tasks/${taskId}`).send({
        title: validTask.title,
        description: validTask.description,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("No changes detected");
    });

    it("should prevent another user from updating the task", async () => {
      const ownerAgent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(ownerAgent, validTask);
      const secondAgent = await createAuthenticatedAgent(secondUser);

      const response = await secondAgent
        .patch(`/api/tasks/${taskId}`)
        .send({ title: "Unauthorized update" });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "You do not have permission to update this task",
      );
    });

    it("should allow admins to update another user's task", async () => {
      const ownerAgent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(ownerAgent, validTask);
      const adminAgent = await createAuthenticatedAgent(
        adminUser,
        UserRole.ADMIN,
      );

      const response = await adminAgent
        .patch(`/api/tasks/${taskId}`)
        .send({ title: "Updated by admin" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task.title).toBe("Updated by admin");
    });
  });

  describe("DELETE /api/tasks/:taskId", () => {
    it("should allow the author to delete their task", async () => {
      const agent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(agent, validTask);

      const response = await agent.delete(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Task deleted successfully",
      });

      const fetchResponse = await agent.get(`/api/tasks/${taskId}`);

      expect(fetchResponse.status).toBe(404);
      expect(fetchResponse.body.message).toBe("Task not found");
    });

    it("should prevent another user from deleting the task", async () => {
      const ownerAgent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(ownerAgent, validTask);
      const secondAgent = await createAuthenticatedAgent(secondUser);

      const response = await secondAgent.delete(`/api/tasks/${taskId}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "You do not have permission to delete this task",
      );
    });

    it("should allow admins to delete another user's task", async () => {
      const ownerAgent = await createAuthenticatedAgent(user);

      const taskId = await createTestTask(ownerAgent, validTask);
      const adminAgent = await createAuthenticatedAgent(
        adminUser,
        UserRole.ADMIN,
      );

      const response = await adminAgent.delete(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Task deleted successfully",
      });

      const fetchResponse = await ownerAgent.get(`/api/tasks/${taskId}`);

      expect(fetchResponse.status).toBe(404);
      expect(fetchResponse.body.message).toBe("Task not found");
    });
  });
});
