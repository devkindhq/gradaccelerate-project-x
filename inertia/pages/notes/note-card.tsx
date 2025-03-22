import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { PinIcon, TrashIcon, ClockIcon, EditIcon } from 'lucide-react'
import { Note, ViewType } from '~/types'

interface NoteCardProps {
  note: Note
  viewType: ViewType
  onPin?: (id: number) => void
  onDelete?: (id: number) => void
  onEdit?: (id: number) => void
}

export default function NoteCard({ note, viewType, onPin, onDelete, onEdit }: NoteCardProps) {
  const timeAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })
  
  return (
    <motion.div 
      className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 border ${
        note.pinned ? 'border-yellow-500/50' : 'border-[#3A3A3C]'
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
      <div className="absolute top-0 right-0 flex">
        {onEdit && (
          <motion.div 
            className="bg-[#3A3A3C] text-[#98989D] hover:bg-blue-600 hover:text-white 
                      text-xs px-2 py-1 rounded-bl-md flex items-center gap-1 cursor-pointer transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(note.id);
            }}
            whileTap={{ scale: 0.95 }}
          >
            <EditIcon size={12} />
            <span>Edit</span>
          </motion.div>
        )}
        
        {onPin && (
          <motion.div 
            className={`${note.pinned ? 'bg-yellow-500 text-black' : 'bg-[#3A3A3C] text-[#98989D]'} 
                        text-xs px-2 py-1 ${onEdit ? 'ml-1' : ''} rounded-bl-md flex items-center gap-1 cursor-pointer hover:opacity-90`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPin(note.id);
            }}
            whileTap={{ scale: 0.95 }}
          >
            <PinIcon size={12} />
            <span>{note.pinned ? 'Pinned' : 'Pin'}</span>
          </motion.div>
        )}
        
        {onDelete && (
          <motion.div 
            className="bg-[#3A3A3C] text-[#98989D] hover:bg-red-600 hover:text-white 
                      text-xs px-2 py-1 ml-1 rounded-bl-md flex items-center gap-1 cursor-pointer transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(note.id);
            }}
            whileTap={{ scale: 0.95 }}
          >
            <TrashIcon size={12} />
            <span>Delete</span>
          </motion.div>
        )}
      </div>

      <div className={`${viewType === 'list' ? 'flex items-center gap-4' : 'flex flex-col'} p-5 ${viewType === 'list' ? 'pb-10' : ''}`}>
        <div className={`${viewType === 'list' ? 'flex-1' : 'w-full'}`}>
          <h2 className="text-lg font-medium text-white line-clamp-1 mb-2">
            {note.title}
          </h2>
          <p className={`text-[#98989D] text-sm ${viewType === 'grid' ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {note.content}
          </p>
        </div>
        
        {viewType === 'list' && (
          <div className="flex items-center text-xs text-[#98989D] ml-auto pl-4 border-l border-[#3A3A3C]/50 self-stretch flex-shrink-0">
            <ClockIcon size={12} className="mr-1" />
            <span>{timeAgo}</span>
          </div>
        )}
      </div>
      
      {viewType === 'grid' && (
        <div className={`px-5 pb-3 pt-1 mt-auto flex items-center text-xs text-[#98989D] border-t border-[#3A3A3C]/50`}>
          <ClockIcon size={12} className="mr-1" />
          <span>{timeAgo}</span>
        </div>
      )}
      
      {viewType === 'grid' && (
        <div className="absolute bottom-8 left-0 right-0 h-12 bg-gradient-to-t from-[#2C2C2E] to-transparent pointer-events-none" />
      )}
    </motion.div>
  )
}