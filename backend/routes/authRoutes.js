const express = require('express')
const router = express.Router()

const {
  registerUser,
  loginUser,
  adminLogin
} = require('../controllers/authController')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/admin/login', adminLogin)

module.exports = router