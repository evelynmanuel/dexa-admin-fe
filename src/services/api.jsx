import axios from "axios";

const API_BASE = "http://localhost:5173/api";

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
};

export const employeeAPI = {
  getAll: () => api.get("/users"),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, formData) =>
    api.put(`/users/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateJson: (id, data) => api.put(`/users/${id}`, data),
};

export const attendanceAPI = {
  getAll: (params) => api.get("/attendances", { params }),
};

export default api;
