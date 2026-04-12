// controllers/aiController.js
const AISession = require("../models/AISession");
const { startAI, processAnswer, quickDiagnose } = require("../services/aiEngine");

exports.startSession = async (req, res) => {
  try {
    const { problem } = req.body;
    const ai = startAI(problem);

    const session = await AISession.create({
      user: req.user._id,
      problem,
      category: ai.category,
      currentQuestionIndex: 0,
      threatScore: ai.threatScore,
      confidence: ai.confidence,
      answers: []
    });

    res.json({
      sessionId: session._id,
      question: ai.question,
      category: ai.category
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    const session = await AISession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const result = processAnswer(session, answer);

    // SAVE ANSWER
    session.answers.push({
      question: session.currentQuestionIndex,
      answer
    });

    session.threatScore = result.threatScore || session.threatScore;
    session.confidence = result.confidence || session.confidence;

    // ✅ FIXED: UPDATE INDEX PROPERLY
    if (!result.done) {
      session.currentQuestionIndex = result.nextIndex;
    } else {
      session.isCompleted = true;
    }

    await session.save();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.quickDiagnoseController = (req, res) => {
  const { problem } = req.body;
  const result = quickDiagnose(problem);
  res.json(result);
};