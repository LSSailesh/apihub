import api from "./api";

export const getKeys = () => api.get("/keys/");
export const addKey = (data) => api.post("/keys/", data);
export const revealKey = (id) => api.get(`/keys/${id}/reveal`);
export const updateKey = (id, data) => api.patch(`/keys/${id}`, data);
export const deleteKey = (id) => api.delete(`/keys/${id}`);
