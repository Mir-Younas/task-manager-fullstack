import { useDeferredValue, useState } from "react";
import { ClipboardList, LoaderCircle, Plus, RefreshCw } from "lucide-react";

import DeleteTaskDialog from "../components/tasks/DeleteTaskDialog";
import TaskCard from "../components/tasks/TaskCard";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskModal from "../components/tasks/TaskModal";
import TaskPagination from "../components/tasks/TaskPagination";

import { useTasks } from "../hooks/useTasks";
import { taskService } from "../services/task.service";
import type { Task, TaskSort, TaskStatus } from "../types/task.types";
import type { CreateTaskFormValues } from "../validations/task.validation";
import { ApiError } from "../utils/api-error";

const TASKS_PER_PAGE = 10;

const TasksPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [sort, setSort] = useState<TaskSort>("newest");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(search);

  const { tasks, pagination, loading, error, refreshTasks } = useTasks({
    search: deferredSearch.trim() || undefined,
    status: status || undefined,
    sort,
    page,
    limit: TASKS_PER_PAGE,
  });

  const handleSearchChange = (value: string): void => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: TaskStatus | ""): void => {
    setStatus(value);
    setPage(1);
  };

  const handleSortChange = (value: TaskSort): void => {
    setSort(value);
    setPage(1);
  };

  const handleClearFilters = (): void => {
    setSearch("");
    setStatus("");
    setSort("newest");
    setPage(1);
  };

  const handlePageChange = (nextPage: number): void => {
    setPage(nextPage);
  };

  const handleCreateTask = (): void => {
    setSelectedTask(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task): void => {
    setSelectedTask(task);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    if (isSubmitting) return;

    setIsModalOpen(false);
    setSelectedTask(null);
    setFormError(null);
  };

  const handleSaveTask = async (data: CreateTaskFormValues): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (selectedTask) {
        await taskService.updateTask(selectedTask._id, data);
      } else {
        await taskService.createTask(data);
      }

      setIsModalOpen(false);
      setSelectedTask(null);
      setPage(1);
      refreshTasks();
    } catch (error: unknown) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "Unable to save task. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDelete = (task: Task): void => {
    setTaskToDelete(task);
    setDeleteError(null);
  };

  const handleCloseDelete = (): void => {
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

      // If the last task on a later page is deleted,
      // move to the previous page.
      if (tasks.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      }

      refreshTasks();
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

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Tasks
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Organize your work and track your progress.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateTask}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <Plus size={19} aria-hidden="true" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <TaskFilters
        search={search}
        status={status}
        sort={sort}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      {/* Task list */}
      <section aria-label="Tasks">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">
            Task List
            {!loading && pagination && (
              <span className="ml-2 text-sm font-medium text-slate-400">
                ({pagination.total})
              </span>
            )}
          </h3>

          <button
            type="button"
            onClick={refreshTasks}
            disabled={loading}
            aria-label="Refresh tasks"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {loading ? (
          <div
            role="status"
            className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8"
          >
            <LoaderCircle
              size={30}
              className="animate-spin text-indigo-600"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm text-slate-500">Loading tasks...</p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-white p-8 text-center"
          >
            <p className="font-semibold text-red-600">Unable to load tasks</p>

            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <button
              type="button"
              onClick={refreshTasks}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <ClipboardList size={28} aria-hidden="true" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">No tasks found</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {search || status
                ? "No tasks match your current filters. Try adjusting your search or status."
                : "You haven't created any tasks yet. Your tasks will appear here once you create one."}
            </p>

            {(search || status) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        )}
      </section>

      {!loading && !error && pagination && (
        <TaskPagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      <TaskModal
        isOpen={isModalOpen}
        task={selectedTask}
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

export default TasksPage;
