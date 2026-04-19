import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs';

// Post a new job
export const postJob = async (jobData) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(API_URL, jobData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Get my posted jobs
export const getMyJobs = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Browse all open jobs
export const browseJobs = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Get job by ID
export const getJobById = async (jobId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Submit a bid
export const submitBid = async (jobId, bidData) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/${jobId}/bid`, bidData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Accept a bid
export const acceptBid = async (jobId, bidId) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API_URL}/${jobId}/accept/${bidId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Hire worker directly
export const hireWorkerDirectly = async (workerId, jobData) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/hire/${workerId}`, jobData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Mark job as done (worker)
export const markJobDone = async (jobId) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API_URL}/${jobId}/worker-done`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Confirm job completion (customer)
export const confirmJobCompletion = async (jobId) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API_URL}/${jobId}/confirm`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
