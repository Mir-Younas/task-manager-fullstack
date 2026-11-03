import { axiosInstance } from "../config/axios";

import type {
  CreateTaskInput,
  DeleteTaskResponse,
  GetTasksQuery,
  TaskListResponse,
  TaskResponse,
  UpdateTaskInput,
} from "../types/task.types";

const TASKS_ENDPOINT = "/api/tasks";

export const taskService = {
  getTasks: async (
    query: GetTasksQuery = {},
    signal?: AbortSignal,
  ): Promise<TaskListResponse> => {
    const response = await axiosInstance.get<TaskListResponse>(TASKS_ENDPOINT, {
      params: query,
      signal,
    });

    return response.data;
  },

  getTaskById: async (taskId: string): Promise<TaskResponse> => {
    const response = await axiosInstance.get<TaskResponse>(
      `${TASKS_ENDPOINT}/${encodeURIComponent(taskId)}`,
    );

    return response.data;
  },

  createTask: async (data: CreateTaskInput): Promise<TaskResponse> => {
    const response = await axiosInstance.post<TaskResponse>(
      TASKS_ENDPOINT,
      data,
    );

    return response.data;
  },

  updateTask: async (
    taskId: string,
    data: UpdateTaskInput,
  ): Promise<TaskResponse> => {
    const response = await axiosInstance.patch<TaskResponse>(
      `${TASKS_ENDPOINT}/${encodeURIComponent(taskId)}`,
      data,
    );

    return response.data;
  },

  deleteTask: async (taskId: string): Promise<DeleteTaskResponse> => {
    const response = await axiosInstance.delete<DeleteTaskResponse>(
      `${TASKS_ENDPOINT}/${encodeURIComponent(taskId)}`,
    );

    return response.data;
  },
};
