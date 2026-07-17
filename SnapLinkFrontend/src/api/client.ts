import axios from "axios";

const client = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8082/api",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
