import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const EditNotificationModal = ({ notificationId, onClose, onSave }) => {
  const mockNotifications = {
    1: { id: 1, content: "New feature update available!", type: "System", navigation: "/updates", sentAt: "2024-03-01" },
    2: { id: 2, content: "50% off on premium plans!", type: "Promotion", navigation: "/offers", sentAt: "2024-02-25" },
    3: { id: 3, content: "Scheduled maintenance on March 5", type: "System", navigation: "/status", sentAt: "2024-02-28" },
  };

  if (!notificationId || !mockNotifications[notificationId]) return null;

  const [notificationData, setNotificationData] = useState(mockNotifications[notificationId]);

  const handleChange = (e) => {
    setNotificationData({ ...notificationData, [e.target.name]: e.target.value });
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
          className="bg-gray-800 text-gray-100 rounded-xl p-6 w-[400px] shadow-2xl border border-gray-700 relative"
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 30, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
            <X size={22} />
          </button>

          <h2 className="text-xl font-semibold mb-5 text-white">Edit Notification</h2>

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

          <label className="block text-gray-300 mt-4 mb-1">Navigation</label>
          <input
            type="text"
            name="navigation"
            value={notificationData.navigation || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-300 mt-4 mb-1">Sent At</label>
          <input
            type="date"
            name="sentAt"
            value={notificationData.sentAt || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => onSave(notificationData)}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-500 p-2 rounded text-white font-semibold transition-all duration-200"
          >
            Save Changes
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditNotificationModal;
