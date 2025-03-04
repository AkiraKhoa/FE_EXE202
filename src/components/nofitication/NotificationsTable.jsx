import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import EditNotificationModal from "./EditNotificationModal";
import CreateNotificationModal from "./CreateNotificationModal";
import axios from "axios";

const NotificationsTable = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editNotificationId, setEditNotificationId] = useState(null);

  useEffect(() => {
    fetchNoti();
  }, []);

  const clearError = () => {
    setTimeout(() => {
      setError(null);
    }, 5000); // 5000ms = 5 seconds
  };

  const dismissError = () => {
    setError(null);
  };

  const fetchNoti = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notification`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const activeNoti = response.data.items.filter(
        (item) => item.status !== "Deleted"
      );
      setNotifications(activeNoti);
      setError(null);
    } catch (err) {
      setError(err, response?.data?.message || "Fail to fetch notifications");
      console.error("Error fetching news: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch1 = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleEdit = (notificationId) => {
    setEditNotificationId(notificationId);
  };

  //Update noti API call
  const handleSave = async (updatedNoti) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/notification/
        ${updatedNoti.notificationId}`,
        updatedNoti,
        {
          header: { Authorization: `${token}` },
        }
      );

      setNotifications(
        notifications.map((item) =>
          item.notificationId === updatedNoti.notificationId
            ? response.data
            : item
        )
      );
      setEditNotificationId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update notifcations");
      clearError();
      console.error("Error updating notification: ", err);
    }
  };

  //Delete notification API call
  const handleDelete = async (notificationId) => {
    console.log("Attempting to delete notification with ID:", notificationId);

    if (!notificationId) {
      console.error("Error: notificationId is undefined!");
      return;
    }

    if (
      !window.confirm("Are you sure you want to delete this notifications?")
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authenttication token found");
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notification/${notificationId}`,
        {
          header: {
            Authorization: `${token}`,
          },
        }
      );

      setNotifications(
        notifications.filter((item) => item.notificationId !== notificationId)
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete news";
      setError(errorMessage);
      clearError();
      console.error("Error deleting news:", err);
    }
  };

  //Create new notification Handler
  const handleCreate = async (newNoti) => {
    try {
      setNotifications([newNoti, ...notifications]);
      setShowCreateModal(false);
    } catch (err) {
      console.log("Error adding new notifications to list: ", err);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-100">Notifications</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="mr-1">+</span>
            Create Notifications
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search notifications..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch1}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {error && (
        <motion.div
          className="mb-4 p-3 bg-red-900 bg-opacity-40 border border-red-800 rounded text-red-200"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>Error: {error}</span>
          <button
            onClick={dismissError}
            className="text-red-200 hover:text-red-100 focus:outline-none"
          >
            ×
          </button>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {notifications.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No notifications found
                  </td>
                </tr>
              ) : (
                notifications
                  .filter(
                    (item) =>
                      item.content.toLowerCase().includes(searchTerm) ||
                      item.type.toLowerCase().includes(searchTerm)
                  )
                  .map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-100">
                          {item.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-100">
                          {item.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {item.createdDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          className="text-indigo-400 hover:text-indigo-300 mr-2"
                          onClick={() => handleEdit(item.notificationId)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(item.notificationId)}
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Notification Modal */}
      {editNotificationId && (
        <EditNotificationModal
          notificationId={editNotificationId}
          onClose={() => setEditNotificationId(null)}
          onSave={handleSave}
          allNotis={notifications}
        />
      )}

      {/* Create Notification Modal */}
      {showCreateModal && (
        <CreateNotificationModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
        />
      )}
    </motion.div>
  );
};

export default NotificationsTable;
