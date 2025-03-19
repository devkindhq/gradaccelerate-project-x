import { Head, Link, usePage } from '@inertiajs/react';
import Layout from './layout';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function ProjectEdit() {
  const { id } = usePage().props.params as { id: string };
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/projects/${id}`);
        setProject(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          status: response.data.status
        });
        setError(null);
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError('Failed to load project. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(`/api/projects/${id}`, formData);
      window.location.href = '/projects';
    } catch (err) {
      console.error('Failed to update project:', err);
      setError('Failed to update project. Please try again.');
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <Layout>
        <Head title="Loading Project..." />
        <div className="min-h-screen bg-[#1C1C1E] text-white p-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-center">Loading project...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !project) {
    return (
      <Layout>
        <Head title="Error" />
        <div className="min-h-screen bg-[#1C1C1E] text-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500 bg-opacity-20 border border-red-500 p-4 rounded-md">
              <p className="text-red-400">{error}</p>
            </div>
            <div className="mt-4">
              <Link href="/projects" className="text-blue-500 hover:text-blue-400">
                ← Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head title="Edit Project" />
      <div className="min-h-screen bg-[#1C1C1E] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Edit Project</h1>
          
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
                disabled={saving}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
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