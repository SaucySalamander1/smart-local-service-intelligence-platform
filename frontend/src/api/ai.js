// frontend/src/api/ai.js
import axios from "axios";

const API = "http://localhost:5000/api/ai";

const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("You must login first");
  return { Authorization: `Bearer ${token}` };
};

// Start new AI session — text or image
export const startAISession = async (problem, imageBase64 = null, imageMime = null) => {
  const res = await axios.post(
    `${API}/start`,
    { problem, image: imageBase64, imageMime },
    { headers: getTokenHeader() }
  );
  return res.data;
};

// Continue with follow-up answer
export const continueAISession = async (sessionId, answer) => {
  const res = await axios.post(
    `${API}/continue`,
    { sessionId, answer },
    { headers: getTokenHeader() }
  );
  return res.data;
};

// Recheck — did it fix?
export const recheckAISession = async (sessionId, isFixed) => {
  const res = await axios.post(
    `${API}/recheck`,
    { sessionId, isFixed },
    { headers: getTokenHeader() }
  );
  return res.data;
};