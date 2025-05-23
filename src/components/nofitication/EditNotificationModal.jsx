import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";

const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toISOString().slice(0, 16);
};

const EditNotificationModal = ({
  notificationId,
  onClose,
  onSave,
  allNotis,
}) => {
  const [notificationData, setNotificationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleOption, setScheduleOption] = useState("immediate");
  const [initialStatus, setInitialStatus] = useState(null); // Track initial status

  useEffect(() => {
    const currentNoti = allNotis.find((noti) => noti.id === notificationId);

    if (currentNoti) {
      setNotificationData({ ...currentNoti, type: "Global" });
      setScheduleOption(currentNoti.scheduledTime ? "schedule" : "immediate");
      setInitialStatus(currentNoti.status); 
      setIsLoading(false);
    } else {
      fetchNotiById();
    }
  }, [notificationId]);

  const fetchNotiById = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedData = { ...response.data, type: "Global" };
      setNotificationData(fetchedData);
      setScheduleOption(fetchedData.scheduledTime ? "schedule" : "immediate");
      setInitialStatus(fetchedData.status); // Store initial status

      if (fetchedData.status === "Active") {
        setError("Cannot edit a notification that has been sent!");
        setIsLoading(false);
        return; // Prevent further processing
      }

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notification details");
      console.error("Error fetching notification:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotificationData(prev => ({
      ...prev,
      [name]: name === 'scheduledTime' ? new Date(value).toISOString() : value,
    }));
  };

  const handleScheduleOptionChange = (e) => {
    const option = e.target.value;
    setScheduleOption(option);
    setNotificationData((prev) => ({
      ...prev,
      scheduledTime: option === "immediate" ? null : prev.scheduledTime,
      status: option === "immediate" ? "Active" : "Pending",
    }));
  };

  const validateScheduledTime = (scheduledTime) => {
    if (scheduleOption === "immediate") return true;
    if (!scheduledTime) {
      setError("Scheduled time is required when scheduling for later.");
      return false;
    }
    
    const scheduledDate = new Date(scheduledTime);
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

      // Format scheduled time properly
      const formattedScheduledTime = 
        scheduleOption === "immediate" 
          ? null 
          : new Date(notificationData.scheduledTime).toISOString();

      const updatedData = {
        ...notificationData,
        type: "Global",
        scheduledTime: formattedScheduledTime,
        status: scheduleOption === "immediate" ? "Active" : "Pending",
      };
      
      onSave(updatedData);
      onClose();
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 pt-10"
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

  if (error || !notificationData) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-gray-800 rounded-xl p-8">
            <div className="text-red-400 mb-4">
              {error || "Notification not found"}
            </div>
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

  const isInitiallyActive = initialStatus === "Active";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 pt-5"
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
            Edit Notification
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
            value={notificationData.title || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notification title"
            disabled={isInitiallyActive} 
          />

          <label className="block text-gray-300 mb-1">Content</label>
          <textarea
            name="body"
            value={notificationData.body || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notification content"
            disabled={isInitiallyActive} 
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
            disabled={isInitiallyActive}
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
                value={formatDateForInput(notificationData.scheduledTime)}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 mb-4"
                disabled={isInitiallyActive} 
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
            disabled={isSubmitting || isInitiallyActive} 
            className={`mt-6 w-full p-2 rounded text-white font-semibold transition-all duration-200 ${
              isSubmitting || isInitiallyActive
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
export default EditNotificationModal;