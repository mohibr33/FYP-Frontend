// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

export const AuthAPI = {
  signup: (data) => api.post("/api/auth/signup", data),
  login: (data) => api.post("/api/auth/login", data),
  verifySignupOtp: (data) => api.post("/api/auth/verify-signup-otp", data),
  verifyLoginOtp: (data) => api.post("/api/auth/verify-login-otp", data),
  me: () => api.get("/api/auth/me"),
};

export const ArticleAPI = {
  list: (params) => api.get("/api/articles", { params }),
  get: (id) => api.get(`/api/articles/${id}`),
};

export const MedicineAPI = {
  list: (params) => api.get("/api/medicine", { params }),
};

export const ReviewAPI = {
  list: (params) => api.get("/api/reviews", { params }),
  create: (payload) => api.post("/api/reviews", payload),
  getMyReviews: () => api.get("/api/reviews/my-reviews"),
};

export const SupportAPI = {
  list: () => api.get("/api/support"),
  create: (payload) => api.post("/api/support", payload),
  resolve: (id) => api.patch(`/api/support/${id}/resolve`),
  getMyTickets: () => api.get("/api/support/my-tickets"),
};

export default api;