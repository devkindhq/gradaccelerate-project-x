import { useState, useEffect } from 'react'

export default function ApiTester() {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [sortBy, setSortBy] = useState('created_at')
  const [order, setOrder] = useState('desc')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  // Form state for creating/editing notes
  const [form, setForm] = useState({
    title: '',
    content: '',
    pinned: false
  })
  
  // Fetch all notes with sorting
  const fetchNotes = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/notes?sort_by=${sortBy}&order=${order}`)
      const data = await response.json()
      setNotes(data)
      setMessage('Notes fetched successfully')
    } catch (error) {
      setMessage(`Error fetching notes: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Create a new note
  const createNote = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      
      if (!response.ok) throw new Error('Failed to create note')
      
      const data = await response.json()
      setForm({ title: '', content: '', pinned: false })
      setMessage('Note created successfully')
      fetchNotes()
    } catch (error) {
      setMessage(`Error creating note: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Toggle pin status
  const togglePin = async (noteId) => {
    setLoading(true)
    try {
      const response = await fetch(`/notes/${noteId}/toggle-pin`, {
        method: 'PATCH'
      })
      
      if (!response.ok) throw new Error('Failed to toggle pin status')
      
      setMessage('Pin status toggled successfully')
      fetchNotes()
    } catch (error) {
      setMessage(`Error toggling pin: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Delete a note
  const deleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    
    setLoading(true)
    try {
      const response = await fetch(`/notes/${noteId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete note')
      
      setMessage('Note deleted successfully')
      fetchNotes()
    } catch (error) {
      setMessage(`Error deleting note: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Load notes on component mount and when sort options change
  useEffect(() => {
    fetchNotes()
  }, [sortBy, order])
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notes API Tester</h1>
      
      {/* Message display */}
      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          {message}
        </div>
      )}
      
      {/* Create note form */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl mb-4">Create New Note</h2>
        <form onSubmit={createNote}>
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Content (Markdown supported)</label>
            <textarea
              className="w-full p-2 border rounded h-32"
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.pinned}
                onChange={(e) => setForm({...form, pinned: e.target.checked})}
                className="mr-2"
              />
              Pin this note
            </label>
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Note'}
          </button>
        </form>
      </div>
      
      {/* Sorting options */}
      <div className="mb-4 flex items-center">
        <span className="mr-2">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="mr-4 p-1 border rounded"
        >
          <option value="created_at">Date Created</option>
          <option value="updated_at">Date Updated</option>
          <option value="title">Title</option>
        </select>
        
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="p-1 border rounded"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        
        <button
          onClick={fetchNotes}
          className="ml-4 bg-gray-200 px-3 py-1 rounded"
        >
          Refresh
        </button>
      </div>
      
      {/* Notes list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <div key={note.id} className={`p-4 border rounded ${note.pinned ? 'bg-yellow-50 border-yellow-200' : ''}`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{note.title}</h3>
              <div>
                <button
                  onClick={() => togglePin(note.id)}
                  className="mr-2 text-sm"
                  title={note.pinned ? 'Unpin' : 'Pin'}
                >
                  📌
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-sm text-red-500"
                  title="Delete"
                >
                  ❌
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              {new Date(note.createdAt).toLocaleString()}
            </div>
            
            <div className="whitespace-pre-wrap">{note.content}</div>
          </div>
        ))}
      </div>
      
      {notes.length === 0 && !loading && (
        <div className="text-center p-8 text-gray-500">
          No notes found. Create your first note!
        </div>
      )}
    </div>
  )
}
