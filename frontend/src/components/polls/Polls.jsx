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
    const [selectedCity, setSelectedCity] = useState("All locations");
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState('active');
    const [polls, setPolls] = useState([]);
    const [filteredPolls, setFilteredPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        if (!token) return;
        const fetchPolls = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/polls', { headers: { 'x-auth-token': token } });
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

    useEffect(() => {
        if (!user) return;
        let filtered = [];
        if (activeTab === 'my') {
            filtered = polls.filter(p => p.author._id === user._id);
        } else if (activeTab === 'voted') {
            filtered = polls.filter(p => p.voters.some(v => v.user === user._id));
        } else if (activeTab === 'closed') {
            filtered = polls.filter(p => p.status === 'closed');
        } else { // active
            filtered = polls.filter(p => p.status === 'active');
        }
        if (selectedCity !== 'All locations') {
            filtered = filtered.filter(p => p.location === selectedCity);
        }
        setFilteredPolls(filtered);
    }, [activeTab, polls, user, selectedCity]);

    const handleVote = async (pollId, optionText) => {
        try {
            const response = await fetch(`http://localhost:5000/api/polls/${pollId}/vote`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ optionText })
            });
            const updatedPoll = await response.json();
            if (!response.ok) throw new Error(updatedPoll.msg || 'Failed to vote.');
            setPolls(polls.map(p => p._id === pollId ? updatedPoll : p));
        } catch (error) {
            alert(error.message);
        }
    };

    const handlePollCreated = (newPoll) => {
        const populatedPoll = { ...newPoll, author: { _id: user._id, name: user.name } };
        setPolls(prev => [populatedPoll, ...prev]);
    };

    return (
        <>
            <CreatePollModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onPollCreated={handlePollCreated} cities={cities} />
            <div className="pt-20 p-4 bg-gradient-to-b from-sky-200 to-gray-300 min-h-screen md:pl-54">
                <div className=" ">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pt-6 pl-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 font-inria">Polls</h1>
                            <p className="text-gray-700 mt-1 font-bold">Participate in community polls and make your voice heard.</p>
                        </div>
                        <button onClick={() => setCreateModalOpen(true)} className="bg-white text-black font-bold px-5 py-3 rounded-lg hover:bg-blue-500 transition duration-300 mt-4 sm:mt-0 cursor-pointer">
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
                                className="border border-gray-300 rounded-lg p-2 text-sm bg-white mt-4 sm:mt-0">{cities.map((city) =>
                                        <option key={city} value={city}>{city}</option>)}
                                </select>
                        </div>

                        {loading ? (
                            <p className="text-center py-10 text-gray-500">Loading polls...</p>
                        ) : filteredPolls.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
                                <h3 className="font-semibold text-gray-600">No polls found with the current filters.</h3>
                                <p className="text-gray-500 mt-2 text-sm">Have a question for your community?</p>
                                <button onClick={() => setCreateModalOpen(true)} className="mt-4 bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">Create a Poll</button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredPolls.map(poll => {
                                    if (!user) return null;
                                    const userVote = poll.voters.find(v => v.user === user._id);
                                    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

                                    return (
                                        <div key={poll._id} className="bg-white p-6 rounded-lg border border-gray-200">
                                            <p className="text-sm text-gray-500 mb-2">Posted by {poll.author.name}</p>
                                            <h3 className="font-bold text-xl text-gray-800">{poll.question}</h3>
                                            {poll.description && <p className="text-gray-600 mt-2 text-sm">{poll.description}</p>}
                                            <div className="space-y-3 mt-4">
                                                {poll.options.map(option => {
                                                    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                                    return (
                                                        <div key={option._id}>
                                                            {userVote ? (
                                                                <div className="relative border rounded-lg p-3 bg-gray-50 overflow-hidden">
                                                                    <div className="absolute top-0 left-0 h-full bg-blue-100 rounded-lg" style={{ width: `${percentage}%` }}></div>
                                                                    <div className="relative flex justify-between font-semibold text-gray-700">
                                                                        <span className="flex items-center">
                                                                            {option.text}
                                                                            {userVote.option === option.text &&
                                                                                <span className="text-blue-600 ml-2 text-xs font-bold flex items-center">
                                                                                    <i className="fa-solid fa-check mr-1"></i> Your Vote
                                                                                </span>}
                                                                        </span>
                                                                        <span className="text-gray-500">{percentage.toFixed(0)}%</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => handleVote(poll._id, option.text)} className="w-full text-left p-3 border rounded-lg bg-white hover:bg-gray-100 hover:border-gray-400 transition font-semibold text-gray-700">
                                                                    {option.text}
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