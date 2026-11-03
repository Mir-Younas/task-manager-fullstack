import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  ListTodo,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

const features = [
  {
    title: "Effortless Task Management",
    description:
      "Create, organize, and update your tasks in one simple workspace.",
    icon: ListTodo,
  },
  {
    title: "Track Your Progress",
    description: "Stay on top of pending, in-progress, and completed tasks.",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    title: "Your Secure Workspace",
    description:
      "Keep your tasks protected with secure account authentication.",
    icon: ShieldCheck,
  },
] as const;

const Home = () => {
  const { user, loading } = useAuth();

  const dashboardPath = "/tasks";
  const signupPath = "/signup";

  const primaryPath = user ? dashboardPath : signupPath;

  return (
    <>
      {/* Hero section */}
      <section
        aria-labelledby="hero-heading"
        className="relative isolate overflow-hidden bg-[#F8FAFC]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 h-130 w-130 rounded-full bg-indigo-200/40 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 h-130 w-130 rounded-full bg-blue-200/30 blur-3xl"
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-5 py-14 text-center sm:px-8 sm:py-20 lg:min-h-150 lg:px-10 lg:py-24">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-700 sm:mb-8 sm:text-sm">
            <CheckCircle2 size={16} aria-hidden="true" className="shrink-0" />
            Your productivity workspace
          </div>

          <h1
            id="hero-heading"
            className="max-w-4xl text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
          >
            Organize your work.
            <span className="block text-indigo-600">Achieve more.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8">
            TaskFlow helps you manage tasks, track progress, and stay focused.
            Everything you need to turn your plans into progress.
          </p>

          <div className="mt-8 flex w-full flex-col items-center gap-4 sm:mt-10 sm:w-auto sm:flex-row">
            {loading ? (
              <div
                aria-label="Loading account status"
                className="h-14 w-full animate-pulse rounded-xl bg-indigo-100 sm:w-48"
              />
            ) : (
              <Link
                to={primaryPath}
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 sm:w-auto sm:min-w-44"
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight size={19} aria-hidden="true" />
              </Link>
            )}

            <a
              href="#features"
              className="inline-flex min-h-14 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 sm:w-auto sm:min-w-44"
            >
              Explore Features
            </a>
          </div>

          <p className="mt-7 text-sm text-slate-400">
            Simple. Organized. Productive.
          </p>
        </div>
      </section>

      {/* Features section */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              Why TaskFlow
            </p>

            <h2
              id="features-heading"
              className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              Everything you need to stay organized
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500">
              A focused workspace designed to make everyday task management
              easier.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-xl hover:shadow-slate-100 sm:p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Icon size={27} aria-hidden="true" />
                </div>

                <h3 className="text-xl font-bold text-slate-900">{title}</h3>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section
        aria-labelledby="cta-heading"
        className="bg-[#0F172A] py-16 text-white sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8 lg:px-10">
          <h2
            id="cta-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Ready to take control of your tasks?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">
            Start organizing your work with TaskFlow and make every day more
            productive.
          </p>

          {!loading && (
            <Link
              to={primaryPath}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400"
            >
              {user ? "Open Dashboard" : "Get Started"}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
