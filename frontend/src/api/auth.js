import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);
  return res.data;
};

export const adminLogin = async (data) => {
  const res = await axios.post(`${API_URL}/auth/admin/login`, data);
  return res.data;
};

export const getPendingWorkers = async () => {
  const token = localStorage.getItem('token');

  const res = await axios.get(`${API_URL}/admin/pending-workers`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};

export const approveWorker = async (workerId) => {
  const token = localStorage.getItem('token');

  const res = await axios.post(
    `${API_URL}/admin/approve-worker`,
    { workerId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};