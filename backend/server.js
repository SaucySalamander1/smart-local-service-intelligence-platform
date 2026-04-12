const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
require('dotenv').config()

const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const workerRoutes = require('./routes/workerRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { protect } = require('./middleware/authMiddleware')

const aiRoutes = require('./routes/aiRoutes');

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

connectDB()

app.use(cors())
app.use(express.json())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

app.use('/api/workers', workerRoutes)
app.use('/api/messages', messageRoutes)

app.use('/api/ai', aiRoutes);


app.get('/', (req, res) => {
  res.send('API is working')
})

app.get('/api/test', protect, (req, res) => {

  res.json({
    message: "Protected route working",
    user: req.user
  })

})

const PORT = process.env.PORT || 5000

// Store connected users
const connectedUsers = {}

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // User joins their personal room
  socket.on('join', (userId) => {
    connectedUsers[userId] = socket.id
    socket.join(userId)
    console.log(`User ${userId} joined room`)
  })

  // Send message event
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message, messageId } = data
    
    // Emit to receiver's room
    io.to(receiverId).emit('receiveMessage', {
      senderId,
      receiverId,
      message,
      messageId,
      timestamp: new Date()
    })

    console.log(`Message from ${senderId} to ${receiverId}`)
  })

  // User disconnects
  socket.on('disconnect', () => {
    for (const [userId, sockId] of Object.entries(connectedUsers)) {
      if (sockId === socket.id) {
        delete connectedUsers[userId]
        console.log(`User ${userId} disconnected`)
        break
      }
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const deemaRoutes = require('./routes/deemaRoutes');
app.use('/api/deema', deemaRoutes);

module.exports = { app, server, io };