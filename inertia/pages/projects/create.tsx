import { Head, Link } from '@inertiajs/react';
import Layout from './layout';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProjectCreate() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Add CSRF token setup
  useEffect(() => {
    // Get CSRF token from meta tag - AdonisJS typically sets this
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Clear detailed debugging
      console.log('Sending project data:', formData);
      
      // Make sure the data structure matches what the controller expects
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status
      };
      
      const response = await axios.post('/api/projects', projectData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      console.log('Server response:', response);
      
      // Navigate to the projects page on success
      if (response.data && response.status >= 200 && response.status < 300) {
        console.log('Project created successfully:', response.data);
        window.location.href = '/projects';
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Failed to create project:', err);
      
      // More detailed error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', err.response.data);
        console.error('Error status:', err.response.status);
        
        const errorMessage = err.response.data?.error || 
                            err.response.data?.message || 
                            `Error ${err.response.status}: ${err.response.statusText}`;
        setError(`Failed to create project: ${errorMessage}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('Failed to create project: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Failed to create project: ${err.message}`);
      }
    } finally {
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
              />
              {fieldErrors.title && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full bg-[#2C2C2E] border border-[#3C3C3E] rounded-md p-2 text-white"
                rows={4}
              />
              {fieldErrors.description && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.description}</p>
              )}
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
              {fieldErrors.status && (
                <p className="text-red-400 text-sm mt-1">{fieldErrors.status}</p>
              )}
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
