import CreatePollModal from './CreatePollModal.jsx';
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

    const { user, token } = useAuth();
    const [selectedCity, setSelectedCity] = useState("All locations");
    const [activeTab, setActiveTab] = useState('active');
    const [polls, setPolls] = useState([]);
    const [filteredPolls, setFilteredPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    // Fetch polls from backend
    useEffect(() => {
        if (!token) return;
        const fetchPolls = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/polls', {
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
    }, [token]);

    // Filter polls
    useEffect(() => {
        if (!user) return;
        let filtered = [];

        if (activeTab === 'my') {
            filtered = polls.filter(p => (typeof p.createdBy === 'object' ? p.createdBy._id : p.createdBy) === user._id);
        } else if (activeTab === 'voted') {
            filtered = polls.filter(p => p.voters.includes(user._id));
        } else if (activeTab === 'closed') {
            filtered = polls.filter(p => p.status === 'closed');
        } else { // active
            filtered = polls.filter(p => !p.status || p.status === 'active');
        }

        if (selectedCity !== 'All locations') {
            filtered = filtered.filter(p => p.targetLocation === selectedCity);
        }

        setFilteredPolls(filtered);
    }, [activeTab, polls, user, selectedCity]);

    // Handle voting by option index
    const handleVote = async (pollId, optionIndex) => {
        try {
            const response = await fetch(`http://localhost:5001/api/polls/${pollId}/vote`, {
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
                            className="bg-white text-black font-bold px-5 py-3 rounded-lg hover:bg-blue-500 transition duration-300 mt-4 sm:mt-0 cursor-pointer"
                        >
                            + Create Poll
                        </button>
                    </div>

                    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                                <button onClick={() => setActiveTab('active')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'active' ? 'bg-white shadow' : 'text-gray-600'}`}>Active Polls</button>
                                <button onClick={() => setActiveTab('voted')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'voted' ? 'bg-white shadow' : 'text-gray-600'}`}>Polls I Voted In</button>
                                <button onClick={() => setActiveTab('my')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'my' ? 'bg-white shadow' : 'text-gray-600'}`}>My Polls</button>
                                <button onClick={() => setActiveTab('closed')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'closed' ? 'bg-white shadow' : 'text-gray-600'}`}>Closed Polls</button>
                            </div>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 text-sm bg-white mt-4 sm:mt-0"
                            >
                                {cities.map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
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
                            <div className="space-y-6">
                                {filteredPolls.map(poll => {
                                    const userVote = poll.voters.includes(user._id);
                                    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                                    const authorName = typeof poll.createdBy === 'object' ? poll.createdBy.name : poll.createdBy;

                                    return (
                                        <div key={poll._id} className="bg-white p-6 rounded-lg border border-gray-200">
                                            <p className="text-sm text-gray-500 mb-2">Posted by {authorName}</p>
                                            <h3 className="font-bold text-xl text-gray-800">{poll.title}</h3>
                                            {poll.description && <p className="text-gray-600 mt-2 text-sm">{poll.description}</p>}
                                            <div className="space-y-3 mt-4">
                                                {poll.options.map((option, index) => {
                                                    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                                    return (
                                                        <div key={index}>
                                                            {userVote ? (
                                                                <div className="relative border rounded-lg p-3 bg-gray-50 overflow-hidden">
                                                                    <div className="absolute top-0 left-0 h-full bg-blue-100 rounded-lg" style={{ width: `${percentage}%` }}></div>
                                                                    <div className="relative flex justify-between font-semibold text-gray-700">
                                                                        <span>{option.optionText}</span>
                                                                        <span className="text-gray-500">{percentage.toFixed(0)}%</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleVote(poll._id, index)}
                                                                    className="w-full text-left p-3 border rounded-lg bg-white hover:bg-gray-100 hover:border-gray-400 transition font-semibold text-gray-700"
                                                                >
                                                                    {option.optionText}
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-right text-sm text-gray-500 mt-4">{totalVotes} votes</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Polls;


