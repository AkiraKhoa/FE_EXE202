import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { motion } from "framer-motion";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Particles } from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { faker } from "@faker-js/faker";
import Header from "../components/common/Header";
import UsersStat from "../components/common/UsersStat";
import SubscriptionRatioChart from "../components/dashboard/SubscriptionRatioChart";
import PeakAccessTimeChart from "../components/dashboard/PeakAccessTimeChart";
import RevenueTrendChart from "../components/dashboard/RevenueTrendChart";
import UserDemographicsChart from "../components/dashboard/UserDemographicsChart";
import EngagementScatter from "../components/dashboard/EngagementScatter";
import HeatmapChart from "../components/dashboard/HeatmapChart";
import AIDrivenInsights from "../components/dashboard/AIDrivenInsights";
import SustainabilityMetrics from "../components/dashboard/SustainabilityMetrics";
import { UserStatsProvider } from "../components/context/UserStatsContext";
import './styles.css';

// Particle effect initialization
const particlesInit = async (engine) => {
  await initParticlesEngine(engine);
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
    "heatmap",
    "aiInsights",
    "sustainability",
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
    heatmapData: Array.from({ length: 7 }, () => ({
      day: faker.date.weekday(),
      value: faker.number.int({ min: 0, max: 100 }),
    })),
    aiInsights: [
      {
        prediction: faker.number.int({ min: 70, max: 95 }),
        message: "Dự đoán: Đạt mục tiêu giảm cân với chế độ dinh dưỡng tối ưu",
        confidence: faker.number.float({ min: 0.85, max: 0.99, precision: 0.01 }),
        timeframe: `${faker.number.int({ min: 1, max: 6 })} tháng`,
        recommendation: "Tăng cường bổ sung protein từ thực phẩm tự nhiên như ức gà và đậu hũ.",
      },
      {
        prediction: faker.number.int({ min: 60, max: 90 }),
        message: "Dự báo: Cải thiện sức khỏe tim mạch thông qua chế độ ăn uống khoa học",
        confidence: faker.number.float({ min: 0.80, max: 0.98, precision: 0.01 }),
        timeframe: `${faker.number.int({ min: 2, max: 8 })} tháng`,
        recommendation: "Giảm lượng muối và tăng cường rau xanh như cải bó xôi vào bữa ăn hàng ngày.",
      },
      {
        prediction: faker.number.int({ min: 65, max: 92 }),
        message: "Tiên lượng: Tăng cơ hiệu quả với kế hoạch dinh dưỡng giàu năng lượng",
        confidence: faker.number.float({ min: 0.82, max: 0.97, precision: 0.01 }),
        timeframe: `${faker.number.int({ min: 3, max: 6 })} tháng`,
        recommendation: "Kết hợp yến mạch và các loại hạt như hạnh nhân vào bữa sáng.",
      },
    ],
    sustainability: {
      carbonFootprint: faker.number.float({ min: 0.5, max: 2.0, precision: 0.1 }),
    },
  });

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
    heatmap: <HeatmapChart />,
    aiInsights: <AIDrivenInsights />,
    sustainability: <SustainabilityMetrics />,
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
                <HeatmapChart />
                <AIDrivenInsights />
                <SustainabilityMetrics />
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