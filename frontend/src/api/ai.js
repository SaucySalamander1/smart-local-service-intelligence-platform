// api/ai.js
import axios from "axios";

const API = "http://localhost:5000/api/ai";

const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("You must be logged in to use AI support");
  return { Authorization: `Bearer ${token}` };
};

export const startAI = async (problem) => {
  try {
    const res = await axios.post(
      `${API}/start`,
      { problem },
      { headers: getTokenHeader() }
    );
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw new Error("Unauthorized: Please login first");
    }
    throw err;
  }
};

export const answerAI = async (sessionId, answer, messages = []) => {
  try {
    const res = await axios.post(
      `${API}/answer`,
      { sessionId, answer, messages },
      { headers: getTokenHeader() }
    );
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw new Error("Unauthorized: Please login first");
    }
    throw err;
  }
};