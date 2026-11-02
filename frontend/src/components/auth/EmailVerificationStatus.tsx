import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  MailCheck,
} from "lucide-react";

import { authService } from "../../services/auth.service";
import type { ApiResponse } from "../../types/auth.types";
import { ApiError } from "../../utils/api-error";

type VerificationStatus = "loading" | "success" | "error";

interface EmailVerificationStatusProps {
  token: string | null;
}

const EmailVerificationStatus = ({ token }: EmailVerificationStatusProps) => {
  const [status, setStatus] = useState<VerificationStatus>(
    token ? "loading" : "error",
  );

  const [message, setMessage] = useState(
    token ? "" : "The verification link is missing a token.",
  );

  const verificationRequest = useRef<Promise<ApiResponse> | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;

    // Reuse the request during React Strict Mode effect replays.
    if (!verificationRequest.current) {
      verificationRequest.current = authService.verifyEmail({ token });
    }

    verificationRequest.current
      .then((response) => {
        if (!active) return;

        setMessage(response.message);
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (!active) return;

        setMessage(
          error instanceof ApiError
            ? error.message
            : "Unable to verify your email. Please try again.",
        );

        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [token]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <div
      role={isLoading ? "status" : undefined}
      aria-live="polite"
      className="w-full rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-8 text-center shadow-sm"
    >
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
        {isLoading ? (
          <LoaderCircle
            size={34}
            className="animate-spin text-indigo-600"
            aria-hidden="true"
          />
        ) : isSuccess ? (
          <CheckCircle2
            size={34}
            className="text-indigo-600"
            aria-hidden="true"
          />
        ) : (
          <AlertCircle
            size={34}
            className="text-indigo-600"
            aria-hidden="true"
          />
        )}
      </div>

      <h3 className="text-2xl font-bold tracking-tight text-slate-900">
        {isLoading
          ? "Verifying your email"
          : isSuccess
            ? "Email verified successfully!"
            : "Verification failed"}
      </h3>

      <p
        role={status === "error" ? "alert" : undefined}
        className="mt-4 text-base leading-7 text-slate-600"
      >
        {isLoading
          ? "Please wait while we verify your email address."
          : message}
      </p>

      {isSuccess && (
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your account is ready. You can now sign in to TaskFlow.
        </p>
      )}

      {!isLoading && (
        <div className="mt-7 space-y-4">
          <Link
            to="/login"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-base font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isSuccess ? "Go to login" : "Back to login"}
          </Link>

          {!isSuccess && (
            <p className="flex items-center justify-center gap-2 text-sm leading-6 text-slate-500">
              <MailCheck
                size={17}
                className="text-indigo-500"
                aria-hidden="true"
              />
              Need another link? Sign in to request a new one.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailVerificationStatus;
