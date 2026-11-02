import type { ReactNode } from "react";
import { CheckCircle2, Layers3, ShieldCheck } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  variant?: "split" | "centered";
}

const AuthLayout = ({
  title,
  description,
  children,
  variant = "split",
}: AuthLayoutProps) => {
  const isCentered = variant === "centered";

  return (
    <main
      className={
        isCentered
          ? "relative min-h-screen overflow-hidden bg-[#F5F7FF]"
          : "min-h-screen bg-[#F8FAFC] lg:grid lg:grid-cols-2"
      }
    >
      {/* Desktop branding — Login only */}
      {!isCentered && (
        <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#0F172A] p-10 text-white lg:flex xl:p-16">
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
              <Layers3 size={25} />
            </div>

            <span className="text-2xl font-bold tracking-tight">TaskFlow</span>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-indigo-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Your productivity workspace
            </div>

            <h1 className="text-4xl leading-tight font-bold tracking-tight xl:text-6xl">
              Bring clarity to
              <br />
              your everyday
              <br />
              workflow.
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-300">
              Organize tasks, track progress, and stay focused on what matters
              most. Everything you need to get things done.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-3 text-base text-slate-300">
                <CheckCircle2 size={22} className="shrink-0 text-indigo-400" />
                Create and manage tasks effortlessly
              </div>

              <div className="flex items-center gap-3 text-base text-slate-300">
                <CheckCircle2 size={22} className="shrink-0 text-indigo-400" />
                Keep track of your progress
              </div>

              <div className="flex items-center gap-3 text-base text-slate-300">
                <ShieldCheck size={22} className="shrink-0 text-indigo-400" />
                Secure access to your workspace
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm text-slate-500">
            TaskFlow — Simplify your workflow.
          </p>
        </section>
      )}

      {/* Soft background accents — Signup only */}
      {isCentered && (
        <>
          <div className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-blue-300/30 blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />
        </>
      )}

      {/* Authentication content */}
      <section
        className={
          isCentered
            ? "relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8"
            : "flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-10"
        }
      >
        <div
          className={
            isCentered ? "w-full max-w-[600px]" : "w-full max-w-[480px]"
          }
        >
          {/* Logo */}
          <div
            className={
              isCentered
                ? "mb-10 flex items-center justify-center gap-3"
                : "mb-12 flex items-center gap-3 lg:hidden"
            }
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Layers3 size={25} />
            </div>

            <span className="text-2xl font-bold tracking-tight text-slate-900">
              TaskFlow
            </span>
          </div>

          {/* Page heading */}
          <div className={isCentered ? "mb-9 text-center" : "mb-9"}>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>

            <p className="mt-3 text-base leading-7 text-slate-500">
              {description}
            </p>
          </div>

          {/* Form */}
          {isCentered ? (
            <div className="rounded-3xl border border-indigo-100/70 bg-white/85 p-6 shadow-xl shadow-indigo-200/30 backdrop-blur-sm sm:p-10">
              {children}
            </div>
          ) : (
            children
          )}

          {/* Footer */}
          <p className="mt-12 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
