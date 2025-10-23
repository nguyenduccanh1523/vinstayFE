import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../stores/actions/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSocket } from "../../config/SocketProvider";

const Header = () => {
  const { notifications, unreadCount, markNotiRead } = useSocket(); // 👈 lấy từ Provider
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = user?.role_id?.name === "admin";
  const isHotelOwner = user?.role_id?.name === "hotel_owner";

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/");
    setUserMenuOpen(false);
  };

  const formatTime = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const previewCount = 3;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="Go to homepage"
        >
          <span className="inline-grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white font-semibold">
            VS
          </span>
          <span className="text-xl font-semibold tracking-tight">VinnStay</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link className="hover:text-slate-900 text-slate-600" to="/hotels">
            Hotels
          </Link>
          <Link className="hover:text-slate-900 text-slate-600" to="/rooms">
            Rooms
          </Link>
          <Link className="hover:text-slate-900 text-slate-600" to="/contact">
            Contact
          </Link>
          {isAdmin && (
            <Link className="hover:text-slate-900 text-slate-600" to="/admin">
              Management
            </Link>
          )}
          {isHotelOwner && (
            <Link
              className="hover:text-slate-900 text-slate-600"
              to="/manage-hotel"
            >
              Manage Hotel
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setNotiOpen((s) => !s)}
                  className="relative p-2 rounded-lg hover:bg-slate-100"
                  aria-label="Notifications"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-slate-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 10-12 0v.75a8.967 8.967 0 01-2.311 6.022c1.766.68 3.6 1.064 5.455 1.31m5.713 0a24.255 24.255 0 01-5.713 0m5.713 0a3 3 0 11-5.713 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {notiOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                    <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-sm font-medium">Notifications</span>
                      <Link
                        to="/notifications"
                        className="text-xs text-slate-600 hover:underline"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.slice(0, previewCount).map((n) => {
                        const title = n.title || "Notification";
                        const message = n.message || n.content || "";
                        const time = formatTime(n.created_at || n.createdAt);
                        const unread = !(n.is_read || n.read);
                        return (
                          <button
                            key={
                              n._id ||
                              `${n.title}-${n.created_at || n.createdAt}`
                            }
                            onClick={() => n._id && markNotiRead(n._id)}
                            className={`w-full text-left px-3 py-2 flex gap-2 hover:bg-slate-50 ${
                              unread ? "bg-slate-50" : "bg-white"
                            }`}
                          >
                            <span
                              className={`mt-1 h-2 w-2 rounded-full ${
                                unread ? "bg-blue-600" : "bg-slate-300"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="text-sm line-clamp-2">
                                {title}
                              </div>
                              {message && (
                                <div className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                                  {message}
                                </div>
                              )}
                              {time && (
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {time}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      {notifications.length === 0 && (
                        <div className="px-3 py-4 text-sm text-slate-600">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

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
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-slate-50"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-sm hover:bg-slate-50"
                    >
                      My Bookings
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        Management
                      </Link>
                    )}
                    {isHotelOwner && (
                      <Link
                        to="/manage-hotel"
                        className="block px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        Manage Hotel
                      </Link>
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
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-700 hover:underline"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center rounded-xl bg-slate-900 px-4 text-white text-sm font-medium hover:bg-slate-800"
              >
                Book Now
              </Link>
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
            <Link className="py-2" to="/hotels">
              Hotels
            </Link>
            <Link className="py-2" to="/rooms">
              Rooms
            </Link>
            <Link className="py-2" to="/contact">
              Contact
            </Link>
            {isAdmin && (
              <Link className="py-2" to="/admin">
                Management
              </Link>
            )}
            {isHotelOwner && (
              <Link
                className="hover:text-slate-900 text-slate-600"
                to="/manage-hotel"
              >
                Manage Hotel
              </Link>
            )}

            <div className="pt-2 grid grid-cols-2 gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="col-span-2 px-3 py-2 bg-slate-50 rounded-lg">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="h-10 rounded-xl border border-slate-300 grid place-items-center"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="h-10 rounded-xl bg-red-600 text-white grid place-items-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="h-10 rounded-xl border border-slate-300 grid place-items-center"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/book"
                    className="h-10 rounded-xl bg-slate-900 text-white grid place-items-center"
                  >
                    Book Now
                  </Link>
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
