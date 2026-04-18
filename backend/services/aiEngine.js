// backend/services/aiEngine.js
const { analyzeInput, analyzeImage } = require("./groqService");
const AISession = require("../models/AISession");
const User = require("../models/User");

// ─── WORKER SCORING ───────────────────────────────────────────────────────────
const scoreWorker = (worker, category, userArea) => {
  let score = 0;
  const area = (userArea || "").toLowerCase();
  const workerArea = (worker.serviceArea || "").toLowerCase();

  if (worker.skills && worker.skills.includes(category)) score += 10;
  if (area && workerArea.includes(area)) score += 8;
  else if (workerArea.includes("dhaka")) score += 3;
  if (worker.availability === "online") score += 6;
  score += (worker.rating || 0);
  score += Math.min((worker.experience || 0) * 0.5, 5);
  score += Math.min((worker.jobsDone || 0) / 10, 5);
  score += Math.min((worker.reviewCount || 0) / 5, 3);
  return score;
};

// ─── FIND BEST WORKERS ────────────────────────────────────────────────────────
const findBestWorkers = async (category, userArea = "") => {
  try {
    const workers = await User.find({
      role: "worker",
      isApproved: true,
      $or: [
        { skills: { $in: [category] } },
        { skills: { $in: ["general"] } }
      ]
    }).select("name skills rating experience serviceArea reviewCount availability phone profilePicture jobsDone payRange");

    return workers
      .map(w => ({
        id: w._id,
        name: w.name,
        skills: w.skills || [],
        rating: w.rating || 0,
        experience: w.experience || 0,
        serviceArea: w.serviceArea || "Dhaka",
        reviewCount: w.reviewCount || 0,
        availability: w.availability || "offline",
        phone: w.phone || "",
        profilePicture: w.profilePicture || "",
        jobsDone: w.jobsDone || 0,
        payRange: w.payRange || { min: 0, max: 0 },
        score: scoreWorker(w, category, userArea),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  } catch (err) {
    console.error("Worker fetch error:", err.message);
    return [];
  }
};

// ─── FORMAT RESULT WITH WORKERS ───────────────────────────────────────────────
const formatResult = async (groqResult, sessionId) => {
  const workers = await findBestWorkers(groqResult.category || "general");
  return {
    type: "result",
    sessionId,
    category: groqResult.category,
    threatLevel: groqResult.threatLevel,
    confidence: groqResult.confidence,
    diagnosis: groqResult.diagnosis,
    precautions: groqResult.precautions || [],
    steps: groqResult.steps || [],
    emergency: groqResult.emergency || { show: false, message: null, callNumber: "999" },
    workers,
  };
};

// ─── START NEW SESSION ────────────────────────────────────────────────────────
exports.startSession = async (userId, problem, imageBase64 = null, imageMime = null) => {
  let groqResult;

  if (imageBase64) {
    groqResult = await analyzeImage(imageBase64, imageMime, problem);
  } else {
    groqResult = await analyzeInput([{ role: "user", content: problem }]);
  }

  if (!groqResult) throw new Error("AI analysis failed");

  // Save session
  const session = await AISession.create({
    user: userId,
    problem,
    category: groqResult.category || "general",
    conversationHistory: [
      { role: "user", content: problem },
      { role: "assistant", content: JSON.stringify(groqResult) }
    ],
    threatScore: groqResult.threatLevel === "high" ? 8 : groqResult.threatLevel === "medium" ? 4 : 1,
    confidence: groqResult.confidence || 50,
    isCompleted: groqResult.type === "result",
    answers: []
  });

  if (groqResult.type === "result") {
    return await formatResult(groqResult, session._id);
  }

  return {
    type: "question",
    sessionId: session._id,
    question: groqResult.question,
    category: groqResult.category,
    confidence: groqResult.confidence
  };
};

// ─── CONTINUE SESSION ─────────────────────────────────────────────────────────
exports.continueSession = async (sessionId, userAnswer) => {
  const session = await AISession.findById(sessionId);
  if (!session) throw new Error("Session not found");

  session.conversationHistory.push({ role: "user", content: userAnswer });
  session.answers.push({ question: "follow-up", answer: userAnswer });

  const groqResult = await analyzeInput(session.conversationHistory);
  if (!groqResult) throw new Error("AI analysis failed");

  session.conversationHistory.push({
    role: "assistant",
    content: JSON.stringify(groqResult)
  });
  session.confidence = groqResult.confidence || session.confidence;
  session.category = groqResult.category || session.category;

  if (groqResult.type === "result") {
    session.isCompleted = true;
    session.threatScore = groqResult.threatLevel === "high" ? 8 : groqResult.threatLevel === "medium" ? 4 : 1;
  }

  await session.save();

  if (groqResult.type === "result") {
    return await formatResult(groqResult, session._id);
  }

  return {
    type: "question",
    sessionId: session._id,
    question: groqResult.question,
    category: groqResult.category,
    confidence: groqResult.confidence
  };
};

// ─── RECHECK SESSION ──────────────────────────────────────────────────────────
exports.recheckSession = async (sessionId, isFixed) => {
  const session = await AISession.findById(sessionId);
  if (!session) throw new Error("Session not found");

  if (isFixed) {
    session.isCompleted = true;
    await session.save();
    return { type: "resolved", message: "Great! Glad the issue is fixed. 🎉" };
  }

  // Not fixed — escalate
  session.conversationHistory.push({
    role: "user",
    content: "The steps did not fix my problem. Please re-evaluate, escalate if needed, and provide better guidance."
  });

  const groqResult = await analyzeInput(session.conversationHistory);
  if (!groqResult) throw new Error("Recheck failed");

  session.conversationHistory.push({
    role: "assistant",
    content: JSON.stringify(groqResult)
  });

  // Force escalate threat level
  if (groqResult.threatLevel === "low") groqResult.threatLevel = "medium";
  else if (groqResult.threatLevel === "medium") groqResult.threatLevel = "high";

  session.threatScore = groqResult.threatLevel === "high" ? 8 : 4;
  session.isCompleted = groqResult.type === "result";
  await session.save();

  if (groqResult.type === "result") {
    const result = await formatResult(groqResult, session._id);
    return { ...result, isRecheck: true };
  }

  return {
    type: "question",
    sessionId: session._id,
    question: groqResult.question,
    confidence: groqResult.confidence
  };
};