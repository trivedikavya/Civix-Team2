import { Link, NavLink } from 'react-router-dom'
import govt_img from '../assets/govt.png'

function Header() {

    return (
        <header className="flex flex-wrap justify-between items-center mx-auto bg-gray-300 border-2 border-gray-500 p-2 fixed w-full">

            <Link to="/" className="hidden sm:flex w-1/4  items-center text-blue-500 ">
                <img src={govt_img}
                    className="mr-1 h-12" alt="Logo " />
                <b className='text-3xl mt-2.5'>Civix
                </b>
            </Link>


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
                        `block py-2 pr-4 pl-3  ${isActive ? "text-orange-500" : "text-gray-700"} hover:text-orange-700`
                    }>
                    Reports
                </NavLink>
                <NavLink
                    to="/Oficials"
                    className={({ isActive }) =>
                        `block py-2 pr-4 pl-3  ${isActive ? "text-orange-500" : "text-gray-700"} hover:text-orange-700`
                    }>
                    Oficials
                </NavLink>
            </div>

            <div className="flex items-end justify-end w-1/4">
                <div>
                    <img src='https://cdn-icons-png.flaticon.com/512/565/565422.png' className="mr-1 h-7" alt="Logo " />
                </div>
                <div
                    to="#"
                    className="text-gray-800 font-bold  text-sm px-4">
                    Sri
                </div>
            </div>
        </header>
    );
}


export default Header;