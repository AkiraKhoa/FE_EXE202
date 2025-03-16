import React from 'react';
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import { useUserStats } from '../context/UserStatsContext';


const UsersStat = () => {
  const { stats, loading, error } = useUserStats();

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <StatCard
        name="Total Users"
        icon={UsersIcon}
        value={loading ? "Loading..." : error ? "Error" : stats.totalUsers.toLocaleString()}
        color="#6366F1"
      />
      <StatCard
        name="New Users"
        icon={UserPlus}
        value={loading ? "Loading..." : error ? "Error" : stats.newUsers}
        color="#10B981"
      />
      <StatCard
        name="Subscription Users"
        icon={UserCheck}
        value={loading ? "Loading..." : error ? "Error" : stats.subscriptionUsers.toLocaleString()}
        color="#F59E0B"
      />
      <StatCard
        name="Subscription Rate"
        icon={UserX}
        value={loading ? "Loading..." : error ? "Error" : stats.churnRate}
        color="#EF4444"
      />
    </motion.div>
  );
};

export default UsersStat;