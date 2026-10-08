import React, { useState } from 'react';
import API from '../../api';
import api from '../../api';


const Forgot_password = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [canResetPassword, setCanResetPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccessMessage('');
      const response = await api.post('forgot-password/', { email });
      setOtpSent(true);
      setSuccessMessage(response.data.message);
    } catch (err) {
      console.log(err);
      const errorData = err.response?.data;
      setError(errorData?.error || errorData?.email?.[0] || 'Something went wrong.');
    }
  };

  const verifyOtp = async () => {
    try {
      setError('');
      setSuccessMessage('');
      const response = await api.post('verify-otp/', { email, otp });
      setCanResetPassword(true);
      setSuccessMessage(response.data.message);
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.error || 'Invalid or expired OTP.');
    }
  }; 

  return (
    <div className="w-full max-w-md items-center flex flex-col gap-4 bg-gray-800 rounded-2xl p-8 shadow-lg">

      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!otpSent ? (
        <>
          <input
            type="email"
            name="email"
            placeholder="Enter Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
          />
          <button
            type="button"
            className="w-full bg-green-600 py-3 text-white rounded-lg font-semibold hover:bg-green-700 transition active:scale-95"
            onClick={handleSubmit}
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP..."
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-blue-500"
          />
          <button
            type="button"
            className="w-full bg-green-600 py-3 text-white rounded-lg font-semibold hover:bg-green-700 transition active:scale-95"
            onClick={verifyOtp} 
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default Forgot_password;
