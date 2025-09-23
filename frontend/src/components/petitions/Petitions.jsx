// File: frontend/src/components/petitions/Petitions.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { CreatePetitionModal } from './CreatePetitionModal';
import PetitionComponent from './PetitionComponent';


// --- Petition Details Modal Component ---
const PetitionDetailsModal = ({ isOpen, onClose, petition }) => {
    if (!isOpen || !petition) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl font-light">&times;</button>
                <h2 className="text-3xl font-bold mb-2">{petition.title}</h2>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-6 border-b pb-4">
                    <span>Created on: {new Date(petition.date).toLocaleDateString()}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-xs">Active</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{petition.description}</p>
            </div>
        </div>
    );
};


// --- Main Petitions Component ---
function Petitions() {
    // Dummy data for demonstration
    const dummy_petition = [
        {
            "_id": "25004620sdfs0sd5f",
            "author": {
                "_id": "user12345",
                "name": "John Doe",
            },
            "category": "Education",
            "title": "Primary School",
            "description": "We want a primary school in our village",
            "signatures": [
                { "_id": "0254120150" },
                { "_id": "65902450" }
            ],
            "signatureGoal": 100,
            "status" : "Active"
        },
        {
            "_id": "25004620s2dfs0sd5f",
            "author": {
                "_id": "68cb0008cdf2f43b1ebbaf97",
                "name": "abcdfg",
            },
            "category": "Healthcare",
            "title": "Village Health Center",
            "description": "A small health center is needed for basic medical care",
            "signatures": [
                { "_id": "987650124" },
                { "_id": "874510245" }
            ],
            "signatureGoal": 150,
            "status": "Active"
        },
        {
            "_id": "25004620s2dfs0sssd5f",
            "author": {
                "_id": "68cb00087",
                "name": "John Doe",
            },
            "category": "Infrastructure",
            "title": "Better Roads",
            "description": "Requesting repair and construction of village roads",
            "signatures": [
                { "_id": "78451203" },
                { "_id": "68cb0008cdf2f43b1ebbaf97" }
            ],
            "signatureGoal": 200,
            "status": "Active"
        },
        {
            "_id": "35004620xyz123sd5f",
            "author": {
                "_id": "user12345",
                "name": "John Doe",
            },
            "category": "Public Safety",
            "title": "Street Lights Installation",
            "description": "We need proper street lighting to reduce accidents and thefts",
            "signatures": [
                { "_id": "11002547" },
                { "_id": "68cb0008cdf2f43b1ebbaf97" },
                { "_id": "33004769" }
            ],
            "signatureGoal": 80,
            "status": "Closed"
        },
        {
            "_id": "45004620abc456sd5f",
            "author": {
                "_id": "user12345",
                "name": "John Doe",
            },
            "category": "Environment",
            "title": "Plant More Trees",
            "description": "Launch a tree plantation drive in the village for clean air",
            "signatures": [
                { "_id": "44001234" },
                { "_id": "55002345" }
            ],
            "signatureGoal": 300,
            "status": "Closed"
        }
    ];

    const categories = ['All Categories', 'Environment', 'Infrastructure', 'Education', 'Public Safety', 'Transportation', 'Healthcare', 'Housing'];
    const [selectedCategoriy, setSelectedCategori] = useState('All Categories');
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [petitions, setPetitions] = useState(dummy_petition || []);
    const [filteredPetitions, setFilteredPetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedPetition, setSelectedPetition] = useState(null);

    useEffect(() => {
        const fetchPetitions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/petitions');
                const data = await response.json();
                if (response.ok) setPetitions(data);
                else throw new Error('Failed to fetch petitions');
            } catch (error) {
                console.error("Fetch petitions error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPetitions();
    }, []);
    
    useEffect(() => {
        if (!user) return;
        let filtered = [];
        if (activeTab === 'my') {
            filtered = petitions.filter(p => p.author._id === user._id);
        } else if (activeTab === 'signed') {
            filtered = petitions.filter(p => p.signatures.some(sig => sig._id=== user._id));
        } else {
            filtered = petitions;
        }
        if (selectedCategoriy !== 'All Categories') {
            filtered = filtered.filter(p => p.category === selectedCategoriy);
        }
        setFilteredPetitions(filtered);
    }, [activeTab, petitions, user, selectedCategoriy]);


    const handleSignPetition = async (petitionId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/petitions/${petitionId}/sign`, {
                method: 'POST',
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
             if (!response.ok) throw new Error(data.msg || 'Failed to sign petition.');
            setPetitions(petitions.map(p => p._id === petitionId ? {...p, signatures: data} : p));
        } catch (error) {
            alert(error.message);
        }
    };

    const handleChangePetitionStatus = (petitionsId,status) => {
        // update petition status
    }

    const viewDetails = (petition) => {
        setSelectedPetition(petition);
        setDetailsModalOpen(true);
    };
    
    const handlePetitionCreated = (newPetition) => {
        const populatedPetition = { ...newPetition, author: { _id: user._id, name: user.name } };
        setPetitions(prev => [populatedPetition, ...prev]);
    };

    return (
        <>
            <CreatePetitionModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onPetitionCreated={handlePetitionCreated} />
            <PetitionDetailsModal isOpen={isDetailsModalOpen} onClose={() => setDetailsModalOpen(false)} petition={selectedPetition} />

            <div className="pt-20 p-4 bg-gradient-to-b from-sky-200 to-gray-300 min-h-screen md:pl-54">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Petitions</h1>
                            <p className="text-gray-500 mt-1">Browse, sign, and track petitions in your community.</p>
                        </div>
                        <button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-4 sm:mt-0 whitespace-nowrap">
                            + Create Petition
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                            <button onClick={() => setActiveTab('all')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'all' ? 'bg-white shadow' : 'text-gray-600'}`}>All Petitions</button>
                            <button onClick={() => setActiveTab('my')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'my' ? 'bg-white shadow' : 'text-gray-600'}`}>My Petitions</button>
                            <button onClick={() => setActiveTab('signed')} className={`py-2 px-4 rounded-md font-semibold text-sm ${activeTab === 'signed' ? 'bg-white shadow' : 'text-gray-600'}`}>Signed by Me</button>
                        </div>
                        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            <select className="border border-gray-300 rounded-lg p-2 text-sm bg-white"><option>All Locations</option></select>
                            <select className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                    value={selectedCategoriy}
                                    onChange={(e) => setSelectedCategori(e.target.value)}>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center py-10 text-gray-500">Loading petitions...</p>
                    ) : filteredPetitions.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
                            <p className="text-gray-500">No petitions found for this filter.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPetitions.map((petition) => 
                                <PetitionComponent key={petition._id} petition={petition} user={user} handleSignPetition={handleSignPetition} viewDetails={viewDetails} handleChangePetitionStatus={handleChangePetitionStatus} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Petitions;