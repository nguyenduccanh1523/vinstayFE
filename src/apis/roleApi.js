import axiosConfig from "../config/axiosConfig";

export const roleApi = {
  // Get all roles
  getRoles: async () => {
    const response = await axiosConfig.get("roles");
    return response.data;
  },

  // Get role by ID
  getRoleById: async (id) => {
    const response = await axiosConfig.get(`roles/${id}`);
    return response.data;
  },

  // Create new role
  createRole: async (roleData) => {
    const response = await axiosConfig.post("roles", roleData);
    return response.data;
  },

  // Update role
  updateRole: async (id, roleData) => {
    const response = await axiosConfig.put(`roles/${id}`, roleData);
    return response.data;
  },

  // Delete role
  deleteRole: async (id) => {
    const response = await axiosConfig.delete(`roles/${id}`);
    return response.data;
  },
};
