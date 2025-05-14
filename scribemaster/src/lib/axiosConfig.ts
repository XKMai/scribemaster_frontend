// src/lib/axiosConfig.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api.com/api",
  withCredentials: true, // Automatically include cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
