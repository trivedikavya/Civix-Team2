import React from 'react'
import { Bell, DollarSign, ChevronDown, Menu } from 'lucide-react';


function DashboardHeader({ onMenuClick }) {

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 sm:space-x-8">
          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">Civix</span>
            <span className="hidden sm:inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">Beta</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <a href="#" className="text-blue-500 font-medium">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Petitions</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Polls</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Reports</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Bell className="w-5 h-5 text-gray-400" />
          <DollarSign className="w-5 h-5 text-gray-400 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 hidden sm:inline">Sri</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;


