import { Head, Link } from '@inertiajs/react';
import Layout from './layout';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
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

  useEffect(() => {
    // If project was already passed as a prop, don't fetch
    if (initialProject) {
      return;
    }
    
    const fetchProject = async () => {
      try {
        setLoading(true);
        // Handle both string and number ids
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
          <div className="flex items-center mb-8">
            <Link href="/projects" className="text-blue-500 hover:text-blue-400 mr-4">
              ← Back to Projects
            </Link>
            <h1 className="text-4xl font-bold">{project.title}</h1>
          </div>
          
          <div className="bg-[#2C2C2E] p-6 rounded-xl">
            <div className="mb-6">
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                project.status === 'completed' ? 'bg-green-500' :
                project.status === 'in-progress' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                {project.status}
              </span>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-400 whitespace-pre-wrap">{project.description}</p>
            </div>
            
            <div className="flex space-x-4">
              <Link 
                href={`/projects/${project.id}/edit`} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
