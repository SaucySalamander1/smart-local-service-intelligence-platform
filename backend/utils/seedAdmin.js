require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

connectDB();

const seedAdmin = async () => {
  const existing = await User.findOne({ email: 'admin@example.com' });
  if (existing) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Super Admin',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
    isApproved: true
  });

  console.log('Admin created');
  process.exit();
};

seedAdmin();