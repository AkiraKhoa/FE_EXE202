import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const ForgotPasswordForm = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    resetCode: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/identity/forgotPassword`,
        { email: formData.email }
      );
      setSuccess("Please check your email for the reset code.");
      setCodeSent(true);
    } catch (error) {
      console.error(error);
      // Handle ASP.NET Core Identity error format
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(", ");
        setError(errorMessages || "Failed to send reset code.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to send reset code. Please try again.");
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/identity/resetPassword`,
        {
          email: formData.email,
          resetCode: formData.resetCode,
          newPassword: formData.newPassword,
        }
      );
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      // Handle ASP.NET Core Identity error format
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(", ");
        setError(errorMessages || "Failed to reset password.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <motion.div 
        className="z-10 flex items-center justify-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-7xl font-bold text-orange-400">App Chảo</h1>
        <img 
          src="/pan.png" 
          alt="App Chảo Icon" 
          className="ml-2 h-[180px] w-[180px]" 
        />
      </motion.div>

      {/* Form Section */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 w-96"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={codeSent ? handleResetPassword : handleSendCode}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              disabled={codeSent}
            />
          </div>

          {codeSent && (
            <>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Reset Code</label>
                <input
                  type="text"
                  name="resetCode"
                  value={formData.resetCode}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          {success && (
            <div className="text-green-500 text-center mb-4">{success}</div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg text-white font-semibold transition-all duration-200"
          >
            {codeSent ? "Reset Password" : "Send Code"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-4 bg-gray-600 hover:bg-gray-500 p-3 rounded-lg text-white font-semibold transition-all duration-200"
            type="button"
            onClick={handleBackToLogin}
          >
            Back to Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;