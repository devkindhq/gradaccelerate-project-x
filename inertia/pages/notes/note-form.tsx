import type React from "react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface NoteFormProps {
  data: {
    id?: number;
    title: string;
    content: string;
    pinned?: boolean;
  }
  setData: (field: string, value: string | boolean) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing: boolean
  cancelEdit?: () => void
}

export default function NoteForm({ 
  data, 
  setData, 
  submit, 
  processing, 
  handleKeyDown, 
  isEditing,
  cancelEdit
}: NoteFormProps) {
  const [isMac, setIsMac] = useState(false)
  
  // Safely check for navigator after component mounts (client-side only)
  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && navigator.platform?.includes('Mac'))
  }, [])
  
  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
      style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        {isEditing ? 'Edit Note' : 'New Note'}
      </h2>
      <form onSubmit={submit}>
        <div className="mb-4">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            type="text"
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
            placeholder="Note title"
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
            required
          />
        </div>
        <div className="mb-4">
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            value={data.content}
            onChange={(e) => setData("content", e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Note content"
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200"
            required
          />
        </div>
        {isEditing && (
          <div className="mb-4 flex items-center">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!data.pinned} 
                onChange={(e) => setData("pinned", e.target.checked)}
                className="sr-only"
              />
              <div className={`w-10 h-6 ${data.pinned ? 'bg-[#0A84FF]' : 'bg-[#3A3A3C]'} rounded-full p-1 transition-colors duration-200 ease-in-out`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${data.pinned ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
              <span className="ml-3 text-sm text-[#98989D]">Pin note</span>
            </label>
          </div>
        )}
        <div className={isEditing ? "grid grid-cols-2 gap-2" : ""}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={processing}
            className="w-full bg-[#0A84FF] text-white px-4 py-3 rounded-lg hover:bg-[#0A74FF] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-2 focus:ring-offset-[#2C2C2E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {processing 
              ? (isEditing ? "Updating..." : "Adding...") 
              : (isEditing ? "Update Note" : "Add Note")
            }
          </motion.button>
          
          {isEditing && cancelEdit && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={cancelEdit}
              className="w-full bg-[#3A3A3C] text-white px-4 py-3 rounded-lg hover:bg-[#4A4A4C] focus:outline-none focus:ring-2 focus:ring-[#3A3A3C] focus:ring-offset-2 focus:ring-offset-[#2C2C2E] transition-all duration-200"
            >
              Cancel
            </motion.button>
          )}
        </div>
        
        {!isEditing && (
          <p className="text-center text-sm text-[#98989D] mt-2">
            Hit {isMac ? "⌘" : "Ctrl"} + Enter to add note
          </p>
        )}
      </form>
    </motion.div>
  )
}