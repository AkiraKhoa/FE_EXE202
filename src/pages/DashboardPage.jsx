import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import UsersStat from "../components/common/UsersStat";
import SubscriptionRatioChart from "../components/dashboard/SubscriptionRatioChart";
import PeakAccessTimeChart from "../components/dashboard/PeakAccessTimeChart";
import { UserStatsProvider } from "../components/context/UserStatsContext";
// import axios from "axios"; // Commented out for mock data, re-enable when backend is available

const DashboardPage = () => {
  const [stats, setStats] = useState({ growthData: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock data for temporary use until backend is available
    const mockStats = {
      totalUsers: 1200,
      subscriptionUsers: 800,
      nonSubscriptionUsers: 400,
      averageSessionTime: 15.5, // minutes
      churnRate: 12.5, // percentage
      peakAccessTimes: [
        { hour: "08:00", accessCount: 150 },
        { hour: "09:00", accessCount: 200 },
        { hour: "10:00", accessCount: 300 },
        { hour: "11:00", accessCount: 250 },
        { hour: "12:00", accessCount: 180 },
        { hour: "13:00", accessCount: 160 },
        { hour: "14:00", accessCount: 170 },
        { hour: "15:00", accessCount: 200 },
        { hour: "16:00", accessCount: 220 },
        { hour: "17:00", accessCount: 190 },
      ],
    };

    setStats(mockStats);
    setLoading(false);

    // Backend API call (commented out, re-enable when backend is available)
    /*
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch user stats");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
    */
  }, []);

  return (
    <UserStatsProvider stats={stats} loading={loading} error={error}>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Dashboard" />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <UsersStat />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SubscriptionRatioChart />
            <PeakAccessTimeChart />
          </div>
        </main>
      </div>
    </UserStatsProvider>
  );
};

export default DashboardPage;