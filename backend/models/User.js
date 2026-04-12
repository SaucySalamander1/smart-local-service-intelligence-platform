const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'worker', 'admin'], default: 'customer' },
    isApproved: { type: Boolean, default: function () { return this.role === 'customer'; } },
    certifications: { type: String }, // for worker
    
    // Worker profile fields
    skills: [{ type: String }], // e.g., ['plumbing', 'electrical', 'ac']
    rating: { type: Number, default: 0, min: 0, max: 5 }, // 0-5 star rating
    experience: { type: Number, default: 0 }, // years of experience
    serviceArea: { type: String }, // e.g., 'Delhi', 'Mumbai', etc.
    location: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    profilePicture: { type: String }, // URL to profile picture
    bio: { type: String },
    phone: { type: String },
    reviewCount: { type: Number, default: 0 }, // Total number of reviews
    availability: { type: String, enum: ['online', 'offline', 'busy', 'unavailable'], default: 'offline' }, // Worker availability status
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);