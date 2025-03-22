import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import UsersStat from "../components/common/UsersStat";
import UserGrowthChart from "../components/dashboard/UserGrowthChart";
import SubscriptionRatioChart from "../components/dashboard/SubscriptionRatioChart";
import { UserStatsProvider } from "../components/context/UserStatsContext";
import axios from "axios";

const DashboardPage = () => {
  const [stats, setStats] = useState({ growthData: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  return (
    <UserStatsProvider stats={stats} loading={loading} error={error}>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Dashboard" />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {error && <div className="text-red-500 text-center">{error}</div>}
          <UsersStat /> {/* STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SubscriptionRatioChart /> {/* CHARTS */}
            <UserGrowthChart />
          </div>
        </main>
      </div>
    </UserStatsProvider>
  );
};

export default DashboardPage;
