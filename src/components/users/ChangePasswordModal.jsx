import { useState } from "react";
import { motion } from "framer-motion";
import { X, Lock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast"; // Add this import

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwords.newPassword !== passwords.confirmPassword) {
      const errorMsg = "New passwords do not match";
      setError(errorMsg);
      toast.error(errorMsg, {
        id: 'password-mismatch',
      });
      return;
    }

    // Validate password length
    if (passwords.newPassword.length < 6) {
      const errorMsg = "Password must be at least 6 characters long";
      setError(errorMsg);
      toast.error(errorMsg, {
        id: 'password-length',
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("upId");

      await axios.put(
        `${import.meta.env.VITE_API}/Auth/change-password`,
        {
          ...passwords,
          userId: userId
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      // Success notification
      toast.success("Password changed successfully!", {
        id: 'password-success',
        duration: 3000,
      });

      // Reset form and close modal
      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      onClose();

    } catch (err) {
      console.error("Password change error:", err);
      const errorMsg = err.response?.data?.message || "Failed to change password";
      setError(errorMsg);
      toast.error(errorMsg, {
        id: 'password-error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center mb-6">
          <Lock className="text-blue-500 mr-2" size={24} />
          <h2 className="text-xl font-semibold text-white">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChangePasswordModal;