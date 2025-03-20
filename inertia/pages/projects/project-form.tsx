import { useForm, } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export default function ProjectForm({ 
    isOpen, 
    onClose, 
    initialData = {}, 
    mode = 'create', 
    data, 
    setData, 
    post, 
    put,
    processing,
    setProjects,
    projects,
    setIsPostOrPut
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    initialData: any, 
    mode: 'create' | 'edit', 
    data: any, 
    setData: any, 
    post: any, 
    put: any,
    processing: boolean,
    setProjects: any,
    projects: any,
    setIsPostOrPut: any,
}) {

  useEffect(() => {
    setData({
        name: initialData.name || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
    })
  }, [initialData])


  const isEditMode = mode === 'edit'
  const dialogTitle = isEditMode ? 'Edit Project' : 'New Project'
  const submitButtonText = isEditMode ? 'Update Project' : 'Create Project'

  const handleSubmit = (e) => {
    e.preventDefault()

    const newProject = {
        id: Date.now(),
        name: data.name,
        description: data.description,
        status: data.status,
        createdAt: new Date().toISOString(),
        updatedAt: null
    }

    setProjects([newProject, ...projects])


    if (isEditMode) {
      // Add your edit logic here (e.g., PUT request)
      put(`/projects/${initialData.id}`, {
        onSuccess: () => {
            setIsPostOrPut((prev) => prev + 1)
            onClose()},
      })
    } else {
      // Add your create logic here (e.g., POST request)
      post('/projects', {
        onSuccess: () => {            
            setIsPostOrPut((prev) => prev + 1)
            onClose()},
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <div className="bg-gradient-to-br from-[#252526] to-[#2D2D30] w-full max-w-md rounded-2xl 
                        border border-gray-700/50 shadow-[0_0_40px_rgba(59,130,246,0.15)] p-6 
                        relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_70%)]" />
            
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 
                         bg-clip-text text-transparent relative z-10">{dialogTitle}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200 tracking-wide">Title</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full bg-[#1A1A1C]/80 border border-gray-600/50 rounded-xl px-4 py-2.5 
                           text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 
                           focus:border-blue-500/50 transition-all duration-300 shadow-sm 
                           hover:bg-[#1A1A1C] backdrop-blur-sm"
                  placeholder="Project title"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200 tracking-wide">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full bg-[#1A1A1C]/80 border border-gray-600/50 rounded-xl px-4 py-2.5 
                           text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 
                           focus:border-blue-500/50 transition-all duration-300 shadow-sm 
                           hover:bg-[#1A1A1C] backdrop-blur-sm resize-none h-28"
                  placeholder="Project description"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200 tracking-wide">Status</label>
                <select
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value)}
                  className="w-full bg-[#1A1A1C]/80 border border-gray-600/50 rounded-xl px-4 py-2.5 
                           text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                           transition-all duration-300 shadow-sm hover:bg-[#1A1A1C] backdrop-blur-sm 
                           appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjN0E3QTdBIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTcuNDEgOC41N0wxMiAxMy4xNSA1Ni41NyA4LjU3IDEyIDE1LjQzIDE2LjU5IDguNTd6Ii8+PC9zdmc+')] 
                           bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px]"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
                           hover:to-blue-700 rounded-xl py-2.5 text-white font-medium 
                           transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.4)] 
                           hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                >
                  {submitButtonText}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl py-2.5 
                           text-gray-200 font-medium transition-all duration-300 shadow-sm 
                           hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
