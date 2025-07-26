import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://scribemaster-frontend-alb-469534981.ap-southeast-1.elb.amazonaws.com",
  withCredentials: true, // Automatically include cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
