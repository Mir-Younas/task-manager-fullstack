
import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import Logo from "../common/Logo";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../utils/api-error";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 ${
    isActive
      ? "text-indigo-600"
      : "text-slate-600 hover:text-indigo-600"
  }`;

const Header = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const mobileNavId = useId();
  const profilePanelId = useId();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const logoutPendingRef = useRef(false);

  const initials =
    user?.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(target) &&
        !mobileButtonRef.current?.contains(target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (profileRef.current?.contains(document.activeElement)) {
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      } else if (mobileNavRef.current?.contains(document.activeElement)) {
        setMenuOpen(false);
        mobileButtonRef.current?.focus();
      } else {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    if (logoutPendingRef.current) return;

    logoutPendingRef.current = true;
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await logout();

      closeMenus();
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      setLogoutError(
        error instanceof ApiError
          ? error.message
          : "Unable to log out. Please try again.",
      );
    } finally {
      logoutPendingRef.current = false;
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Logo size="sm" />

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <a
            href="/#features"
            className="rounded-md text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
          >
            Features
          </a>
        </nav>

        {/* Desktop authentication */}
        <div className="hidden items-center gap-4 md:flex">
          {!loading &&
            (user ? (
              <div ref={profileRef} className="relative">
                <button
                  ref={profileButtonRef}
                  type="button"
                  aria-label={`Account options for ${user.name}`}
                  aria-expanded={profileOpen}
                  aria-controls={profileOpen ? profilePanelId : undefined}
                  onClick={() => {
                    setProfileOpen((current) => !current);
                    setLogoutError("");
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {initials}
                  </span>

                  <span className="max-w-36 truncate text-sm font-semibold text-slate-800">
                    {user.name}
                  </span>

                  <ChevronDown
                    size={17}
                    aria-hidden="true"
                    className={`text-slate-500 transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div
                    id={profilePanelId}
                    className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/tasks"
                      onClick={closeMenus}
                      className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-indigo-500"
                    >
                      <LayoutDashboard size={18} aria-hidden="true" />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      disabled={isLoggingOut}
                      onClick={() => void handleLogout()}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LogOut size={18} aria-hidden="true" />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>

                    {logoutError && (
                      <p
                        role="alert"
                        className="px-4 py-2 text-xs text-red-600"
                      >
                        {logoutError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md text-sm font-semibold text-slate-700 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Get Started
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </>
            ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          ref={mobileButtonRef}
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls={mobileNavId}
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-500 md:hidden"
        >
          {menuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      <nav
        ref={mobileNavRef}
        id={mobileNavId}
        aria-label="Mobile navigation"
        hidden={!menuOpen}
        className="border-t border-slate-100 bg-white px-5 py-5 md:hidden"
      >
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            end
            onClick={closeMenus}
            className={navLinkClass}
          >
            Home
          </NavLink>

          <a
            href="/#features"
            onClick={closeMenus}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            Features
          </a>

          {!loading &&
            (user ? (
              <>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {initials}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/tasks"
                  onClick={closeMenus}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
                >
                  <LayoutDashboard size={18} aria-hidden="true" />
                  Dashboard
                </Link>

                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => void handleLogout()}
                  className="flex items-center gap-2 text-left text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={18} aria-hidden="true" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>

                {logoutError && (
                  <p role="alert" className="text-xs text-red-600">
                    {logoutError}
                  </p>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenus}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
