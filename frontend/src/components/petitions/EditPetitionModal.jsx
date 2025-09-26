import { useState, useEffect } from "react";
import { useAuth } from '/src/context/AuthContext.jsx';

export const EditPetitionModal = ({ isOpen, onClose, onPetitionUpdated, petition }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({ title: '', description: '', category: '', signatureGoal: 100, location: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        // Pre-fill form when petition data is available
        if (petition) {
            setFormData({
                title: petition.title,
                description: petition.description,
                category: petition.category,
                signatureGoal: petition.signatureGoal,
                location: petition.location,
            });
        }
    }, [petition]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.title || !formData.description || !formData.category || !formData.location) {
            setError('Please fill out all required fields.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/petitions/${petition._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Failed to update petition.');
            onPetitionUpdated(data);
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
                        <i className="fa-solid fa-pencil fa-lg"></i>
                    </div>
                    <h2 className="text-2xl font-bold ml-4">Edit Your Petition</h2>
                </div>
                {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Petition Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
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
                            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="5" className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold transition duration-300">Save Changes</button>
                </form>
            </div>
        </div>
    );
};