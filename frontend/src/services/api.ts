import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-url-management.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;