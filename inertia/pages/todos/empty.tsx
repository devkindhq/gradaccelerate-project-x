import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, ListTodo } from 'lucide-react'

export default function Empty() {
  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold">Empty Page</h1>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center mt-20"
        >
          <p className="text-xl text-[#98989D] mb-8">Gracias.</p>
          
          <Link
            href="/todos"
            className="flex items-center gap-2 bg-[#0A84FF] hover:bg-[#007AFF] text-white px-5 py-3 rounded-lg transition-colors duration-200"
          >
            <ListTodo size={20} />
            <span className="font-medium">Go to Todos</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}