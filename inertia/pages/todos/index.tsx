import { useState, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import axios from 'axios'
import TodoItem from './components/TodoItem'
import CreateTodoForm from './components/CreateTodoForm'

interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  labels: string | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/todos')
      setTodos(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/todos/${id}`)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleToggleComplete = async (id: number, currentStatus: boolean) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return

      await axios.put(`/api/todos/${id}`, {
        ...todo,
        completed: !currentStatus
      })
      
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !currentStatus } : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleCreateTodo = (newTodo: Todo) => {
    setTodos([newTodo, ...todos])
    setIsCreateFormOpen(false)
  }

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ))
  }

  return (
    <>
      <Head title="Todos" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold">Todos</h1>
            </div>
            
            <button
              onClick={() => setIsCreateFormOpen(true)}
              className="flex items-center gap-2 bg-[#0A84FF] hover:bg-[#007AFF] text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Plus size={18} />
              <span>New Todo</span>
            </button>
          </motion.div>

          {isCreateFormOpen && (
            <CreateTodoForm 
              onClose={() => setIsCreateFormOpen(false)}
              onTodoCreated={handleCreateTodo}
            />
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 size={36} className="animate-spin text-[#0A84FF]" />
            </div>
          ) : todos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <p className="text-2xl text-[#98989D] font-medium mb-4">No todos yet</p>
              <p className="text-[#98989D]">Create your first todo to get started</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                  onUpdate={handleUpdateTodo}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}