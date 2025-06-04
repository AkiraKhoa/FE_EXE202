import { motion } from "framer-motion";
import { useUserStats } from "../context/UserStatsContext";

const UserInteractionTimeline = () => {
  const { stats, loading, error } = useUserStats();

  if (loading) return <div className="text-gray-100">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">User Interaction Timeline (Last 7 Days)</h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-4">
          {stats.detailedStats.userInteractionTimeline.map((day, index) => (
            <motion.div
              key={index}
              className="min-w-[200px] bg-gray-700 bg-opacity-30 rounded-lg p-4 border border-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-gray-100 font-semibold">{day.date}</h3>
              <div className="mt-2 space-y-2">
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="text-gray-400 text-sm">
                    <span className="text-green-400">{event.time}</span> - {event.type}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UserInteractionTimeline;