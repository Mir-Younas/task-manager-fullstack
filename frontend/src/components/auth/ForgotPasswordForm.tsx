import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, LoaderCircle, Mail } from "lucide-react";

import { authService } from "../../services/auth.service";
import { ApiError } from "../../utils/api-error";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../../validations/auth.validation";

const ForgotPasswordForm = () => {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues): Promise<void> => {
    setServerError("");

    try {
      const response = await authService.forgotPassword(data);
      setSuccessMessage(response.message);
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : "Unable to process your request. Please try again.",
      );
    }
  };

  return (
    <div className="w-full">
      {successMessage ? (
        <div
          role="status"
          className="rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-8 text-center shadow-sm"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <CheckCircle2 size={34} className="text-indigo-600" />
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            Check your email
          </h3>

          <p className="mt-4 text-base leading-7 text-slate-600">
            {successMessage}
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            If you receive a reset email, open the link to create a new
            password.
          </p>

          <Link
            to="/login"
            className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-base font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
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
                  aria-describedby={
                    errors.email ? "forgot-email-error" : undefined
                  }
                  {...register("email")}
                  className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {errors.email && (
                <p
                  id="forgot-email-error"
                  role="alert"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {serverError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-base font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  Sending request...
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <Link
            to="/login"
            className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
          >
            <ArrowLeft size={17} />
            Back to login
          </Link>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
