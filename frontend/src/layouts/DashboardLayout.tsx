import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

const DashboardLayout = () => {
  const location = useLocation();

  const [sidebarOpenedAt, setSidebarOpenedAt] = useState<string | null>(null);

  const isSidebarOpen =
    sidebarOpenedAt !== null && sidebarOpenedAt === location.pathname;

  const openSidebar = (): void => {
    setSidebarOpenedAt(location.pathname);
  };

  const closeSidebar = (): void => {
    setSidebarOpenedAt(null);
  };

  // Prevent background scrolling while the mobile sidebar is open.
  useEffect(() => {
    if (!isSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  // Allow Escape to close the mobile sidebar.
  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader onOpenSidebar={openSidebar} />

        <main
          id="dashboard-content"
          className="w-full flex-1 px-5 py-8 sm:px-8 lg:px-10"
        >
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
