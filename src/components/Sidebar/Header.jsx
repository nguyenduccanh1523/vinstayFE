import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../stores/actions/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = user?.role_id?.name === "admin";

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/");
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2"
          aria-label="Go to homepage"
        >
          <span className="inline-grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white font-semibold">
            VS
          </span>
          <span className="text-xl font-semibold tracking-tight">VinnStay</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="hover:text-slate-900 text-slate-600" href="#rooms">
            Rooms
          </a>
          <a className="hover:text-slate-900 text-slate-600" href="#offers">
            Offers
          </a>
          <a className="hover:text-slate-900 text-slate-600" href="#dining">
            Dining
          </a>
          <a className="hover:text-slate-900 text-slate-600" href="#spa">
            Spa
          </a>
          <a className="hover:text-slate-900 text-slate-600" href="#events">
            Events
          </a>
          <a className="hover:text-slate-900 text-slate-600" href="#contact">
            Contact
          </a>
          {isAdmin && (
            <a
              className="hover:text-slate-900 text-slate-600"
              href="/management"
            >
              Management
            </a>
          )}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium">{user.username}</span>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-200">
                    <p className="text-sm text-slate-500">{user.email}</p>
                    <p className="text-xs text-slate-400 capitalize">
                      {user.role_id?.name}
                    </p>
                  </div>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    Profile
                  </a>
                  <a
                    href="/bookings"
                    className="block px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    My Bookings
                  </a>
                  {isAdmin && (
                    <a
                      href="/admin"
                      className="block px-4 py-2 text-sm hover:bg-slate-50"
                    >
                      Management
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="text-sm text-slate-700 hover:underline"
              >
                Sign in
              </a>
              <a
                href="/book"
                className="inline-flex h-9 items-center rounded-xl bg-slate-900 px-4 text-white text-sm font-medium hover:bg-slate-800"
              >
                Book Now
              </a>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen((s) => !s)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="sr-only">Menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M3.75 6.75h16.5v1.5H3.75zm0 4.5h16.5v1.5H3.75zm0 4.5h16.5v1.5H3.75z" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-3 grid gap-3 text-sm">
            <a className="py-2" href="#rooms">
              Rooms
            </a>
            <a className="py-2" href="#offers">
              Offers
            </a>
            <a className="py-2" href="#dining">
              Dining
            </a>
            <a className="py-2" href="#spa">
              Spa
            </a>
            <a className="py-2" href="#events">
              Events
            </a>
            <a className="py-2" href="#contact">
              Contact
            </a>
            {isAdmin && (
              <a className="py-2" href="/management">
                Management
              </a>
            )}
            <div className="pt-2 grid grid-cols-2 gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="col-span-2 px-3 py-2 bg-slate-50 rounded-lg">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <a
                    href="/profile"
                    className="h-10 rounded-xl border border-slate-300 grid place-items-center"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="h-10 rounded-xl bg-red-600 text-white grid place-items-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="h-10 rounded-xl border border-slate-300 grid place-items-center"
                  >
                    Sign in
                  </a>
                  <a
                    href="/book"
                    className="h-10 rounded-xl bg-slate-900 text-white grid place-items-center"
                  >
                    Book Now
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
