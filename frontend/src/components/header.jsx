import { Link, NavLink } from 'react-router-dom';
import govt_img from '../assets/govt.png';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function Header() {
    const [navClick, setNavClick] = useState(false);
    const [userIconClick, setuserIconClick] = useState(false);

    const { user, logout } = useAuth();

    return (
        <>
            <header className="flex flex-wrap justify-between items-center mx-auto bg-gray-100 p-3 shadow-md border-b-2 fixed w-full h-17 z-50">

                <div className='flex'>
                    <button
                        className="block text-2xl border rounded-xl hover:text-orange-700 mr-3 md:hidden px-1.5 cursor-pointer"
                        onClick={() => setNavClick(!navClick)}>
                        <i className={`fa-solid fa-bars fa-lg ${navClick ? "text-red-500" : "text-gray-700"}`}></i>
                    </button>
                    <Link to="/" className="md:pl-6 flex items-center text-blue-500">
                        <img src={govt_img}
                            className="mr-1 h-12" alt="Logo" />
                        <b className='text-3xl mt-2.5'>Civix</b>
                    </Link>
                </div>
                
                <div className="hidden md:flex flex-row w-1/2 font-bold text-md">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `py-2 pr-4 pl-3 ${isActive ? "text-orange-500 border-b-3" : "text-gray-700"} hover:text-orange-700`
                        }>
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
                        to="/reports"
                        className={({ isActive }) =>
                            `py-2 pr-4 pl-3 ${isActive ? "text-orange-500 border-b-3" : "text-gray-700"} hover:text-orange-700`
                        }>
                        Reports
                    </NavLink>
                    <NavLink
                        to="/officials"
                        className={({ isActive }) =>
                            `py-2 pr-4 pl-3 ${isActive ? "text-orange-500 border-b-3" : "text-gray-700"} hover:text-orange-700`
                        }>
                        Officials
                    </NavLink>
                </div>

                {/* Sidebar Component for mobile */}
                <Sidebar navClick={navClick} setNavClick={setNavClick} />

                {/* User account section */}
                <div className="flex items-center justify-end">
                    <NavLink to="/settings" className='h-7 mr-2 hidden md:block'>
                        <i className="fa-solid fa-gear fa-lg text-gray-700 hover:text-orange-700"></i>
                    </NavLink>
                    <div className='mr-1 cursor-pointer hidden md:block'>
                        <img src='https://cdn-icons-png.flaticon.com/512/565/565422.png' 
                             className="mr-1 h-7" alt="Notification" />
                    </div>
                    <button 
                        onClick={() => setuserIconClick(!userIconClick)}
                        className="text-gray-800 font-bold border rounded-full text-sm p-2 px-3 cursor-pointer hover:bg-gray-200 transition-colors">
                        {user ? user.name : 'Account'}
                    </button>
                </div>

                {/* User Dropdown Menu */}
                {user && (
                    <div className={`absolute top-full right-0 mt-1 w-64 bg-white px-4 py-3 z-50 rounded-b-2xl text-left shadow-xl border border-gray-200
                        transform transition-transform duration-300 ease-in-out
                        ${userIconClick ? "translate-x-0 mr-1" : "translate-x-[100%]"}`}>
                        <div className='flex items-center pb-3 border-b border-gray-100'>
                            <div className="text-white bg-blue-500 rounded-full cursor-pointer w-12 h-12 flex items-center justify-center font-bold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className='flex flex-col ml-3'>
                                <h1 className='font-bold text-gray-800'>{user.name}</h1>
                                <div className='text-sm text-gray-600'>{user.role}</div>
                                <div className='text-sm text-gray-500'>{user.email}</div>
                            </div>
                        </div>
                        
                        {/* Mobile menu items in dropdown */}
                        <div className="md:hidden py-2 border-b border-gray-100">
                            <NavLink 
                                to="/settings" 
                                className="block py-2 text-gray-700 hover:text-orange-700"
                                onClick={() => setuserIconClick(false)}>
                                <i className="fa-solid fa-gear mr-2"></i>Settings
                            </NavLink>
                        </div>
                        
                        <div className="pt-3">
                            <button 
                                onClick={() => {
                                    logout();
                                    setuserIconClick(false);
                                }} 
                                className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors'>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>
            
            {/* Overlay to close dropdown when clicking outside */}
            {userIconClick && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setuserIconClick(false)}
                ></div>
            )}
        </>
    );
}