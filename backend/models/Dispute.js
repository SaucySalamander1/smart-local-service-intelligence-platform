const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
  serviceId: String,
  type: String,
  description: String,
  expectedResolution: String,
  amount: Number,
  evidence: String,
  timeline: [
    {
      status: String,
      date: String,
      note: String,
    },
  ],
  status: {
    type: String,
    default: "Submitted",
  },
  providerNotes: String,
  adminNotes: String,
}, { timestamps: true });

module.exports = mongoose.model("Dispute", disputeSchema);