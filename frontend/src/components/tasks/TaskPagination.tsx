import { ChevronLeft, ChevronRight } from "lucide-react";

import type { TaskPagination as PaginationData } from "../../types/task.types";

interface TaskPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

const TaskPagination = ({ pagination, onPageChange }: TaskPaginationProps) => {
  const { page, limit, total, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <nav
      aria-label="Task pagination"
      className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row"
    >
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-900">
          {firstItem}–{lastItem}
        </span>{" "}
        of <span className="font-semibold text-slate-900">{total}</span> tasks
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={19} />
        </button>

        <span className="text-sm font-medium text-slate-700">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={19} />
        </button>
      </div>
    </nav>
  );
};

export default TaskPagination;
