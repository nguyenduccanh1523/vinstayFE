import axiosConfig from "../config/axiosConfig";

export const customerApi = {
  // Get all customers
  getAllCustomers: async () => {
    const response = await axiosConfig.get("users");
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    const response = await axiosConfig.get(`users/${id}`);
    return response.data;
  },

  // Create new customer
  createCustomer: async (customerData) => {
    const response = await axiosConfig.post("users", customerData);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await axiosConfig.put(`users/${id}`, customerData);
    return response.data;
  },

  updateCustomerRole: async (id, role_id) => {
    const response = await axiosConfig.put(`users/${id}`, { role_id });
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await axiosConfig.delete(`users/${id}`);
    return response.data;
  },
};

export default customerApi;
