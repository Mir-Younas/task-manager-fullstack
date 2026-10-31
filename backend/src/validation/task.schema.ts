import { z } from "zod";

import { TaskStatus } from "../enums/task.enums";

export const createTaskSchema = z.object({
  title: z
    .string({
      error: "Title is required",
    })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string({
      error: "Description is required",
    })
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  status: z
    .enum(TaskStatus, {
      error: "Invalid task status",
    })
    .optional(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const getTasksQuerySchema = z.object({
  status: z.enum(TaskStatus).optional(),

  search: z.string().trim().max(100).optional(),

  sort: z.enum(["newest", "oldest"]).default("newest"),

  page: z.coerce.number<string>().int().min(1).default(1),

  limit: z.coerce.number<string>().int().min(1).max(100).default(10),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type GetTasksQueryInput = z.infer<typeof getTasksQuerySchema>;
