import { Head, Link } from '@inertiajs/react';
import Layout from './layout';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ShowProps {
  project?: Project;
  params?: {
    id: string | number;
  };
}

export default function ProjectShow({ project: initialProject, params }: ShowProps) {
  const [project, setProject] = useState<Project | null>(initialProject || null);
  const [loading, setLoading] = useState(!initialProject);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // If project was already passed as a prop, don't fetch
    if (initialProject) {
      return;
    }
    
    const fetchProject = async () => {
      try {
        setLoading(true);
        const projectId = params?.id ? params.id : '';
        const response = await axios.get(`/api/projects/${projectId}`);
        setProject(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError('Failed to load project. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchProject();
    }
  }, [params?.id, initialProject]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500';
      case 'in-progress':
        return 'bg-blue-500 bg-opacity-20 text-blue-400 border-blue-500';
      case 'completed':
        return 'bg-green-500 bg-opacity-20 text-green-400 border-green-500';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400 border-gray-500';
    }
  };
  
  const confirmDelete = () => {
    setDeleteConfirm(true);
  };
  
  const cancelDelete = () => {
    setDeleteConfirm(false);
  };
  
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      
      if (!project) throw new Error('Project not found');
      
      await axios.delete(`/api/projects/${project.id}`);
      
      // Navigate to the projects list after successful deletion
      window.location.href = '/projects';
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError('Failed to delete project. Please try again.');
      setDeleteLoading(false);
      setDeleteConfirm(false);
    }
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

  if (error || !project) {
    return (
      <Layout>
        <Head title="Error" />
        <div className="min-h-screen bg-[#1C1C1E] text-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500 bg-opacity-20 border border-red-500 p-4 rounded-md">
              <p className="text-red-400">{error || 'Project not found'}</p>
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
      <Head title={project.title} />
      <div className="min-h-screen bg-[#1C1C1E] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/projects" className="text-blue-500 hover:text-blue-400">
              ← Back to Projects
            </Link>
          </div>
          
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#2C2C2E] p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-[#2C2C2E] border border-[#3C3C3E] rounded-md p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-300 whitespace-pre-line">{project.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-gray-400">
              <div>
                <p>Created: {new Date(project.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p>Last Updated: {new Date(project.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Link
                href={`/projects/${project.id}/edit`}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit Project
              </Link>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
