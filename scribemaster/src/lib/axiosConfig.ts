import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", //|| "http://localhost:5000/api",
  withCredentials: true, // Automatically include cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
