const mongoose = require("mongoose");

const warrantySchema = new mongoose.Schema({
  serviceId: String,
  warrantyType: String,
  coverageBasis: String,
  provider: String,
  duration: Number,
  startDate: Date,
  expiry: Date,
  coveredIssues: String,
  exclusions: String,
  status: String,
  claimCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Warranty", warrantySchema);
