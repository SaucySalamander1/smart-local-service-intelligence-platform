// models/AISession.js
const mongoose = require("mongoose");

const aiSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  problem: String,
  category: String,
  answers: [{ question: String, answer: String }],
  currentQuestionIndex: { type: Number, default: 0 },
  threatScore: { type: Number, default: 0 },
  confidence: { type: Number, default: 20 },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("AISession", aiSessionSchema);