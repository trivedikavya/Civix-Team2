// File: frontend/src/components/polls/PollCard.jsx
import React from 'react';

const PollCard = ({ poll, user, handleVote, viewDetails, handleEdit }) => {
  const userVote = poll.voters.find(v => v.user === user._id);
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-gray-500 mb-2">Posted by {poll.author.name}</p>
      <h3 className="font-bold text-xl text-gray-800">{poll.question}</h3>
      {poll.description && <p className="text-gray-600 mt-2 text-sm">{poll.description}</p>}

      <div className="space-y-3 mt-4">
        {poll.options.map(opt => {
          const percentage = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
          return userVote ? (
            <div key={opt._id} className="relative border rounded-lg p-3 bg-gray-50 overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-blue-100 rounded-lg" style={{ width: `${percentage}%` }} />
              <div className="relative flex justify-between font-semibold text-gray-700">
                <span>{opt.text}{userVote.option === opt.text && <span className="text-blue-600 ml-2 text-xs font-bold flex items-center">✓ Your Vote</span>}</span>
                <span className="text-gray-500">{percentage.toFixed(0)}%</span>
              </div>
            </div>
          ) : (
            <button key={opt._id} onClick={() => handleVote(poll._id, opt.text)} className="w-full text-left p-3 border rounded-lg bg-white hover:bg-gray-100 transition font-semibold text-gray-700">{opt.text}</button>
          );
        })}
      </div>

      <p className="text-right text-sm text-gray-500 mt-4">{totalVotes} votes</p>

      <div className="flex justify-end mt-4 space-x-2">
        {user._id === poll.author._id && <button onClick={() => handleEdit(poll)} className="text-blue-600 text-sm font-semibold">Edit</button>}
        <button onClick={() => viewDetails(poll)} className="text-gray-600 text-sm font-semibold">View</button>
      </div>
    </div>
  );
};

export default PollCard;
