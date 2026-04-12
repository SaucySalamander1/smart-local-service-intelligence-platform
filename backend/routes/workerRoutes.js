const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  getWorkers,
  getWorkerById,
  getServiceAreas,
  getAvailableSkills,
  updateWorkerProfile
} = require('../controllers/workerController');

// Public routes (no authentication required)
router.get('/', getWorkers);
router.get('/meta/service-areas', getServiceAreas);
router.get('/meta/skills', getAvailableSkills);
router.get('/:id', getWorkerById);

// Protected routes (authentication required)
router.put('/:id', protect, updateWorkerProfile);

module.exports = router;
