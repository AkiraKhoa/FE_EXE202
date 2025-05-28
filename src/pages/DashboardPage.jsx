import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { motion } from "framer-motion";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Particles } from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react"; // Only need initParticlesEngine
import { faker } from "@faker-js/faker";
import Header from "../components/common/Header";
import UsersStat from "../components/common/UsersStat";
import SubscriptionRatioChart from "../components/dashboard/SubscriptionRatioChart";
import PeakAccessTimeChart from "../components/dashboard/PeakAccessTimeChart";
import RevenueTrendChart from "../components/dashboard/RevenueTrendChart";
import UserDemographicsChart from "../components/dashboard/UserDemographicsChart";
import EngagementScatter from "../components/dashboard/EngagementScatter";
import { UserStatsProvider } from "../components/context/UserStatsContext";
import './styles.css';

// Particle effect initialization
const particlesInit = async (engine) => {
  await initParticlesEngine(engine);
  // No need for loadFull; @tsparticles/all already includes all features
};

// Component SortableChart cho drag-and-drop
const SortableChart = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState({ growthData: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [chartOrder, setChartOrder] = useState([
    "subscription",
    "peakAccess",
    "revenue",
    "demographics",
    "engagement",
  ]);

  // Generate mock data
  const generateMockData = () => ({
    totalUsers: faker.number.int({ min: 1000, max: 5000 }),
    subscriptionUsers: faker.number.int({ min: 500, max: 3000 }),
    nonSubscriptionUsers: faker.number.int({ min: 300, max: 2000 }),
    averageSessionTime: faker.number.float({ min: 10, max: 20, precision: 0.1 }),
    churnRate: faker.number.float({ min: 5, max: 15, precision: 0.1 }),
    peakAccessTimes: Array.from({ length: 10 }, () => ({
      hour: faker.date.recent().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      accessCount: faker.number.int({ min: 100, max: 500 }),
    })),
    revenueTrends: Array.from({ length: 7 }, (_, index) => ({
      day: `Day ${index + 1}`,
      revenue: faker.number.int({ min: 1000, max: 10000 }),
    })),
    userDemographics: [
      { age: "<20", count: faker.number.int({ min: 50, max: 200 }) },
      { age: "20-30", count: faker.number.int({ min: 300, max: 1000 }) },
      { age: "30-40", count: faker.number.int({ min: 200, max: 800 }) },
      { age: ">40", count: faker.number.int({ min: 100, max: 500 }) },
    ],
    engagementData: Array.from({ length: 10 }, () => ({
      hour: faker.date.recent().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      clicks: faker.number.int({ min: 50, max: 300 }),
    })),
  });

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

  useEffect(() => {
    // Initial mock data
    setStats(generateMockData());
    setLoading(false);

    // Simulate real-time data updates every 10 seconds
    const interval = setInterval(() => {
      setStats(generateMockData());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Handle drag-and-drop for chart reordering
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const chartComponents = {
    subscription: <SubscriptionRatioChart />,
    peakAccess: <PeakAccessTimeChart />,
    revenue: <RevenueTrendChart />,
    demographics: <UserDemographicsChart />,
    engagement: <EngagementScatter />,
  };

  return (
    <UserStatsProvider stats={stats} loading={loading} error={error}>
      <div className={`flex-1 overflow-auto relative z-10 ${theme}`}>
        {/* Particle Background */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: { color: theme === "dark" ? "#1F2937" : "#F3F4F6" },
            particles: {
              number: { value: 80, density: { enable: true, value_area: 800 } },
              color: { value: theme === "dark" ? "#10B981" : "#3B82F6" },
              shape: { type: "circle" },
              opacity: { value: 0.5 },
              size: { value: 3 },
              move: { enable: true, speed: 2 },
            },
          }}
          style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0 }}
        />

        {/* Header with Theme Toggle */}
        <Header title="Dashboard">
          <button
            onClick={toggleTheme}
            className="ml-4 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </Header>

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 relative z-10">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          {/* Tabs */}
          <Tabs>
            <TabList className="flex border-b border-gray-700 mb-6">
              <Tab className="px-4 py-2 text-gray-100 cursor-pointer hover:bg-gray-700" selectedClassName="bg-gray-700 border-b-2 border-blue-500">
                Summary
              </Tab>
              <Tab className="px-4 py-2 text-gray-100 cursor-pointer hover:bg-gray-700" selectedClassName="bg-gray-700 border-b-2 border-blue-500">
                Detailed Stats
              </Tab>
              <Tab className="px-4 py-2 text-gray-100 cursor-pointer hover:bg-gray-700" selectedClassName="bg-gray-700 border-b-2 border-blue-500">
                Custom Insights
              </Tab>
            </TabList>

            {/* Tab 1: Summary */}
            <TabPanel>
              <UsersStat />
              <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={chartOrder}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {chartOrder.map((chartId) => (
                      <SortableChart key={chartId} id={chartId}>
                        {chartComponents[chartId]}
                      </SortableChart>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </TabPanel>

            {/* Tab 2: Detailed Stats */}
            <TabPanel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RevenueTrendChart />
                <UserDemographicsChart />
                <EngagementScatter />
              </div>
            </TabPanel>

            {/* Tab 3: Custom Insights */}
            <TabPanel>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-medium mb-4 text-gray-100">Custom Insights</h2>
                <p className="text-gray-300">
                  (Tính năng này sẽ cho phép người dùng chọn dữ liệu và biểu đồ tùy chỉnh - hiện đang phát triển.)
                </p>
              </div>
            </TabPanel>
          </Tabs>
        </main>
      </div>
    </UserStatsProvider>
  );
};

export default DashboardPage;