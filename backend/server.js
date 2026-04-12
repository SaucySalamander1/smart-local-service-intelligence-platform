const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const workerRoutes = require('./routes/workerRoutes')
const { protect } = require('./middleware/authMiddleware')

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/workers', workerRoutes)

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const deemaRoutes = require('./routes/deemaRoutes');
app.use('/api/deema', deemaRoutes);