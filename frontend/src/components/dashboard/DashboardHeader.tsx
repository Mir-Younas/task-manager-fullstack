import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, LogOut, Menu, UserRound } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

const DashboardHeader = ({ onOpenSidebar }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("Unable to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open navigation menu"
            aria-controls="dashboard-sidebar"
            aria-expanded={false}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
          >
            <Menu size={23} />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              My Workspace
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              Manage your tasks and stay productive.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden min-w-0 items-center gap-3 sm:flex">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <UserRound size={20} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="max-w-40 truncate text-sm font-semibold text-slate-900">
                {user?.name ?? "User"}
              </p>

              <p className="max-w-40 truncate text-xs text-slate-500">
                {user?.email ?? ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            {isLoggingOut ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <LogOut size={18} />
            )}

            <span className="hidden sm:inline">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>

      {logoutError && (
        <p
          role="alert"
          className="border-t border-red-100 bg-red-50 px-5 py-2 text-sm text-red-600 sm:px-8"
        >
          {logoutError}
        </p>
      )}
    </header>
  );
};

export default DashboardHeader;
