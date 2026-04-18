// backend/controllers/jobController.js
const Job = require("../models/Job");
const Bid = require("../models/Bid");

// ─── CUSTOMER: Post a job ─────────────────────────────────────────────────────
// POST /api/jobs
exports.postJob = async (req, res) => {
  try {
    const { title, description, category, budget, area, urgency } = req.body;

    if (!title || !description || !category || !area) {
      return res.status(400).json({ message: "Title, description, category and area are required." });
    }

    const job = await Job.create({
      customer: req.user._id,
      title, description, category,
      budget: budget || 0,
      area, urgency: urgency || "normal"
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to post job", error: err.message });
  }
};

// ─── CUSTOMER: Get my jobs ────────────────────────────────────────────────────
// GET /api/jobs/my
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ customer: req.user._id })
      .populate("hiredWorker", "name phone profilePicture rating serviceArea")
      .populate("acceptedBid")
      .sort({ createdAt: -1 });

    // Get bid counts for each job
    const jobsWithBidCount = await Promise.all(
      jobs.map(async (job) => {
        const bidCount = await Bid.countDocuments({ job: job._id });
        return { ...job.toObject(), bidCount };
      })
    );

    res.json(jobsWithBidCount);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your jobs", error: err.message });
  }
};

// ─── ALL: Browse open jobs ────────────────────────────────────────────────────
// GET /api/jobs?category=electrical&area=Mirpur
exports.browseJobs = async (req, res) => {
  try {
    const { category, area, urgency } = req.query;

    let query = { status: "open" };
    if (category && category !== "all") query.category = category;
    if (area) query.area = { $regex: area, $options: "i" };
    if (urgency) query.urgency = urgency;

    const jobs = await Job.find(query)
      .populate("customer", "name")
      .sort({ urgency: -1, createdAt: -1 }); // urgent first

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to browse jobs", error: err.message });
  }
};

// ─── ALL: Get single job + its bids ──────────────────────────────────────────
// GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("customer", "name phone")
      .populate("hiredWorker", "name phone profilePicture rating serviceArea");

    if (!job) return res.status(404).json({ message: "Job not found" });

    const bids = await Bid.find({ job: job._id })
      .populate("worker", "name profilePicture rating serviceArea skills jobsDone phone availability");

    res.json({ job, bids });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job", error: err.message });
  }
};

// ─── WORKER: Submit a bid ─────────────────────────────────────────────────────
// POST /api/jobs/:id/bid
exports.submitBid = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "open") return res.status(400).json({ message: "Job is no longer open for bidding" });

    // Check if worker already bid
    const existingBid = await Bid.findOne({ job: job._id, worker: req.user._id });
    if (existingBid) return res.status(400).json({ message: "You have already bid on this job" });

    const { price, message, estimatedTime, workerLocation, workerCategory } = req.body;

    if (!price || !message || !estimatedTime) {
      return res.status(400).json({ message: "Price, message and estimated time are required" });
    }

    const bid = await Bid.create({
      job: job._id,
      worker: req.user._id,
      price, message, estimatedTime,
      workerLocation: workerLocation || req.user.serviceArea,
      workerCategory: workerCategory || req.user.skills || []
    });

    res.status(201).json({ message: "Bid submitted successfully", bid });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit bid", error: err.message });
  }
};

// ─── CUSTOMER: Accept a bid ───────────────────────────────────────────────────
// PUT /api/jobs/:id/accept/:bidId
exports.acceptBid = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (job.status !== "open") return res.status(400).json({ message: "Job is not open" });

    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    // Accept this bid
    bid.status = "accepted";
    await bid.save();

    // Reject all other bids
    await Bid.updateMany(
      { job: job._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    // Update job
    job.status = "in_progress";
    job.acceptedBid = bid._id;
    job.hiredWorker = bid.worker;
    await job.save();

    res.json({ message: "Bid accepted! Job is now in progress.", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to accept bid", error: err.message });
  }
};

// ─── WORKER: Mark job as done ─────────────────────────────────────────────────
// PUT /api/jobs/:id/worker-done
exports.workerMarkDone = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.hiredWorker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (job.status !== "in_progress") return res.status(400).json({ message: "Job is not in progress" });

    job.workerMarkedDone = true;
    await job.save();

    res.json({ message: "Marked as done. Waiting for customer confirmation.", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark done", error: err.message });
  }
};

// ─── CUSTOMER: Confirm completion ─────────────────────────────────────────────
// PUT /api/jobs/:id/confirm
exports.customerConfirm = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (!job.workerMarkedDone) {
      return res.status(400).json({ message: "Worker has not marked the job as done yet" });
    }

    job.customerConfirmed = true;
    job.status = "completed";
    await job.save();

    // Increment worker's jobsDone
    const User = require("../models/User");
    await User.findByIdAndUpdate(job.hiredWorker, { $inc: { jobsDone: 1 } });

    res.json({ message: "Job confirmed as completed! Please pay admin to release payment to worker.", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to confirm job", error: err.message });
  }
};

// ─── ADMIN: Get all jobs ──────────────────────────────────────────────────────
// GET /api/jobs/admin/all?status=completed
exports.adminGetAllJobs = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const jobs = await Job.find(query)
      .populate("customer", "name email phone")
      .populate("hiredWorker", "name email phone")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

// ─── ADMIN: Mark payment released ────────────────────────────────────────────
// PUT /api/jobs/:id/pay
exports.adminMarkPaid = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "completed") return res.status(400).json({ message: "Job is not completed yet" });

    job.adminPaid = true;
    job.status = "paid";
    await job.save();

    res.json({ message: "Payment released to worker successfully.", job });
  } catch (err) {
    res.status(500).json({ message: "Failed to release payment", error: err.message });
  }
};