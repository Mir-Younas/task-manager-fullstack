import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const NotFound = () => {
  const { user, loading } = useAuth();

  return (
    <section
      aria-labelledby="not-found-heading"
      className="relative isolate flex min-h-[65vh] items-center justify-center overflow-hidden bg-[#F8FAFC] px-5 py-20 sm:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-130 w-130 rounded-full bg-indigo-200/40 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-130 w-130 rounded-full bg-blue-200/30 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600">
          <SearchX size={38} aria-hidden="true" />
        </div>

        <p className="mt-8 text-lg font-semibold tracking-widest text-indigo-600">
          ERROR 404
        </p>

        <h1
          id="not-found-heading"
          className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
        >
          Page not found
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-8 text-slate-600">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 sm:w-auto"
          >
            <Home size={18} aria-hidden="true" />
            Back to Home
          </Link>

          {!loading && user && (
            <Link
              to="/tasks"
              className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 sm:w-auto"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default NotFound;
