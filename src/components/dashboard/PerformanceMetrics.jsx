import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { useUserStats } from "../context/UserStatsContext";
import { Server, Clock, AlertTriangle, Activity } from "lucide-react";

const PerformanceMetrics = () => {
  const { stats, loading, error } = useUserStats();

  if (loading) return <div className="text-gray-100">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const { performance } = stats;

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
          <Clock className="w-8 h-8 text-blue-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">Avg Load Time</h3>
            <p className="text-lg font-semibold text-gray-100">{performance.avgLoadTime} giây</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">Error Rate</h3>
            <p className="text-lg font-semibold text-gray-100">{performance.errorRate}%</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Activity className="w-8 h-8 text-green-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">API Calls/min</h3>
            <p className="text-lg font-semibold text-gray-100">{performance.apiCallsPerMin.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Server className="w-8 h-8 text-purple-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">Server Uptime</h3>
            <p className="text-lg font-semibold text-gray-100">{performance.serverUptime}%</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Peak API Calls */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-4 text-gray-100">Peak API Calls</h2>
        <p className="text-gray-300">
          Thời điểm cao nhất: <span className="text-green-400">{performance.peakAPICalls.hour}</span> với{" "}
          <span className="text-green-400">{performance.peakAPICalls.count.toLocaleString()}</span> lượt gọi.
        </p>
      </motion.div>

      {/* Load Time Trends - Area Chart */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-4 text-gray-100">Load Time Trends (24 Hours)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performance.loadTimeTrends}>
              <defs>
                <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <ReferenceLine
                y={performance.loadTimeTrends.reduce((sum, item) => sum + item.loadTime, 0) / performance.loadTimeTrends.length}
                stroke="#EF4444"
                label="Avg"
                strokeDasharray="3 3"
              />
              <Area type="monotone" dataKey="loadTime" stroke="#3B82F6" fill="url(#gradientArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Error Rate Trends - Line Chart */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-4 text-gray-100">Error Rate Trends (24 Hours)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performance.errorRateTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Line type="monotone" dataKey="errorRate" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Response Time Distribution - Histogram */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-4 text-gray-100">Response Time Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performance.responseTimeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Bar dataKey="count">
                {performance.responseTimeDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgba(59, 130, 246, ${1 - index * 0.15})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceMetrics;