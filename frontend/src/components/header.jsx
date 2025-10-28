// File: frontend/src/components/header.jsx

import { Link, NavLink } from 'react-router-dom';
import govt_img from '../assets/govt.png';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function Header() {
    const [navClick, setNavClick] = useState(false);
    const [userIconClick, setuserIconClick] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { user, logout, token } = useAuth();

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

    // Fetch notifications (remains the same)
    useEffect(() => {
       // ... fetch notifications logic ...
    }, [user, API_URL, token]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Mark single notification as read (remains the same)
    const markAsRead = async (id) => {
       // ... mark as read logic ...
    };

    return (
        <>
            <header className="flex flex-wrap justify-between items-center mx-auto bg-gray-100 p-3 shadow-md fixed w-full h-17 z-50">
                {/* Left Side (Logo and Hamburger) remains the same */}
                <div className='flex'>
                   {/* ... */}
                </div>

                {/* --- Center Navigation (Desktop) --- */}
                <div className="hidden md:flex flex-grow justify-center font-bold text-md">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `py-2 pr-4 pl-3 ${isActive ? "text-orange-500 border-b-3" : "text-gray-700"} hover:text-orange-700`
                        } >
                        Home
                    </NavLink>
                    <NavLink
                        to="/petitions"
                        className={({ isActive }) =>
                            `py-2 pr-4 pl-3 ${isActive ? "text-orange-500 border-b-3" : "text-gray-700"} hover:text-orange-700`
                        }>
                        Petitions
                    </NavLink>
                    <NavLink
                        to="/polls"
                        className={({ isActive }) =>
                            `py-2 pr-4 pl-3 ${isActive ? "text-orange-500 border-b-3" : "text-gray-700"} hover:text-orange-700`
                        }>
                        Polls
                    </NavLink>
                    <NavLink
                        to="/reports" // Corrected path case
                        className={({ isActive }) =>
                            `py-2 pr-4 pl-3 ${isActive ? "text-orange-500 border-b-3" : "text-gray-700"} hover:text-orange-700`
                        }>
                        Reports
                    </NavLink>
                    <NavLink
                        to="/officials" // Corrected path case to lowercase
                        className={({ isActive }) =>
                            `py-2 pr-4 pl-3 ${isActive ? "text-orange-500 border-b-3" : "text-gray-700"} hover:text-orange-700`
                        }>
                        Officials
                    </NavLink>
                </div>

                <Sidebar navClick={navClick} setNavClick={setNavClick} />

                {/* Right Side (Settings, Notifications, User Menu) remains the same */}
                <div className="flex items-center justify-end ">
                   {/* ... settings icon ... */}
                   {/* ... notification icon and dropdown ... */}
                   {/* ... user account button ... */}
                </div>

                {/* User Dropdown Menu remains the same */}
                {user && (
                   {/* ... user dropdown div ... */}
                )}
            </header>
        </>
    );
}