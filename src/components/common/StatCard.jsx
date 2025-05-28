import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center space-x-4"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Icon className="w-8 h-8" style={{ color }} />
      <div>
        <h3 className="text-sm font-medium text-gray-400">{name}</h3>
        <p className="text-lg font-semibold text-gray-100">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;