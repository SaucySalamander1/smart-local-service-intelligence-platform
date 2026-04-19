const Payment = require('../models/Payment');
const Job = require('../models/Job');
const User = require('../models/User');

// ─── REQUEST OTP ────────────────────────────────────────────────────────────
exports.requestOTP = async (req, res) => {
  try {
    const { jobId } = req.body;
    const customerId = req.user.id;

    // Validate job exists and is in correct state
    const job = await Job.findById(jobId)
      .populate('hiredWorker', 'id')
      .populate('customer', 'id');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if job is marked as done by worker
    if (!job.workerMarkedDone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Worker has not marked this job as completed yet' 
      });
    }

    // Check if customer is requesting
    if (job.customer._id.toString() !== customerId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only the job customer can request payment' 
      });
    }

    // Check if already paid
    if (job.status === 'paid') {
      return res.status(400).json({ 
        success: false, 
        message: 'This job is already paid' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enter any 4-6 digit code to complete payment (Mock OTP)',
      data: {
        jobId,
        note: 'This is a mock OTP system - enter any 4-6 digit code'
      }
    });
  } catch (error) {
    console.error('❌ Error requesting OTP:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error requesting OTP',
      error: error.message
    });
  }
};

// ─── VERIFY OTP & PROCESS PAYMENT ───────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { jobId, otp } = req.body;
    const customerId = req.user.id;

    if (!jobId || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Job ID and OTP are required' 
      });
    }

    // Validate OTP is 4-6 digits
    if (!/^\d{4,6}$/.test(otp.toString())) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP must be 4-6 digits' 
      });
    }

    // Validate job
    const job = await Job.findById(jobId)
      .populate('hiredWorker', '_id name')
      .populate('customer', '_id email');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check authorization
    if (job.customer._id.toString() !== customerId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    // ✅ OTP VERIFIED (mock - any 4-6 digits accepted)
    console.log(`\n✅ PAYMENT VERIFIED!`);
    console.log(`OTP Code: ${otp}`);

    // Generate transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment record
    const payment = new Payment({
      jobId,
      customerId: job.customer._id,
      workerId: job.hiredWorker._id,
      amount: job.budget,
      paymentMethod: 'OTP',
      status: 'completed',
      transactionId,
      otpVerifiedAt: new Date(),
      jobTitle: job.title,
      jobDescription: job.description
    });

    await payment.save();
    console.log(`✅ Payment created: ${transactionId}`);

    // Update job status
    job.status = 'paid';
    job.customerConfirmed = true;
    await job.save();
    console.log(`✅ Job ${jobId} marked as PAID`);

    console.log(`\n💰 PAYMENT SUCCESSFUL!`);
    console.log(`Transaction ID: ${transactionId}`);
    console.log(`Amount: ৳${job.budget}`);
    console.log(`Job: ${job.title}\n`);

    res.status(200).json({
      success: true,
      message: 'Payment successful! Job marked as completed and paid.',
      data: {
        paymentId: payment._id,
        transactionId,
        amount: job.budget,
        jobId
      }
    });
  } catch (error) {
    console.error('❌ Error verifying payment:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// ─── GET PAYMENT HISTORY ────────────────────────────────────────────────────
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get payments where user is customer or worker
    const payments = await Payment.find({
      $or: [{ customerId: userId }, { workerId: userId }]
    })
      .populate('jobId', 'title')
      .populate('customerId', 'name email')
      .populate('workerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('❌ Error fetching payment history:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// ─── GET PAYMENT BY ID ──────────────────────────────────────────────────────
exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('jobId')
      .populate('customerId', 'name email')
      .populate('workerId', 'name email');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('❌ Error fetching payment:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};
