const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      default: ''
    },
    customerName: {
      type: String
    },
    jobTitle: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rating', ratingSchema);
