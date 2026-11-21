import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  LoaderCircle,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

import TaskModal from "../components/tasks/TaskModal";
import DeleteTaskDialog from "../components/tasks/DeleteTaskDialog";
import { taskService } from "../services/task.service";
import type { Task, TaskStatus } from "../types/task.types";
import type { CreateTaskFormValues } from "../validations/task.validation";
import { ApiError } from "../utils/api-error";

const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    className: string;
    icon: typeof Circle;
  }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
    icon: Circle,
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700",
    icon: Clock3,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
};

const formatDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
};

const TaskDetailsPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<{
    taskId: string;
    task: Task | null;
    error: string | null;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    let active = true;

    const fetchTask = async () => {
      try {
        const response = await taskService.getTaskById(taskId);

        if (!active) return;

        setResult({
          taskId,
          task: response.task,
          error: null,
        });
      } catch (error: unknown) {
        if (!active) return;

        setResult({
          taskId,
          task: null,
          error:
            error instanceof ApiError
              ? error.message
              : "Unable to load task. Please try again.",
        });
      }
    };

    void fetchTask();

    return () => {
      active = false;
    };
  }, [taskId]);

  const loading = Boolean(taskId) && result?.taskId !== taskId;
  const task = result?.taskId === taskId ? result?.task : null;

  const error = !taskId
    ? "Invalid task ID."
    : result?.taskId === taskId
      ? result.error
      : null;

  const handleEditTask = () => {
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
    setFormError(null);
  };

  const handleSaveTask = async (data: CreateTaskFormValues): Promise<void> => {
    if (!task || isSubmitting) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await taskService.updateTask(task._id, data);

      setResult({
        taskId: task._id,
        task: response.task,
        error: null,
      });

      setIsModalOpen(false);
    } catch (error: unknown) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "Unable to update task. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDelete = () => {
    if (!task) return;

    setTaskToDelete(task);
    setDeleteError(null);
  };

  const handleCloseDelete = () => {
    if (isDeleting) return;

    setTaskToDelete(null);
    setDeleteError(null);
  };

  const handleDeleteTask = async (): Promise<void> => {
    if (!taskToDelete || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await taskService.deleteTask(taskToDelete._id);

      setTaskToDelete(null);
      navigate("/tasks", { replace: true });
    } catch (error: unknown) {
      setDeleteError(
        error instanceof ApiError
          ? error.message
          : "Unable to delete task. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8"
      >
        <LoaderCircle
          size={30}
          className="animate-spin text-indigo-600"
          aria-hidden="true"
        />

        <p className="mt-3 text-sm text-slate-500">Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <AlertCircle
          size={36}
          className="mx-auto text-red-500"
          aria-hidden="true"
        />

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Unable to load task
        </h2>

        <p role="alert" className="mt-2 text-sm text-slate-500">
          {error ?? "Task not found."}
        </p>

        <Link
          to="/tasks"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Tasks
        </Link>
      </div>
    );
  }

  const status = statusConfig[task.status] ?? {
    label: "Unknown",
    className: "bg-slate-100 text-slate-600",
    icon: Circle,
  };

  const StatusIcon = status.icon;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/tasks"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to Tasks
      </Link>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
          >
            <StatusIcon size={14} aria-hidden="true" />
            {status.label}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEditTask}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Pencil size={16} aria-hidden="true" />
              Edit
            </button>

            <button
              type="button"
              onClick={handleOpenDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={16} aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>

        <h1 className="wrap-break-word text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {task.title}
        </h1>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-900">Description</h2>

          <p className="mt-3 wrap-break-word whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {task.description}
          </p>
        </div>

        <div className="mt-8 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <UserRound
              size={18}
              className="mt-0.5 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs text-slate-500">Created by</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {task.author?.name ?? "Unknown user"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays
              size={18}
              className="mt-0.5 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs text-slate-500">Created on</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDate(task.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock3
              size={18}
              className="mt-0.5 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs text-slate-500">Last updated</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDate(task.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </article>

      <TaskModal
        isOpen={isModalOpen}
        task={task}
        isSubmitting={isSubmitting}
        error={formError}
        onClose={handleCloseModal}
        onSubmit={handleSaveTask}
      />

      <DeleteTaskDialog
        task={taskToDelete}
        isDeleting={isDeleting}
        error={deleteError}
        onClose={handleCloseDelete}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
};

export default TaskDetailsPage;
