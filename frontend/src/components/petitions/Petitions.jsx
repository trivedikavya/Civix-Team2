import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Petitions() {
    const [petitions, setPetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, user } = useAuth();

    const fetchPetitions = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/petitions');
            const data = await response.json();
            setPetitions(data);
        } catch (error) {
            console.error("Failed to fetch petitions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPetitions();
    }, []);

    const handleSign = async (petitionId) => {
        if (!token) {
            alert('You must be logged in to sign a petition.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/petitions/${petitionId}/sign`, {
                method: 'POST',
                headers: { 'x-auth-token': token },
            });

            if(response.ok) {
                alert('Petition signed successfully!');
                fetchPetitions(); // Refresh petitions to show new signature count
            } else {
                const data = await response.json();
                alert(data.msg || "Failed to sign petition.");
            }

        } catch (error) {
             console.error('Error signing petition:', error);
        }
    };

    if (loading) return <p className="text-center pt-24">Loading petitions...</p>;

    return (
        <div className="pt-24 p-4 md:px-10 lg:px-20 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Petitions</h1>
                <Link to="/petitions/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Petition
                </Link>
            </div>

            {petitions.length === 0 ? (
                 <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">No petitions have been created yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {petitions.map((petition) => (
                        <div key={petition._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                            <div>
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                                    {petition.category}
                                </span>
                                <h2 className="text-xl font-bold mt-2 mb-2">{petition.title}</h2>
                                <p className="text-gray-600 mb-4 h-24 overflow-hidden text-ellipsis">{petition.description}</p>
                            </div>
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                    <div 
                                        className="bg-blue-600 h-2.5 rounded-full" 
                                        style={{ width: `${(petition.signatures.length / petition.signatureGoal) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm font-semibold text-gray-700 mb-4">
                                    {petition.signatures.length} / {petition.signatureGoal} signatures
                                </div>
                                <button
                                    onClick={() => handleSign(petition._id)}
                                    disabled={petition.signatures.includes(user?._id)}
                                    className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 hover:bg-green-600"
                                >
                                    {petition.signatures.includes(user?._id) ? 'Signed' : 'Sign Petition'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Petitions;