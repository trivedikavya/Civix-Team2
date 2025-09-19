import { Link, NavLink } from 'react-router-dom';
import govt_img from '../assets/govt.png';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Header() {
    const [navClick, setNavClick] = useState(false);
    const [userIconClick, setuserIconClick] = useState(false);
    
    const { user, logout } = useAuth();

    return (
        <>
            <header className="flex flex-wrap justify-between items-center mx-auto bg-white border-2 border-gray-500 p-3 fixed w-full">

                <Link to="/" className="hidden sm:flex w-1/4  items-center text-blue-500 ">
                    <img src={govt_img}
                        className="mr-1 h-12" alt="Logo " />
                    <b className='text-3xl mt-2.5'>Civix
                    </b>
                </Link>

                <button
                    className="sm:hidden text-gray-700 hover:text-orange-700"
                    onClick={() => { setNavClick(!navClick); console.log(navClick) }}
                >
                    <i className="fa-solid fa-bars fa-lg"></i>
                </button>

                <div className="flex flex-row w-1/2 font-bold text-md ">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `block py-2 pr-4 pl-3 ${isActive ? "text-orange-500" : "text-gray-700"} hover:text-orange-700`
                        } >
                        Home
                    </NavLink>
                    <NavLink
                        to="/petitions"
                        className={({ isActive }) =>
                            `block py-2 pr-4 pl-3  ${isActive ? "text-orange-500" : "text-gray-700"} hover:text-orange-700`
                        }>
                        Petitions
                    </NavLink>
                    <NavLink
                        to="/Polls"
                        className={({ isActive }) =>
                            `block py-2 pr-4 pl-3  ${isActive ? "text-orange-500" : "text-gray-700"} hover:text-orange-700`
                        }>
                        Polls
                    </NavLink>

                    <NavLink
                        to="/Reports"
                        className={({ isActive }) =>
                            `hidden sm:block py-2 pr-4 pl-3  ${isActive ? "text-orange-500" : "text-gray-700"} hover:text-orange-700`
                        }>
                        Reports
                    </NavLink>
                    <NavLink
                        to="/Oficials"
                        className={({ isActive }) =>
                            `hidden sm:block py-2 pr-4 pl-3  ${isActive ? "text-orange-500" : "text-gray-700"} hover:text-orange-700`
                        }>
                        Officials
                    </NavLink>
                </div>

                <div className={`sm:hidden absolute top-full left-0 mt-1 w-30 bg-gray-200 flex flex-col font-bold px-4 z-50 rounded-b-2xl text-center shadow-md
                    transform transition-transform duration-500 ease-in-out
                    ${navClick ? "translate-x-0" : "translate-x-[-100%]"}`}>
                    <NavLink
                        to="/Reports"
                        className={({ isActive }) =>
                            `block py-2 ${isActive ? "text-orange-500" : "text-gray-700"
                            }  hover:text-orange-700`
                        }
                        onClick={() => setNavClick(false)}
                    >
                        Reports
                    </NavLink>
                    <NavLink
                        to="/Oficials"
                        className={({ isActive }) =>
                            `block py-2 ${isActive ? "text-orange-500" : "text-gray-700"
                            }  hover:text-orange-700`
                        }
                        onClick={() => setNavClick(false)}
                    >
                        Officials
                    </NavLink>
                </div>

                {/* user account details */}
                <div className="flex items-end justify-end w-1/4">
                    <div className='hidden sm:block'>
                        <img src='https://cdn-icons-png.flaticon.com/512/565/565422.png' className="mr-1 h-7" alt="Logo " />
                    </div>
                    <button onClick={() => setuserIconClick(!userIconClick)}
                        className="text-gray-800 font-bold border rounded-4xl text-sm p-2 px-2.5 cursor-pointer">
                        {user ? user.name : 'Account'} 
                    </button>
                </div>

                {/* Dropdown Menu */}
                {user && (
                    <div className={`absolute top-full right-0 mt-1 w-auto bg-gray-200 px-4 py-2 z-50 rounded-b-2xl text-center shadow-md
                        transform transition-transform duration-500 ease-in-out
                        ${userIconClick ? "translate-x-0" : "translate-x-[100%]"}`}>
                        <div className='flex items-center pb-1'>
                            <div className="text-gray-800 border rounded-full cursor-pointer w-8 h-8 flex items-center justify-center font-bold bg-gray-300">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className='flex flex-col items-start ml-2 text-left'>
                                <h1 className='font-bold'>{user.name}</h1>
                                <div className='text-sm '>{user.role}</div>
                                <div className='text-xs text-gray-600'>{user.email}</div>
                            </div>
                        </div>
                        <button onClick={logout} className='border rounded-4xl bg-orange-400 py-0.5 px-2 mt-2.5 cursor-pointer '>logout</button>
                    </div>
                )}
            </header>
        </>
    );
}

export default Header; 