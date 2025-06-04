import { motion } from "framer-motion";
import { useUserStats } from "../context/UserStatsContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, LogIn, CheckCircle, FileText, UserPlus, ArrowUpCircle } from "lucide-react";

const UserInteractionChart = () => {
  const { stats, loading, error } = useUserStats();

  if (loading) return <div className="text-gray-100">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <LogIn className="w-8 h-8 text-blue-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">Logins</h3>
            <p className="text-lg font-semibold text-gray-100">
              {stats.detailedStats.userInteractionData.reduce((sum, day) => sum + day.login, 0).toLocaleString()}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CheckCircle className="w-8 h-8 text-green-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">Goals Completed</h3>
            <p className="text-lg font-semibold text-gray-100">
              {stats.detailedStats.userInteractionData.reduce((sum, day) => sum + day.goalCompleted, 0).toLocaleString()}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FileText className="w-8 h-8 text-yellow-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">Recipes Accepted</h3>
            <p className="text-lg font-semibold text-gray-100">
              {stats.detailedStats.userInteractionData.reduce((sum, day) => sum + day.acceptRecipe, 0).toLocaleString()}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FileText className="w-8 h-8 text-purple-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">AI Plans Accepted</h3>
            <p className="text-lg font-semibold text-gray-100">
              {stats.detailedStats.userInteractionData.reduce((sum, day) => sum + day.acceptAIPlan, 0).toLocaleString()}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Stacked Bar Chart */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-4 text-gray-100 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-400" />
          User Interactions (Last 7 Days)
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.detailedStats.userInteractionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ color: "#E5E7EB", fontSize: "14px" }} />
              <Bar dataKey="createAccount" stackId="a" fill="#3B82F6" name="Create Account" />
              <Bar dataKey="login" stackId="a" fill="#10B981" name="Login" />
              <Bar dataKey="recipeCreated" stackId="a" fill="#F59E0B" name="Recipe Created" />
              <Bar dataKey="goalCompleted" stackId="a" fill="#EF4444" name="Goal Completed" />
              <Bar dataKey="acceptRecipe" stackId="a" fill="#D1D5DB" name="Accept Recipe" />
              <Bar dataKey="acceptAIPlan" stackId="a" fill="#9CA3AF" name="Accept AI Plan" />
              <Bar dataKey="addSubscription" stackId="a" fill="#6366F1" name="Add Subscription" />
              <Bar dataKey="upgradeSubscription" stackId="a" fill="#FBBF24" name="Upgrade Subscription" />
              <Bar dataKey="logout" stackId="a" fill="#6B7280" name="Logout" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default UserInteractionChart;