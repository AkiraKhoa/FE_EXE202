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
    type: "Global",
    scheduledTime: null,
    status: "Active",
    createdDate: new Date().toISOString().split("-")[0],
  });

  const [scheduleOption, setScheduleOption] = useState("immediate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setNotificationData({
      ...notificationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScheduleOptionChange = (e) => {
    const option = e.target.value;
    setScheduleOption(option);
    // Reset scheduledTime when switching options
    setNotificationData((prev) => ({
      ...prev,
      scheduledTime: option === "immediate" ? null : prev.scheduledTime,
      status: option === "immediate" ? "Active" : "Pending", // Set status based on option
    }));
  };

  const validateScheduledTime = (scheduledTime) => {
    if (scheduleOption === "immediate") return true;
    if (!scheduledTime){
      setError("Scheduled time is required when scheduling for later.");
      return false
    }; // No scheduledTime is valid (will send immediately)
    const scheduledDate = new Date(scheduledTime + "Z");
    const now = new Date();
    if (scheduledDate < now) {
      setError("Scheduled time cannot be in the past.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (
        scheduleOption === "schedule" &&
        !validateScheduledTime(notificationData.scheduledTime)
      ) {
        setIsSubmitting(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setIsSubmitting(false);
        return;
      }

      // Prepare data, only include scheduledTime if a value is provided
      const payload = {
        staffId: notificationData.staffId,
        title: notificationData.title,
        content: notificationData.content,
        type: "Global",
        createdDate: notificationData.createdDate,
        scheduledTime: notificationData.scheduledTime || null,
        status: notificationData.status,
      };

      console.log(payload);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/notifications`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSave(response.data);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the notification"
      );
      console.error("Error creating notification:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
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
            <div className="mb-4 p-2 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm flex justify-between items-center">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-200 hover:text-red-100"
              >
                ×
              </button>
            </div>
          )}

          <label className="block text-gray-300 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={notificationData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notification title"
          />

          <label className="block text-gray-300 mb-1">Content</label>
          <textarea
            name="content"
            value={notificationData.content || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notification content"
          ></textarea>

          <label className="block text-gray-300 mt-4 mb-1">Type</label>
          <div className="w-full p-2 rounded bg-gray-700 text-gray-400 border border-gray-600">
            Global
          </div>

          <label className="block text-gray-300 mb-1">Scheduled Option</label>
          <select
            name="scheduleOption"
            value={scheduleOption}
            onChange={handleScheduleOptionChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 mb-2"
          >
            <option value="immediate">Send Immediately</option>
            <option value="schedule">Schedule for Later</option>
          </select>

          {scheduleOption === "schedule" && (
            <>
              <label className="block text-gray-300 mb-1">Scheduled Time</label>
              <input
                type="datetime-local"
                name="scheduledTime"
                value={notificationData.scheduledTime || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 mb-4"
                required
              />
            </>
          )}

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
