import { isValidObjectId } from "mongoose";
import type { FilterQuery } from "mongoose";
import { UserRole } from "../enums/user.enums";
import { Task } from "../models/task.model";
import { AppError } from "../utils/app-error";
import type {
  CreateTaskInput,
  GetTasksQueryInput,
  UpdateTaskInput,
} from "../validation/task.schema";
import { getPaginationMeta, getPaginationSkip } from "../utils/pagination";
import { escapeRegex } from "../utils/escape-regex";

type TaskFilter = FilterQuery<InstanceType<typeof Task>>;

const validateTaskId = (taskId: string) => {
  if (!isValidObjectId(taskId)) {
    throw new AppError("Invalid task ID", 400);
  }
};

const findTaskOrThrow = async (taskId: string) => {
  validateTaskId(taskId);

  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

export const createTask = async (userId: string, body: CreateTaskInput) => {
  const task = await Task.create({
    ...body,
    author: userId,
  });

  await task.populate("author", "name -_id");

  return task;
};

export const fetchTasks = async (
  userId: string,
  userRole: UserRole,
  query: GetTasksQueryInput,
) => {
  const { status, search, sort, page, limit } = query;

  const filter: TaskFilter = {};

  if (userRole !== UserRole.ADMIN) {
    filter.author = userId;
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.title = {
      $regex: escapeRegex(search),
      $options: "i",
    };
  }

  const skip = getPaginationSkip({ page, limit });
  const sortOrder = sort === "oldest" ? 1 : -1;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("author", "name -_id")
      .sort({ createdAt: sortOrder, _id: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: getPaginationMeta(total, { page, limit }),
  };
};

export const fetchTaskById = async (
  taskId: string,
  userId: string,
  userRole: UserRole,
) => {
  const task = await findTaskOrThrow(taskId);

  const isAuthor = task.author.toString() === userId;
  const isAdmin = userRole === UserRole.ADMIN;

  if (!isAuthor && !isAdmin) {
    throw new AppError("You do not have permission to view this task", 403);
  }

  await task.populate("author", "name -_id");

  return task;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  userRole: UserRole,
  body: UpdateTaskInput,
) => {
  const task = await findTaskOrThrow(taskId);

  const isAuthor = task.author.toString() === userId;
  const isAdmin = userRole === UserRole.ADMIN;

  if (!isAuthor && !isAdmin) {
    throw new AppError("You do not have permission to update this task", 403);
  }

  const hasChanges = Object.entries(body).some(
    ([key, value]) => task.get(key) !== value,
  );

  if (!hasChanges) {
    throw new AppError("No changes detected", 400);
  }

  Object.assign(task, body);

  await task.save();

  await task.populate("author", "name -_id");

  return task;
};

export const deleteTask = async (
  taskId: string,
  userId: string,
  userRole: UserRole,
) => {
  const task = await findTaskOrThrow(taskId);

  const isAuthor = task.author.toString() === userId;
  const isAdmin = userRole === UserRole.ADMIN;

  if (!isAuthor && !isAdmin) {
    throw new AppError("You do not have permission to delete this task", 403);
  }

  await task.deleteOne();
};
