import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import EditUserModal from "./EditUserModal";
import CreateUserModal from "./CreateUserModal";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchUsers = async (search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            searchTerm: search, // Thêm searchTerm vào params
            pageSize: 1000, // Get all users
          },
        }
      );

      console.log("Users data from API:", response.data.items);
      setUsers(response.data.items);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchUsers(searchTerm); // Gọi API với searchTerm hiện tại
    }
  };

  // Xử lý thay đổi search term
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleEdit = (id) => {
    setEditUserId(id);
  };

  const handleSave = async (updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/users/${updatedUser.id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers(
        users.map((user) => 
          user.id === updatedUser.id ? response.data : user
        )
      );
      setEditUserId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    console.log("Deleting user with ID:", id); 

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const handleCreate = (newUser) => {
    setUsers([newUser, ...users]);
    setShowCreateModal(false);
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
          <h2 className="text-xl font-semibold text-gray-100">Manage Users</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="mr-1">+</span>
            Create User
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange} // Cập nhật searchTerm
            onKeyDown={handleKeyDown} // Bắt sự kiện nhấn Enter
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400 cursor-pointer"
            size={18}
            onClick={() => fetchUsers(searchTerm)} // Thêm sự kiện click cho biểu tượng search
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-40 border border-red-800 rounded text-red-200">
          Error: {error}
        </div>
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
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users
                  .filter(
                    (user) =>
                      !searchTerm ||
                      user.userName?.toLowerCase().includes(searchTerm) ||
                      user.email?.toLowerCase().includes(searchTerm) ||
                      user.status?.toLowerCase().includes(searchTerm)
                  )
                  .map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-100">
                          {user.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {user.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          className="text-indigo-400 hover:text-indigo-300 mr-2"
                          onClick={() => handleEdit(user.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(user.id)}
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

      {editUserId && (
        <EditUserModal
          id={editUserId}
          onClose={() => setEditUserId(null)}
          onSave={handleSave}
          allUsers={users}
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
        />
      )}
    </motion.div>
  );
};

export default UsersTable;