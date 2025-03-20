import type React from "react"
import { motion } from "framer-motion"
import { PinIcon, XIcon } from "lucide-react"

interface NoteFormProps {
  data: {
    title: string
    content: string
    pinned?: boolean
  }
  setData: (field: string, value: any) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  onCancel?: () => void
  isEditing?: boolean
}

export default function NoteForm({ data, setData, submit, processing, handleKeyDown, onCancel, isEditing = false }: NoteFormProps) {
  const isMac = navigator.userAgent.includes("Mac")

  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
      style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">{isEditing ? 'Edit Note' : 'New Note'}</h2>
        {onCancel && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="p-1 hover:bg-[#3A3A3C] rounded-full transition-colors"
          >
            <XIcon size={18} className="text-[#98989D]" />
          </motion.button>
        )}
      </div>
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
            placeholder="Note content (Markdown supported)"
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200"
            required
          />
          <p className="mt-1 text-xs text-[#98989D]">Markdown formatting is supported</p>
        </div>
        
        <div className="mb-4 flex items-center">
          <label htmlFor="pinned" className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="pinned"
              checked={!!data.pinned}
              onChange={(e) => setData("pinned", e.target.checked)}
              className="hidden"
            />
            <span className={`inline-block w-5 h-5 mr-2 rounded border ${data.pinned ? 'bg-yellow-500 border-yellow-500' : 'border-gray-500'} flex items-center justify-center transition-colors`}>
              {data.pinned && <PinIcon size={12} className="text-black" />}
            </span>
            <span className="text-sm text-white">Pin this note</span>
          </label>
        </div>
        
        <div className="flex gap-3">
          {onCancel && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onCancel}
              className="flex-1 bg-[#3A3A3C] text-white px-4 py-3 rounded-lg hover:bg-[#4A4A4C] focus:outline-none focus:ring-2 focus:ring-[#3A3A3C] focus:ring-offset-2 focus:ring-offset-[#2C2C2E] transition-all duration-200"
            >
              Cancel
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={processing}
            className={`${onCancel ? 'flex-1' : 'w-full'} bg-[#0A84FF] text-white px-4 py-3 rounded-lg hover:bg-[#0A74FF] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-2 focus:ring-offset-[#2C2C2E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
          >
            {processing ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Changes" : "Add Note")}
          </motion.button>
        </div>
        <p className="text-center text-sm text-[#98989D] mt-2">
          Hit {isMac ? "⌘" : "Ctrl"} + Enter to {isEditing ? "save" : "add"} note
        </p>
      </form>
    </motion.div>
  )
}