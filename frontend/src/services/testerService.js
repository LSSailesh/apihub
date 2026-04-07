import api from "./api";

export const sendRequest = (data) => api.post("/tester/send", data);
