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

interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  previous_page_url: string | null;
}

export default function ProjectsIndex() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Load projects on initial render and when page changes
  useEffect(() => {
    fetchProjects();
  }, [page]);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Request 9 projects per page
      const response = await axios.get(`/api/projects?page=${page}&limit=9`);
      
      // The response should contain data and meta for pagination
      if (response.data && response.data.data) {
        setProjects(response.data.data);
        setMeta(response.data.meta);
      } else {
        setProjects([]);
        setMeta(null);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Please try again.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDelete = (id: number) => {
    setDeleteConfirm(id);
  };
  
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };
  
  const handleDelete = async (id: number) => {
    try {
      setDeleteLoading(true);
      
      // Call the API to delete the project
      await axios.delete(`/api/projects/${id}`);
      
      // Remove the project from the UI
      setProjects(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
      
      // Refresh the list if we potentially deleted the last item on a page
      if (projects.length === 1 && meta && meta.current_page > 1) {
        setPage(meta.current_page - 1);
      } else {
        fetchProjects();
      }
    } catch (err) {
      setError('Failed to delete project. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };
  
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
  
  return (
    <Layout>
      <Head title="Projects" />
      <div className="min-h-screen bg-[#1C1C1E] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Projects</h1>
            <Link
              href="/projects/create"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create Project
            </Link>
          </div>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 p-4 rounded-md mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#2C2C2E] p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
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
          
          {loading ? (
            <div className="text-center py-8">
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-[#2C2C2E] border border-[#3C3C3E] rounded-md p-8 text-center">
              <p className="text-gray-400">No projects found. Create your first project to get started!</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div 
                    key={project.id} 
                    className="bg-[#2C2C2E] border border-[#3C3C3E] rounded-md overflow-hidden hover:border-[#5C5C5E] transition-colors"
                  >
                    <div className="p-5">
                      <h2 className="text-xl font-semibold mb-2 text-white">
                        {project.title}
                      </h2>
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span 
                          className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(project.status)}`}
                        >
                          {project.status.replace('-', ' ')}
                        </span>
                        <div className="flex space-x-2">
                          <Link
                            href={`/projects/${project.id}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View
                          </Link>
                          <Link
                            href={`/projects/${project.id}/edit`}
                            className="text-green-400 hover:text-green-300"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => confirmDelete(project.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Always show pagination controls regardless of meta data */}
              <div className="flex justify-center space-x-4 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={!meta || meta.current_page <= 1}
                  className="px-4 py-2 bg-[#3C3C3E] rounded-md hover:bg-[#4C4C4E] disabled:opacity-50"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 bg-[#2C2C2E] rounded-md">
                  Page {meta?.current_page || 1} of {meta?.last_page || 1}
                  <span className="ml-2 text-sm text-gray-400">
                    (Total: {meta?.total || 0})
                  </span>
                </span>
                
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!meta || meta.current_page >= meta.last_page}
                  className="px-4 py-2 bg-[#3C3C3E] rounded-md hover:bg-[#4C4C4E] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}