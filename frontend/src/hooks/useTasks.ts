import { useCallback, useEffect, useState } from "react";

import { taskService } from "../services/task.service";
import type { GetTasksQuery, Task, TaskPagination } from "../types/task.types";
import { ApiError } from "../utils/api-error";

interface TasksState {
  tasks: Task[];
  pagination: TaskPagination | null;
  error: string | null;
  queryKey: string | null;
}

interface UseTasksResult {
  tasks: Task[];
  pagination: TaskPagination | null;
  loading: boolean;
  error: string | null;
  refreshTasks: () => void;
}

export const useTasks = (query: GetTasksQuery): UseTasksResult => {
  const [state, setState] = useState<TasksState>({
    tasks: [],
    pagination: null,
    error: null,
    queryKey: null,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const { status, search, sort, page, limit } = query;

  const queryKey = JSON.stringify({
    status,
    search,
    sort,
    page,
    limit,
    refreshKey,
  });

  const refreshTasks = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchTasks = async (): Promise<void> => {
      try {
        const response = await taskService.getTasks(
          {
            status,
            search,
            sort,
            page,
            limit,
          },
          controller.signal,
        );

        if (!active || controller.signal.aborted) return;

        setState({
          tasks: response.tasks,
          pagination: response.pagination,
          error: null,
          queryKey,
        });
      } catch (error: unknown) {
        if (!active || controller.signal.aborted) return;

        setState({
          tasks: [],
          pagination: null,
          error:
            error instanceof ApiError
              ? error.message
              : "Unable to load tasks. Please try again.",
          queryKey,
        });
      }
    };

    void fetchTasks();

    return () => {
      active = false;
      controller.abort();
    };
  }, [status, search, sort, page, limit, queryKey]);

  return {
    tasks: state.tasks,
    pagination: state.pagination,
    loading: state.queryKey !== queryKey,
    error: state.queryKey === queryKey ? state.error : null,
    refreshTasks,
  };
};
