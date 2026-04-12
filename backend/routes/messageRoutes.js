const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  getConversation,
  listConversations
} = require('../controllers/messageController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Send a message
router.post('/send', sendMessage);

// Get conversation with another user
router.get('/conversation/:otherUserId', getConversation);

// Get all conversations
router.get('/conversations', listConversations);

module.exports = router;
