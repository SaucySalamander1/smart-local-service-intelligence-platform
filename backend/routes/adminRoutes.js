const express = require('express');
const router = express.Router();
const { approveWorker, listPendingWorkers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // must be logged in

// Only admin can access
router.use((req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
  next();
});

router.get('/pending-workers', listPendingWorkers);
router.post('/approve-worker', approveWorker);

module.exports = router;