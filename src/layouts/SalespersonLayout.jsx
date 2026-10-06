import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  ShoppingCart,
  UserCircle,
  Users,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const SalespersonLayout = () => {
  const navItems = [
    {
      label: "Dashboard",
      path: "/salesperson/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Orders",
      path: "/salesperson/orders",
      icon: ShoppingCart,
    },
    {
      label: "New Order",
      path: "/salesperson/orders/new",
      icon: PlusCircle,
    },
    {
      label: "My Dealers",
      path: "/salesperson/dealers",
      icon: Users,
    },
    {
      label: "My Profile",
      path: "/salesperson/profile",
      icon: UserCircle,
    },
    {
      label: "Settings",
      path: "/salesperson/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-900 text-white">
          {/* Logo */}
          <div className="border-b border-slate-700 px-6 py-5">
            <h1 className="text-2xl font-bold">PareekX</h1>

            <p className="mt-1 text-xs text-slate-400">Salesperson Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-slate-700 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-64 flex min-h-screen flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              {/* Header Title */}
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Salesperson Panel
                </h2>

                <p className="text-xs text-slate-500">
                  Manage dealers and orders
                </p>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* My Dealers */}
                <NavLink
                  to="/salesperson/dealers"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#B5220E]/10 text-[#B5220E]"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <Users size={18} />

                  <span className="hidden sm:inline">My Dealers</span>
                </NavLink>

                {/* My Profile */}
                <NavLink
                  to="/salesperson/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#B5220E]/10 text-[#B5220E]"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <UserCircle size={18} />

                  <span className="hidden sm:inline">My Profile</span>
                </NavLink>

                {/* Settings */}
                <NavLink
                  to="/salesperson/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#B5220E]/10 text-[#B5220E]"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <Settings size={18} />

                  <span className="hidden sm:inline">Settings</span>
                </NavLink>

                {/* PareekX Badge */}
                <div className="rounded-xl bg-[#B5220E]/5 px-4 py-2 text-sm font-semibold text-[#B5220E]">
                  PareekX
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SalespersonLayout;
