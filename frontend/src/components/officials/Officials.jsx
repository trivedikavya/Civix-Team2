// File: frontend/src/components/officials/Officials.jsx

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import PetitionComponent from '/src/components/petitions/PetitionComponent.jsx'; // Reuse Petition component
import PollCard from '/src/components/polls/PollCard.jsx'; // Reuse PollCard component

// Base API URL from environment variables or default
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

// Reusable Metric Card component (copied from Reports)
const MetricCard = ({ title, value, iconClass, color }) => (
    <div className="bg-white rounded-xl shadow-md p-3 flex flex-col justify-between border-l-4" style={{ borderColor: color }}>
        <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-gray-500">{title}</p>
            <i className={`${iconClass} text-xl`} style={{ color: color }}></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
    </div>
);

// Custom hook to fetch necessary data for the Officials page
const useOfficialsData = () => {
    const { user, token } = useAuth();
    const [officials, setOfficials] = useState([]);
    const [myActivity, setMyActivity] = useState(null);
    const [myPetitions, setMyPetitions] = useState([]);
    const [myPolls, setMyPolls] = useState([]);
    // State for recent general activity (optional enhancement)
    // const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!token || !user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            // Fetch Officials List
            const officialsRes = await fetch(`${API_BASE_URL}/api/officials`, {
                headers: { 'x-auth-token': token } // Assuming officials endpoint might need auth in future
            });
            const officialsData = await officialsRes.json();
            if (!officialsRes.ok) throw new Error(officialsData.msg || 'Failed to fetch officials.');
            setOfficials(officialsData);

            // Fetch My Activity Metrics (Directly, similar to how it was in Reports)
            // Note: This requires backend changes if the endpoint was removed.
            // Alternative: Calculate on frontend from all petitions/polls if needed.
            // Let's assume we calculate it on the frontend for now
            const allPetitionsRes = await fetch(`${API_BASE_URL}/api/petitions`);
            const allPetitionsData = await allPetitionsRes.json();
            if (!allPetitionsRes.ok) throw new Error('Failed to fetch petitions for activity calc.');

            const allPollsRes = await fetch(`${API_BASE_URL}/api/polls`, { headers: { 'x-auth-token': token } });
            const allPollsData = await allPollsRes.json();
             if (!allPollsRes.ok) throw new Error('Failed to fetch polls for activity calc.');

            const authoredPetitions = allPetitionsData.filter(p => p.author?._id === user._id);
            const signedPetitions = allPetitionsData.filter(p => p.signatures?.some(sig => sig._id === user._id));
            const createdPolls = allPollsData.filter(p => (typeof p.createdBy === 'object' ? p.createdBy._id : p.createdBy) === user._id);
            const votedPolls = allPollsData.filter(p => p.voters?.includes(user._id));

            setMyActivity({
                petitionsAuthored: authoredPetitions.length,
                petitionsSigned: signedPetitions.length,
                pollsCreated: createdPolls.length,
                pollsVotedIn: votedPolls.length,
            });

            // Fetch My Recent Petitions & Polls (e.g., last 3)
            setMyPetitions(authoredPetitions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3));
            setMyPolls(createdPolls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3));

            // Fetch Recent General Activity (Optional - requires backend endpoint)
            // const recentActivityRes = await fetch(`${API_BASE_URL}/api/activity/recent`, { headers: { 'x-auth-token': token }});
            // const recentActivityData = await recentActivityRes.json();
            // if (!recentActivityRes.ok) throw new Error('Failed to fetch recent activity.');
            // setRecentActivity(recentActivityData);


        } catch (err) {
            console.error("Officials Page Fetch Error:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Add handlers for editing/deleting polls/petitions if needed, similar to Polls.jsx/Petitions.jsx
    // These would likely involve updating the main `petitions` or `polls` state in parent components
    // or refetching data. For simplicity, we'll omit them here but they'd be needed for full functionality.

    return { officials, myActivity, myPetitions, myPolls, loading, error };
};

function Officials() {
    const { officials, myActivity, myPetitions, myPolls, loading, error } = useOfficialsData();
    const { user, token } = useAuth(); // Needed for PollCard/PetitionComponent props

    if (loading) {
        return <div className="pt-20 p-4 min-h-screen bg-gradient-to-b from-sky-200 to-gray-300 md:pl-54 text-center">Loading Officials...</div>;
    }

    if (error) {
        return <div className="pt-20 p-4 min-h-screen bg-gradient-to-b from-sky-200 to-gray-300 md:pl-54 text-center text-red-600">Error: {error}</div>;
    }

    // Handlers needed for PollCard/PetitionComponent interactivity (simplified for now)
    const handleVote = (pollId, optionIndex) => console.log("Vote on poll:", pollId, optionIndex);
    const handleDeletePoll = (pollId) => console.log("Delete poll:", pollId);
    const handleEditPoll = (poll) => console.log("Edit poll:", poll);
    const handleSignPetition = (petitionId) => console.log("Sign petition:", petitionId);
    // Add other handlers as needed (delete/edit petition, comments, etc.)

    return (
        <div className="pt-20 p-4 bg-gradient-to-b from-sky-200 to-gray-300 min-h-screen md:pl-54">
            <div className="pl-6 pt-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-800 font-inria">Officials & My Activity</h1>
                <p className="text-gray-700 mt-1 font-bold">View public officials and your recent contributions.</p>
            </div>

             {/* My Activity Metrics */}
             <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pl-6">My Activity Summary</h2>
                {myActivity ? (
                     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6'>
                        <MetricCard
                            title="Petitions Authored"
                            value={myActivity.petitionsAuthored}
                            iconClass="fa-solid fa-pen-to-square"
                            color="#f97316"
                        />
                        <MetricCard
                            title="Petitions Signed"
                            value={myActivity.petitionsSigned}
                            iconClass="fa-solid fa-signature"
                            color="#65a30d"
                        />
                        <MetricCard
                            title="Polls Created"
                            value={myActivity.pollsCreated}
                            iconClass="fa-solid fa-square-poll-horizontal"
                            color="#06b6d4"
                        />
                        <MetricCard
                            title="Polls Voted In"
                            value={myActivity.pollsVotedIn}
                            iconClass="fa-solid fa-check-to-slot"
                            color="#c026d3"
                        />
                    </div>
                 ) : (
                    <p className="text-gray-500 pl-6">Could not load activity metrics.</p>
                 )}
            </div>


            {/* Recent User Content */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">My Recent Content</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Petitions */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-700 border-b pb-2">Latest Petitions Created</h3>
                        {myPetitions.length > 0 ? (
                            myPetitions.map(petition => (
                                <PetitionComponent
                                    key={petition._id}
                                    petition={petition}
                                    user={user}
                                    token={token}
                                    handleSignPetition={handleSignPetition} // Pass relevant handlers
                                    // Add other handlers like handleDelete, handleEdit if needed
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">You haven't created any petitions recently.</p>
                        )}
                    </div>
                     {/* Recent Polls */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-700 border-b pb-2">Latest Polls Created</h3>
                         {myPolls.length > 0 ? (
                            myPolls.map(poll => (
                                <PollCard
                                    key={poll._id}
                                    poll={poll}
                                    user={user}
                                    handleVote={handleVote} // Pass relevant handlers
                                    handleDeletePoll={handleDeletePoll}
                                    handleEdit={handleEditPoll}
                                />
                            ))
                        ) : (
                             <p className="text-gray-500 text-sm">You haven't created any polls recently.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Officials List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Public Officials</h2>
                 {officials.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {officials.map((official) => (
                                    <tr key={official._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{official.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{official.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{official.location || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 ) : (
                     <p className="text-gray-500">No public officials found.</p>
                 )}
            </div>

             {/* Optional: Recent Community Activity Section */}
            {/*
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Community Activity</h2>
                {recentActivity.length > 0 ? (
                    <ul>
                        {recentActivity.map(activity => (
                             <li key={activity._id} className="text-sm text-gray-600 border-b py-2">
                                {activity.message} - <span className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</span>
                             </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No recent activity to display.</p>
                )}
            </div>
            */}
        </div>
    );
}

export default Officials;