import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Sidebar/Header";
import Footer from "../../components/Sidebar/Footer";

const NavItem = ({ href, label, icon, active }) => (
  <a
    href={href}
    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition border border-transparent
${active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}
    aria-current={active ? "page" : undefined}
  >
    <span
      className={`grid h-8 w-8 place-items-center rounded-lg ${
        active ? "bg-white/20" : "bg-slate-900/10"
      }`}
    >
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </a>
);

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white border-r border-slate-200 p-4
transition-transform duration-300 ease-in-out md:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Admin sidebar"
    >
      <div className="flex items-center justify-between px-1">
        <a
          href="/admin"
          className="flex items-center gap-2"
          aria-label="Admin home"
        >
          <span className="inline-grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white font-semibold">
            AD
          </span>
          <span className="text-lg font-semibold tracking-tight">
            VinnStay Admin
          </span>
        </a>
        <button
          className="md:hidden h-9 w-9 grid place-items-center rounded-lg border hover:bg-slate-100"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <nav className="mt-6 grid gap-2" role="navigation">
        <NavItem
          href="/admin"
          label="Dashboard"
          icon={<span>📊</span>}
          active={isActive("/admin")}
        />
        <NavItem
          href="/admin/bookings"
          label="Bookings"
          icon={<span>🛎️</span>}
          active={isActive("/admin/bookings")}
        />
        <NavItem
          href="/admin/rooms"
          label="Rooms"
          icon={<span>🛏️</span>}
          active={isActive("/admin/rooms")}
        />
        <NavItem
          href="/admin/customers"
          label="Customers"
          icon={<span>👤</span>}
          active={isActive("/admin/customers")}
        />
        <NavItem
          href="/admin/roles"
          label="Roles"
          icon={<span>🔐</span>}
          active={isActive("/admin/roles")}
        />
        <NavItem
          href="/admin/payments"
          label="Payments"
          icon={<span>💳</span>}
          active={isActive("/admin/payments")}
        />
        <NavItem
          href="/admin/offers"
          label="Offers"
          icon={<span>🏷️</span>}
          active={isActive("/admin/offers")}
        />
        <NavItem
          href="/admin/settings"
          label="Settings"
          icon={<span>⚙️</span>}
          active={isActive("/admin/settings")}
        />
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
          <div className="text-sm font-medium">Occupancy Today</div>
          <div className="mt-2 text-2xl font-semibold">84%</div>
          <div className="mt-1 text-xs text-slate-600">+5% vs yesterday</div>
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({ setOpen }) => {
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    if (path.includes("/roles")) return "Roles";
    if (path.includes("/bookings")) return "Bookings";
    if (path.includes("/rooms")) return "Rooms";
    if (path.includes("/customers")) return "Customers";
    if (path.includes("/payments")) return "Payments";
    if (path.includes("/offers")) return "Offers";
    if (path.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-grid h-10 w-10 place-items-center rounded-lg border hover:bg-slate-100"
            onClick={() => setOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <div className="text-sm text-slate-600">
            Admin /{" "}
            <span className="text-slate-900 font-medium">
              {getBreadcrumb()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search…"
            className="h-10 w-32 sm:w-56 rounded-xl border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-slate-900/50"
          />
          <a
            href="/"
            className="text-sm text-slate-700 hover:underline hidden sm:block"
          >
            View site
          </a>
          <button
            className="h-9 w-9 grid place-items-center rounded-full bg-slate-900 text-white hover:bg-slate-800"
            aria-label="Profile"
          >
            VM
          </button>
        </div>
      </div>
    </header>
  );
};

const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        !event.target.closest("aside") &&
        !event.target.closest('button[aria-label="Open sidebar"]')
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <Sidebar open={open} setOpen={setOpen} />
      <div className="md:pl-72 transition-all duration-300">
        <Topbar setOpen={setOpen} />
        <main className="p-3 sm:p-4 lg:p-6 xl:p-8">{children}</main>
        <footer className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 text-xs text-slate-500 border-t border-slate-200">
          © {new Date().getFullYear()} VinnStay Admin. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
