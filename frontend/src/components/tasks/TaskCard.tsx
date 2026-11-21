import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Task, TaskStatus } from "../../types/task.types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

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
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const status = statusConfig[task.status] ?? {
    label: "Unknown",
    className: "bg-slate-100 text-slate-600",
    icon: Circle,
  };

  const StatusIcon = status.icon;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
        >
          <StatusIcon size={14} aria-hidden="true" />
          {status.label}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Pencil size={17} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Link
        to={`/tasks/${encodeURIComponent(task._id)}`}
        className="group flex flex-1 flex-col rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
      >
        <h3 className="mb-2 wrap-break-word text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
          {task.title}
        </h3>

        <p className="mb-6 flex-1 wrap-break-word whitespace-pre-wrap text-sm leading-6 text-slate-600">
          {task.description}
        </p>

        <div className="space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays size={15} aria-hidden="true" />
            <span>Created {formatDate(task.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Created by:</span>

            <span className="truncate">
              {task.author?.name ?? "Unknown user"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default TaskCard;
