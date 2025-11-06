import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/config/env';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Thêm token vào mỗi request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý lỗi chung
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Nếu token hết hạn hoặc không hợp lệ (401), logout
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
