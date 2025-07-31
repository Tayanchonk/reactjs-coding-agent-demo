import axios from "axios";

const API_URL = "/configurationService";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;
