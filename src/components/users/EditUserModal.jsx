import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const EditUserModal = ({ userId, onClose, onSave }) => {
  const mockUsers = {
    1: { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
    2: { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
    3: { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
  };

  const [userData, setUserData] = useState(mockUsers[userId] || {});

  if (!userId) return null;

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm  z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal Container */}
        <motion.div
          className="bg-gray-800 text-gray-100 rounded-xl p-6 w-[400px] shadow-2xl border border-gray-700 relative"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={22} />
          </button>

          {/* Title */}
          <h2 className="text-xl font-semibold mb-5 text-white">Edit User</h2>

          {/* Name Input */}
          <label className="block text-gray-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          {/* Email Input */}
          <label className="block text-gray-300 mt-4 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          {/* Role Dropdown */}
          <label className="block text-gray-300 mt-4 mb-1">Role</label>
          <select
            name="role"
            value={userData.role || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
          </select>

          {/* Status Dropdown */}
          <label className="block text-gray-300 mt-4 mb-1">Status</label>
          <select
            name="status"
            value={userData.status || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Save Button */}
          <button
            onClick={() => onSave(userData)}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-500 p-2 rounded text-white font-semibold transition-all duration-200"
          >
            Save Changes
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditUserModal;
