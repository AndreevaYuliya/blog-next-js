import axios from "axios";
import { getAccessToken } from "@/lib/auth/tokenStorage";

const axiosInstance = axios.create({ baseURL: "" });

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
