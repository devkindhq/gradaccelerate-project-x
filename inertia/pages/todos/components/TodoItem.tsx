import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Trash2, Edit2, Calendar, X, Save } from 'lucide-react'
import axios from 'axios'
import { DateTime } from 'luxon'

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

interface TodoItemProps {
  todo: Todo
  onDelete: (id: number) => void
  onToggleComplete: (id: number, currentStatus: boolean) => void
  onUpdate: (updatedTodo: Todo) => void
}

export default function TodoItem({ todo, onDelete, onToggleComplete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(todo.title)
  const [editedDescription, setEditedDescription] = useState(todo.description || '')
  const [editedDueDate, setEditedDueDate] = useState(todo.dueDate ? 
    DateTime.fromISO(todo.dueDate).toFormat('yyyy-MM-dd') : '')
  const [editedLabels, setEditedLabels] = useState(todo.labels || '')

  const formattedDueDate = todo.dueDate ? 
    DateTime.fromISO(todo.dueDate).toFormat('MMM dd, yyyy') : 'No due date'

  const isOverdue = todo.dueDate && !todo.completed ? 
    DateTime.fromISO(todo.dueDate) < DateTime.now() : false

  const labels = todo.labels ? todo.labels.split(',') : []

  const handleSave = async () => {
    try {
      const updatedTodo = {
        ...todo,
        title: editedTitle,
        description: editedDescription || null,
        dueDate: editedDueDate ? new Date(editedDueDate).toISOString() : null,
        labels: editedLabels
      }
      
      const response = await axios.put(`/api/todos/${todo.id}`, updatedTodo)
      onUpdate(response.data)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-[#2C2C2E] rounded-lg p-4 shadow-md ${todo.completed ? 'opacity-75' : ''}`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-[#3A3A3C] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            placeholder="Title"
          />
          
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full bg-[#3A3A3C] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF] min-h-[80px]"
            placeholder="Description (optional)"
          />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm text-[#98989D] mb-1">Due Date</label>
              <input
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
                className="w-full bg-[#3A3A3C] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
            
            <div className="w-full sm:w-1/2">
              <label className="block text-sm text-[#98989D] mb-1">Labels (comma separated)</label>
              <input
                type="text"
                value={editedLabels}
                onChange={(e) => setEditedLabels(e.target.value)}
                className="w-full bg-[#3A3A3C] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                placeholder="e.g. work, urgent, personal"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 bg-[#3A3A3C] hover:bg-[#48484A] px-3 py-1.5 rounded-md transition-colors"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-[#0A84FF] hover:bg-[#007AFF] px-3 py-1.5 rounded-md transition-colors"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleComplete(todo.id, todo.completed)}
              className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full border ${
                todo.completed 
                  ? 'bg-[#30D158] border-[#30D158] text-white' 
                  : 'border-[#98989D] hover:border-white'
              } flex items-center justify-center`}
            >
              {todo.completed && <Check size={12} />}
            </button>
            
            <div className="flex-grow">
              <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-[#98989D]' : 'text-white'}`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`mt-1 text-sm ${todo.completed ? 'text-[#98989D]' : 'text-[#EBEBF5]'}`}>
                  {todo.description}
                </p>
              )}
              
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {todo.dueDate && (
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                    isOverdue && !todo.completed ? 'bg-[#FF453A]/20 text-[#FF453A]' : 'bg-[#3A3A3C] text-[#98989D]'
                  }`}>
                    <Calendar size={12} />
                    {formattedDueDate}
                  </span>
                )}
                
                {labels.map((label, index) => (
                  <span key={index} className="bg-[#3A3A3C] text-[#98989D] text-xs px-2 py-1 rounded-md">
                    {label.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-[#98989D] hover:text-white hover:bg-[#3A3A3C] rounded-md transition-colors"
              >
                <Edit2 size={16} />
              </button>
              
              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-[#98989D] hover:text-[#FF453A] hover:bg-[#3A3A3C] rounded-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
