import React, { useContext, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const Forgot_password = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const [status, setStatus] = useState("initial");

  const handleSubmit = async () => {
    if (!email) return;
    try {
      setError("");
      setResultMsg("");
      const response = await api.post("forgot-password/", { email });
      setResultMsg(response.data.message);
      setStatus("otp_sent");
    } catch (err) {
      console.log(err);
      const errorData = err.response?.data;
      setError(
        errorData?.error || errorData?.email?.[0] || "Something went wrong.",
      );
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;
    else if (otp.length !== 6) setError("Enter invalid otp..");
    try {
      setError("");
      setResultMsg("");
      const response = await api.post("verify-otp/", { email, otp });
      setResultMsg(response.data.message);
      setStatus("otp_verified");
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.error || "Invalid or expired OTP.");
    }
  };

  const handleResetPassword = async () => {

      if (
        newPassword.length < 8 ||
        !/[A-Z]/.test(newPassword) ||
        !/[a-z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
      ) {
        setResultMsg("")
        setError("Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.")
        return
      }

    try {
      setError("");
      setResultMsg("");
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      const response = await api.post("reset-password/", {
        email,
        new_password: newPassword,
      });
      setResultMsg(response.data.message || "Password reset successfully!");
      setStatus("completed");
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.error || "Failed to reset password.");
    }
  };

  return (
    <div className="w-full flex justify-center items-center px-4 py-8">
      <div className="w-[450px] max-w-full flex flex-col items-center gap-5 bg-gray-800 rounded-2xl p-8 shadow-xl text-white border border-gray-700/50">
        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 w-full p-3 rounded-xl text-center border border-red-500/20 font-medium">
            {error}
          </p>
        )}
        {resultMsg && (
          <p className="text-green-400 text-sm bg-green-500/10 w-full p-3 rounded-xl text-center border border-green-500/20 font-medium">
            {resultMsg}
          </p>
        )}

        {status === "initial" && (
          <>
            <input
              type="email"
              placeholder="Enter Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-700 text-white px-4 py-3.5 rounded-xl outline-none border border-gray-600 focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              className="w-full bg-green-600 py-3.5 active:scale-95 text-white rounded-xl font-semibold hover:bg-green-700 transition duration-200 active:scale-\[0.98\] shadow-md"
              onClick={handleSubmit}
            >
              Send OTP
            </button>
          </>
        )}

        {status === "otp_sent" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP..."
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full bg-gray-700 text-white px-4 py-3.5 rounded-xl outline-none border border-gray-600 focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              className="w-full bg-green-600 py-3.5 text-white rounded-xl font-semibold hover:bg-green-700 transition duration-200 active:scale-95 shadow-md"
              onClick={verifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}

        {status === "otp_verified" && (
          <>
            <input
              type="password"
              placeholder="Enter New Password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-gray-700 text-white px-4 py-3.5 rounded-xl outline-none border border-gray-600 focus:border-blue-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Confirm New Password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-gray-700 text-white px-4 py-3.5 rounded-xl outline-none border border-gray-600 focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              className="w-full bg-blue-600 py-3.5 active:scale-95 text-white rounded-xl font-semibold hover:bg-blue-700 transition duration-200 active:scale-\[0.98\] shadow-md"
              onClick={handleResetPassword}
            >
              Update Password
            </button>
          </>
        )}

        {status === "completed" && (
          <Link
            to="/login"
            className="w-full text-center bg-gray-700 py-3.5 rounded-xl text-green-400 font-semibold hover:bg-gray-600 transition duration-200 shadow-inner"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Forgot_password;
