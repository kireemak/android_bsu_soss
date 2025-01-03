import axios from "axios";
import { getToken } from "../utils/secureStore";

const API_URL = "http://192.168.100.201:8084/api/v1/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавление токена в запросы
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error || // Добавляем поле `error`, если оно используется на сервере
      "Произошла ошибка. Попробуйте позже.";
    console.error("API Error:", error.response || error.message);
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
