import { useState } from "react";
import govt_image from "../../assets/govt_of_india.jpg";


function Register({ setPage }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loc, setLoc] = useState("");
    const [role, setRole] = useState("");


    const createAccount = (e) => {
        console.log("sign in button clicked")
    }

    return (
        <div className="min-h-screen  flex  items-center justify-center bg-sky-200">
            <div className="bg-gradient-to-b from-sky-300 to-gray-500 w-[900px] h-[800px] rounded-lg shadow-xl flex  justify-center ">

                {/* Left Side - Form  */}
                <div className="hidden sm:flex w-[40%] flex-col items-center justify-center">
                        <img
                            src={govt_image}
                            alt="building"
                            className="m-6 rounded-[50%] px-2 h-[200px] w-[200px] object-cover "
                        />
                    <div>
                        <div className="mt-8">
                            <div
                                className="w-full mt-2 px-4 py-2 text-2xl font-bold flex text-center flax justify-center text-[#3c3838]"
                            >Digital Civix <br/> Engagement Platform</div>
                        </div>

                        <div className="mt-8 ">
                            <div
                                className="w-full mt-2 px-4 py-2 text-2sm flex text-center text-[#eeeeee]"
                            >Civix enables citizens to engage in local governance through petitions, voting, and tracking officials responses. Join our platform to make your voice heard and drive positive change in your community.</div>
                        </div>
                        <div className="mt-8 ">
                            <div
                                className="w-full mt-2 px-4 py-2 text-2xl font-bold flex text-center text-[#3c3838]"
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full sm:w-[60%] min-w-90 max-w-125  flex flex-col justify-center px-10">
                    <h1 className="text-3xl font-semibold text-center text-gray-800">
                        Welcome to Civix
                    </h1>
                    <p className="font-bold text-center text-gray-600 mt-2">
                        Join our platform to make your voice heard in local governance
                    </p>

                    <div className="flex justify-center gap-4 mt-6 p-2 border border-gray-600 rounded-full bg-[#a1c0c8]">
                        <button onClick={() => setPage("login")} className="font-bold flex-grow px-6 py-2 rounded-full border border-gray-700 bg-gray-300 hover:bg-gray-400 cursor-pointer ">
                            Login
                        </button>
                        <button className="font-bold flex-grow px-6 py-2 rounded-full border border-gray-700 bg-white hover:bg-gray-400 cursor-pointer">
                            Register
                        </button>
                    </div>

                    <div className="mt-4">
                        <label className="text-lg block text-white font-medium">Full Name</label>
                        <input
                            type="email"
                            placeholder="Your full name....."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-2 px-4 py-2 bg-gray-200 text-xl border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-lg block text-white font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="Your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-2 px-4 py-2 bg-gray-200 text-xl border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-lg block text-white font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 px-4 py-2  bg-gray-200  text-xl border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-lg block text-white font-medium">Location</label>
                        <input
                            type="email"
                            placeholder="Potland or...."
                            value={loc}
                            onChange={(e) => setLoc(e.target.value)}
                            className="w-full mt-2 px-4 py-2 bg-gray-200 text-xl border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                    </div>
                    <div className="mt-4 text-white flex items-center">
                        <span className="text-lg font-medium "> I am registering as: </span>
                        <label className="m-2 font-medium"><input
                            type="radio" 
                            name="role" 
                            value="citizen"
                            checked={role === "citizen"}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-4 h-4 accent-sky-500" /> Citizen</label>
                        
                        <label className="m-2 font-medium"><input
                            type="radio" 
                            name="role" 
                            value="Public_officer"
                            checked={role === "Public_officer"}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-4 h-4 accent-sky-500" /> Public officer</label>
                    </div>

                    <button onClick={(e) => createAccount(e)} className="w-1/2 mt-6 ml-[25%] bg-sky-500 border border-gray-600 hover:bg-sky-600 text-white py-2 rounded-full font-medium">
                        Create Account
                    </button>

                    <p className="text-center text-black mt-4">
                        Don't have an account?{" "}
                        <a onClick={() => setPage("login")} className="text-blue-800 font-bold cursor-pointer">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>

    )
}

export default Register;