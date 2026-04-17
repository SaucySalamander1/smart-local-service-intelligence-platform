// backend/models/AISession.js
const mongoose = require("mongoose");

const aiSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problem: { type: String, required: true },
  category: { type: String, default: "general" },
  conversationHistory: [
    {
      role: { type: String, enum: ["user", "assistant"] },
      content: { type: String }
    }
  ],
  answers: [
    { question: String, answer: String }
  ],
  threatScore: { type: Number, default: 0 },
  confidence: { type: Number, default: 20 },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("AISession", aiSessionSchema);