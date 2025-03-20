import { Head, useForm, Link, router } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PlusIcon, XIcon, ArrowLeft } from 'lucide-react'
import NoteCard from './note-card'
import NoteForm from './note-form'
import ViewSwitcher from './view-switcher'
import SortNotes from './sort-notes'

interface Note {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string | null;
}
interface SortNotes {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

type ViewType = 'grid' | 'list'

export default function Index({ notes: initialNotes }: { notes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [viewType, setViewType] = useState<ViewType>('grid')
  const [sortNotes, setSortNotes] = useState<SortNotes>({ sortBy: 'createdAt', sortOrder: 'desc' });

  const { data, setData, post, processing, reset } = useForm({
    title: '',
    content: ''
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newNote: Note = {
      id: Date.now(),
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: null
    }
    
    setNotes([newNote, ...notes])
    
    post('/notes', {
      onSuccess: () => {
        reset()
        setIsFormVisible(false)
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      submit(e as any);
    }
  };
  

  useEffect(() => {
   router.get('/notes', { 
      sortBy: sortNotes.sortBy, 
      sortOrder: sortNotes.sortOrder 
    }, { preserveState: true,  onSuccess: (page) => {

      const fetchedNotes = page.props.notes as Note[];

        // Sort so pinned notes always come first
      const sortedNotes = [...fetchedNotes].sort((a, b) => {
        if (a.pinned === b.pinned) {
          return sortNotes.sortOrder === "asc"
              ? a[sortNotes.sortBy] > b[sortNotes.sortBy]
                ? 1
                : -1
              : a[sortNotes.sortBy] < b[sortNotes.sortBy]
              ? 1
              : -1;
          }
          return a.pinned ? -1 : 1; 
        });

        setNotes(sortedNotes);
    } });

  }, [sortNotes.sortBy, sortNotes.sortOrder]);
  
  const updatePinnedNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? { ...note, pinned: updatedNote.pinned } : note
    );
  
    // Sort so pinned notes always come first
    const sortedNotes = [...updatedNotes].sort((a, b) => {
      if (a.pinned === b.pinned) {
        return sortNotes.sortOrder === 'asc'
          ? a[sortNotes.sortBy] > b[sortNotes.sortBy] ? 1 : -1
          : a[sortNotes.sortBy] < b[sortNotes.sortBy] ? 1 : -1;
      }
      return a.pinned ? -1 : 1;
    });
  
    setNotes(sortedNotes);
  };
  

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
              <SortNotes currentSortValue={sortNotes} onChange={setSortNotes} />
              <ViewSwitcher currentView={viewType} onChange={setViewType}  />
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
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={viewType === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 gap-4"
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
                >
                  <NoteCard note={note} viewType={viewType} updatePinnedNote={updatePinnedNote} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  )
} 