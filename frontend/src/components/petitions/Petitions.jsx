// File: frontend/src/components/petitions/Petitions.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';

// --- Create Petition Modal Component ---
const CreatePetitionModal = ({ isOpen, onClose, onPetitionCreated }) => {
    const { token } = useAuth();
    const initialState = { title: '', description: '', category: '', signatureGoal: 100, location: '' };
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.title || !formData.description || !formData.category || !formData.location) {
            setError('Please fill out all required fields.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/petitions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Failed to create petition.');
            onPetitionCreated(data);
            setFormData(initialState);
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl font-light">&times;</button>
                <div className="flex items-center mb-4">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-3">
                        <i className="fa-solid fa-file-lines fa-lg"></i>
                    </div>
                    <h2 className="text-2xl font-bold ml-4">Create a New Petition</h2>
                </div>
                <p className="text-gray-600 mb-6">Use your voice to start a civic, specific, and actionable change in your community.</p>
                {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Petition Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Give your petition a clear, specific title" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                            <select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                                <option value="">Select Category</option>
                                <option value="Environment">Environment</option>
                                <option value="Infrastructure">Infrastructure</option>
                                <option value="Education">Education</option>
                                <option value="Public Safety">Public Safety</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="signatureGoal" className="block text-sm font-bold text-gray-700 mb-2">Signature Goal</label>
                            <input type="number" name="signatureGoal" id="signatureGoal" value={formData.signatureGoal} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., San Diego, CA" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="5" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Clearly explain the issue, why it matters, and what specific action you're requesting."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold transition duration-300">Submit Petition</button>
                </form>
            </div>
        </div>
    );
};

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
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [petitions, setPetitions] = useState([]);
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
            filtered = petitions.filter(p => p.signatures.includes(user._id));
        } else {
            filtered = petitions;
        }
        setFilteredPetitions(filtered);
    }, [activeTab, petitions, user]);


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

            <div className="p-4 sm:p-6 lg:p-8">
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
                            <select className="border border-gray-300 rounded-lg p-2 text-sm bg-white"><option>All Categories</option></select>
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
                            {filteredPetitions.map((petition) => {
                                if (!user) return null;
                                const isSigned = petition.signatures.includes(user._id);
                                const isAuthor = petition.author._id === user._id;
                                return (
                                <div key={petition._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{petition.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3">by {petition.author.name}</p>
                                        <p className="text-gray-600 mb-4 h-24 overflow-hidden text-ellipsis leading-relaxed">{petition.description}</p>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-700 mb-4">
                                            <span className="font-bold">{petition.signatures.length}</span> of {petition.signatureGoal} signatures
                                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                             <button onClick={() => viewDetails(petition)} className="text-blue-600 font-semibold hover:underline text-sm">View Details</button>
                                             {isSigned || isAuthor ? (
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${isAuthor ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-800'}`}>
                                                    {isAuthor ? 'Author' : 'Signed'}
                                                </span>
                                            ) : (
                                                <button onClick={() => handleSignPetition(petition._id)} className="bg-blue-100 text-blue-800 font-semibold px-4 py-1.5 rounded-md hover:bg-blue-200 text-sm">Sign</button>
                                             )}
                                        </div>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Petitions;