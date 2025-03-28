import type React from "react"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { ImageIcon, X, Upload } from "lucide-react"

interface NoteFormProps {
  data: {
    id?: number;
    title: string;
    content: string;
    pinned?: boolean;
    imageUrl?: string;
  }
  setData: (field: string, value: string | boolean) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing: boolean
  cancelEdit?: () => void
  uploadImage?: (file: File) => Promise<string>
  uploadingImage?: boolean
}

export default function NoteForm({ 
  data, 
  setData, 
  submit, 
  processing, 
  handleKeyDown, 
  isEditing,
  cancelEdit,
  uploadImage,
  uploadingImage = false
}: NoteFormProps) {
  const [isMac, setIsMac] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Safely check for navigator after component mounts (client-side only)
  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && navigator.platform?.includes('Mac'))
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0] && uploadImage) {
      await handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!uploadImage) return
    
    try {
      const imageUrl = await uploadImage(file)
      setData("imageUrl", imageUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && uploadImage) {
      await handleFileUpload(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setData("imageUrl", "")
  }
  
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
            className="w-full px-4 py-3 bg-[#1A1A1C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
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
            className="w-full px-4 py-3 bg-[#1A1A1C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200"
            required
          />
        </div>

        {/* Image upload area */}
        <div 
          className={`mb-4 border-2 border-dashed rounded-lg transition-colors ${
            dragActive ? "border-[#0A84FF] bg-[#0A84FF]/10" : "border-[#3A3A3C]"
          } p-4 text-center cursor-pointer`}
          onClick={triggerFileInput}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {uploadingImage ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A84FF] mb-2"></div>
              <p className="text-[#98989D] text-sm">Uploading image...</p>
            </div>
          ) : data.imageUrl ? (
            <div className="relative">
              <img 
                src={data.imageUrl} 
                alt="Note image" 
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-[#1A1A1C]/80 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <Upload size={24} className="text-[#98989D] mb-2" />
              <p className="text-[#98989D] text-sm">Drag & drop an image or click to upload</p>
              <p className="text-[#98989D] text-xs mt-1">Supports JPG, PNG, GIF (max 5MB)</p>
            </div>
          )}
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
            disabled={processing || uploadingImage}
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