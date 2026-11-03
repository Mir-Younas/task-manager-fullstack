import { Search, SlidersHorizontal, X } from "lucide-react";

import type { TaskSort, TaskStatus } from "../../types/task.types";

interface TaskFiltersProps {
  search: string;
  status: TaskStatus | "";
  sort: TaskSort;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "") => void;
  onSortChange: (value: TaskSort) => void;
  onClearFilters: () => void;
}

const TaskFilters = ({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onClearFilters,
}: TaskFiltersProps) => {
  const hasActiveFilters =
    search.length > 0 || status !== "" || sort !== "newest";

  return (
    <section
      aria-label="Task filters"
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal
          size={18}
          className="text-indigo-600"
          aria-hidden="true"
        />

        <h2 className="text-sm font-semibold text-slate-900">
          Search & Filters
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="task-search"
            className="mb-2 block text-xs font-medium text-slate-600"
          >
            Search tasks
          </label>

          <div className="relative">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />

            <input
              id="task-search"
              type="search"
              value={search}
              maxLength={100}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-3 pl-10 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="task-status"
            className="mb-2 block text-xs font-medium text-slate-600"
          >
            Status
          </label>

          <select
            id="task-status"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as TaskStatus | "")
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="task-sort"
            className="mb-2 block text-xs font-medium text-slate-600"
          >
            Sort by
          </label>

          <select
            id="task-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as TaskSort)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
          >
            <X size={15} aria-hidden="true" />
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
};

export default TaskFilters;
