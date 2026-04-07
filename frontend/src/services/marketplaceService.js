import api from "./api";

export const getApis = (params) => api.get("/marketplace/", { params });
export const getApiById = (id) => api.get(`/marketplace/${id}`);
export const submitApi = (data) => api.post("/marketplace/submit", data);
export const rateApi = (id, rating) => api.post(`/marketplace/${id}/rate`, { rating });
export const toggleFavorite = (id) => api.post(`/marketplace/${id}/favorite`);
export const getFavorites = () => api.get("/marketplace/user/favorites");
