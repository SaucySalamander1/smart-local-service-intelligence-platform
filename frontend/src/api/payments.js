import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payments';

export const requestOTP = async (jobId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${API_URL}/request-otp`,
    { jobId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const verifyOTP = async (jobId, otp) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${API_URL}/verify-otp`,
    { jobId, otp },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getPaymentHistory = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getPaymentById = async (paymentId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
