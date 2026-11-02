import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { authService } from "../../services/auth.service";
import type { SignupResponse } from "../../types/auth.types";
import { ApiError } from "../../utils/api-error";
import {
  signupSchema,
  type SignupFormValues,
} from "../../validations/auth.validation";

const SignupForm = () => {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [signupResult, setSignupResult] = useState<SignupResponse | null>(null);
  const [resendMessage, setResendMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!signupResult?.emailSent && !resendMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [signupResult?.emailSent, resendMessage, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues): Promise<void> => {
    setServerError("");

    try {
      const response = await authService.signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setSignupResult(response);
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : "An unexpected error occurred.",
      );
    }
  };

  const handleResendVerification = async (): Promise<void> => {
    if (!signupResult || isResending || resendMessage) {
      return;
    }

    setServerError("");
    setIsResending(true);

    try {
      const response = await authService.resendVerification({
        email: signupResult.data.email,
      });

      setResendMessage(response.message);
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : "Unable to resend the verification email.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const inputClassName =
    "h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  const toggleClassName =
    "absolute inset-y-0 right-2 flex w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-500";

  const buttonClassName =
    "flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-base font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="w-full">
      {signupResult ? (
        /* Signup response */
        <div
          role="status"
          className="rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-8 text-center shadow-sm"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            {signupResult.emailSent || resendMessage ? (
              <CheckCircle2 size={34} className="text-indigo-600" />
            ) : (
              <AlertCircle size={34} className="text-indigo-600" />
            )}
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            {resendMessage
              ? "Verification request received"
              : signupResult.emailSent
                ? "Check your email"
                : "Verification email not sent"}
          </h3>

          <p className="mt-4 text-base leading-7 text-slate-600">
            {resendMessage || signupResult.message}
          </p>

          {signupResult.emailSent || resendMessage ? (
            <div className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-indigo-600">
              <LoaderCircle size={17} className="animate-spin" />
              Redirecting to login...
            </div>
          ) : (
            <div className="mt-7 space-y-4">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending}
                className={buttonClassName}
              >
                {isResending ? (
                  <>
                    <LoaderCircle size={20} className="animate-spin" />
                    Sending request...
                  </>
                ) : (
                  "Resend verification email"
                )}
              </button>

              {serverError && (
                <p role="alert" className="text-sm leading-6 text-red-600">
                  {serverError}
                </p>
              )}

              <Link
                to="/login"
                className="inline-block text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
              >
                Back to login
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2.5 block text-base font-semibold text-slate-700"
              >
                Full name
              </label>

              <div className="relative">
                <UserRound
                  size={20}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...register("name")}
                  className={inputClassName}
                />
              </div>

              {errors.name && (
                <p
                  id="name-error"
                  role="alert"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

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
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                  className={inputClassName}
                />
              </div>

              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2.5 block text-base font-semibold text-slate-700"
              >
                Password
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
                  placeholder="Create a strong password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  {...register("password")}
                  className={`${inputClassName} pr-14`}
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
                  id="password-error"
                  role="alert"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2.5 block text-base font-semibold text-slate-700"
              >
                Confirm password
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
                  placeholder="Confirm your password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                  {...register("confirmPassword")}
                  className={`${inputClassName} pr-14`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                  className={toggleClassName}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={21} />
                  ) : (
                    <Eye size={21} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
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
              </div>
            )}

            {/* Signup button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={buttonClassName}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-base text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default SignupForm;
