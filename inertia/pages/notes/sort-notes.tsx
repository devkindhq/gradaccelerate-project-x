import { SortNotesInterface } from '#inertia/interfaces/note-interface'
import { motion } from 'framer-motion'



interface SortNotesProps {
  currentSortValue: SortNotesInterface
  onChange: (view: SortNotesInterface) => void
}

export default function SortNotes({ currentSortValue, onChange }: SortNotesProps) {
  return (
    <div className="rounded-lg flex gap-2 items-center">
      <span className="text-xs font-medium text-white">Sort by:</span>

      <motion.select
        whileTap={{ scale: 0.95 }}
        value={currentSortValue.sortBy}
        onChange={(e) => onChange({ ...currentSortValue, sortBy: e.target.value })}
        className="px-2 py-1 rounded border border-gray-300 bg-transparent text-white text-xs"
      >
        <option value="created_at" className="text-xs">Created At</option>
        <option value="updated_at" className="text-xs">Updated At</option>
      </motion.select>

      <motion.select
        value={currentSortValue.sortOrder}
        whileTap={{ scale: 0.95 }}
        onChange={(e) => onChange({ ...currentSortValue, sortOrder: e.target.value as 'asc' | 'desc' })}
        className="px-2 py-1 rounded border border-gray-300 bg-transparent text-white text-xs"
      >
        <option value="asc" className="text-xs">Ascending</option>
        <option value="desc" className="text-xs">Descending</option>
      </motion.select>
    </div>
  )
}
