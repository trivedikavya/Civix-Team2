import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';

const API_URL = 'http://localhost:5001/api/reports';

// Custom Hook for fetching report data
const useReportData = () => {
    const { token } = useAuth();
    const [communityData, setCommunityData] = useState(null);
    const [myActivityData, setMyActivityData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch both community and user activity reports
    const fetchData = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Fetch Community Data
            const communityResponse = await fetch(`${API_URL}/community`, {
                headers: { 'x-auth-token': token }
            });
            const communityJson = await communityResponse.json();
            if (communityResponse.ok) {
                setCommunityData(communityJson);
            } else {
                throw new Error(communityJson.msg || 'Failed to fetch community report.');
            }

            // Fetch My Activity Data
            const myActivityResponse = await fetch(`${API_URL}/my-activity`, {
                headers: { 'x-auth-token': token }
            });
            const myActivityJson = await myActivityResponse.json();
            if (myActivityResponse.ok) {
                setMyActivityData(myActivityJson);
            } else {
                throw new Error(myActivityJson.msg || 'Failed to fetch my activity report.');
            }

        } catch (err) {
            console.error("Report Fetch Error:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { communityData, myActivityData, loading, error, refreshData: fetchData };
};

// Component to render a simple analytic card (used for metrics)
const MetricCard = ({ title, value, iconClass, color }) => (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between border-l-4" style={{ borderColor: color }}>
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <i className={`${iconClass} text-2xl`} style={{ color: color }}></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mt-2">{value}</h2>
    </div>
);

// Component to render a breakdown list (used for charts/lists)
const BreakdownList = ({ title, data, className = '' }) => {
    const entries = Object.entries(data);
    if (entries.length === 0) return (
        <div className={`bg-white p-5 rounded-xl shadow-md ${className}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{title}</h3>
            <p className="text-gray-500 text-sm">No data available yet.</p>
        </div>
    );

    return (
        <div className={`bg-white p-5 rounded-xl shadow-md ${className}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{title}</h3>
            <div className="space-y-2">
                {entries.map(([key, count]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

function Reports() {
    const { communityData, myActivityData, loading, error, refreshData } = useReportData();
    const [activeTab, setActiveTab] = useState('community');

    if (loading) {
        return <div className="pt-20 p-4 min-h-screen bg-gradient-to-b from-sky-200 to-gray-300 md:pl-54 text-center text-gray-700 font-bold">Loading Reports...</div>;
    }

    if (error) {
        return <div className="pt-20 p-4 min-h-screen bg-gradient-to-b from-sky-200 to-gray-300 md:pl-54 text-center text-red-600 font-bold">Error loading reports: {error}</div>;
    }

    const comm = communityData?.communityOverview;
    const petitionAnl = communityData?.petitionAnalytics;
    const pollAnl = communityData?.pollAnalytics;
    
    return (
        <div className="pt-20 p-4 bg-gradient-to-b from-sky-200 to-gray-300 min-h-screen md:pl-54">
            <div className='pl-6 pt-6'>
                <h1 className="text-3xl font-bold text-gray-800 font-inria">Reports & Analytics</h1>
                <p className="text-gray-700 mt-1 font-bold">Track civic engagement and measure the impact of petitions and polls.</p>
            </div>
            
            {/* Main Content Container */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
                
                {/* Tabs for Community vs My Activity */}
                <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto mb-6">
                    <button 
                        onClick={() => setActiveTab('community')} 
                        className={`cursor-pointer py-2 px-4 rounded-md font-semibold text-sm flex-1 text-center ${activeTab === 'community' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-black'}`}>
                        Community Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('my')} 
                        className={`cursor-pointer py-2 px-4 rounded-md font-semibold text-sm flex-1 text-center ${activeTab === 'my' ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:text-black'}`}>
                        My Activity
                    </button>
                </div>
                
                {/* Content for Community Overview */}
                {activeTab === 'community' && comm && (
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                            <MetricCard 
                                title="Total Petitions" 
                                value={comm.totalPetitions} 
                                iconClass="fa-solid fa-file-lines" 
                                color="#3b82f6" 
                            />
                            <MetricCard 
                                title="Total Polls" 
                                value={comm.totalPolls} 
                                iconClass="fa-solid fa-square-poll-vertical" 
                                color="#10b981" 
                            />
                            <MetricCard 
                                title="Active Engagement" 
                                value={comm.activeEngagement} 
                                iconClass="fa-solid fa-fire" 
                                color="#ef4444" 
                            />
                             <MetricCard 
                                title="Total Users" 
                                value={comm.totalUsers} 
                                iconClass="fa-solid fa-users" 
                                color="#8b5cf6" 
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <BreakdownList 
                                title="Petition Status Breakdown" 
                                data={petitionAnl.status} 
                            />
                            <BreakdownList 
                                title="Petition Category Breakdown" 
                                data={petitionAnl.category} 
                            />
                            <BreakdownList 
                                title="Polls by Location" 
                                data={pollAnl.locations} 
                            />
                        </div>
                    </>
                )}

                {/* Content for My Activity */}
                {activeTab === 'my' && myActivityData && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                        <MetricCard 
                            title="Petitions Authored" 
                            value={myActivityData.petitionsAuthored} 
                            iconClass="fa-solid fa-pen-to-square" 
                            color="#f97316" 
                        />
                        <MetricCard 
                            title="Petitions Signed" 
                            value={myActivityData.petitionsSigned} 
                            iconClass="fa-solid fa-signature" 
                            color="#65a30d" 
                        />
                        <MetricCard 
                            title="Polls Created" 
                            value={myActivityData.pollsCreated} 
                            iconClass="fa-solid fa-square-poll-horizontal" 
                            color="#06b6d4" 
                        />
                        <MetricCard 
                            title="Polls Voted In" 
                            value={myActivityData.pollsVotedIn} 
                            iconClass="fa-solid fa-check-to-slot" 
                            color="#c026d3" 
                        />
                    </div>
                )}
                
                {/* Refresh Button */}
                <button 
                    onClick={refreshData}
                    className='mt-6 bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 text-sm transition duration-200'
                >
                    <i className="fa-solid fa-rotate-right mr-2"></i> Refresh Data
                </button>

            </div>
        </div>
    );
}

export default Reports;
