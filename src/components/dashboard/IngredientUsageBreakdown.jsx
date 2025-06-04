import { motion } from "framer-motion";
import { PieChart, Pie, Cell } from "recharts";
import { useUserStats } from "../context/UserStatsContext";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const IngredientUsageBreakdown = () => {
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
      <h2 className="text-lg font-medium mb-4 text-gray-100">Ingredient Usage Breakdown</h2>
      <div className="h-80">
        <PieChart width={400} height={300} data={stats.detailedStats.ingredientUsageBreakdown}>
          <Pie
            dataKey="value"
            data={stats.detailedStats.ingredientUsageBreakdown}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {stats.detailedStats.ingredientUsageBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </motion.div>
  );
};

export default IngredientUsageBreakdown;