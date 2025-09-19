import { useState, useEffect } from 'react';
// We need to create the api service file next if it doesn't exist
// For now, let's assume it does.

const getPetitions = async () => {
    const response = await fetch('http://localhost:5000/api/petitions');
    if (!response.ok) {
        throw new Error('Failed to fetch petitions');
    }
    return response.json();
};


function Petitions() {
    const [petitions, setPetitions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPetitions = async () => {
            try {
                const data = await getPetitions();
                setPetitions(data);
            } catch (error) {
                console.error("Failed to fetch petitions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPetitions();
    }, []);

    if (loading) return <p className="text-center pt-24">Loading petitions...</p>;

    return (
        <div className="pt-24 p-4 md:px-10 lg:px-40 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Petitions</h1>
                {/* We will add a "Create Petition" button here later */}
            </div>

            {petitions.length === 0 ? (
                 <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">No petitions have been created yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {petitions.map((petition) => (
                        <div key={petition._id} className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
                            <div>
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                                    {petition.category}
                                </span>
                                <h2 className="text-xl font-bold mt-2 mb-2">{petition.title}</h2>
                                <p className="text-gray-600 mb-4 h-20 overflow-hidden text-ellipsis">{petition.description}</p>
                            </div>
                            <div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                    <div 
                                        className="bg-blue-600 h-2.5 rounded-full" 
                                        style={{ width: `${(petition.signatures.length / petition.signatureGoal) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm font-semibold text-gray-700">
                                    {petition.signatures.length} / {petition.signatureGoal} signatures
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Petitions;