// File: frontend/src/components/polls/Polls.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';

// --- Create Poll Modal Component ---
const CreatePollModal = ({ isOpen, onClose, onPollCreated }) => {
    const { token } = useAuth();
    const initialState = { question: '', description: '', options: ['', ''] };
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        if (formData.options.length < 5) {
            setFormData({ ...formData, options: [...formData.options, ''] });
        }
    };
    
    const removeOption = (index) => {
        if (formData.options.length > 2) {
            setFormData({ ...formData, options: formData.options.filter((_, i) => i !== index) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.question || formData.options.some(opt => !opt.trim())) {
            setError('Please provide a question and fill all option fields.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/polls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ ...formData, options: formData.options.filter(opt => opt.trim()) }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Failed to create poll.');
            onPollCreated(data);
            setFormData(initialState);
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl font-light">&times;</button>
                 <div className="flex items-center mb-4">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-3">
                        <i className="fa-solid fa-square-poll-vertical fa-lg"></i>
                    </div>
                    <h2 className="text-2xl font-bold ml-4">Create a New Poll</h2>
                </div>
                <p className="text-gray-600 mb-6">Create a poll to get public sentiment on local issues.</p>
                {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="question" className="block text-sm font-bold text-gray-700 mb-2">Poll Question</label>
                        <input type="text" name="question" id="question" value={formData.question} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Keep your question clear and specific" />
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Poll Options</label>
                        <p className="text-xs text-gray-500 mb-3">Add at least 2 options, up to a maximum of 5.</p>
                        {formData.options.map((option, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" placeholder={`Option ${index + 1}`} />
                                {formData.options.length > 2 && <button type="button" onClick={() => removeOption(index)} className="ml-2 text-red-500 text-2xl font-light">&times;</button>}
                            </div>
                        ))}
                         {formData.options.length < 5 && <button type="button" onClick={addOption} className="text-blue-600 font-semibold text-sm">+ Add Option</button>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Give community members enough information to make an informed choice."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold transition duration-300">Create Poll</button>
                </form>
            </div>
        </div>
    );
};


// --- Main Polls Component ---
function Polls() {
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
                const response = await fetch('http://localhost:5000/api/polls', { headers: { 'x-auth-token': token }});
                const data = await response.json();
                if(response.ok) setPolls(data);
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
        setFilteredPolls(filtered);
    }, [activeTab, polls, user]);

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
            <CreatePollModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onPollCreated={handlePollCreated}/>
            <div className="p-4 sm:p-6 lg:p-8">
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                         <div>
                            <h1 className="text-3xl font-bold text-gray-800">Polls</h1>
                            <p className="text-gray-500 mt-1">Participate in community polls and make your voice heard.</p>
                        </div>
                        <button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-4 sm:mt-0 whitespace-nowrap">
                            + Create Poll
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                            <button onClick={() => setActiveTab('active')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'active' ? 'bg-white shadow' : 'text-gray-600'}`}>Active Polls</button>
                            <button onClick={() => setActiveTab('voted')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'voted' ? 'bg-white shadow' : 'text-gray-600'}`}>Polls I Voted In</button>
                            <button onClick={() => setActiveTab('my')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'my' ? 'bg-white shadow' : 'text-gray-600'}`}>My Polls</button>
                            <button onClick={() => setActiveTab('closed')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'closed' ? 'bg-white shadow' : 'text-gray-600'}`}>Closed Polls</button>
                        </div>
                         <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            <select className="border border-gray-300 rounded-lg p-2 text-sm bg-white"><option>All Locations</option></select>
                        </div>
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
        </>
    );
}

export default Polls;