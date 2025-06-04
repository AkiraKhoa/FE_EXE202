import { motion } from "framer-motion";
import { useUserStats } from "../context/UserStatsContext";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

const RecipePopularityTable = () => {
  const { stats, loading, error } = useUserStats();
  const [sortConfig, setSortConfig] = useState({ key: "usageCount", direction: "desc" });
  const [filterCategory, setFilterCategory] = useState("");

  if (loading) return <div className="text-gray-100">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const recipes = stats.detailedStats.recipePopularity;

  // Sort function
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return sortConfig.direction === "asc"
      ? a[sortConfig.key] - b[sortConfig.key]
      : b[sortConfig.key] - a[sortConfig.key];
  });

  // Filter function
  const filteredRecipes = filterCategory
    ? sortedRecipes.filter((recipe) => recipe.category === filterCategory)
    : sortedRecipes;

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Recipe Popularity</h2>
      <div className="mb-4">
        <label className="text-gray-400 mr-2">Filter by Category:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-700 text-gray-100 rounded p-1"
        >
          <option value="">All</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-gray-100">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-2 text-left">
                <button onClick={() => handleSort("name")} className="flex items-center">
                  Recipe Name <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="p-2 text-left">
                <button onClick={() => handleSort("usageCount")} className="flex items-center">
                  Usage Count <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="p-2 text-left">
                <button onClick={() => handleSort("rating")} className="flex items-center">
                  Rating <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="p-2 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map((recipe, index) => (
              <motion.tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <td className="p-2">{recipe.name}</td>
                <td className="p-2">{recipe.usageCount}</td>
                <td className="p-2">{recipe.rating.toFixed(1)}</td>
                <td className="p-2">{recipe.category}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecipePopularityTable;