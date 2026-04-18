// backend/controllers/aiController.js
const { startSession, continueSession, recheckSession } = require("../services/aiEngine");

// POST /api/ai/start
exports.handleStart = async (req, res) => {
  try {
    const { problem, image, imageMime } = req.body;
    const userId = req.user._id;

    if (!problem && !image) {
      return res.status(400).json({ message: "Please describe your problem or upload an image." });
    }

    const result = await startSession(userId, problem || "Analyze this image", image, imageMime);
    res.json(result);
  } catch (err) {
    console.error("AI START ERROR:", err.message);
    res.status(500).json({ message: "AI failed to analyze. Please try again." });
  }
};

// POST /api/ai/continue
exports.handleContinue = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    if (!sessionId || !answer) {
      return res.status(400).json({ message: "Session ID and answer are required." });
    }

    const result = await continueSession(sessionId, answer);
    res.json(result);
  } catch (err) {
    console.error("AI CONTINUE ERROR:", err.message);
    res.status(500).json({ message: "AI failed to process answer. Please try again." });
  }
};

// POST /api/ai/recheck
exports.handleRecheck = async (req, res) => {
  try {
    const { sessionId, isFixed } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required." });
    }

    const result = await recheckSession(sessionId, isFixed);
    res.json(result);
  } catch (err) {
    console.error("AI RECHECK ERROR:", err.message);
    res.status(500).json({ message: "Recheck failed. Please try again." });
  }
};