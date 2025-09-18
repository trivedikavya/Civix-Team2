import React from 'react'
import { useState } from 'react';
import StatsGrid from './StatsGrid';


function MainContent({ sidebarOpen }) {
  
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [location] = useState('San Diego, CA');

  const categories = [
    'All Categories', 'Environment', 'Infrastructure', 'Education', 
    'Public Safety', 'Transportation', 'Healthcare', 'Housing'
  ];

  return (
    <main className={`
      flex-1 p-4 sm:p-6 lg:p-8 
      transition-all duration-200 ease-in-out
      ${sidebarOpen ? 'lg:ml-0' : ''}
    `}>
      <div className="max-w-full lg:max-w-6xl">
        <WelcomeSection />
        <StatsGrid />
        <ActivePetitions 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          location={location}
        />
      </div>
    </main>
  );
};
export default MainContent
