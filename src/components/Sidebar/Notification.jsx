import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { notificationApi } from "../../apis/notificationApi";

const formatTime = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "";
  }
};

export default function Notification() {
  const { isAuthenticated, token } = useSelector((s) => s.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setErr("");
    try {
      const res = await notificationApi.getNotifications(token);
      const list = res?.notifications || res?.data || res || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr("Không thể tải thông báo.");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationApi.markAsRead(id, token);
      setItems((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, is_read: true, read: true } : n
        )
      );
    } catch {}
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {loading && <div className="text-sm text-slate-600">Đang tải...</div>}
      {err && <div className="text-sm text-red-600">{err}</div>}
      {!loading && items.length === 0 && (
        <div className="text-sm text-slate-600">Chưa có thông báo.</div>
      )}
      <div className="space-y-2">
        {items.map((n) => {
          const title = n.title || "Notification";
          const message = n.message || n.content || "";
          const time = formatTime(n.created_at || n.createdAt);
          const unread = !(n.is_read || n.read);
          return (
            <div
              key={n._id}
              className={`rounded-xl border p-3 ${
                unread
                  ? "bg-slate-50 border-slate-300"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium">{title}</div>
                  {message && (
                    <div className="text-sm text-slate-700 mt-1">{message}</div>
                  )}
                  {time && (
                    <div className="text-xs text-slate-500 mt-1">{time}</div>
                  )}
                </div>
                {unread && (
                  <button
                    className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
                    onClick={() => markRead(n._id)}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
