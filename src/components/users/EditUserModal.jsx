import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";

const EditUserModal = ({ id, onClose, onSave, allUsers }) => {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    status: "Active",
    subscriptionStatus: "Free",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("Modal opened with id:", id);
    const currentUser = allUsers.find((user) => user.id === id);
    if (currentUser) {
      console.log("User found in allUsers:", currentUser);
      setUserData(currentUser);
      setIsLoading(false);
    } else {
      console.log("Fetching user from API...");
      fetchUserById();
    }
  }, [id]);

  const fetchUserById = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      console.log("Fetching user with URL:", `${import.meta.env.VITE_SERVER_URL}/users/${id}`);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API response:", response.data);
      setUserData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      setError("Failed to fetch user details");
    } finally {
      setIsLoading(false);
    }
  };

  const [emailError, setEmailError] = useState(null);

  const handleChange = (e) => {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
  
      // Kiểm tra email ngay khi nhập
      if (name === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
              setEmailError("Please enter a valid email address.");
          } else {
              setEmailError(null);
          }
      }
  };
  

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSave(userData);
    } catch (err) {
      setError("Failed to save changes");
      console.error("Error saving changes:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-gray-800 rounded-xl p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-300">Loading...</span>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (error || !userData) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-gray-800 rounded-xl p-8">
            <div className="text-red-400 mb-4">{error || "User not found"}</div>
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

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

          <h2 className="text-xl font-semibold mb-5 text-white">Edit User</h2>

          {error && (
            <div className="mb-4 p-2 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <label className="block text-gray-300 mb-1">Username</label>
          <input
            type="text"
            name="userName"
            value={userData.userName || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">Status</label>
          <select
            name="status"
            value={userData.status || "Active"}
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
            value={userData.subscriptionStatus || "Free"}
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditUserModal;