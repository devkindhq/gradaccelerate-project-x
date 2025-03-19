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
}

export default function NoteCard({ note, viewType }: NoteCardProps) {
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
      
      {viewType === 'grid' && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#2C2C2E] to-transparent" />
      )}
    </motion.div>
  )
}