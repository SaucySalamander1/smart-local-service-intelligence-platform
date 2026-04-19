import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/ratings';

export const submitRating = async (jobId, workerId, rating, review) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE}/submit`,
      {
        jobId,
        workerId,
        rating,
        review
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getWorkerRatings = async (workerId) => {
  try {
    const response = await axios.get(`${API_BASE}/worker/${workerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getWorkerRatingStats = async (workerId) => {
  try {
    const response = await axios.get(`${API_BASE}/worker/${workerId}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
