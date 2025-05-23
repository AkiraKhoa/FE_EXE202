import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
// import EditUserModal from "./EditUserModal";
import ViewUserProfile from "./ViewUserProfile";
import CreateUserModal from "./CreateUserModal";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const [editUserId, setEditUserId] = useState(null);
  const [viewUserId, setViewUserId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async (search = "", page = 1, size = pageSize) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API}/UserProfile`,
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

      // Update this section to handle the response correctly
      const userData = response.data;
      
      // Check if the response has items property
      if (userData && userData.items) {
        const mappedUsers = userData.items.map((user) => ({
          Id: user.upId,
          Fullname: user.fullName || "N/A",
          Email: user.email,
          Role: user.role,
          Gender: user.gender || "N/A",
          Age: user.age || "N/A",
          SubscriptionStatus: user.subscriptionId ? "Active" : "Inactive",
        }));

        setUsers(mappedUsers);
        setTotalCount(userData.totalCount || mappedUsers.length);
        setTotalPages(Math.ceil((userData.totalCount || mappedUsers.length) / size));
        setCurrentPage(page);
        setError(null);
      } else if (Array.isArray(userData)) {
        // Fallback for array response
        const mappedUsers = userData.map((user) => ({
          Id: user.upId,
          Fullname: user.fullName || "N/A",
          Email: user.email,
          Role: user.role,
          Gender: user.gender || "N/A",
          Age: user.age || "N/A",
          SubscriptionStatus: user.subscriptionId ? "Active" : "Inactive",
        }));

        setUsers(mappedUsers);
        setTotalCount(mappedUsers.length);
        setTotalPages(Math.ceil(mappedUsers.length / size));
        setCurrentPage(page);
        setError(null);
      } else {
        setUsers([]);
        setTotalCount(0);
        setTotalPages(0);
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchTerm, currentPage);
  }, [currentPage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      fetchUsers(searchTerm, 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // const handleEdit = (id) => {
  //   setEditUserId(id);
  // };

  const handleView = (id) => {
    setViewUserId(id);
  };

  const handleSave = async (updatedUser) => {
    try {
      // Mock update logic
      setUsers(
        users.map((user) =>
          user.Id === updatedUser.Id ? { ...user, ...updatedUser } : user
        )
      );
      setEditUserId(null);

      // Backend API call (commented out, re-enable when backend is available)
      /*
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${updatedUser.Id}`,
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
          user.Id === updatedUser.Id ? response.data : user
        )
      );
      setEditUserId(null);
      */
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      // Mock delete logic
      // setUsers(users.filter((user) => user.Id !== id));

      // Backend API call (commented out, re-enable when backend is available)
      // /*
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(users.filter((user) => user.Id !== id));
      // */
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const handleCreate = (newUser) => {
    setUsers([newUser, ...users]);
    fetchUsers(searchTerm, currentPage);
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
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400 cursor-pointer"
            size={18}
            onClick={() => fetchUsers(searchTerm)}
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
                  Role
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
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <motion.tr
                    key={user.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-100">
                        {user.Fullname}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{user.Email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.Role === "Admin"
                            ? "bg-purple-800 text-purple-100"
                            : user.Role === "Staff"
                            ? "bg-blue-800 text-blue-100"
                            : user.Role === "Member"
                            ? "bg-yellow-500 text-yellow-100"
                            : user.Role === "User"
                            ? "bg-green-800 text-green-100"
                            : "bg-gray-800 text-gray-100"
                        }`}
                      >
                        {user.Role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.SubscriptionStatus === "Upgrade"
                            ? "bg-green-800 text-green-100"
                            : user.SubscriptionStatus === "Free"
                            ? "bg-blue-800 text-blue-100"
                            : user.SubscriptionStatus === "None"
                            ? "bg-black-800 text-black-100"
                            : "bg-red-800 text-red-100"
                        }`}
                      >
                        {user.SubscriptionStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => handleView(user.Id)}
                      >
                        View
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(user.Id)}
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

      {viewUserId && (
        <ViewUserProfile
          id={viewUserId}
          onClose={() => setViewUserId(null)}
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

{
  /* {editUserId && (
        <EditUserModal
          id={editUserId}
          onClose={() => setEditUserId(null)}
          onSave={handleSave}
          allUsers={users}
        />
      )} */
}
