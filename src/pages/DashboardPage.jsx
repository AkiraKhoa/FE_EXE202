import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import { BarChart2, ShoppingBag, User, Users, Zap } from "lucide-react";
import StatCard from "../components/common/StatCard";
import { motion } from "framer-motion";
import SalesOverviewChart from "../components/dashboard/SalesOverviewChart";
import CategoryDistributionChart from "../components/dashboard/CategoryDistributionChart";
import UsersStat from "../components/common/UsersStat";
import UserDemographicsChart from "../components/dashboard/UserDemographicsChart";
import UserGrowthChart from "../components/dashboard/UserGrowthChart";
import SubscriptionRatioChart from "../components/dashboard/SubscriptionRatioChart";
import { UserStatsProvider } from "../components/context/UserStatsContext";

const DashboardPage = () => {
  const [stats, setStats] = useState({ growthData: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5146/api/user-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user stats");
        }
        const result = await response.json();
        setStats(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
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
