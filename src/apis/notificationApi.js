import axiosConfig from "../config/axiosConfig";

const withAuth = (token) => {
  if (!token) return undefined;
  const auth = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  return { Authorization: auth };
};

export const notificationApi = {
  // GET /api/notifications
  getNotifications: async (token, params) => {
    const res = await axiosConfig.get("notifications", {
      headers: withAuth(token),
      params, // e.g., { limit: 10, page: 1 }
    });
    return res.data;
  },

  // PATCH /api/notifications/:id/read
  markAsRead: async (id, token) => {
    const res = await axiosConfig.patch(`notifications/${id}/read`, {}, {
      headers: withAuth(token),
    });
    return res.data;
  },
};
