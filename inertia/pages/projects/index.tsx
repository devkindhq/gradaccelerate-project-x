import { Head, Link, useForm } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, Edit2, Trash2, Plus, Clock, Calendar } from 'lucide-react'

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string | null;
}

interface PaginatedProjects {
  data: Project[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  }
}

export default function Index({ projects }: { projects: PaginatedProjects }) {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const { delete: deleteProject } = useForm();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDelete = (id: number) => {
    deleteProject(`/projects/${id}`);
    setConfirmDelete(null);
  };

  return (
    <>
      <Head title="Projects" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-7xl mx-auto p-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold">Projects</h1>
            </div>

            <Link 
              href="/projects/create"
              className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0A74FF] transition-colors duration-200"
            >
              <Plus size={18} />
              New Project
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {projects.data.length === 0 ? (
              <div className="bg-[#2C2C2E] rounded-xl p-8 text-center">
                <p className="text-lg text-gray-400">No projects found. Create your first project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {projects.data.map((project) => (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-[#2C2C2E] rounded-xl overflow-hidden border border-[#3A3A3C] hover:border-[#4A4A4C] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <div className={`h-2 w-full ${getStatusColor(project.status)}`}></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <Link href={`/projects/${project.id}`} className="text-xl font-medium hover:text-[#0A84FF] transition-colors line-clamp-1">
                            {project.title}
                          </Link>
                          <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(project.status)} text-white capitalize`}>
                            {project.status.replace('-', ' ')}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 mb-6 line-clamp-3 text-sm">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center text-xs text-gray-400 mb-6">
                          <Calendar size={14} className="mr-1" />
                          <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                          {project.updatedAt && (
                            <span className="ml-4 flex items-center">
                              <Clock size={14} className="mr-1" /> 
                              Updated: {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-2 border-t border-[#3A3A3C]">
                          <Link 
                            href={`/projects/${project.id}`}
                            className="px-3 py-1.5 bg-[#3A3A3C]/50 hover:bg-[#3A3A3C] rounded-md transition-colors text-sm"
                          >
                            View
                          </Link>
                          <Link 
                            href={`/projects/${project.id}/edit`}
                            className="p-1.5 hover:bg-[#3C3C3E] rounded transition-colors text-gray-300 hover:text-white"
                          >
                            <Edit2 size={16} />
                          </Link>
                          {confirmDelete === project.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(project.id)}
                                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-md transition-colors text-red-500 hover:text-red-400 text-sm"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-3 py-1.5 bg-[#3A3A3C]/50 hover:bg-[#3A3A3C] rounded-md transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(project.id)}
                              className="p-1.5 hover:bg-[#3C3C3E] rounded transition-colors text-gray-300 hover:text-white"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination controls */}
            {projects.meta.last_page > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  {Array.from({ length: projects.meta.last_page }, (_, i) => i + 1).map((page) => (
                    <Link
                      key={page}
                      href={`/projects?page=${page}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        page === projects.meta.current_page
                          ? 'bg-[#0A84FF] text-white'
                          : 'bg-[#2C2C2E] text-gray-300 hover:bg-[#3A3A3C]'
                      }`}
                    >
                      {page}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  )
}