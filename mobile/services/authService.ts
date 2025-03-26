import axios from "axios";
import { API_BASE_URL } from "../constants/api";

export const signup = async (
  username: string,
  email: string,
  password: string,
  avatar?: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
      username,
      email,
      password,
      avatar,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
