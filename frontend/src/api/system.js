import axios from "axios";

const API = "http://localhost:5000/api";

export const createWarranty = (data) => axios.post(`${API}/warranty`, data);
export const getWarranty = () => axios.get(`${API}/warranty`);

export const createDispute = (data) => axios.post(`${API}/dispute`, data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const getDisputes = () => axios.get(`${API}/dispute`);
export const getDispute = (id) => axios.get(`${API}/dispute/${id}`);
export const updateDisputeStatus = (id, data) => axios.put(`${API}/dispute/${id}/status`, data);