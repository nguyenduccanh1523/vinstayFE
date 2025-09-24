// apis/hotelApi.js
import axiosConfig from "../config/axiosConfig";

export const hotelApi = {
  getAllHotels: async () => {
    const res = await axiosConfig.get("hotels");
    return res.data;
  },

  getHotelByOwner: async (ownerId) => {
    const res = await axiosConfig.get(`hotels/owner/${ownerId}`);
    return res.data;
  },

  getHotelById: async (id) => {
    const res = await axiosConfig.get(`hotels/${id}`);
    return res.data;
  },

  createHotel: async (formData) => {
    const res = await axiosConfig.post("hotels", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: [(data) => data],
    });
    return res.data;
  },

  updateHotel: async (id, formData) => {
    const res = await axiosConfig.put(`hotels/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: [(data) => data],
    });
    return res.data;
  },

  deleteHotel: async (id) => {
    const res = await axiosConfig.delete(`hotels/${id}`);
    return res.data;
  },


};
