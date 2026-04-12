import axios from 'axios';

const API_BASE = process.env.REACT_APP_API || 'http://localhost:5000/api';

export const sendMessage = async (receiverId, message) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE}/messages/send`,
      { receiverId, message },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getConversation = async (otherUserId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_BASE}/messages/conversation/${otherUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const listConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_BASE}/messages/conversations`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
