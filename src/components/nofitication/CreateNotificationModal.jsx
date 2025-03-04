import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { title } from "framer-motion/client";
import axios from "axios";

const CreateNotificationModal = ({ onClose, onSave }) => {
  const [notificationData, setNotificationData] = useState({
    staffId: localStorage.getItem("userId"),
    title: "",
    content: "",
    type: "",
    createdDate: new Date().toISOString().split("-")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setNotificationData({
      ...notificationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/notification`,
        notificationData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      onSave(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Fail to create notification");
      console.error("Error creating notification: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 pt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 text-gray-100 rounded-xl p-6 w-[400px] shadow-2xl border border-gray-700 relative mb-40 "
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

          <h2 className="text-xl font-semibold mb-5 text-white">
            Create Notification
          </h2>

          {error && (
            <div className="mb-4 p-2 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <label className="block text-gray-300 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={notificationData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mb-1">Content</label>
          <textarea
            name="content"
            value={notificationData.content || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <label className="block text-gray-300 mt-4 mb-1">Type</label>
          <input
            type="text"
            name="type"
            value={notificationData.type || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
          
          {error && (
            <motion.div
              className="mt-4 text-red-400 text-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`mt-6 w-full p-2 rounded text-white font-semibold transition-all duration-200 ${
              isSubmitting
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Notification"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateNotificationModal;
