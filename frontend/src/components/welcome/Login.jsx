import { useState } from "react";
import parliament_image from "../../assets/parliament_image.jpeg";


function Login({ setPage }) {

   const  [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn=(e)=>{
        console.log("sign in button clicked")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-200">
            <div className="bg-gradient-to-b from-sky-300 to-gray-500 w-[900px] h-[550px] rounded-lg shadow-xl flex overflow-hidden justify-center ">

                 {/* Left Side - Image  */}
                <div className="hidden sm:flex w-1/2 items-center justify-center">
                    <img
                        src={parliament_image}
                        alt="building"
                        className="m-6 rounded-[40px] h-[500px] w-[400px] object-cover shadow-xl/20"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="w-full sm:w-1/2 min-w-90 max-w-100  flex flex-col justify-center px-9">
                    <h1 className="text-3xl font-semibold text-center text-gray-800">
                        Welcome to Civix
                    </h1>
                    <p className="font-bold text-center text-gray-600 mt-2">
                        Join our platform to make your voice heard in local governance
                    </p>

                    <div className="flex justify-center gap-4 mt-6 p-2 border border-gray-600 rounded-full bg-[#a1c0c8]">
                        <button className="font-bold flex-grow px-6 py-2 rounded-full border border-gray-700 bg-gray-300 hover:bg-gray-400 cursor-pointer ">
                            Login
                        </button>
                        <button onClick={() => setPage("register")} className="font-bold flex-grow px-6 py-2 rounded-full border border-gray-700 bg-white hover:bg-gray-400 cursor-pointer">
                            Register
                        </button>
                    </div>

                    <div className="mt-8">
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

                    <button onClick={(e)=>signIn(e)} className="w-1/2 mt-6 ml-[25%] bg-sky-500 border border-gray-600 hover:bg-sky-600 text-white py-2 rounded-full font-medium">
                        Sign In
                    </button>

                    <p className="text-center text-black mt-4">
                        Don't have an account?{" "}
                        <a onClick={() => setPage("register")} className="text-blue-800 font-bold cursor-pointer">
                            Register now
                        </a>
                    </p>
                </div>
            </div>
        </div>

    )
}

export default Login;