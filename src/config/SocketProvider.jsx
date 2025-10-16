import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import axiosConfig from "./axiosConfig";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { notificationApi } from "../apis/notificationApi"; // thêm để mark read

const SocketCtx = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketCtx);

export default function SocketProvider({ children }) {
  const { isAuthenticated, token, user } = useSelector((s) => s.auth);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  const seenRef = useRef(new Set());

  // NEW: fetch initial notifications on login
  useEffect(() => {
    const loadInitial = async () => {
      if (!isAuthenticated || !token) return;
      try {
        const res = await notificationApi.getNotifications(token, {
          limit: 10,
        });
        const list = res?.notifications || res?.data || res || [];
        setNotifications(Array.isArray(list) ? list : []);
      } catch {
        // silent
      }
    };
    loadInitial();
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      try {
        socketRef.current?.removeAllListeners();
        socketRef.current?.close();
      } catch {}
      socketRef.current = null;
      setNotifications([]);
      return;
    }

    try {
      socketRef.current?.removeAllListeners();
      socketRef.current?.close();
    } catch {}
    socketRef.current = null;

    const getSocketOrigin = () => {
      const raw = axiosConfig?.defaults?.baseURL || window.location.origin;
      try {
        const u = new URL(raw, window.location.origin);
        return u.origin; // vd: http://localhost:5000
      } catch {
        return window.location.origin;
      }
    };
    const origin = getSocketOrigin();

    const s = io(origin, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: false,
      auth: { token: token.startsWith("Bearer ") ? token : `Bearer ${token}` },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketRef.current = s;

    console.log("[socket] connecting to", origin, "path:", "/socket.io");
    s.on("connect", () =>
      console.log("[socket] connected", s.id, s.io.opts.path)
    );
    s.on("connect_error", (err) =>
      console.warn("[socket] connect_error", err?.message)
    );

    const pushNoti = (raw) => {
      console.log("[socket] incoming event payload:", raw); // debug
      const n = raw?.notification || raw?.data || raw;
      if (!n) return;

      const key =
        n._id || n.id || n.created_at || n.createdAt || JSON.stringify(n);
      if (key && !seenRef.current.has(key)) {
        seenRef.current.add(key);
        if (seenRef.current.size > 200) {
          seenRef.current = new Set(Array.from(seenRef.current).slice(-120));
        }
        const title = n.title || "New notification";
        const message = n.message || n.content || "";
        toast.info(message ? `${title}: ${message}` : title);
      }

      setNotifications((prev) => {
        const list = [n, ...prev];
        const uniq = [];
        const keys = new Set();
        for (const i of list) {
          const k =
            i._id || i.id || i.created_at || i.createdAt || JSON.stringify(i);
          if (keys.has(k)) continue;
          keys.add(k);
          uniq.push(i);
        }
        return uniq.slice(0, 30);
      });
    };

    s.on("connect", () => {
      const userId = user?._id || user?.id;
      if (userId) s.emit("join", String(userId));
    });

    // CHUẨN: nghe "notification:new"
    s.on("notification:new", pushNoti);
    // Alias (phòng backend chưa đổi kịp)
    [
      "newNotification",
      "notification",
      "notifications",
      "new_notification",
      "notify",
      "review:created",
      "booking:created",
      "booking:canceled",
      "booking:cancelled",
      "booking:accepted",
    ].forEach((evt) => s.on(evt, pushNoti));

    s.onAny((evt, payload) => {
      if (
        [
          "connect",
          "disconnect",
          "connect_error",
          "reconnect",
          "pong",
        ].includes(evt)
      )
        return;
      console.log("[socket] onAny:", evt, payload); // debug
      pushNoti(payload);
    });

    return () => {
      try {
        s.removeAllListeners();
        s.close();
      } catch {}
    };
  }, [isAuthenticated, token, user]);

  const unreadCount = notifications.filter(
    (n) => !(n.is_read || n.read)
  ).length;

  const markNotiRead = async (id) => {
    try {
      await notificationApi.markAsRead(id, token);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, is_read: true, read: true } : n
        )
      );
    } catch {}
  };

  const value = {
    socket: socketRef.current,
    notifications,
    setNotifications,
    unreadCount,
    markNotiRead,
  };

  return <SocketCtx.Provider value={value}>{children}</SocketCtx.Provider>;
}
