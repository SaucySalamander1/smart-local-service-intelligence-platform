// backend/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const { handleStart, handleContinue, handleRecheck } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/start", protect, handleStart);
router.post("/continue", protect, handleContinue);
router.post("/recheck", protect, handleRecheck);



module.exports = router;