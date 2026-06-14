import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const BASE_URL = "http://localhost:3000";
export default api;