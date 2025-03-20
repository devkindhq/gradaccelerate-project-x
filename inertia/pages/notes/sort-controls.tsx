import { motion } from 'framer-motion'
import { SortAsc, SortDesc, Calendar, Clock } from 'lucide-react'

type SortField = 'created_at' | 'updated_at' | 'title'
type SortOrder = 'asc' | 'desc'

interface SortControlsProps {
  sortBy: SortField
  sortOrder: SortOrder
  onChange: (field: SortField, order: SortOrder) => void
}

export default function SortControls({ sortBy, sortOrder, onChange }: SortControlsProps) {
  const toggleOrder = () => {
    onChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="bg-[#2C2C2E] rounded-lg p-1 flex gap-1 items-center flex-wrap">
      <div className="flex flex-wrap">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange('created_at', sortOrder)}
          className={`p-2 rounded flex items-center gap-1 ${
            sortBy === 'created_at' 
              ? 'bg-[#3A3A3C] text-white' 
              : 'text-[#98989D] hover:text-white'
          }`}
        >
          <Calendar size={14} />
          <span className="text-xs whitespace-nowrap">Created</span>
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange('updated_at', sortOrder)}
          className={`p-2 rounded flex items-center gap-1 ${
            sortBy === 'updated_at' 
              ? 'bg-[#3A3A3C] text-white' 
              : 'text-[#98989D] hover:text-white'
          }`}
        >
          <Clock size={14} />
          <span className="text-xs whitespace-nowrap">Updated</span>
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange('title', sortOrder)}
          className={`p-2 rounded flex items-center gap-1 ${
            sortBy === 'title' 
              ? 'bg-[#3A3A3C] text-white' 
              : 'text-[#98989D] hover:text-white'
          }`}
        >
          <span className="text-xs whitespace-nowrap">Title</span>
        </motion.button>
      </div>
      
      <div className="border-l border-[#3A3A3C] pl-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleOrder}
          className="p-2 rounded text-white hover:bg-[#3A3A3C]"
        >
          {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
        </motion.button>
      </div>
    </div>
  )
}
