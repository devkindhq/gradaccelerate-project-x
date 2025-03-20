import { Head, useForm, router } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import NoteForm from './note-form'
import { Link } from '@inertiajs/react'

interface Note {
  id: number;
  title: string;
  content: string;
  pinned?: boolean;
}

export default function Edit({ note }: { note: Note }) {
  const { data, setData, put, processing } = useForm({
    title: note.title,
    content: note.content,
    pinned: note.pinned || false
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    put(`/notes/${note.id}`, {
      onSuccess: () => {
        // Redirect to notes index after update
        router.visit('/notes');
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      submit(e as any);
    }
  };

  return (
    <>
      <Head title={`Edit: ${note.title}`} />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Link 
              href="/notes" 
              className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold">Edit Note</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NoteForm 
              data={data}
              setData={setData}
              submit={submit}
              processing={processing}
              handleKeyDown={handleKeyDown}
              isEditing={true}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}
