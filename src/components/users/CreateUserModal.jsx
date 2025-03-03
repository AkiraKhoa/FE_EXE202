import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";

const CreateUserModal = ({ onClose, onSave }) => {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
    status: "Active",
    subscriptionStatus: "Free",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSave(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
      console.error("Error creating user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 pt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 text-gray-100 rounded-xl p-6 w-[400px] shadow-2xl border border-gray-700 relative mb-24"
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 30, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={22} />
          </button>

          <h2 className="text-xl font-semibold mb-5 text-white">Create User</h2>

          {error && (
            <div className="mb-4 p-2 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <label className="block text-gray-300 mb-1">Username</label>
          <input
            type="text"
            name="userName"
            value={userData.userName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">Status</label>
          <select
            name="status"
            value={userData.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>

          <label className="block text-gray-300 mt-4 mb-1">
            Subscription Status
          </label>
          <select
            name="subscriptionStatus"
            value={userData.subscriptionStatus}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
            <option value="Pro">Pro</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`mt-6 w-full p-2 rounded text-white font-semibold transition-all duration-200 ${
              isSubmitting
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateUserModal;