import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

// ✅ Dynamically attach token on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 🔐
  }
  return config;
});

export const entryAPI = {
  addEntry: async (entryData) => {
    const res = await API.post("/entries/add", entryData);
    return res.data;
  },
  getEntries: async (page = 1, limit = 5) => {
    const res = await API.get(`/entries/history?page=${page}&limit=${limit}`);
    return res.data;
  },
  updateEntry: async (id, updatedData) => {
    const res = await API.put(`/entries/${id}`, updatedData);
    return res.data;
  },
  deleteEntry: async (id) => {
    const res = await API.delete(`/entries/${id}`);
    return res.data;
  },
};

export default API;
