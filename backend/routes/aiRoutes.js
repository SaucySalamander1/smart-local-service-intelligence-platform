// routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const { startSession, answerQuestion, quickDiagnoseController } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/start", protect, startSession);
router.post("/answer", protect, answerQuestion);
router.post("/quick-diagnose", quickDiagnoseController);

module.exports = router;