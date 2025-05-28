import { motion } from "framer-motion";
import { useUserStats } from "../context/UserStatsContext";
import { Brain, Clock, CheckCircle } from "lucide-react";

const AIDrivenInsights = () => {
  const { stats, loading, error } = useUserStats();

  if (loading) return <div className="text-gray-100">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100 flex items-center">
        <Brain className="w-6 h-6 mr-2 text-blue-400" />
        AI-Driven Insights
      </h2>
      <div className="space-y-4">
        {stats.aiInsights.map((insight, index) => (
          <motion.div
            key={index}
            className="p-4 rounded-lg bg-gray-700 bg-opacity-30 border border-gray-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
          >
            <p className="text-gray-200 font-semibold">{insight.message}</p>
            <div className="mt-2 text-sm text-gray-400 space-y-1">
              <p className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Xác suất thành công: <span className="text-green-400 ml-1">{insight.prediction}%</span>
              </p>
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                Thời gian dự kiến: <span className="text-blue-400 ml-1">{insight.timeframe}</span>
              </p>
              <p className="text-gray-300">Gợi ý: {insight.recommendation}</p>
              <p className="text-gray-500 text-xs">Độ tin cậy: {Math.round(insight.confidence * 100)}%</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AIDrivenInsights;