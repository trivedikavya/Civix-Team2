import { useAuth } from '../context/AuthContext'; // 1. Import the useAuth hook
import { useState } from 'react';

function Home() {
    const { user } = useAuth(); // 2. Get the user object from the context
    const categories = ['All Categories', 'Environment', 'Infrastructure', 'Education', 'Public Safety', 'Transportation', 'Healthcare', 'Housing'];
    const cities = [
        'Mumbai, MH',
        'Delhi, DL',
        'Bengaluru, KA',
        'Chennai, TN',
        'Kolkata, WB',
        'Hyderabad, TS',
        'Pune, MH'
    ];
    const [activeCategoriy, setActiveCategori] = useState('All Categories');
    const activeCategori = (categori) => {
        setActiveCategori(categori);
    }

    return (
        <div className="pt-22 md:pt-25 p-2 md:px-10 lg:px-40 bg-gradient-to-b from-sky-200 to-gray-500 min-h-screen">
            <div className="bg-white rounded-lg shadow py-6 p-4 mb-6">
                <h1 className="text-3xl font-semibold italic">
                    {/* 3. Use the user's name dynamically */}
                    welcome back, <span className="font-bold">{user ? user.name : 'User'}!</span>
                </h1>
                <p className="text-gray-600 mt-2">
                    See what's happening in your community and make your voice heard.
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <p className="text-gray-700 font-bold">My Petitions</p>
                    <h2 className="text-2xl font-bold">0</h2>
                    <p className="text-gray-500">petitions</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <p className="text-gray-700 font-bold">Successful Petitions</p>
                    <h2 className="text-2xl font-bold">0</h2>
                    <p className="text-sm text-gray-500">or under review</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <p className="text-gray-700 font-bold">Polls Created</p>
                    <h2 className="text-2xl font-bold">0</h2>
                    <p className="text-gray-500">Polls Created</p>
                </div>
            </div>

            {/* Active Petitions */}
            <div className="flex justify-between items-center mb-4 p-4">
                <h2 className="text-lg font-semibold border-b-2">Active Petitions Near You</h2>

                <p className="text-gray-900 text-md flex">Showing for:
                    <span className="bg-gray-500 font-semibold px-2.5 rounded-lg ml-1">
                        <select className="bg-gray-500 text-white font-semibold rounded-lg px-1 cursor-pointer">
                            {cities.map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </span>
                </p>
            </div>

            <div className="flex flex-wrap gap-4">
                {categories.map((categori) =>
                    (<div 
                        className={`border text-[16px] rounded-2xl px-4 py-1 text-center hover:bg-gray-400 hover:font-medium cursor-pointer ${activeCategoriy === categori ? "bg-gray-500 text-white border-black" : "bg-white border-gray-300"}`} 
                        key={categori} 
                        onClick={() => activeCategori(categori)}>
                        {categori}
                    </div>)
                )}
            </div>
            
            <div className='flex justify-center flex-wrap py-6'>
                <p className='w-full text-center text-2xl font-mono py-2'>no petition found...............</p>
                <button 
                    className='border px-2 text-xl bg-white rounded-md cursor-pointer hover:bg-gray-400' 
                    onClick={() => setActiveCategori("All Categories")}>
                    Clear Filter
                </button>
            </div>
        </div>
    )
}

export default Home;