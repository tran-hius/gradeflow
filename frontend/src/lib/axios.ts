import axios from "axios";

const isServer = typeof window === "undefined";

export const getBaseURL = () => {
  if (isServer) {
    return process.env.INTERNAL_API_URL || "http://api:8000/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = getBaseURL();
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Đã xảy ra lỗi không xác định";
    const status = error.response?.status || 500;

    return Promise.reject({ status, message });
  }
);

export default apiClient;
