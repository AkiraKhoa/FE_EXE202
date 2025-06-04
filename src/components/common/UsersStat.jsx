import React from "react";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import StatCard from "./StatCard";
import { useUserStats } from "../context/UserStatsContext";

// CSS cho gradient động
const gradientAnimation = `
  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .gradient-animated {
    background-size: 200% 200%;
    animation: gradientMove 4s ease infinite;
  }
`;

const UsersStat = () => {
  const { stats, loading, error } = useUserStats();

  // Component con để render số với hiệu ứng count-up
  const AnimatedNumber = ({ value, unit = "", gradientStyle }) => {
    const motionValue = useMotionValue(0);
    const [displayValue, setDisplayValue] = React.useState("0");

    // Animate giá trị từ 0 đến value khi value thay đổi
    React.useEffect(() => {
      const animation = animate(motionValue, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest).toLocaleString());
        },
      });
      return () => animation.stop();
    }, [value, motionValue]);

    return (
      <motion.span
        className="bg-clip-text text-transparent gradient-animated"
        style={gradientStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {displayValue}
        {unit}
      </motion.span>
    );
  };

  return (
    <>
      <style>{gradientAnimation}</style>
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <StatCard
          name="Total Users"
          icon={UsersIcon}
          value={
            loading ? (
              "Loading..."
            ) : error ? (
              "Error"
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={stats.totalUsers}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedNumber
                    value={stats.totalUsers}
                    gradientStyle={{ backgroundImage: "linear-gradient(to right, #6366F1, #A855F7)" }}
                  />
                </motion.div>
              </AnimatePresence>
            )
          }
          color="#6366F1"
        />
        <StatCard
          name="Subscription Users"
          icon={UserCheck}
          value={
            loading ? (
              "Loading..."
            ) : error ? (
              "Error"
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={stats.subscriptionUsers}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedNumber
                    value={stats.subscriptionUsers}
                    gradientStyle={{ backgroundImage: "linear-gradient(to right, #F59E0B, #F97316)" }}
                  />
                </motion.div>
              </AnimatePresence>
            )
          }
          color="#F59E0B"
        />
        <StatCard
          name="Average Session Time"
          icon={UserPlus}
          value={
            loading ? (
              "Loading..."
            ) : error ? (
              "Error"
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={stats.averageSessionTime}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedNumber
                    value={stats.averageSessionTime}
                    unit=" mins"
                    gradientStyle={{ backgroundImage: "linear-gradient(to right, #10B981, #14B8A6)" }}
                  />
                </motion.div>
              </AnimatePresence>
            )
          }
          color="#10B981"
        />
        <StatCard
          name="Churn Rate"
          icon={UserX}
          value={
            loading ? (
              "Loading..."
            ) : error ? (
              "Error"
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={stats.churnRate}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedNumber
                    value={stats.churnRate}
                    unit="%"
                    gradientStyle={{ backgroundImage: "linear-gradient(to right, #EF4444, #F472B6)" }}
                  />
                </motion.div>
              </AnimatePresence>
            )
          }
          color="#EF4444"
        />
      </motion.div>
    </>
  );
};

export default UsersStat;