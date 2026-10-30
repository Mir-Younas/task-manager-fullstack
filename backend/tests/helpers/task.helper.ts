import { expect } from "@jest/globals";

import type { AuthenticatedAgent } from "./auth.helper";

export type TestTaskInput = {
  title: string;
  description: string;
};

export const createTestTask = async (
  agent: AuthenticatedAgent,
  task: TestTaskInput,
): Promise<string> => {
  const response = await agent.post("/api/tasks").send(task).expect(201);
  const id: unknown = response.body.task?._id;

  expect(typeof id).toBe("string");
  if (typeof id !== "string") {
    throw new Error("Task creation did not return a string ID");
  }

  return id;
};
