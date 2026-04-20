// backend/server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();



const { connectDB } = require("./config/db");
const warrantyRoutes = require("./routes/warrantyRoutes");
const disputeRoutes = require("./routes/disputeRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const workerRoutes = require("./routes/workerRoutes");
const jobRoutes = require("./routes/jobRoutes");
const messageRoutes = require("./routes/messageRoutes");
const aiRoutes = require("./routes/aiRoutes");
const deemaRoutes = require("./routes/deemaRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const { protect } = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app);

// ✅ SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5001"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});


app.use((req, res, next) => {
  console.log("API HIT:", req.method, req.url);
  next();
});

// ✅ CONNECT DB
connectDB();

// ✅ MIDDLEWARE
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5001"
  ],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/warranty", warrantyRoutes);
app.use("/api/dispute", disputeRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ EXISTING ROUTES (UNCHANGED)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/deema", deemaRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ratings", ratingRoutes);


// ✅ TEST ROUTES
app.get("/", (req, res) => res.send("API is working"));

app.get("/api/test", protect, (req, res) => {
  res.json({ message: "Protected route working", user: req.user });
});

// =============================
// 🔥 SOCKET SYSTEM (UPGRADED)
// =============================
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join user room
  socket.on("join", (userId) => {
    connectedUsers[userId] = socket.id;
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  // 💬 NORMAL CHAT (existing)
  socket.on("sendMessage", (data) => {
    const { senderId, receiverId, message, messageId } = data;

    io.to(receiverId).emit("receiveMessage", {
      senderId,
      receiverId,
      message,
      messageId,
      timestamp: new Date(),
    });

    console.log(`Message from ${senderId} to ${receiverId}`);
  });

  // ⚖️ DISPUTE CHAT (NEW)
  socket.on("disputeMessage", (data) => {
    const { disputeId, sender, message } = data;

    io.to(disputeId).emit("disputeMessage", {
      sender,
      message,
      time: new Date(),
    });
  });

  // Join dispute room
  socket.on("joinDispute", (disputeId) => {
    socket.join(disputeId);
    console.log(`Joined dispute room ${disputeId}`);
  });

  socket.on("disconnect", () => {
    for (const [userId, sockId] of Object.entries(connectedUsers)) {
      if (sockId === socket.id) {
        delete connectedUsers[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// =============================
// 🚀 SERVER START
// =============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// ✅ EXPORT (KEEP THIS)
module.exports = { app, server, io };
