// backend/controllers/workerController.js
const User = require('../models/User');

// ─── GET ALL WORKERS ──────────────────────────────────────────────────────────
// Supports: serviceArea, skill, category, area, sort (emergency|rating|jobs)
exports.getWorkers = async (req, res) => {
  try {
    const { serviceArea, skill, category, area, sort, location } = req.query;

    let query = { role: 'worker', isApproved: true };

    // Filter by service area (supports both param names)
    const areaFilter = serviceArea || area;
    if (areaFilter) {
      query.serviceArea = { $regex: areaFilter, $options: 'i' };
    }

    // Filter by skill (supports both param names)
    const skillFilter = skill || category;
    if (skillFilter && skillFilter !== 'general') {
      query.skills = { $in: [skillFilter] };
    }

    // Filter by location (substring matching)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    let workers = await User.find(query)
      .select('name email skills rating experience serviceArea location phone bio profilePicture availability reviewCount certifications jobsDone payRange')
      .sort({ rating: -1 });

    // ✅ Emergency sort — online first, then composite score
    if (sort === 'emergency') {
      workers = workers
        .map(w => ({ ...w.toObject(), _score: calcScore(w, skillFilter, areaFilter) }))
        .sort((a, b) => {
          const aOnline = a.availability === 'online' ? 1 : 0;
          const bOnline = b.availability === 'online' ? 1 : 0;
          if (bOnline !== aOnline) return bOnline - aOnline;
          return b._score - a._score;
        });
    }

    res.status(200).json({
      success: true,
      count: workers.length,
      data: workers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workers',
      error: error.message
    });
  }
};

// ─── GET SINGLE WORKER ────────────────────────────────────────────────────────
exports.getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await User.findById(id)
      .select('role name email skills rating experience serviceArea location phone bio profilePicture availability reviewCount certifications jobsDone payRange isApproved');

    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    res.status(200).json({ success: true, data: worker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching worker', error: error.message });
  }
};

// ─── GET SERVICE AREAS ────────────────────────────────────────────────────────
exports.getServiceAreas = async (req, res) => {
  try {
    const areas = await User.find({ role: 'worker', isApproved: true }).distinct('serviceArea');
    res.status(200).json({ success: true, data: areas.filter(area => area) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching service areas', error: error.message });
  }
};

// ─── GET AVAILABLE SKILLS ─────────────────────────────────────────────────────
exports.getAvailableSkills = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isApproved: true });
    const skillsSet = new Set();
    workers.forEach(worker => {
      if (worker.skills && Array.isArray(worker.skills)) {
        worker.skills.forEach(skill => skillsSet.add(skill));
      }
    });
    res.status(200).json({ success: true, data: Array.from(skillsSet) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching skills', error: error.message });
  }
};

// ─── UPDATE WORKER PROFILE ────────────────────────────────────────────────────
exports.updateWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio, phone, skills, experience, serviceArea, location, profilePicture, availability, certifications, payRange } = req.body;

    const worker = await User.findById(id);
    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    if (name !== undefined) worker.name = name;
    if (bio !== undefined) worker.bio = bio;
    if (phone !== undefined) worker.phone = phone;
    if (skills !== undefined) worker.skills = skills;
    if (experience !== undefined) worker.experience = experience;
    if (serviceArea !== undefined) worker.serviceArea = serviceArea;
    if (location !== undefined) worker.location = location;
    if (profilePicture !== undefined) worker.profilePicture = profilePicture;
    if (availability !== undefined) worker.availability = availability;
    if (certifications !== undefined) worker.certifications = certifications;
    if (payRange !== undefined) worker.payRange = payRange;

    await worker.save();
    console.log('✅ Worker updated:', { id, location: worker.location });
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: worker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
  }
};

// ─── UPLOAD PROFILE PICTURE ───────────────────────────────────────────────────
exports.uploadProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const worker = await User.findById(id);
    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    const fileUrl = `/uploads/profiles/${req.file.filename}`;
    worker.profilePicture = fileUrl;
    await worker.save();

    res.status(200).json({ success: true, message: 'Profile picture uploaded successfully', data: { profilePicture: fileUrl, worker } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading profile picture', error: error.message });
  }
};

// ─── COMPOSITE SCORE (for emergency sorting) ──────────────────────────────────
function calcScore(worker, category, userArea) {
  let score = 0;
  const area = (userArea || '').toLowerCase();
  const workerArea = (worker.serviceArea || '').toLowerCase();

  if (worker.skills && category && worker.skills.includes(category)) score += 10;
  if (area && workerArea.includes(area)) score += 8;
  else if (workerArea.includes('dhaka')) score += 3;
  if (worker.availability === 'online') score += 6;
  score += (worker.rating || 0);
  score += Math.min((worker.experience || 0) * 0.5, 5);
  score += Math.min((worker.jobsDone || 0) / 10, 5);
  score += Math.min((worker.reviewCount || 0) / 5, 3);
  return score;
}