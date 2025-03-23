import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { PinIcon, PinOff } from 'lucide-react'
import { router, useForm } from '@inertiajs/react';
import { marked } from 'marked';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { NoteInterface } from '#inertia/interfaces/note-interface';

interface NoteCardProps {
  note: NoteInterface
  viewType: 'grid' | 'list'
  updatePinnedNote: (updatedNote: NoteInterface) => void
}

export default function NoteCard({ note, viewType, updatePinnedNote }: NoteCardProps) {
  const timeAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })
  const { setData, put, } = useForm({ pinned: note.pinned });

  const handlePinToggle = () => {
    const newPinnedState = !note.pinned  // Toggle state first
    setData('pinned', newPinnedState); 
  
    put(`/notes/${note.id}`, {
      onSuccess: () => {
        updatePinnedNote({ ...note, pinned: newPinnedState });      
      },
      preserveScroll: true
    });
  };

  const renderedContent = marked(note.content); // Parse Markdown + HTML
  
  
  
  return (
    <motion.div 
      className={`relative overflow-hidden backdrop-blur-sm h-full bg-[#2C2C2E]/80 border border-[#3A3A3C] ${
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
            <h2 className="text-lg font-medium text-white">{note.title}</h2>
            <div className='flex items-center gap-2'>
              <span className="text-xs text-[#98989D]">{timeAgo}</span>
              <button onClick={handlePinToggle}>
                {
                  note?.pinned ? (
                    <PinOff size={16} className="text-[#0A84FF]" />
                  ) : (
                    <PinIcon size={16} className="text-[#98989D]" />
                  )
                }
              </button>
            </div>
          </div>
          <p className={`text-[#98989D] text-sm ${viewType === 'grid' ? 'line-clamp-3' : 'line-clamp-1'}`}>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{note.content}</ReactMarkdown>          </p>
        </div>
      </div>
      
      {viewType === 'grid' && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#2C2C2E] to-transparent" />
      )}
    </motion.div>
  )
} 