const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  requestOTP,
  verifyOTP,
  getPaymentHistory,
  getPaymentById
} = require('../controllers/paymentController');

// Protected routes (authentication required)
router.post('/request-otp', protect, requestOTP);
router.post('/verify-otp', protect, verifyOTP);
router.get('/history', protect, getPaymentHistory);
router.get('/:paymentId', protect, getPaymentById);

module.exports = router;
