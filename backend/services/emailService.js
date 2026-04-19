const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate OTP
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
exports.sendOTPEmail = async (otp, recipientEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: recipientEmail || process.env.OTP_RECIPIENT,
      subject: '🔐 Your Payment OTP - Smart Local Service',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">Payment OTP Verification</h2>
            
            <p style="color: #666; font-size: 14px;">
              Your one-time password (OTP) for payment verification is:
            </p>
            
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #2563eb; letter-spacing: 5px; margin: 0;">
                ${otp}
              </h1>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              ⏱️ This OTP will expire in ${process.env.OTP_EXPIRY || 10} minutes
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              If you didn't request this OTP, please ignore this email.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px; text-align: center; color: #999; font-size: 12px;">
              <p>Smart Local Service Intelligence Platform</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    throw error;
  }
};

// Send payment confirmation email
exports.sendPaymentConfirmationEmail = async (recipientEmail, jobTitle, amount, transactionId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject: '✅ Payment Confirmed - Smart Local Service',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #22c55e; text-align: center;">✅ Payment Successful</h2>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
              <p style="color: #166534; margin: 0 0 10px 0;">
                <strong>Job:</strong> ${jobTitle}
              </p>
              <p style="color: #166534; margin: 0 0 10px 0;">
                <strong>Amount:</strong> ৳${amount}
              </p>
              <p style="color: #166534; margin: 0;">
                <strong>Transaction ID:</strong> ${transactionId}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Your payment has been successfully processed. The worker has been notified and the job is now marked as completed.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px; text-align: center; color: #999; font-size: 12px;">
              <p>Smart Local Service Intelligence Platform</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Payment confirmation email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending payment confirmation email:', error.message);
    throw error;
  }
};
