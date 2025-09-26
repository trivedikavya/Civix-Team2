// File: frontend/src/components/polls/Polls.jsx

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { CreatePollModal } from './CreatePollModal';
import { EditPollModal } from './EditPollModal';
import PollCard from './PollCard';

// --- Poll Details Modal ---
const PollDetailsModal = ({ isOpen, onClose, poll, user }) => {
  if (!isOpen || !poll) return null;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const userVote = poll.voters.find(v => v.user === user._id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl font-light">&times;</button>
        <h2 className="text-3xl font-bold mb-2">{poll.question}</h2>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-6 border-b pb-4">
          <span>Created by: {poll.author.name}</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-xs">
            {poll.status === 'active' ? 'Active' : 'Closed'}
          </span>
        </div>
        {poll.description && <p className="text-gray-700 mb-4 whitespace-pre-wrap">{poll.description}</p>}

        <div className="space-y-3">
          {poll.options.map(opt => {
            const percentage = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
            return (
              <div key={opt._id} className="relative border rounded-lg p-3 bg-gray-50 overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-blue-100 rounded-lg" style={{ width: `${percentage}%` }} />
                <div className="relative flex justify-between font-semibold text-gray-700">
                  <span className="flex items-center">
                    {opt.text}
                    {userVote?.option === opt.text && <span className="text-blue-600 ml-2 text-xs font-bold flex items-center"><i className="fa-solid fa-check mr-1"></i>Your Vote</span>}
                  </span>
                  <span className="text-gray-500">{percentage.toFixed(0)}%</span>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-right text-sm text-gray-500 mt-4">{totalVotes} votes</p>
      </div>
    </div>
  );
};

// --- Main Polls Component ---
function Polls() {
  const { user, token } = useAuth();
  const tabs = ['active', 'my', 'voted', 'closed'];
  const [activeTab, setActiveTab] = useState('active');
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [pollToEdit, setPollToEdit] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/polls', { headers: { 'x-auth-token': token } });
        const data = await response.json();
        if (response.ok) setPolls(data);
        else throw new Error('Failed to fetch polls');
      } catch (error) {
        console.error('Fetch polls error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, [token]);

  const filteredPolls = useMemo(() => {
    if (!user) return [];
    let filtered = [];
    switch (activeTab) {
      case 'my':
        filtered = polls.filter(p => p.author._id === user._id);
        break;
      case 'voted':
        filtered = polls.filter(p => p.voters.some(v => v.user === user._id));
        break;
      case 'closed':
        filtered = polls.filter(p => p.status === 'closed');
        break;
      default:
        filtered = polls.filter(p => p.status === 'active');
    }
    return filtered;
  }, [activeTab, polls, user]);

  const handleVote = async (pollId, optionText) => {
    try {
      const res = await fetch(`http://localhost:5000/api/polls/${pollId}/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ optionText })
      });
      const updatedPoll = await res.json();
      if (!res.ok) throw new Error(updatedPoll.msg || 'Failed to vote.');
      setPolls(prev => prev.map(p => p._id === pollId ? updatedPoll : p));
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePollCreated = (newPoll) => {
    const populatedPoll = { ...newPoll, author: { _id: user._id, name: user.name } };
    setPolls(prev => [populatedPoll, ...prev]);
  };

  const handleOpenEditModal = (poll) => {
    setPollToEdit(poll);
    setEditModalOpen(true);
  };

  const handlePollUpdated = (updatedPoll) => {
    setPolls(prev => prev.map(p => p._id === updatedPoll._id ? updatedPoll : p));
  };

  const viewDetails = (poll) => {
    setSelectedPoll(poll);
    setDetailsModalOpen(true);
  };

  return (
    <>
      <CreatePollModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onPollCreated={handlePollCreated} />
      <EditPollModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} poll={pollToEdit} onPollUpdated={handlePollUpdated} />
      <PollDetailsModal isOpen={isDetailsModalOpen} onClose={() => setDetailsModalOpen(false)} poll={selectedPoll} user={user} />

      <div className="pt-20 p-4 bg-gradient-to-b from-sky-200 to-gray-300 min-h-screen md:pl-54">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Polls</h1>
              <p className="text-gray-500 mt-1">Create and participate in community polls.</p>
            </div>
            <button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-4 sm:mt-0 whitespace-nowrap">
              + Create Poll
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === tab ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}>
                {tab === 'active' ? 'Active Polls' : tab === 'my' ? 'My Polls' : tab === 'voted' ? 'Polls I Voted In' : 'Closed Polls'}
              </button>
            ))}
          </div>

          {/* Polls */}
          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading polls...</p>
          ) : filteredPolls.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-500">No polls found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolls.map(poll => (
                <PollCard key={poll._id} poll={poll} user={user} handleVote={handleVote} viewDetails={viewDetails} handleEdit={handleOpenEditModal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Polls;
