import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#10B981", "#D1D5DB"]; // Màu xanh cho subscription, màu xám cho non-subscription

const totalUsers = 152845;
const subscriptionUsers = 38520;
const nonSubscriptionUsers = totalUsers - subscriptionUsers;

const subscriptionData = [
  { name: "Subscription", value: subscriptionUsers },
  { name: "Non-Subscription", value: nonSubscriptionUsers },
];

const SubscriptionRatioChart = () => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Subscription Ratio</h2>
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={subscriptionData}
              cx={"55%"}
              cy={"50%"}
              innerRadius={50} // Tạo khoảng trống để thành Donut Chart
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {subscriptionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
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
