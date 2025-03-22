import { Head, useForm, Link, router } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { PlusIcon, XIcon, ArrowLeft, Trash2Icon, AlertTriangleIcon } from 'lucide-react'
import NoteCard from './note-card'
import NoteForm from './note-form'
import ViewSwitcher from './view-switcher'
import SortControls from './sort-controls'
import { marked } from 'marked'
import { Note, ViewType, SortField, SortOrder } from '~/types'

export default function Index({ notes: initialNotes }: { notes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [viewType, setViewType] = useState<ViewType>('grid')
  const [sortBy, setSortBy] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [previewNote, setPreviewNote] = useState<Note | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const { data, setData, post, processing, reset } = useForm({
    title: '',
    content: '',
    pinned: false
  });

  // Function to sort notes
  const sortNotes = (notesToSort: Note[]) => {
    return [...notesToSort].sort((a, b) => {
      // Always put pinned notes on top regardless of sort field/order
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then sort by the selected field and order
      let fieldA, fieldB;
      
      if (sortBy === 'title') {
        fieldA = a.title.toLowerCase();
        fieldB = b.title.toLowerCase();
      } else if (sortBy === 'updated_at') {
        fieldA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime();
        fieldB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime();
      } else {
        fieldA = new Date(a.createdAt).getTime();
        fieldB = new Date(b.createdAt).getTime();
      }
      
      if (sortOrder === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
  };

  // Re-sort notes when sort parameters change
  useEffect(() => {
    setNotes(sortNotes(notes));
  }, [sortBy, sortOrder]);
  
  // Apply initial sorting on component mount
  useEffect(() => {
    setNotes(sortNotes(initialNotes));
  }, [initialNotes]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post('/notes', {
      onSuccess: () => {
        // Refresh the page to get the updated list of notes
        router.reload();
        reset();
        setIsFormVisible(false);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      submit(e as any);
    }
  };

  const handlePinToggle = (id: number) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    // Optimistic UI update
    setNotes(notes.map(n => 
      n.id === id ? { ...n, pinned: !n.pinned } : n
    ));
    
    // Send request to server
    router.patch(`/notes/${id}/pin`, {}, {
      onError: () => {
        // Revert on error
        setNotes(notes);
      },
      preserveState: true,
    });
  };

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortBy(field);
    setSortOrder(order);
    
    // Update URL query params for bookmarking
    router.get('/notes', { sort_by: field, sort_order: order }, {
      preserveState: true,
      preserveScroll: true,
      only: [],
    });
  };

  const handleDeleteClick = (id: number) => {
    setNoteToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (id: number) => {
    router.visit(`/notes/${id}/edit`);
  };

  const confirmDelete = () => {
    if (noteToDelete === null) return;
    
    // Optimistic UI update
    const updatedNotes = notes.filter(n => n.id !== noteToDelete);
    setNotes(updatedNotes);
    
    // Send delete request to server
    router.delete(`/notes/${noteToDelete}`, {
      onError: () => {
        // Revert on error
        setNotes(notes);
      },
      preserveState: true,
    });
    
    // Close modal
    setIsDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  const renderMarkdownPreview = (content: string) => {
    return { __html: marked(content) };
  };

  return (
    <>
      <Head title="Notes" />
      <div className="min-h-screen bg-[#1C1C1E] text-white overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
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
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <SortControls 
                sortBy={sortBy} 
                sortOrder={sortOrder} 
                onChange={handleSortChange} 
              />
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
                  data={data}
                  setData={setData}
                  submit={submit}
                  processing={processing}
                  handleKeyDown={handleKeyDown}
                  onCancel={() => setIsFormVisible(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={viewType === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
              : "flex flex-col gap-3"
            }
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
                  className={viewType === 'list' ? 'w-full' : ''}
                  onClick={() => setPreviewNote(note)}
                >
                  <NoteCard 
                    note={note} 
                    viewType={viewType} 
                    onPin={handlePinToggle}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Markdown Preview Modal */}
          <AnimatePresence>
            {previewNote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setPreviewNote(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#2C2C2E] rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{previewNote.title}</h2>
                    <button 
                      onClick={() => setPreviewNote(null)}
                      className="p-2 hover:bg-[#3A3A3C] rounded-full transition-colors"
                    >
                      <XIcon size={20} />
                    </button>
                  </div>
                  <div 
                    className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-blue-400"
                    dangerouslySetInnerHTML={renderMarkdownPreview(previewNote.content)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {isDeleteModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={cancelDelete}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#2C2C2E] rounded-xl p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4 text-red-500">
                    <AlertTriangleIcon size={24} />
                    <h2 className="text-xl font-bold">Delete Note</h2>
                  </div>
                  <p className="text-[#98989D] mb-6">
                    Are you sure you want to delete this note? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={cancelDelete}
                      className="px-4 py-2 rounded-lg bg-[#3A3A3C] text-white hover:bg-[#4A4A4C] transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={confirmDelete}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2Icon size={16} />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}