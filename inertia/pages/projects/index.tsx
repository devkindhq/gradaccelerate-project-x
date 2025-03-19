import { Head, Link } from '@inertiajs/react';
import Layout from './layout';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | string;
}

export default function ProjectsIndex() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/projects');
        setProjects(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Layout>
      <Head title="Projects" />
      <div className="min-h-screen bg-[#1C1C1E] text-white p-6">
        <div className="max-w-4xl mx-auto">
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
          
          {loading ? (
            <div className="bg-[#2C2C2E] p-6 rounded-xl text-center">
              <p className="text-gray-400">Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-[#2C2C2E] p-6 rounded-xl">
                  <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      project.status === 'completed' ? 'bg-green-500' :
                      project.status === 'in-progress' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {project.status}
                    </span>
                    <div className="space-x-4">
                      <Link href={`/projects/${project.id}`} className="text-blue-500 hover:text-blue-400">
                        View
                      </Link>
                      <Link href={`/projects/${project.id}/edit`} className="text-blue-500 hover:text-blue-400">
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#2C2C2E] p-6 rounded-xl text-center">
              <p className="text-gray-400">No projects found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}