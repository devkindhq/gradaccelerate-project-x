import {Clock, Loader2, CheckCircle2, Pencil } from 'lucide-react' 
import { motion } from 'framer-motion'

export default function ProjectCard({ project, onEdit }) {
    const getStatusStyles = (status) => {
      switch (status) {
        case 'pending': return 'bg-yellow-500/20 text-yellow-500'
        case 'in-progress': return 'bg-blue-500/20 text-blue-500'
        case 'completed': return 'bg-green-500/20 text-green-500'
        default: return 'bg-gray-500/20 text-gray-500'
      }
    }
  
    const getStatusIcon = (status) => {
      switch (status) {
        case 'pending': return <Clock className="w-4 h-4" />
        case 'in-progress': return <Loader2 className="w-4 h-4 animate-spin" />
        case 'completed': return <CheckCircle2 className="w-4 h-4" />
        default: return null
      }
    }
  
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group relative bg-[#252526] p-5 rounded-xl border border-gray-800 
                  hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">{project.name}</h2>
          <button 
            onClick={() => onEdit(project)}
            className="p-1 hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        <p className="text-gray-400 text-sm mb-4">{project.description}</p>
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(project.status)}`}>
          {getStatusIcon(project.status)}
          {project.status}
        </span>
      </motion.div>
    )
}