export const TASK_STATUSES = ["pending", "in-progress", "completed"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskSort = "newest" | "oldest";

export interface TaskAuthor {
  name: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  author: TaskAuthor | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface GetTasksQuery {
  status?: TaskStatus;
  search?: string;
  sort?: TaskSort;
  page?: number;
  limit?: number;
}

export interface TaskPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TaskListResponse {
  success: boolean;
  tasks: Task[];
  pagination: TaskPagination;
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  task: Task;
}

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
}
