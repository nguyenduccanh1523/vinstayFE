import axiosConfig from "../config/axiosConfig";

// helper: ensure hotel_id present in payload
const ensureHotelId = (payload) => {
  // work on a shallow copy to avoid mutating caller object
  const p = { ...payload };
  // try common places where hotel id may exist
  if (p.hotel_id) return p;
  if (p.hotelId) p.hotel_id = p.hotelId;
  // room may be id string or object
  const room = p.room || p.room_id || null;
  if (room) {
    // if room is object with hotel ref
    if (typeof room === "object") {
      p.hotel_id =
        p.hotel_id || room.hotel_id || room.hotel?._id || room.hotel?.id;
    }
    // if room is id string we cannot infer hotel here
  }
  return p;
};

export const bookingApi = {
  createBooking: async (bookingData) => {
    // Ensure basic hotel_id from common places
    let payload = ensureHotelId(bookingData);

    // If still missing hotel_id but we have a room id string, fetch room detail to extract hotel_id
    if (!payload.hotel_id) {
      const roomId =
        payload.room_id ||
        (typeof payload.room === "string" ? payload.room : undefined) ||
        (payload.room && payload.room._id ? payload.room._id : undefined);

      if (roomId) {
        try {
          const roomRes = await axiosConfig.get(`rooms/${roomId}`);
          const roomData = roomRes.data?.room || roomRes.data || null;
          if (roomData) {
            payload = {
              ...payload,
              hotel_id:
                roomData.hotel_id || roomData.hotel?._id || roomData.hotel?.id,
            };
          }
        } catch (err) {
          // nếu không lấy được room details, tiếp tục để server báo lỗi — log để debug
          console.error("Failed to fetch room to infer hotel_id:", err);
        }
      }
    }

    const res = await axiosConfig.post("bookings", payload);
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
