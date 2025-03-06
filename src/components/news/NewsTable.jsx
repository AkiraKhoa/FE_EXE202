import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import EditNewModal from "./EditNewModal";
import CreateNewsModal from "./CreateNewsModal";

const NewsTable = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editNewsId, setEditNewsId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchNews(searchTerm, currentPage);
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
      setCurrentPage(1);
      fetchNews(searchTerm, 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };
  const fetchNews = async (search = "", page = 1, size = pageSize) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`, {
        headers: {
          Authorization: `${token}`,
        },
        params: {
          searchTerm: search,
          page: page,
          pageSize: size,
        },
      });
      const activeNews = response.data.items.filter(
        (item) => item.status !== "Deleted"
      );
      setNews(activeNews);
      setTotalCount(response.data.totalCount);
      setTotalPages(Math.ceil(response.data.totalCount / size));
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch news");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newsId) => {
    setEditNewsId(newsId);
  };

  // Update news API call
  const handleSave = async (updatedNews) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/news/${updatedNews.newsId}`,
        updatedNews,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the news list with the updated item
      setNews(
        news.map((item) =>
          item.newsId === updatedNews.newsId ? response.data : item
        )
      );
      setEditNewsId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update news");
      clearError();
      console.error("Error updating news:", err);
    }
  };

  // Delete news API call
  const handleDelete = async (newsId) => {
    console.log("Attempting to delete news with ID:", newsId);

    if (!newsId) {
      console.error("Error: newsId is undefined!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this news?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/news/${newsId}`, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      // Remove the deleted item from the news list
      setNews(news.filter((item) => item.newsId !== newsId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete news");
      clearError();
      console.error("Error deleting news:", err);
    }
  };

  // Create news handler
  const handleCreate = async (newNews) => {
    try {
      // Add the new news to the list
      setNews([newNews, ...news]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error adding new news to list:", err);
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
          <h2 className="text-xl font-semibold text-gray-100">Manage News</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="mr-1">+</span>
            Create News
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search news..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
            onClick={() => fetchNews(searchTerm)}
          />
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
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {news.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No news articles found
                  </td>
                </tr>
              ) : (
                news
                  .filter(
                    (item) =>
                      !searchTerm ||
                      item.title?.toLowerCase().includes(searchTerm) ||
                      item.content?.toLowerCase().includes(searchTerm) ||
                      item.type?.toLowerCase().includes(searchTerm)
                  )
                  .map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-100">
                        {item.title.length > 18
                            ? item.title.substring(0, 18) + "..."
                            : item.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300 truncate w-64">
                          {item.content.length > 25
                            ? item.content.substring(0, 25) + "..."
                            : item.content}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {item.lastEdited ? item.lastEdited : item.createdDate}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {item.url.length > 20
                            ? item.url.substring(0, 20) + "..."
                            : item.url}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          className="text-indigo-400 hover:text-indigo-300 mr-2"
                          onClick={() => handleEdit(item.newsId)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(item.newsId)}
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
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} users
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

      {/* Edit News Modal */}
      {editNewsId && (
        <EditNewModal
          newsId={editNewsId}
          onClose={() => setEditNewsId(null)}
          onSave={handleSave}
          allNews={news}
        />
      )}

      {/* Create News Modal */}
      {showCreateModal && (
        <CreateNewsModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
        />
      )}
    </motion.div>
  );
};

export default NewsTable;
