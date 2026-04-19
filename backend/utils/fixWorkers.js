require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

connectDB();

const fixWorkers = async () => {
  try {
    // Find all workers regardless of isApproved status
    const allWorkers = await User.find({ role: 'worker' });
    console.log(`Found ${allWorkers.length} workers total`);
    
    // Check how many are approved
    const approvedWorkers = await User.find({ role: 'worker', isApproved: true });
    console.log(`Found ${approvedWorkers.length} approved workers`);
    
    // Update all workers to isApproved: true
    const result = await User.updateMany(
      { role: 'worker' },
      { $set: { isApproved: true } }
    );
    
    console.log(`Updated ${result.modifiedCount} workers to isApproved: true`);
    
    // Show list of workers
    const updatedWorkers = await User.find({ role: 'worker', isApproved: true })
      .select('name email skills serviceArea');
    console.log('Updated workers:', updatedWorkers);
    
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixWorkers();
