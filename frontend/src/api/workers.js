import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workers';

export const getWorkers = async (serviceArea = '', skill = '') => {
  const params = new URLSearchParams();
  
  if (serviceArea) params.append('serviceArea', serviceArea);
  if (skill) params.append('skill', skill);

  const res = await axios.get(`${API_URL}?${params.toString()}`);
  return res.data;
};

export const getWorkerById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const getServiceAreas = async () => {
  const res = await axios.get(`${API_URL}/meta/service-areas`);
  return res.data;
};

export const getAvailableSkills = async () => {
  const res = await axios.get(`${API_URL}/meta/skills`);
  return res.data;
};

export const updateWorkerProfile = async (workerId, profileData) => {
  const token = localStorage.getItem('token');

  const res = await axios.put(`${API_URL}/${workerId}`, profileData, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};

