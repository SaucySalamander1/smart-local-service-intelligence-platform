const Rating = require('../models/Rating');
const Job = require('../models/Job');
const User = require('../models/User');

// Submit a rating/review for a worker
exports.submitRating = async (req, res) => {
  try {
    const { jobId, workerId, rating, review } = req.body;
    const customerId = req.user.id;

    // Validate input
    if (!jobId || !workerId || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if job exists and is paid
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'paid') {
      return res.status(400).json({ message: 'Can only rate completed payments' });
    }

    // Check if customer already rated this job
    const existingRating = await Rating.findOne({ jobId, customerId });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this job' });
    }

    // Get customer and worker names
    const customer = await User.findById(customerId);
    const worker = await User.findById(workerId);

    // Create rating
    const newRating = new Rating({
      jobId,
      workerId,
      customerId,
      rating,
      review: review || '',
      customerName: customer?.name || 'Anonymous',
      jobTitle: job.title
    });

    await newRating.save();

    // Update worker's average rating
    const allRatings = await Rating.find({ workerId });
    const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await User.findByIdAndUpdate(workerId, {
      rating: parseFloat(averageRating.toFixed(2)),
      reviewCount: allRatings.length
    });

    console.log(`✅ Rating submitted: ${rating} stars for worker ${workerId}`);
    console.log(`✅ Worker new average rating: ${averageRating.toFixed(2)}`);

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        rating: newRating,
        workerNewRating: parseFloat(averageRating.toFixed(2)),
        totalReviews: allRatings.length
      }
    });
  } catch (error) {
    console.error('❌ Error submitting rating:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all ratings for a worker
exports.getWorkerRatings = async (req, res) => {
  try {
    const { workerId } = req.params;

    const ratings = await Rating.find({ workerId })
      .populate('customerId', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: ratings
    });
  } catch (error) {
    console.error('❌ Error fetching ratings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get rating stats for a worker
exports.getWorkerRatingStats = async (req, res) => {
  try {
    const { workerId } = req.params;

    const ratings = await Rating.find({ workerId });
    const worker = await User.findById(workerId);

    const ratingBreakdown = {
      5: ratings.filter(r => r.rating === 5).length,
      4: ratings.filter(r => r.rating === 4).length,
      3: ratings.filter(r => r.rating === 3).length,
      2: ratings.filter(r => r.rating === 2).length,
      1: ratings.filter(r => r.rating === 1).length
    };

    res.json({
      success: true,
      data: {
        averageRating: worker?.rating || 0,
        totalReviews: ratings.length,
        ratingBreakdown
      }
    });
  } catch (error) {
    console.error('❌ Error fetching rating stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
