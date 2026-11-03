import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import type { z } from "zod";

import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import { ApiError } from "../../utils/api-error";
import { loginSchema } from "../../validations/auth.validation";

const EMAIL_NOT_VERIFIED_MESSAGE = "Please verify your email before logging in";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [serverError, setServerError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof loginSchema>,
    unknown,
    z.output<typeof loginSchema>
  >({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const clearVerificationState = (): void => {
    setServerError("");
    setNeedsVerification(false);
    setResendMessage("");
    setResendError("");
  };

  const onSubmit = async (
    data: z.output<typeof loginSchema>,
  ): Promise<void> => {
    clearVerificationState();

    try {
      await login(data);

      const from = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname;

      const destination =
        from?.startsWith("/") && !from.startsWith("//") ? from : "/tasks";

      navigate(destination, { replace: true });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "An unexpected error occurred.";

      setServerError(message);
      setNeedsVerification(message === EMAIL_NOT_VERIFIED_MESSAGE);
    }
  };

  const handleResendVerification = async (): Promise<void> => {
    if (isResending || isSubmitting || resendMessage) {
      return;
    }

    setResendError("");

    const email = getValues("email").trim().toLowerCase();
    const validation = loginSchema.shape.email.safeParse(email);

    if (!validation.success) {
      setResendError("Please enter a valid email address.");
      return;
    }

    setIsResending(true);

    try {
      const response = await authService.resendVerification({
        email: validation.data,
      });

      setResendMessage(response.message);
      setServerError("");
      setNeedsVerification(false);
    } catch (error) {
      setResendError(
        error instanceof ApiError
          ? error.message
          : "Unable to request verification email. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const inputClassName =
    "h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  const buttonClassName =
    "flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-base font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2.5 block text-base font-semibold text-slate-700"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={20}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
            />

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email", {
                onChange: clearVerificationState,
              })}
              className={inputClassName}
            />
          </div>

          {errors.email && (
            <p
              id="login-email-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="password"
              className="text-base font-semibold text-slate-700"
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <LockKeyhole
              size={20}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              {...register("password", {
                onChange: clearVerificationState,
              })}
              className={`${inputClassName} pr-14`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-2 flex w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
            </button>
          </div>

          {errors.password && (
            <p
              id="login-password-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Login error */}
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {serverError}
          </div>
        )}

        {/* Verification recovery */}
        {needsVerification && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-4">
            <p className="text-sm leading-6 text-slate-600">
              Your account needs email verification before you can sign in. You
              can request another verification link below.
            </p>

            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isResending || isSubmitting}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Sending request...
                </>
              ) : (
                "Resend verification email"
              )}
            </button>

            {resendError && (
              <p role="alert" className="mt-3 text-sm leading-6 text-red-600">
                {resendError}
              </p>
            )}
          </div>
        )}

        {/* Resend confirmation */}
        {resendMessage && (
          <div
            role="status"
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-sm leading-6 text-indigo-700"
          >
            <p className="font-semibold">Verification request received</p>

            <p className="mt-1">{resendMessage}</p>

            <p className="mt-2 text-slate-600">
              If you receive a verification email, open the link to verify your
              account before signing in.
            </p>
          </div>
        )}

        {/* Email login */}
        <button
          type="submit"
          disabled={isSubmitting || isResending}
          className={buttonClassName}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={20} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-sm font-medium text-slate-400">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Google login */}
      <button
        type="button"
        onClick={() => authService.googleLogin()}
        disabled={isSubmitting || isResending}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.8 7.18l7.73 6C44.38 38.03 46.98 31.88 46.98 24.55z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.87-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.14 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Signup link */}
      <p className="mt-8 text-center text-base text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
