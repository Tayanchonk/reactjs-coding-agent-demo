// src/services/apiService.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL, // เปลี่ยน URL ให้ตรงกับ API ของคุณ
  headers: {
    "Content-Type": "application/json",
  },
});

export const getData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

// gen put data
export const putData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error putting data:", error);
    throw error;
  }
};
