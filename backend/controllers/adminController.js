const User = require('../models/User');

// Approve worker
exports.approveWorker = async (req, res) => {
  const { workerId } = req.body;
  const worker = await User.findById(workerId);
  if (!worker || worker.role !== 'worker') return res.status(404).json({ message: 'Worker not found' });

  worker.isApproved = true;
  await worker.save();

  res.json({ message: 'Worker approved successfully' });
};

// List unapproved workers
exports.listPendingWorkers = async (req, res) => {
  const workers = await User.find({ role: 'worker', isApproved: false });
  res.json(workers);
};