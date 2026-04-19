const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const router = express.Router();

const {
  createDispute,
  getDisputes,
  getDisputeById,
  updateDisputeStatus,
} = require("../controllers/disputeController");

const uploadsDir = path.join(__dirname, "../uploads/disputes");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `evidence-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// CREATE DISPUTE
router.post("/", upload.single("evidence"), createDispute);

// GET DISPUTES
router.get("/", getDisputes);

// GET SINGLE DISPUTE
router.get("/:id", getDisputeById);

// UPDATE DISPUTE STATUS / ADMIN ACTION
router.put("/:id/status", updateDisputeStatus);

module.exports = router;