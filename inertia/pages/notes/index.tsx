import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import NoteCard from './note-card'
import NoteForm from './note-form'

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
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [processing, setProcessing] = useState(false)

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
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) return
    
    setProcessing(true)
    try {
      await axios.post('/api/notes', formData)
      setFormData({ title: '', content: '' })
      fetchNotes() // Refresh notes list
    } catch (err) {
      setError('Failed to create note. Please try again.')
    } finally {
      setProcessing(false)
    }
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Notes</h1>
        <p className="text-[#98989D]">Create and manage your notes here</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <NoteForm
            data={formData}
            setData={handleInputChange}
            submit={handleSubmit}
            processing={processing}
            handleKeyDown={handleKeyDown}
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
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
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded ${viewType === 'grid' ? 'bg-[#0A84FF] text-white' : 'bg-[#3A3A3C] text-[#98989D]'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded ${viewType === 'list' ? 'bg-[#0A84FF] text-white' : 'bg-[#3A3A3C] text-[#98989D]'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

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
                ? "grid grid-cols-1 sm:grid-cols-2 gap-4" 
                : "flex flex-col gap-3"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} viewType={viewType} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}