const mongoose = require("mongoose");

const state = {
  connected: false,
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    state.connected = true;
    console.log("MongoDB Connected ✅");
  } catch (error) {
    state.connected = false;
    console.error("MongoDB connection failed:", error.message);
    console.warn("Proceeding without MongoDB. Warranty and dispute data will use in-memory fallback.");
  }
};

module.exports = { connectDB, state };
