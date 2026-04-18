// backend/models/Bid.js
const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  message: { type: String, required: true },
  estimatedTime: { type: String, required: true }, // e.g. "2 hours", "1 day"
  workerLocation: { type: String },
  workerCategory: [{ type: String }],
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
}, { timestamps: true });

module.exports = mongoose.model("Bid", bidSchema);