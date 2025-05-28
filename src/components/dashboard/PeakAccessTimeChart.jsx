import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useUserStats } from "../context/UserStatsContext";

const PeakAccessTimeChart = () => {
  const { stats, loading, error } = useUserStats();

  if (loading) return <div className="text-gray-100">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const averageAccess = stats.peakAccessTimes.reduce((sum, item) => sum + item.accessCount, 0) / stats.peakAccessTimes.length;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Peak Access Times</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.peakAccessTimes}>
            <defs>
              <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" />
                <stop offset="95%" stopColor="#1D4ED8" />
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
            <ReferenceLine y={averageAccess} stroke="#EF4444" label="Avg" strokeDasharray="3 3" />
            <Bar dataKey="accessCount" fill="url(#gradientBar)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PeakAccessTimeChart;