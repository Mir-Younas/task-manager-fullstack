import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import { authService } from "../../services/auth.service";
import { ApiError } from "../../utils/api-error";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../../validations/auth.validation";

interface ResetPasswordFormProps {
  token: string | null;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues): Promise<void> => {
    if (!token) return;

    setServerError("");

    try {
      const response = await authService.resetPassword({
        token,
        password: data.password,
      });

      setSuccessMessage(response.message);
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : "Unable to reset your password. Please try again.",
      );
    }
  };

  const inputClassName =
    "h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-14 text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  const toggleClassName =
    "absolute inset-y-0 right-2 flex w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-500";

  const buttonClassName =
    "flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-base font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60";

  if (!token) {
    return (
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <AlertCircle size={34} className="text-indigo-600" />
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          Invalid reset link
        </h3>

        <p className="mt-4 text-base leading-7 text-slate-600">
          This password reset link is missing a token. Please request a new
          link.
        </p>

        <Link to="/forgot-password" className={`mt-7 ${buttonClassName}`}>
          Request new reset link
        </Link>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-8 text-center shadow-sm"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <CheckCircle2 size={34} className="text-indigo-600" />
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          Password reset successfully!
        </h3>

        <p className="mt-4 text-base leading-7 text-slate-600">
          {successMessage}
        </p>

        <Link to="/login" className={`mt-7 ${buttonClassName}`}>
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* New password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2.5 block text-base font-semibold text-slate-700"
          >
            New password
          </label>

          <div className="relative">
            <LockKeyhole
              size={20}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your new password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "reset-password-error" : undefined
              }
              {...register("password")}
              className={inputClassName}
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className={toggleClassName}
            >
              {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
            </button>
          </div>

          {errors.password && (
            <p
              id="reset-password-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm new password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2.5 block text-base font-semibold text-slate-700"
          >
            Confirm new password
          </label>

          <div className="relative">
            <LockKeyhole
              size={20}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
            />

            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your new password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword
                  ? "reset-confirm-password-error"
                  : undefined
              }
              {...register("confirmPassword")}
              className={inputClassName}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
              className={toggleClassName}
            >
              {showConfirmPassword ? <EyeOff size={21} /> : <Eye size={21} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p
              id="reset-confirm-password-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* API error */}
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {serverError}

            {(serverError.toLowerCase().includes("expired") ||
              serverError.toLowerCase().includes("invalid")) && (
              <Link
                to="/forgot-password"
                className="mt-2 block font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Request a new reset link
              </Link>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonClassName}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={20} className="animate-spin" />
              Resetting password...
            </>
          ) : (
            "Reset password"
          )}
        </button>
      </form>

      <Link
        to="/login"
        className="mt-8 block text-center text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
      >
        Back to login
      </Link>
    </div>
  );
};

export default ResetPasswordForm;
