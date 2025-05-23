import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, StarHalf } from "lucide-react";
import axios from "axios";
import EditRecipeModal from "./EditRecipeModal";
import CreateRecipesModal from "./CreateRecipesModal";
import ReactCountryFlag from "react-country-flag";

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`star-${i}`}
        size={16}
        className="text-yellow-400 fill-yellow-400"
      />
    );
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <StarHalf
        key="half-star"
        size={16}
        className="text-yellow-400 fill-yellow-400"
      />
    );
  }

  // Add empty stars
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star
        key={`empty-star-${i}`}
        size={16}
        className="text-gray-600"
      />
    );
  }

  return stars;
};

const getCountryCode = (nation) => {
  const countryMap = {
    Vietnam: "VN",
    Japan: "JP",
    Korea: "KR",
    China: "CN",
    Thailand: "TH",
    Italy: "IT",
    France: "FR",
    Spain: "ES",
    India: "IN",
    Mexico: "MX",
    // Add more mappings as needed
  };
  return countryMap[nation] || "UN"; // UN as fallback
};

const RecipesTable = () => {
  const [Recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editRecipesId, setEditRecipesId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchRecipes(searchTerm, currentPage);
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
      fetchRecipes(searchTerm, 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handlePageChange = (RecipePage) => {
    if (RecipePage < 1 || RecipePage > totalPages) return;
    setCurrentPage(RecipePage);
  };

  const fetchRecipes = async (search = "", page = 1, size = pageSize) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      // For testing without API
      // Comment this out when you have the real API
      // setRecipes([]); // or some mock data
      // setTotalCount(0);
      // setTotalPages(1);
      // setError(null);

      // /* Uncomment when API is ready
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/Recipes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          searchTerm: search,
          page: page,
          pageSize: size,
        },
      });
      setRecipes(response.data.items || []);
      setTotalCount(response.data.totalCount || 0);
      setTotalPages(Math.ceil((response.data.totalCount || 0) / size));
      // */
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      setRecipes([]); // Ensure Recipes is at least an empty array
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (RecipesId) => {
    setEditRecipesId(RecipesId);
  };

  // Update Recipes API call
  const handleSave = async (updatedRecipes) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/Recipes/${updatedRecipes.RecipesId}`,
        updatedRecipes,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the Recipes list with the updated item
      setRecipes(
        Recipes.map((item) =>
          item.RecipesId === updatedRecipes.RecipesId ? response.data : item
        )
      );
      setEditRecipesId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update Recipes");
      clearError();
      console.error("Error updating Recipes:", err);
    }
  };

  // Delete Recipes API call
  const handleDelete = async (RecipesId) => {
    console.error("Attempting to delete Recipes with ID:", RecipesId);

    if (!RecipesId) {
      console.error("Error: RecipesId is undefined!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this Recipes?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/Recipes/${RecipesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Remove the deleted item from the Recipes list
      setRecipes(Recipes.filter((item) => item.RecipesId !== RecipesId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete Recipes");
      clearError();
      console.error("Error deleting Recipes:", err);
    }
  };

  // Create Recipes handler
  const handleCreate = async (RecipeRecipes) => {
    try {
      // Add the Recipe Recipes to the list
      setRecipes([RecipeRecipes, ...Recipes]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error adding Recipe Recipes to list:", err);
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
          <h2 className="text-xl font-semibold text-gray-100">
            Manage Recipes
          </h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="mr-1">+</span>
            Create Recipes
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Recipes..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
            onClick={() => fetchRecipes(searchTerm)}
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
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Recipe Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Meals
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Nation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Difficulty Estimation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time Estimation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {!Recipes || Recipes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    {loading ? "Loading..." : "No Recipes articles found"}
                  </td>
                </tr>
              ) : (
                Recipes.filter(
                  (item) =>
                    item && // Add this check
                    (!searchTerm ||
                      (item.recipeName && item.recipeName.toLowerCase().includes(searchTerm)) ||
                      (item.Meals && item.Meals.toLowerCase().includes(searchTerm)))
                ).map((item) => (
                  <motion.tr
                    key={item.RecipesId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-100">
                        {item.recipeName && item.recipeName.length > 25
                          ? item.recipeName.substring(0, 25) + "..."
                          : item.recipeName || ""}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                        {item.meals}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex items-center gap-2 text-xs leading-5 font-semibold rounded-full bg-gray-800 text-gray-100">
                        <ReactCountryFlag
                          countryCode={getCountryCode(item.nation)}
                          svg
                          style={{
                            width: "1.2em",
                            height: "1.2em",
                          }}
                          title={item.nation}
                        />
                        {item.nation}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {renderStars(parseFloat(item.difficultyEstimation))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                        {item.timeEstimation}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => handleEdit(item.RecipesId)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(item.RecipesId)}
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

      {/* Edit Recipes Modal */}
      {editRecipesId && (
        <EditRecipeModal
          RecipesId={editRecipesId}
          onClose={() => setEditRecipesId(null)}
          onSave={handleSave}
          allRecipes={Recipes}
        />
      )}

      {/* Create Recipes Modal */}
      {showCreateModal && (
        <CreateRecipesModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
        />
      )}
    </motion.div>
  );
};

export default RecipesTable;
