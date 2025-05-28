import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useUserStats } from "../context/UserStatsContext";

const SubscriptionRatioChart = () => {
  const { stats, loading, error } = useUserStats();

  if (loading) return <div className="text-gray-100">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const subscriptionData = [
    { name: "Subscription", value: stats.subscriptionUsers },
    { name: "Non-Subscription", value: stats.nonSubscriptionUsers },
  ];

// const totalUsers = 152845;
// const subscriptionUsers = 38520;
// const nonSubscriptionUsers = totalUsers - subscriptionUsers;

// const subscriptionData = [
//   { name: "Subscription", value: subscriptionUsers },
//   { name: "Non-Subscription", value: nonSubscriptionUsers },
// ];


  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Subscription Ratio</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id="gradientSub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" />
                <stop offset="95%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="gradientNonSub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D1D5DB" />
                <stop offset="95%" stopColor="#9CA3AF" />
              </linearGradient>
            </defs>
            <Pie
              data={subscriptionData}
              cx="55%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
              activeShape={{ outerRadius: 100 }}
            >
              <Cell fill="url(#gradientSub)" />
              <Cell fill="url(#gradientNonSub)" />
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ color: "#E5E7EB", fontSize: "14px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SubscriptionRatioChart;