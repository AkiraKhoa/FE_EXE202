import { motion } from "framer-motion";
import { useUserStats } from "../context/UserStatsContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Trophy, Award, UserPlus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const GamificationReport = () => {
  const { stats, loading, error } = useUserStats();

  if (loading) return <div className="text-gray-100">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const { gamificationReport } = stats;

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <UserPlus className="w-8 h-8 text-green-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">New Subscriptions</h3>
            <p className="text-lg font-semibold text-gray-100">{gamificationReport.subscriptionStats.newSubscriptions.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ArrowUpCircle className="w-8 h-8 text-blue-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">Subscription Upgrades</h3>
            <p className="text-lg font-semibold text-gray-100">{gamificationReport.subscriptionStats.upgrades.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ArrowDownCircle className="w-8 h-8 text-red-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">Subscription Downgrades</h3>
            <p className="text-lg font-semibold text-gray-100">{gamificationReport.subscriptionStats.downgrades.toLocaleString()}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Achievements Table */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-4 text-gray-100 flex items-center">
          <Award className="w-6 h-6 mr-2 text-yellow-400" />
          Achievements Earned
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-gray-100">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-2 text-left">Achievement Name</th>
                <th className="p-2 text-left">Users Earned</th>
              </tr>
            </thead>
            <tbody>
              {gamificationReport.achievements.map((achievement, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <td className="p-2">{achievement.name}</td>
                  <td className="p-2">{achievement.count.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Login Streak Trends */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-4 text-gray-100 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-purple-400" />
          Login Streak Trends (Last 7 Days)
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gamificationReport.loginStreaks}>
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
              <Line type="monotone" dataKey="streakCount" stroke="#3B82F6" name="Users with Streaks" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="avgStreakLength" stroke="#10B981" name="Avg Streak Length" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default GamificationReport;