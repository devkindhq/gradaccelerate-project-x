import { Head, Link } from '@inertiajs/react';
import Layout from './layout';
import { useState } from 'react';
import axios from 'axios';

export default function ProjectCreate() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Explicitly log the API endpoint and request payload for debugging
      console.log('Creating project with data:', formData);
      console.log('API endpoint:', '/api/projects');
      
      // Make sure we're sending a POST request to the correct API endpoint
      const response = await axios.post('/api/projects', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Project created successfully:', response.data);
      
      // Navigate to the projects page after successful creation
      window.location.href = '/projects';
    } catch (err) {
      console.error('Failed to create project:', err);
      // Provide more detailed error information
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(`Failed to create project: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head title="Create Project" />
      <div className="min-h-screen bg-[#1C1C1E] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Create Project</h1>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 p-4 rounded-md mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full bg-[#2C2C2E] border border-[#3C3C3E] rounded-md p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full bg-[#2C2C2E] border border-[#3C3C3E] rounded-md p-2 text-white"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full bg-[#2C2C2E] border border-[#3C3C3E] rounded-md p-2 text-white"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <Link
                href="/projects"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
