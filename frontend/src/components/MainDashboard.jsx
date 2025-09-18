import React from 'react'
import { useState } from 'react';
import DashboardHeader from './DashboardHeader';

function MainDashboard() {
 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onMenuClick={toggleSidebar} />
      <div className="flex relative">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <MainContent sidebarOpen={sidebarOpen} />
      </div>
    </div>
  );
}

export default MainDashboard
