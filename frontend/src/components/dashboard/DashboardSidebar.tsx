import { NavLink } from "react-router-dom";
import { CheckSquare2, LayoutDashboard, X } from "lucide-react";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "My Tasks",
    path: "/tasks",
    icon: LayoutDashboard,
  },
];

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <NavLink
            to="/tasks"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <CheckSquare2 size={23} aria-hidden="true" />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              TaskFlow
            </span>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-2 overflow-y-auto px-4 py-6"
        >
          <p className="mb-4 px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Workspace
          </p>

          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-100 px-6 py-5">
          <p className="text-xs leading-5 text-slate-400">
            Stay organized. Get things done.
          </p>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
