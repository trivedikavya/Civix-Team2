import { useState } from 'react';
import { Home, FileText, BarChart3, Users, Settings, HelpCircle, Bell, DollarSign, ChevronDown, Edit, TrendingUp, Vote, Menu, X, Navigation } from 'lucide-react';
import DashboardHeader from '../DashboardHeader';

import Sidebar from '../Sidebar';
import UserProfile from '../UserProfile';
import NavItem from '../NavItem';
import DashboardWelcome from '../DashboardWelcome';
import StatCard from '../StatCard';
import StatsGrid from '../StatsGrid';
import Category from '../Category';
import ActivePetition from '../ActivePetition';
import MainContent from '../MainContent';
import MainDashboard from '../MainDashboard';




function Dashboard() {
  return (
    <>
      <DashboardHeader />
      <UserProfile />
      <NavItem />
      <Sidebar />
      <DashboardWelcome />
      <StatCard />
      <StatsGrid />
      <Category />
      <Location />
      <ActivePetition />
      <MainContent />
      <MainDashboard />




    </>
  )
}

export default Dashboard;
