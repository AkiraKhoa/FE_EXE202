import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useUserStats } from "../context/UserStatsContext";

const HealthConditionTrends = () => {
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
      <h2 className="text-lg font-medium mb-4 text-gray-100">Health Condition Trends by Age Group</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={stats.detailedStats.healthConditionTrends}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="ageGroup" stroke="#9CA3AF" />
            <PolarRadiusAxis angle={30} domain={[0, 50]} stroke="#9CA3AF" />
            <Radar
              name="Diabetes"
              dataKey="diabetes"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.6}
            />
            <Radar
              name="Hypertension"
              dataKey="hypertension"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.6}
            />
            <Radar
              name="Allergies"
              dataKey="allergies"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default HealthConditionTrends;