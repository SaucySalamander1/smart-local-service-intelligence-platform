import React, { useState } from 'react';
import { requestOTP, verifyOTP } from '../api/payments';

const PaymentModal = ({ jobId, jobTitle, amount, onPaymentSuccess, onClose }) => {
  const [step, setStep] = useState('confirm'); // 'confirm', 'otp', 'success', 'error'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRequestOTP = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await requestOTP(jobId);

      if (response.success) {
        setMessage(response.message);
        setStep('otp');
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setErrorMessage('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const response = await verifyOTP(jobId, otp);

      if (response.success) {
        setStep('success');
        setMessage('Payment completed successfully!');
        setTimeout(() => {
          onPaymentSuccess(response.data);
        }, 2000);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment Confirmation</h2>
          <p className="text-gray-600 text-sm mt-1">{jobTitle}</p>
        </div>

        {/* Confirm Step */}
        {step === 'confirm' && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm mb-3">
                Total Amount to Pay:
              </p>
              <p className="text-3xl font-bold text-blue-600">৳{amount}</p>
              <p className="text-gray-600 text-xs mt-2">
                OTP will be sent to your registered email
              </p>
            </div>

            <button
              onClick={handleRequestOTP}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              {loading ? 'Sending OTP...' : 'Proceed to Pay'}
            </button>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div>
            <div className="mb-6">
              <p className="text-gray-700 text-sm mb-4">
                {message}
              </p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl letter-spacing-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <p className="text-gray-600 text-xs mt-2 text-center">
                ⏱️ OTP expires in 10 minutes
              </p>
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200 mb-3"
            >
              {loading ? 'Verifying...' : 'Verify & Complete Payment'}
            </button>

            <button
              onClick={() => setStep('confirm')}
              disabled={loading}
              className="w-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition duration-200"
            >
              Back
            </button>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 text-sm">
              Your payment has been processed successfully. The worker has been notified.
            </p>
            <p className="text-gray-600 text-xs mt-4">Redirecting...</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Close Button */}
        {(step === 'confirm' || step === 'otp') && (
          <button
            onClick={onClose}
            className="mt-4 w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
