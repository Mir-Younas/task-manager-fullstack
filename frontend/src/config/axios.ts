import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { ApiError } from "../utils/api-error";

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: unknown;
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

const refreshInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

const excludedRoutes = new Set([
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/refresh",
  "/api/auth/verify-email",
  "/api/auth/resend-verification",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
]);

let refreshPromise: Promise<void> | null = null;
let sessionVersion = 0;
let onSessionExpired: (() => void) | null = null;

export const setSessionExpiredHandler = (
  handler: (() => void) | null,
): void => {
  onSessionExpired = handler;
};

export const invalidateAuthSession = (): void => {
  sessionVersion += 1;
};

export const normalizeApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return new ApiError("An unexpected error occurred.");
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return new ApiError("The request timed out. Please try again.");
  }

  if (!error.response) {
    return new ApiError(
      "Unable to connect to the server. Please check your connection.",
    );
  }

  const { status, data } = error.response;

  const message =
    typeof data?.message === "string" && data.message.trim()
      ? data.message
      : "Something went wrong. Please try again.";

  return new ApiError(message, status, data?.errors);
};

const shouldSkipRefresh = (url?: string): boolean => {
  if (!url) return true;

  const pathname = new URL(url, baseURL).pathname;

  return excludedRoutes.has(pathname);
};

const handleResponseError = async (
  error: AxiosError<ApiErrorResponse>,
): Promise<AxiosResponse> => {
  const request = error.config as RetryableRequest | undefined;

  if (
    error.response?.status !== 401 ||
    !request ||
    request._retry ||
    shouldSkipRefresh(request.url)
  ) {
    throw normalizeApiError(error);
  }

  request._retry = true;
  const currentSessionVersion = sessionVersion;

  try {
    refreshPromise ??= refreshInstance
      .post("/api/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });

    await refreshPromise;
  } catch (refreshError) {
    const normalizedError = normalizeApiError(refreshError);

    if (currentSessionVersion !== sessionVersion) {
      throw new ApiError("Authentication session has changed.", 401);
    }

    if (
      normalizedError.statusCode === 401 ||
      normalizedError.statusCode === 403
    ) {
      invalidateAuthSession();
      onSessionExpired?.();

      throw new ApiError("Your session has expired. Please log in again.", 401);
    }

    throw normalizedError;
  }

  if (currentSessionVersion !== sessionVersion) {
    throw new ApiError("Authentication session has changed.", 401);
  }

  return axiosInstance(request);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  handleResponseError,
);
