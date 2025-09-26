// File: frontend/src/components/polls/CreatePollModal.jsx
import { useState } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';

export const CreatePollModal = ({ isOpen, onClose, onPollCreated }) => {
  const { token, user } = useAuth();
  const initialState = { question: '', description: '', options: ['', ''] };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleOptionChange = (i, value) => {
    const newOptions = [...formData.options];
    newOptions[i] = value;
    setFormData({ ...formData, options: newOptions });
  };
  const addOption = () => formData.options.length < 5 && setFormData({ ...formData, options: [...formData.options, ''] });
  const removeOption = i => formData.options.length > 2 && setFormData({ ...formData, options: formData.options.filter((_, idx) => idx !== i) });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!formData.question || formData.options.some(opt => !opt.trim())) return setError('Question and all options are required.');
    try {
      const res = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ ...formData, options: formData.options.filter(o => o.trim()) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to create poll.');
      onPollCreated({ ...data, author: { _id: user._id, name: user.name } });
      setFormData(initialState);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl font-light">&times;</button>
        <h2 className="text-2xl font-bold mb-4">Create a New Poll</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="question" placeholder="Poll Question" value={formData.question} onChange={handleChange} className="w-full p-3 border rounded mb-4" />
          {formData.options.map((opt, i) => (
            <div key={i} className="flex mb-2">
              <input type="text" value={opt} onChange={e => handleOptionChange(i, e.target.value)} className="w-full p-3 border rounded" placeholder={`Option ${i + 1}`} />
              {formData.options.length > 2 && <button type="button" onClick={() => removeOption(i)} className="ml-2 text-red-500">&times;</button>}
            </div>
          ))}
          {formData.options.length < 5 && <button type="button" onClick={addOption} className="text-blue-600 text-sm mb-4">+ Add Option</button>}
          <textarea name="description" placeholder="Description (optional)" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded mb-4"></textarea>
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">Create Poll</button>
        </form>
      </div>
    </div>
  );
};
