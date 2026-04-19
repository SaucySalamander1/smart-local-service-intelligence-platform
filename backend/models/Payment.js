const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      default: 'OTP'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    otpVerifiedAt: {
      type: Date
    },
    jobTitle: {
      type: String
    },
    jobDescription: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
