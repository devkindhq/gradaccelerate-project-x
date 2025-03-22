import { Head, useForm, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    status: 'pending'
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/projects');
  };

  return (
    <>
      <Head title="Create Project" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Link 
              href="/projects" 
              className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold">Create New Project</h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
            style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)" }}
          >
            <form onSubmit={submit}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  type="text"
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Enter project title"
                  className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Describe your project"
                  className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200"
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value)}
                  className="w-full px-4 py-3 bg-[#3A3A3C] text-white rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={processing}
                  className="bg-[#0A84FF] text-white px-6 py-3 rounded-lg hover:bg-[#0A74FF] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-2 focus:ring-offset-[#2C2C2E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {processing ? "Creating..." : "Create Project"}
                </motion.button>
                
                <Link
                  href="/projects"
                  className="bg-transparent hover:bg-[#3A3A3C] text-white px-6 py-3 rounded-lg border border-[#3A3A3C] transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  )
}