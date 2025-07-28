// src/api/axios.ts
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://admin-panel-snq4.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
