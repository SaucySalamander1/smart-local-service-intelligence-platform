const User = require('../models/User');

// Get all workers with location filtering and rating-based ranking
exports.getWorkers = async (req, res) => {
  try {
    const { serviceArea, skill } = req.query;

    let query = { role: 'worker', isApproved: true };

    // Filter by service area if provided
    if (serviceArea) {
      query.serviceArea = { $regex: serviceArea, $options: 'i' }; // Case-insensitive
    }

    // Filter by skill if provided
    if (skill) {
      query.skills = { $in: [skill] };
    }

    // Fetch workers and sort by rating (highest first)
    const workers = await User.find(query)
      .select('name email skills rating experience serviceArea phone bio profilePicture')
      .sort({ rating: -1 }); // Sort by rating descending

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

// Get a single worker by ID
exports.getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await User.findById(id)
      .select('name email skills rating experience serviceArea phone bio profilePicture');

    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({
      success: true,
      data: worker
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching worker',
      error: error.message
    });
  }
};

// Get service areas (unique values for filtering)
exports.getServiceAreas = async (req, res) => {
  try {
    const areas = await User.find({ role: 'worker', isApproved: true })
      .distinct('serviceArea');

    res.status(200).json({
      success: true,
      data: areas.filter(area => area) // Remove null/undefined values
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service areas',
      error: error.message
    });
  }
};

// Get all available skills (unique values for filtering)
exports.getAvailableSkills = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isApproved: true });
    const skillsSet = new Set();

    workers.forEach(worker => {
      if (worker.skills && Array.isArray(worker.skills)) {
        worker.skills.forEach(skill => skillsSet.add(skill));
      }
    });

    res.status(200).json({
      success: true,
      data: Array.from(skillsSet)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message
    });
  }
};

// Update worker profile (only by the worker themselves)
exports.updateWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio, phone, skills, experience, serviceArea, profilePicture, availability, certifications } = req.body;

    // Find worker
    const worker = await User.findById(id);

    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    // Update fields
    if (name) worker.name = name;
    if (bio) worker.bio = bio;
    if (phone) worker.phone = phone;
    if (skills) worker.skills = skills;
    if (experience !== undefined) worker.experience = experience;
    if (serviceArea) worker.serviceArea = serviceArea;
    if (profilePicture) worker.profilePicture = profilePicture;
    if (availability) worker.availability = availability;
    if (certifications) worker.certifications = certifications;

    await worker.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: worker
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

