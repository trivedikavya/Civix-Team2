// File: frontend/src/components/reports/Reports.jsx

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001') + '/api/reports';

// Custom Hook for fetching report data
// MODIFY: Remove myActivityData fetching and state
const useReportData = () => {
    const { token } = useAuth();
    const [communityData, setCommunityData] = useState(null);
    // const [myActivityData, setMyActivityData] = useState(null); // REMOVE
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch community report data
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

            // REMOVE My Activity Data Fetching logic

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

    // MODIFY: Return only communityData
    return { communityData, loading, error, refreshData: fetchData };
};

// Component to render a simple analytic card (used for metrics)
const MetricCard = ({ title, value, iconClass, color }) => (
    <div className="bg-white rounded-xl shadow-md p-3 flex flex-col justify-between border-l-4" style={{ borderColor: color }}>
        <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-gray-500">{title}</p>
            <i className={`${iconClass} text-xl`} style={{ color: color }}></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
    </div>
);


function Reports() {
    // MODIFY: Remove myActivityData
    const { communityData, loading, error, refreshData } = useReportData();
    // const [activeTab, setActiveTab] = useState('community'); // REMOVE state for tabs

    if (loading) {
        return <div className="pt-20 p-4 min-h-screen bg-gradient-to-b from-sky-200 to-gray-300 md:pl-54 text-center text-gray-700 font-bold">Loading Reports...</div>;
    }

    if (error) {
        return <div className="pt-20 p-4 min-h-screen bg-gradient-to-b from-sky-200 to-gray-300 md:pl-54 text-center text-red-600 font-bold">Error loading reports: {error}</div>;
    }

    // Community data remains the same
    const comm = communityData?.communityOverview;
    const petitionAnl = communityData?.petitionAnalytics;
    const pollAnl = communityData?.pollAnalytics;

    // Chart data setup remains the same
    const petitionStatusData = { /* ... */ };
    const petitionCategoryData = { /* ... */ };
    const pollStatusData = { /* ... */ };
    const pollLocationData = { /* ... */ };

    return (
        <div className="pt-20 p-4 bg-gradient-to-b from-sky-200 to-gray-300 min-h-screen md:pl-54">
            <div className='pl-6 pt-6'>
                {/* MODIFY Title if needed, e.g., Community Reports & Analytics */}
                <h1 className="text-3xl font-bold text-gray-800 font-inria">Community Reports & Analytics</h1>
                <p className="text-gray-700 mt-1 font-bold">Track community-wide civic engagement and impact.</p>
            </div>

            {/* Main Content Container */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">

                {/* REMOVE Tabs for Community vs My Activity */}
                {/*
                <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto mb-6">
                    <button>...</button>
                    <button>...</button>
                </div>
                */}

                {/* Content for Community Overview */}
                {/* MODIFY: Remove the check for activeTab */}
                {comm && (
                    <div className='space-y-6'>
                        {/* Overview Metrics */}
                         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
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
                                title="Total Users"
                                value={comm.totalUsers}
                                iconClass="fa-solid fa-users"
                                color="#f97316"
                            />
                        </div>

                        {/* Monthly Summary */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Monthly Summary</h2>
                             <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
                                <MetricCard
                                    title="Petitions This Month"
                                    value={comm.petitionsThisMonth}
                                    iconClass="fa-solid fa-calendar-plus"
                                    color="#06b6d4"
                                />
                                <MetricCard
                                    title="Polls This Month"
                                    value={comm.pollsThisMonth}
                                    iconClass="fa-solid fa-calendar-plus"
                                    color="#8b5cf6"
                                />
                            </div>
                        </div>

                        {/* Petition Analytics */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Petition Analytics</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className="bg-white p-4 rounded-xl shadow-md max-w-md mx-auto">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Petition Status</h3>
                                    <Doughnut data={petitionStatusData} />
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-md max-w-md mx-auto">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Petition Categories</h3>
                                    <Pie data={petitionCategoryData} />
                                </div>
                            </div>
                        </div>

                        {/* Poll Analytics */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Poll Analytics</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className="bg-white p-4 rounded-xl shadow-md max-w-md mx-auto">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Poll Status</h3>
                                    <Doughnut data={pollStatusData} />
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-md max-w-md mx-auto">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Polls by Location</h3>
                                    <Pie data={pollLocationData} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* REMOVE Content for My Activity */}

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