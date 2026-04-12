const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
  getWorkers,
  getWorkerById,
  getServiceAreas,
  getAvailableSkills,
  updateWorkerProfile,
  uploadProfilePicture
} = require('../controllers/workerController');

// Public routes (no authentication required)
router.get('/', getWorkers);
router.get('/meta/service-areas', getServiceAreas);
router.get('/meta/skills', getAvailableSkills);
router.get('/:id', getWorkerById);

// Protected routes (authentication required)
router.put('/:id', protect, updateWorkerProfile);
router.post('/:id/upload-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
