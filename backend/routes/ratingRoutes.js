const express = require('express');
const { submitRating, getWorkerRatings, getWorkerRatingStats } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (customer must be logged in to rate)
router.post('/submit', protect, submitRating);
router.get('/worker/:workerId', getWorkerRatings);
router.get('/worker/:workerId/stats', getWorkerRatingStats);

module.exports = router;
