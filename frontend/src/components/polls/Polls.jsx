import CreatePollModal from './CreatePollModal.jsx';
import PollCard from './PollCard.jsx';
import { useState, useEffect } from "react";
import { useAuth } from '/src/context/AuthContext.jsx';

function Polls() {
    const cities = [
        'All locations',
        'Mumbai, MH',
        'Delhi, DL',
        'Bengaluru, KA',
        'Chennai, TN',
        'Kolkata, WB',
        'Hyderabad, TS',
        'Pune, MH'
    ];
    const tabs = [
        { id: "active", label: "Active Polls" },
        { id: "voted", label: "Polls I Voted In" },
        { id: "my", label: "My Polls" },
        { id: "closed", label: "Closed Polls" },
    ];

    const { user, token } = useAuth();
    const [selectedCity, setSelectedCity] = useState("All locations");
    const [activeTab, setActiveTab] = useState('active');
    const [polls, setPolls] = useState([]);
    const [filteredPolls, setFilteredPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
    // Fetch polls from backend
    useEffect(() => {
        if (!token) return;
        const fetchPolls = async () => {
            try {
                const response = await fetch(`${API_URL}/api/polls`, {
                    headers: { 'x-auth-token': token }
                });
                const data = await response.json();
                if (response.ok) setPolls(data);
                else throw new Error('Failed to fetch polls');
            } catch (error) {
                console.error("Fetch polls error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPolls();
    }, [token, API_URL]);

    // Filter polls
    useEffect(() => {
        if (!user) return;
        let filtered = [];

        if (activeTab === 'my') {
            filtered = polls.filter(p => (typeof p.createdBy === 'object' ? p.createdBy._id : p.createdBy) === user._id);
        } else if (activeTab === 'voted') {
            filtered = polls.filter(p => p.voters.includes(user._id));
        } else if (activeTab === 'closed') {
            filtered = polls.filter(p => new Date(p.closedAt) < new Date());
        } else { // active
            filtered = polls.filter(p => new Date(p.closedAt) >= new Date());
        }
        if (selectedCity !== 'All locations') {
            filtered = filtered.filter(p => p.targetLocation === selectedCity);
        }

        setFilteredPolls(filtered);
    }, [activeTab, polls, user, selectedCity]);

    // Handle voting by option index
    const handleVote = async (pollId, optionIndex) => {
        try {
            const response = await fetch(`${API_URL}/api/polls/${pollId}/vote`, {
                method: 'POST', // match backend
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ optionIndex }) // match backend expected payload
            });

            const updatedPoll = await response.json();
            if (!response.ok) throw new Error(updatedPoll.msg || 'Failed to vote.');
            setPolls(polls.map(p => p._id === pollId ? updatedPoll : p));
        } catch (error) {
            alert(error.message);
        }
    };


    const handleDeletePoll = async (pollId) => {
        if (window.confirm('Are you sure you want to delete this poll ?')) {
            try {
                const response = await fetch(`${API_URL}/api/polls/${pollId}`, {
                    method: 'DELETE',
                    headers: { 'x-auth-token': token }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.msg || 'Failed to delete poll.');
                setPolls(polls.filter(p => p._id !== pollId));
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleEdit = async (updatedPoll) => {
        try {
            const response = await fetch(`${API_URL}/api/polls/${updatedPoll._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({
                    title: updatedPoll.title,
                    description: updatedPoll.description,
                    options: updatedPoll.options,
                    closedAt: updatedPoll.closedAt
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Failed to update poll.');
            setPolls(polls.map(p => p._id === updatedPoll._id ? data : p));
        } catch (error) {
            alert(error.message);
        }
    }

    const handlePollCreated = (newPoll) => {
        const populatedPoll = { 
            ...newPoll, 
            createdBy: { _id: user._id, name: user.name }, 
            voters: [] 
        };
        setPolls(prev => [populatedPoll, ...prev]);
    };

    return (
        <>
            <CreatePollModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setCreateModalOpen(false)} 
                onPollCreated={handlePollCreated} 
                cities={cities} 
                API_URL={API_URL}
            />
            <div className="pt-20 p-4 bg-gradient-to-b from-sky-200 to-gray-300 min-h-screen md:pl-54">
                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pt-6 pl-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 font-inria">Polls</h1>
                            <p className="text-gray-700 mt-1 font-bold">Participate in community polls and make your voice heard.</p>
                        </div>
                        <button 
                            onClick={() => setCreateModalOpen(true)} 
                            className="bg-white text-black font-bold px-5 py-3 rounded-lg hover:bg-blue-300 transition duration-300 mt-4 sm:mt-0 cursor-pointer"
                        >
                            + Create Poll
                        </button>
                    </div>

                    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                        <div className="flex flex-col min-[690px]:flex-row justify-between items-center mb-6">
                            
                            <div className="hidden min-[542px]:max-[768px]:flex min-[768px]:hidden min-[890px]:flex items-center space-x-1 bg-gray-100 p-1 rounded-lg justify-center">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-2 px-4 rounded-md font-semibold text-sm cursor-pointer hover:text-black ${activeTab === tab.id ? "bg-white shadow" : "text-gray-600"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* --- Mobile + Large Screen (Dropdown View) --- */}
                            <div className="min-[542px]:max-[768px]:hidden min-[890px]:hidden relative w-full sm:w-40">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-full flex justify-between items-center py-2 px-4 rounded-md border border-gray-300/60 bg-gray-100 shadow text-sm font-semibold cursor-pointer"
                                >
                                    {tabs.find((t) => t.id === activeTab)?.label}
                                    <span className="ml-2 text-gray-500">▼</span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    setActiveTab(tab.id);
                                                    setDropdownOpen(false);
                                                }}
                                                className={`block w-full text-left py-2 px-4 text-sm hover:bg-gray-100 ${activeTab === tab.id
                                                        ? "font-semibold text-black"
                                                        : "text-gray-600"
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="border border-gray-300 rounded-lg p-2 bg-sky-200 mt-4 min-[690px]:mt-0 min-w-35 w-full min-[542px]:w-auto flex items-center space-x-2">
                                <i className="fa-solid fa-location-dot text-gray-700"></i>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="cursor-pointer text-sm bg-transparent outline-none flex-1"
                                >
                                    {cities.map((city, index) => (
                                        <option key={index} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <p className="text-center py-10 text-gray-500">Loading polls...</p>
                        ) : filteredPolls.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
                                <h3 className="font-semibold text-gray-600">No polls found with the current filters.</h3>
                                <p className="text-gray-500 mt-2 text-sm">Have a question for your community?</p>
                                <button 
                                    onClick={() => setCreateModalOpen(true)} 
                                    className="mt-4 bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
                                >
                                    Create a Poll
                                </button>
                            </div>
                        ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredPolls.map((poll) => 
                                    <PollCard key={poll._id} poll={poll} user={user} handleVote={handleVote} handleDeletePoll={handleDeletePoll} handleEdit={handleEdit} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Polls;


