import { Link, NavLink } from 'react-router-dom'
import govt_img from '../assets/govt.png'
import { useState } from 'react';

function Header() {
    const [navClick, setNavClick] = useState(false)

    // Handles the logout process
    const handleLogout = () => {
        // Remove the token from local storage
        localStorage.removeItem('token');
        // Reload the page to reset the application state and redirect to login
        window.location.href = '/'; 
    };

    return (<>
        <header className="flex flex-wrap justify-between items-center mx-auto bg-gray-300 border-2 border-gray-500 p-2 fixed w-full mt-1">

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

            <div className="flex flex-row w-1/2 font-bold ">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 ${isActive ? "text-orange-500" : "text-gray-700"} hover:text-orange-700`
                    } >
                    Home
                </NavLink>
                <NavLink
                    to="/Petition"
                    className={({ isActive }) =>
                        `block py-2 pr-4 pl-3  ${isActive ? "text-orange-500" : "text-gray-700"} hover:text-orange-700`
                    }>
                    Petition
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
                    Oficials
                </NavLink>
            </div>

            {navClick && (
                <div className="absolute top-full left-0 w-25 bg-gray-200 flex flex-col font-bold px-4 z-50 rounded-b-2xl">
                    <NavLink
                        to="/Reports"
                        className={({ isActive }) =>
                            `block py-2 ${isActive ? "text-orange-500" : "text-gray-700"
                            }`
                        }
                        onClick={() => setNavClick(false)}
                    >
                        Reports
                    </NavLink>
                    <NavLink
                        to="/Oficials"
                        className={({ isActive }) =>
                            `block py-2 ${isActive ? "text-orange-500" : "text-gray-700"
                            }`
                        }
                        onClick={() => setNavClick(false)}
                    >
                        Oficials
                    </NavLink>
                </div>
            )}

            <div className="flex items-center justify-end w-1/4">
                <div>
                    <img src='https://cdn-icons-png.flaticon.com/512/565/565422.png' className="mr-1 h-7" alt="Logo " />
                </div>
                <div
                    to="#"
                    className="text-gray-800 font-bold  text-sm px-4">
                    Sri
                </div>
                {/* --- LOGOUT BUTTON ADDED HERE --- */}
                <button 
                    onClick={handleLogout}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-1 px-3 rounded-full"
                >
                    Logout
                </button>
            </div>
        </header>
    </>
    );
}

export default Header;