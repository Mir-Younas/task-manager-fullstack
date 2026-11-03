import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";

import type { Task } from "../../types/task.types";
import {
  createTaskSchema,
  type CreateTaskFormValues,
} from "../../validations/task.validation";

interface TaskFormProps {
  task?: Task | null;
  isSubmitting: boolean;
  onSubmit: (data: CreateTaskFormValues) => Promise<void>;
  onCancel: () => void;
}

const TaskForm = ({
  task,
  isSubmitting,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const isEditing = Boolean(task);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "pending",
    },
  });

  useEffect(() => {
    reset({
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "pending",
    });
  }, [task, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Title */}
      <div>
        <label
          htmlFor="task-title"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Task Title
        </label>

        <input
          id="task-title"
          type="text"
          maxLength={100}
          placeholder="Enter task title"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "task-title-error" : undefined}
          {...register("title")}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        {errors.title && (
          <p
            id="task-title-error"
            role="alert"
            className="mt-1.5 text-xs text-red-600"
          >
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="task-description"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Description
        </label>

        <textarea
          id="task-description"
          rows={5}
          maxLength={1000}
          placeholder="Describe your task..."
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "task-description-error" : undefined
          }
          {...register("description")}
          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        {errors.description && (
          <p
            id="task-description-error"
            role="alert"
            className="mt-1.5 text-xs text-red-600"
          >
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="task-status-field"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Status
        </label>

        <select
          id="task-status-field"
          {...register("status")}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {errors.status && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            {errors.status.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && (
            <LoaderCircle
              size={17}
              className="animate-spin"
              aria-hidden="true"
            />
          )}

          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
