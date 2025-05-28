import { motion } from "framer-motion";
import { useUserStats } from "../context/UserStatsContext";

const SustainabilityMetrics = () => {
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
      <h2 className="text-lg font-medium mb-4 text-gray-100">Sustainability Metrics</h2>
      <div className="text-gray-300">
        <p>
          Carbon Footprint: <span className="text-green-400">{stats.sustainability.carbonFootprint}</span> kg CO₂
        </p>
      </div>
    </motion.div>
  );
};

export default SustainabilityMetrics;