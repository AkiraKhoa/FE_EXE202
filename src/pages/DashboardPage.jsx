import React from 'react'
import Header from '../components/common/Header'
import { BarChart2, ShoppingBag, User, Users, Zap } from 'lucide-react'
import StatCard from '../components/common/StatCard'
import { motion } from "framer-motion";
import SalesOverviewChart from '../components/dashboard/SalesOverviewChart';
import CategoryDistributionChart from '../components/dashboard/CategoryDistributionChart';
import UsersStat from '../components/common/UsersStat';
import UserDemographicsChart from '../components/dashboard/UserDemographicsChart';
import UserGrowthChart from '../components/dashboard/UserGrowthChart';
import SubscriptionRatioChart from '../components/dashboard/SubscriptionRatioChart';


const DashboardPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
        <Header title="Dashboard"/>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
            {/* STATS */}
          <UsersStat />
            {/* CHARTS */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <SubscriptionRatioChart />
              <UserGrowthChart />
              {/* <SalesOverviewChart />
              <CategoryDistributionChart /> */}
            </div>
            
        </main>
    </div>
  )
}

export default DashboardPage