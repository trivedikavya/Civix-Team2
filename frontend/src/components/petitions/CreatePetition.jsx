import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CreatePetition() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        signatureGoal: 100,
        location: ''
    });

    const { title, description, category, signatureGoal, location } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/petitions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                navigate('/petitions');
            } else {
                const data = await response.json();
                alert(data.msg || 'Failed to create petition');
            }
        } catch (error) {
            console.error('Error creating petition:', error);
            alert('Server error');
        }
    };

    return (
        <div className="pt-20 md:ml-64 p-4 md:px-10 lg:px-20 bg-gray-100 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Create a New Petition</h1>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Petition Title</label>
                        <input type="text" name="title" value={title} onChange={onChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
                        <textarea name="description" value={description} onChange={onChange} required rows="5" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Category</label>
                        <input type="text" name="category" value={category} onChange={onChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                     <div className="mb-4">
                        <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Target Location (e.g., San Diego, CA)</label>
                        <input type="text" name="location" value={location} onChange={onChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="signatureGoal" className="block text-gray-700 font-bold mb-2">Signature Goal</label>
                        <input type="number" name="signatureGoal" value={signatureGoal} onChange={onChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                        Submit Petition
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreatePetition;