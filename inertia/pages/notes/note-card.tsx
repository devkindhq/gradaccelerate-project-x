import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  pinned: boolean;
}

interface NoteCardProps {
  note: Note
  viewType: 'grid' | 'list'
  onDelete: (id: number) => void
  onEdit: (note: Note) => void
  onTogglePin: (id: number) => void
}

export default function NoteCard({ note, viewType, onDelete, onEdit, onTogglePin }: NoteCardProps) {
  const timeAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })
  
  return (
    <motion.div 
      className={`relative overflow-hidden backdrop-blur-sm ${
        note.pinned 
          ? 'bg-[#3A3A3C]/90 border border-[#5A5A5E]' 
          : 'bg-[#2C2C2E]/80 border border-[#3A3A3C]'
      } ${
        viewType === 'grid' ? 'rounded-xl' : 'rounded-lg'
      }`}
      style={{ 
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`p-5 ${viewType === 'list' ? 'flex items-center gap-4' : ''}`}>
        <div className={viewType === 'list' ? 'flex-1' : ''}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-white">{note.title}</h2>
              {note.pinned && (
                <span className="text-xs bg-[#0A84FF] text-white px-1.5 py-0.5 rounded-full">
                  Pinned
                </span>
              )}
            </div>
            <span className="text-xs text-[#98989D]">{timeAgo}</span>
          </div>
          <p className={`text-[#98989D] text-sm ${viewType === 'grid' ? 'line-clamp-3' : 'line-clamp-1'}`}>
            {note.content}
          </p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note.id);
          }}
          className="p-1.5 rounded-full bg-[#3A3A3C] text-[#98989D] hover:bg-[#4A4A4C] hover:text-white transition-colors"
          title={note.pinned ? "Unpin note" : "Pin note"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
            <path d="M10 10a2 2 0 011.414.586l3 3a2 2 0 11-2.828 2.828l-3-3A2 2 0 018 12.414V16a2 2 0 11-4 0v-3.586a2 2 0 01.586-1.414l3-3A2 2 0 0110 10z" />
          </svg>
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
          className="p-1.5 rounded-full bg-[#3A3A3C] text-[#98989D] hover:bg-[#4A4A4C] hover:text-white transition-colors"
          title="Edit note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="p-1.5 rounded-full bg-[#3A3A3C] text-[#98989D] hover:bg-red-500 hover:text-white transition-colors"
          title="Delete note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {viewType === 'grid' && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#2C2C2E] to-transparent" />
      )}
    </motion.div>
  )
}