import axios from "axios";

const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Error Response:", error.response);
    if (window.location.pathname === "/login") {
      return Promise.reject(error);
    }
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
