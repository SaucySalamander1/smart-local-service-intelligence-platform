// backend/services/aiEngine.js

const faqData = require("../data/faqData");
const workers = require("../data/workersData");

const normalize = (text) => text.toLowerCase().trim();

// CATEGORY DETECTION
const detectCategory = (problem) => {
  const text = normalize(problem);

  for (let category in faqData) {
    if (faqData[category].keywords.some((k) => text.includes(k))) {
      return category;
    }
  }

  return "general";
};

// HUMAN RESPONSE STYLE
const humanize = (question) => {
  return `Alright, let’s check this. ${question}`;
};

// LOCATION DETECTION
const extractLocation = (text) => {
  const locations = [
    "mirpur",
    "mirpur 10",
    "uttara",
    "sector 7",
    "dhanmondi",
    "gulshan",
    "banani",
    "dhaka",
  ];

  text = normalize(text);
  return locations.find((loc) => text.includes(loc)) || "dhaka";
};

// WORKER SCORING
const scoreWorker = (worker, category, userLocation) => {
  let score = 0;

  if (worker.category === category) score += 5;

  if (worker.locations.includes(userLocation)) score += 5;
  else if (worker.locations.includes("dhaka")) score += 2;

  score += worker.rating;
  score += worker.jobsDone / 100;

  return score;
};

// FIND BEST WORKERS
const findBestWorkers = (category, userText) => {
  const location = extractLocation(userText);

  return workers
    .map((w) => ({
      ...w,
      score: scoreWorker(w, category, location),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

// START AI
exports.startAI = (problem) => {
  const category = detectCategory(problem);
  const faqs = faqData[category].faqs;

  return {
    category,
    question: humanize(faqs[0]?.question || "Explain your issue."),
    threatScore: 0,
    confidence: 20,
  };
};

// PROCESS ANSWER
exports.processAnswer = (session, answer) => {
  const categoryData = faqData[session.category];
  const faqs = categoryData.faqs;
  const currentFaq = faqs[session.currentQuestionIndex];

  let threat = session.threatScore;
  let confidence = session.confidence;

  const text = normalize(answer);

  // SMART UNDERSTANDING
  if (text.includes("not working") || text.includes("no cooling")) {
    threat += 2;
    confidence += 15;
  }

  if (text.includes("smell") || text.includes("burn")) {
    threat += 4;
    confidence += 20;
  }

  if (text.includes("noise")) {
    threat += 2;
    confidence += 10;
  }

  if (text.includes("yes")) {
    threat += currentFaq.impact?.threat || 1;
    confidence += currentFaq.impact?.confidence || 10;
  }

  if (!["yes", "no"].includes(text)) {
    confidence += 10;
  }

  // LIVE PRECAUTION
  let precaution = null;
  if (threat >= 5) {
    precaution =
      "⚠️ Please consider turning off the appliance to avoid further damage.";
  }

  const nextIndex = session.currentQuestionIndex + 1;

  // FINISH EARLY IF CONFIDENT
  if (nextIndex >= faqs.length || confidence > 80) {
    return {
      done: true,
      result: generateFinalDiagnosis(
        categoryData,
        threat,
        confidence,
        session.problem
      ),
    };
  }

  return {
    done: false,
    nextIndex,
    nextQuestion: humanize(faqs[nextIndex].question),
    precaution,
    threatScore: threat,
    confidence,
  };
};

// FINAL RESULT
const generateFinalDiagnosis = (categoryData, threat, confidence, problem) => {
  let level = "low";
  if (threat >= 6) level = "high";
  else if (threat >= 3) level = "medium";

  let diagnosis = "";

  if (level === "low") {
    diagnosis = "This seems like a minor issue you can fix yourself.";
  } else if (level === "medium") {
    diagnosis =
      "This might need attention. Try the solutions, or consider a technician.";
  } else {
    diagnosis =
      "This looks serious. I strongly recommend professional help.";
  }

  return {
    threatLevel: level,
    confidence,
    diagnosis,
    solutions: categoryData.solutions[level],
    precautions: categoryData.precautions || [],
    workers: level !== "low" ? findBestWorkers(categoryData.type, problem) : [],
  };
};

// QUICK DIAGNOSE
exports.quickDiagnose = (problem) => {
  const category = detectCategory(problem);

  return {
    category,
    message: "Basic diagnosis complete.",
    suggestion: "Start full AI chat for detailed help.",
  };
};