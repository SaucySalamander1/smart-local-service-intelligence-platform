// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'worker', 'admin'], default: 'customer' },
    isApproved: { type: Boolean, default: function () { return this.role === 'customer'; } },
    certifications: { type: String },

    // Worker profile fields
    skills: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    experience: { type: Number, default: 0 },
    serviceArea: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    profilePicture: { type: String },
    bio: { type: String },
    phone: { type: String },
    reviewCount: { type: Number, default: 0 },
    availability: {
      type: String,
      enum: ['online', 'offline', 'busy', 'unavailable'],
      default: 'offline'
    },

    // ✅ ADDED — needed for AI worker scoring & emergency sorting
    jobsDone: { type: Number, default: 0 },
    payRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);