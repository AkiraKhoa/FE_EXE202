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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchNoti(searchTerm, currentPage);
  }, [currentPage]);

  const clearError = () => {
    setTimeout(() => {
      setError(null);
    }, 5000); // 5000ms = 5 seconds
  };

  const dismissError = () => {
    setError(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchNoti(searchTerm, 1); // Fetch when Enter is pressed
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    // Reset to first page but don't fetch immediately
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const fetchNoti = async (search = "", page = 1, size = pageSize) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            searchTerm: search,
            page: page,
            pageSize: size,
          },
        }
      );

      // Update state with new data
      setNotifications(response.data.items || []);
      setTotalCount(response.data.totalCount || 0);
      setTotalPages(Math.ceil((response.data.totalCount || 0) / size));
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notificationId) => {
    setEditNotificationId(notificationId);
  };

  //Update noti API call
  const handleSave = async (updatedNoti) => {
    try {
      // Add console log to see the updatedNoti data
      console.log("Updated Notification Data:", updatedNoti);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/Notifications/${
          updatedNoti.notificationId
        }`,
        updatedNoti,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add console log to see the response data
      console.log("API Response Data:", response.data);

      setNotifications(
        notifications.map((item) =>
          item.notificationId === updatedNoti.notificationId
            ? response.data
            : item
        )
      );
      setEditNotificationId(null);
    } catch (err) {
      console.error("Full error object:", err);
      setError(err.response?.data?.message || "Failed to update notifcations");
      clearError();
    }
  };

  //Delete notification API call
  const handleDelete = async (notificationId) => {
    // console.log("Attempting to delete notification with ID:", notificationId);

    if (!notificationId) {
      console.error("Error: notificationId is undefined!");
      return;
    }

    const notificationToDelete = notifications.find(
      (item) => item.notificationId === notificationId
    );

    if (notificationToDelete && notificationToDelete.status === "Active") {
      setError("Cannot delete an Active notification");
      clearError();
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
        `${import.meta.env.VITE_API_URL}/Notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        notifications.filter((item) => item.notificationId !== notificationId)
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete notification";
      setError(errorMessage);
      clearError();
      console.error("Error deleting notification:", err);
    }
  };

  //Create new notification Handler
  const handleCreate = async (newNoti) => {
    try {
      setNotifications([newNoti, ...notifications]);
      fetchNoti(searchTerm, currentPage);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error adding new notifications to list: ", err);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not Scheduled";
    try {
      const cleanedDate = dateString.split(".")[0].replace("T", "-");
      return cleanedDate;
    } catch (e) {
      console.error("Date formatting error:", e, "for date:", dateString);
      return "Invalid Date";
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
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
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400 cursor-pointer"
            size={18}
            onClick={() => fetchNoti(searchTerm, 1)} // Add click handler
          />
        </div>
      </div>

      {error && (
        <motion.div
          className="mb-4 p-3 bg-red-900 bg-opacity-40 border border-red-800 rounded text-red-200"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
        >
          <span>Error: {error} </span>
          <button
            onClick={dismissError}
            className="text-red-200 hover:text-red-100 focus:outline-none absolute right-10"
          >
            X
          </button>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="mt-4"> {/* Remove height and overflow classes */}
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider w-1/6">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider w-2/6">
                  Content
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider w-[12%]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider w-[18%]">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider w-[18%]">
                  Scheduled At
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider w-[12%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {!notifications || notifications.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-4 text-center text-gray-400"
                  >
                    {loading ? "Loading..." : "No notifications found"}
                  </td>
                </tr>
              ) : (
                notifications
                  .filter(
                    (item) =>
                      !searchTerm ||
                      item?.body?.toLowerCase().includes(searchTerm) ||
                      item?.title?.toLowerCase().includes(searchTerm)
                  )
                  .map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-100">
                          {item.title.length > 20
                            ? item.title.substring(0, 20) + "..."
                            : item.title}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-100">
                          {item.body.length > 40
                            ? item.body.substring(0, 40) + "..."
                            : item.body}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                            item.status === "Active"
                              ? "bg-green-800 text-green-100"
                              : item.status === "Pending"
                              ? "bg-blue-800 text-blue-100"
                              : item.status === "Failed"
                              ? "bg-red-800 text-red-100"
                              : "bg-gray-800 text-gray-100"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {formatDate(item.createdAt)}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {formatDate(item.scheduledTime)}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
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

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
          notifications
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Previous
          </button>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>

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
