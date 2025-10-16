import axiosConfig from "../config/axiosConfig";

export const reviewApi = {
  createReview: async (reviewData, token) => {
    const auth = token
      ? token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`
      : undefined;
    const res = await axiosConfig.post("reviews", reviewData, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return res.data;
  },

  deleteReview: async (id, token) => {
    const auth = token
      ? token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`
      : undefined;
    const res = await axiosConfig.delete(`reviews/${id}`, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return res.data;
  },

  updateReview: async (id, reviewData, token) => {
    const auth = token
      ? token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`
      : undefined;
    const res = await axiosConfig.put(`reviews/${id}`, reviewData, {
      headers: auth ? { Authorization: auth } : undefined,
    });
    return res.data;
  },

  getHotelReviews: async (hotelId) => {
    const res = await axiosConfig.get(`reviews/${hotelId}`);
    return res.data;
  },
};
