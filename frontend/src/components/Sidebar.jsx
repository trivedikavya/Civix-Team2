import React from 'react'
import { Home, Edit, Vote, Users, BarChart3, Settings, HelpCircle, X } from 'lucide-react';
import UserProfile from './UserProfile';
import NavItem from './NavItem';



function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <UserProfile />
        
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <NavItem icon={Home} label="Dashboard" isActive={true} />
            <NavItem icon={Edit} label="Petitions" />
            <NavItem icon={Vote} label="Polls" />
            <NavItem icon={Users} label="Officials" />
            <NavItem icon={BarChart3} label="Reports" />
            <NavItem icon={Settings} label="Settings" />
            <li className="pt-4">
              <NavItem icon={HelpCircle} label="Help & Support" />
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};


export default Sidebar
