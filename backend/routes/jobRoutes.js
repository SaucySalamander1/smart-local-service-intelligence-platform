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
  hireWorkerDirectly,
  adminGetAllJobs,
  adminMarkPaid,
} = require("../controllers/jobController");

// ── EXACT PATHS FIRST (highest priority) ──
router.post("/", protect, postJob);                          // POST / - Post a job
router.get("/", protect, browseJobs);                       // GET / - Browse open jobs
router.get("/my", protect, getMyJobs);                      // GET /my - My jobs
router.get("/admin/all", protect, adminGetAllJobs);         // GET /admin/all - All jobs

// ── SPECIFIC NAMED PATHS (before parameter routes) ──
router.post("/hire/:workerId", protect, hireWorkerDirectly); // POST /hire/:workerId - Hire worker

// ── PARAMETER-BASED MULTI-SEGMENT ROUTES ──
router.put("/:id/accept/:bidId", protect, acceptBid);       // PUT /:id/accept/:bidId - Accept bid
router.put("/:id/confirm", protect, customerConfirm);       // PUT /:id/confirm - Confirm completion
router.put("/:id/pay", protect, adminMarkPaid);             // PUT /:id/pay - Release payment
router.post("/:id/bid", protect, submitBid);                // POST /:id/bid - Submit bid
router.put("/:id/worker-done", protect, workerMarkDone);    // PUT /:id/worker-done - Mark done

// ── GENERIC SINGLE-PARAMETER ROUTE (lowest priority - must be last) ──
router.get("/:id", protect, getJobById);                    // GET /:id - Get job details

module.exports = router;