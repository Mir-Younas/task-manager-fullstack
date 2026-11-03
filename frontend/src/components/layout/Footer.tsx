import { Link } from "react-router-dom";

import Logo from "../common/Logo";
import { useAuth } from "../../hooks/useAuth";

const Footer = () => {
  const { user, loading } = useAuth();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <Logo size="sm" />

            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500">
              Simplify your workflow, organize your tasks, and focus on what
              matters most.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-col gap-4 text-sm font-medium text-slate-600"
          >
            <Link to="/" className="hover:text-indigo-600">
              Home
            </Link>

            <a href="/#features" className="hover:text-indigo-600">
              Features
            </a>

            {!loading &&
              (user ? (
                <Link to="/tasks" className="hover:text-indigo-600">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="hover:text-indigo-600">
                  Sign In
                </Link>
              ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
