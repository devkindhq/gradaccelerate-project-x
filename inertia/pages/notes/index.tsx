import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Head, Link } from '@inertiajs/react'
import { PlusIcon, XIcon, ArrowLeft } from 'lucide-react'
import NoteCard from './note-card'
import NoteForm from './note-form'
import ViewSwitcher from './view-switcher'

interface Note {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string | null
  pinned: boolean
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [order, setOrder] = useState<string>('desc')
  const [formData, setFormData] = useState({ title: '', content: '', pinned: false })
  const [processing, setProcessing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(false)

  // Fetch notes with current sorting
  const fetchNotes = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/notes?sort_by=${sortBy}&order=${order}`)
      setNotes(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching notes:', err)
      setError('Failed to load notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Initial load and when sort params change
  useEffect(() => {
    fetchNotes()
  }, [sortBy, order])

  // Handle form input change
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle form submission - creates new note or updates existing one
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) return
    
    setProcessing(true)
    try {
      if (isEditing && editingNoteId) {
        // Update existing note
        await axios.put(`/api/notes/${editingNoteId}`, formData)
        resetForm()
      } else {
        // Create new note
        await axios.post('/api/notes', formData)
        resetForm()
      }
      fetchNotes() // Refresh notes list
      setIsFormVisible(false)
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} note. Please try again.`)
    } finally {
      setProcessing(false)
    }
  }

  // Reset form and editing state
  const resetForm = () => {
    setFormData({ title: '', content: '', pinned: false })
    setIsEditing(false)
    setEditingNoteId(null)
  }

  // Handle keyboard shortcuts for submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      // Toggle order if clicking the same field
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to descending
      setSortBy(field)
      setOrder('desc')
    }
  }

  // Delete a note
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/notes/${id}`)
      setNotes(notes.filter(note => note.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setError('Failed to delete note. Please try again.')
    }
  }

  // Edit a note - populate form with note data
  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      pinned: note.pinned
    })
    setIsEditing(true)
    setEditingNoteId(note.id)
    setIsFormVisible(true)
  }

  // Toggle a note's pinned status
  const handleTogglePin = async (id: number) => {
    try {
      const response = await axios.patch(`/api/notes/${id}/toggle-pin`)
      const updatedNote = response.data
      
      // Update the notes list with the updated note
      setNotes(notes.map(note => 
        note.id === id ? updatedNote : note
      ))
    } catch (err) {
      setError('Failed to update note pin status. Please try again.')
    }
  }

  return (
    <>
      <Head title="Notes" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
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
              <svg width="32" height="32" viewBox="0 0 188 354" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <path d="M69.8447 1.82232C87.701 1.82232 109.843 1.2517 127.692 0.933476L166.846 0.247858C173.654 0.163964 180.756 -0.346625 187.5 0.401914C187.471 2.1514 186.276 3.12195 185.245 4.48958C168.635 31.5433 149.663 57.6453 131.887 83.9635C125.465 93.4754 118.291 102.926 112.571 112.87C113.996 113.818 115.199 113.894 116.845 114.129C122.086 112.258 175.336 112.98 184.257 113.504L173.06 128.764L111.361 210.908C106.357 217.569 96.2051 233.408 90.8141 238.123L85.6237 245.276C83.254 248.378 80.963 251.857 78.2354 254.634C61.9276 278.442 50.5433 291.46 35.244 316.629C28.7568 325.064 14.7477 348.616 5.72741 353.296C4.47767 353.945 1.80906 352.966 1.00125 351.988C-0.241596 350.484 -0.126339 348.336 0.278159 346.542C0.978659 343.451 2.42368 340.794 3.49196 337.842C22.6108 284.507 44.2408 230.055 66.8593 178.063C59.7859 178.032 52.7126 177.961 45.6392 177.849C33.2465 178.311 20.7107 177.936 8.29798 177.937C11.1224 153.688 60.4958 26.7594 69.8447 1.82232Z" fill="url(#paint0_linear_99_30)"/>
                <defs>
                  <linearGradient id="paint0_linear_99_30" x1="-135.668" y1="210.459" x2="25.2897" y2="30.4275" gradientUnits="userSpaceOnUse">
                    <stop offset="0.035" stopColor="#FFB30F"/>
                    <stop offset="0.505" stopColor="#FFBA06"/>
                    <stop offset="1" stopColor="#D73E47"/>
                  </linearGradient>
                </defs>
              </svg>
              <h1 className="text-3xl font-bold">Notes</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => handleSortChange('created_at')}
                  className={`text-sm px-2 py-1 rounded ${
                    sortBy === 'created_at' 
                      ? 'bg-[#0A84FF] text-white' 
                      : 'bg-[#3A3A3C] text-[#98989D]'
                  }`}
                >
                  Date {sortBy === 'created_at' && (order === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => handleSortChange('title')}
                  className={`text-sm px-2 py-1 rounded ${
                    sortBy === 'title' 
                      ? 'bg-[#0A84FF] text-white' 
                      : 'bg-[#3A3A3C] text-[#98989D]'
                  }`}
                >
                  Title {sortBy === 'title' && (order === 'desc' ? '↓' : '↑')}
                </button>
              </div>
              <ViewSwitcher currentView={viewType} onChange={setViewType} />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="bg-[#0A84FF] text-white p-3 rounded-full shadow-lg hover:bg-[#0A74FF] transition-colors duration-200"
              >
                {isFormVisible ? <XIcon size={20} /> : <PlusIcon size={20} />}
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {isFormVisible && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: 'auto'
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  height: 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <NoteForm
                  data={formData}
                  setData={handleInputChange}
                  submit={handleSubmit}
                  processing={processing}
                  handleKeyDown={handleKeyDown}
                  isEditing={isEditing}
                  cancelEdit={isEditing ? resetForm : undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A84FF]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg">
              {error}
            </div>
          ) : notes.length === 0 ? (
            <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">No notes yet</h3>
              <p className="text-[#98989D] mb-4">Create your first note to get started</p>
            </div>
          ) : (
            <motion.div 
              className={viewType === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 gap-4" 
                : "flex flex-col gap-3"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence>
                {notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={viewType === 'list' ? 'w-full' : 'group relative'}
                  >
                    <NoteCard 
                      note={note} 
                      viewType={viewType} 
                      onDelete={() => setDeleteConfirm(note.id)}
                      onEdit={() => handleEdit(note)}
                      onTogglePin={() => handleTogglePin(note.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            className="bg-[#2C2C2E] p-6 rounded-xl max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2">Delete Note</h3>
            <p className="text-[#98989D] mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-[#3A3A3C] text-white px-4 py-2 rounded-lg hover:bg-[#4A4A4C]"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}