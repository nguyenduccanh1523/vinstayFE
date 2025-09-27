import axiosConfig from "../config/axiosConfig";

export const bookingApi = {
  createBooking: async (bookingData) => {
    const res = await axiosConfig.post("bookings", bookingData);
    return res.data;
  },

  cancelBooking: async (id) => {
    const res = await axiosConfig.patch(`bookings/${id}/cancel`);
    return res.data;
  },

  updateBookingStatus: async (id, statusData) => {
    const res = await axiosConfig.patch(`bookings/${id}/status`, statusData);
    return res.data;
  },

  getUserBookings: async () => {
    const res = await axiosConfig.get("bookings/user");
    return res.data;
  },

  getOwnerBookings: async () => {
    const res = await axiosConfig.get("bookings/owner");
    return res.data;
  },

  getAllBookings: async () => {
    const res = await axiosConfig.get("bookings");
    return res.data;
  },
};
