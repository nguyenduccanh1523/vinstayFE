import axiosConfig from "../config/axiosConfig";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
} from "../stores/actions/authSlice";

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await axiosConfig.post("auth/login", credentials);
    dispatch(loginSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    dispatch(loginFailure(errorMessage));
    throw error;
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    const response = await axiosConfig.post("auth/register", userData);
    dispatch(registerSuccess());
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Registration failed";
    dispatch(registerFailure(errorMessage));
    throw error;
  }
};
