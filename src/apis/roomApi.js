import axiosConfig from "../config/axiosConfig";

export const roomApi = {
  // Get all rooms
  getAllRooms: async () => {
    const res = await axiosConfig.get("rooms");
    return res.data;
  },

  // ⬇️ Thêm: lấy rooms theo hotel
  getRoomsByHotel: async (hotelId) => {
    const res = await axiosConfig.get(`rooms/hotel/${hotelId}`);
    return res.data;
  },

  // Get room by id
  getRoomById: async (id) => {
    const res = await axiosConfig.get(`rooms/${id}`);
    return res.data;
  },

  // Create room (multipart)
  createRoom: async (formData) => {
    const res = await axiosConfig.post("rooms", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: [(data) => data], // đừng stringify FormData
    });
    return res.data;
  },

  // Update room (multipart)
  updateRoom: async (id, formData) => {
    const res = await axiosConfig.put(`rooms/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: [(data) => data],
    });
    return res.data;
  },

  // Delete room
  deleteRoom: async (id) => {
    const res = await axiosConfig.delete(`rooms/${id}`);
    return res.data;
  },
};

export default roomApi;
