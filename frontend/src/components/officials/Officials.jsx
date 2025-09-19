import { useState, useEffect } from 'react';

function Officials() {
    const [officials, setOfficials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOfficials = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/officials');
                const data = await response.json();
                setOfficials(data);
            } catch (error) {
                console.error("Failed to fetch officials:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOfficials();
    }, []);

    if (loading) return <p className="text-center pt-24">Loading officials...</p>;

    return (
        <div className="pt-20 md:ml-64 p-4 md:px-10 lg:px-20 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Public Officials</h1>
            {officials.length === 0 ? (
                <p>No officials found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {officials.map(official => (
                        <div key={official._id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800">{official.name}</h2>
                            <p className="text-gray-600">{official.email}</p>
                            <p className="text-sm text-gray-500 mt-2">Location: {official.location || 'Not specified'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Officials;