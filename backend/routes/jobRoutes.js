// backend/routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  postJob,
  getMyJobs,
  browseJobs,
  getJobById,
  submitBid,
  acceptBid,
  workerMarkDone,
  customerConfirm,
  adminGetAllJobs,
  adminMarkPaid,
} = require("../controllers/jobController");

// ── CUSTOMER ──
router.post("/", protect, postJob);                          // Post a job
router.get("/my", protect, getMyJobs);                      // My posted jobs
router.put("/:id/accept/:bidId", protect, acceptBid);       // Accept a bid
router.put("/:id/confirm", protect, customerConfirm);       // Confirm completion

// ── WORKER (teammate builds UI) ──
router.post("/:id/bid", protect, submitBid);                // Submit a bid
router.put("/:id/worker-done", protect, workerMarkDone);    // Mark as done

// ── BROWSE (all users) ──
router.get("/", protect, browseJobs);                       // Browse open jobs
router.get("/:id", protect, getJobById);                    // Single job + bids

// ── ADMIN ──
router.get("/admin/all", protect, adminGetAllJobs);         // All jobs
router.put("/:id/pay", protect, adminMarkPaid);             // Release payment

module.exports = router;