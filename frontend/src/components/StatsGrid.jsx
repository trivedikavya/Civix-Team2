import React from 'react'
import StatCard from './StatCard';
import { Edit, TrendingUp, Vote } from 'lucide-react';

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <StatCard 
        title="My Petitions" 
        value="0" 
        subtitle="petitions"
        icon={Edit}
        bgColor="bg-blue-50 text-blue-500"
      />
      <StatCard 
        title="Successful Petitions" 
        value="0" 
        subtitle="or under review"
        icon={TrendingUp}
        bgColor="bg-green-50 text-green-500"
      />
      <StatCard 
        title="Polls Created" 
        value="0" 
        subtitle="polls"
        icon={Vote}
        bgColor="bg-purple-50 text-purple-500"
      />
    </div>
  );
};

export default StatsGrid
