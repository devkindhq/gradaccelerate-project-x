import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Loader2 } from 'lucide-react'
import axios from 'axios'

interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  labels: string | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

interface CreateTodoFormProps {
  onClose: () => void
  onTodoCreated: (todo: Todo) => void
}

export default function CreateTodoForm({ onClose, onTodoCreated }: CreateTodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [labels, setLabels] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    try {
      setIsSubmitting(true)
      const response = await axios.post('/api/todos', {
        title,
        description: description || null,
        completed: false,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        labels: labels || null
      })
      
      onTodoCreated(response.data)
      
    } catch (error) {
      console.error('Error creating todo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6 bg-[#2C2C2E] rounded-lg p-4 shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Create New Todo</h2>
        <button 
          onClick={onClose}
          className="p-1.5 text-[#98989D] hover:text-white hover:bg-[#3A3A3C] rounded-md transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full bg-[#3A3A3C] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${
              errors.title ? 'border border-[#FF453A]' : ''
            }`}
            placeholder="Todo title *"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-[#FF453A]">{errors.title}</p>
          )}
        </div>
        
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#3A3A3C] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF] min-h-[100px]"
            placeholder="Description (optional)"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm text-[#98989D] mb-1">Due Date (optional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#3A3A3C] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>
          
          <div className="w-full sm:w-1/2">
            <label className="block text-sm text-[#98989D] mb-1">Labels (comma separated)</label>
            <input
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              className="w-full bg-[#3A3A3C] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              placeholder="e.g. work, urgent, personal"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#3A3A3C] hover:bg-[#48484A] rounded-md transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0A84FF] hover:bg-[#007AFF] rounded-md transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Todo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
