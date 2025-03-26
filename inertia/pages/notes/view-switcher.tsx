import { motion } from 'framer-motion'
import { LayoutGridIcon, ListIcon } from 'lucide-react'

type ViewType = 'grid' | 'list'

interface ViewSwitcherProps {
  currentView: ViewType
  onChange: (view: ViewType) => void
  
}

export default function ViewSwitcher({ currentView, onChange }: ViewSwitcherProps) {
  return (
    <div className="bg-[#2C2C2E] rounded-lg p-1 flex gap-1">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange('grid')}
        className={`p-2 rounded ${
          currentView === 'grid' 
            ? 'bg-[#3A3A3C] text-white' 
            : 'text-[#98989D] hover:text-white'
        }`}
      >
        <LayoutGridIcon size={18} />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange('list')}
        className={`p-2 rounded ${
          currentView === 'list' 
            ? 'bg-[#3A3A3C] text-white' 
            : 'text-[#98989D] hover:text-white'
        }`}
      >
        <ListIcon size={18} />
      </motion.button>
    </div>
  )
} 