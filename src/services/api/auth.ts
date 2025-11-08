import { api } from "../apiClient";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "clinic_auth_token";
const USER_KEY = "clinic_user_data";


interface DecodedToken {
  name: string;
  role: string;
  userId: string;
  exp: number;
  iat: number;
}

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/user/login", { email, password });
      console.log("Login response:", response.data);

      const { token, refreshToken } = response.data.data;
      const user = jwtDecode<DecodedToken>(token);
      console.log("Decoded user:", user);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return { user, token: token };
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    console.log("START LOGOUT");
    try {
      console.log("Calling API /user/logout");
      const response = await api.put("/user/logout");
      console.log("API Response:", response);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      console.log("Clearing localStorage...");
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem(USER_KEY);
      console.log("LocalStorage cleared");
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await api.post("/Auth/refresh", { refreshToken });
      const { accessToken } = response.data;
      if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      if (!userData) return null;
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  forgotPassword: async (email: string) => {
    const response = await api.put(`/user/token-password?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  resetPassword: async ({ email, token, password }) => {
    const response = await api.post("/user/reset-password", {
      email,
      token,
      password,
    });
    return response.data;
  },

  changePassword: async (password, newPassword) => {
    const response = await api.put("/user/password", {
      password,
      newPassword
    });
    return response.data;
  },

  registerNotification: async (firebaseToken: string) => {
    const userToken = localStorage.getItem("clinic_auth_token");

    const response = await api.post(
      "/notification/register",
      null,
      {
        params: {
          token: firebaseToken
        },
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    );

    return response.data;
  },
};

export default authService;
