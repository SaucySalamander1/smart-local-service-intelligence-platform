// backend/models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  budget: { type: Number, default: 0 },
  area: { type: String, required: true },
  urgency: { type: String, enum: ["low", "normal", "high"], default: "normal" },
  status: {
    type: String,
    enum: ["open", "in_progress", "completed", "paid"],
    default: "open"
  },
  acceptedBid: { type: mongoose.Schema.Types.ObjectId, ref: "Bid", default: null },
  hiredWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  workerMarkedDone: { type: Boolean, default: false },
  customerConfirmed: { type: Boolean, default: false },
  adminPaid: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);