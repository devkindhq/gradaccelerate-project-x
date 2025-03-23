import type React from "react"
import { motion } from "framer-motion"
import "easymde/dist/easymde.min.css"
import { useEffect, useMemo, useState } from "react"



interface NoteFormProps {
  data: {
    title: string
    content: string
  }
  setData: (field: string, value: string) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
}

export default function NoteForm({ data, setData, submit, processing, handleKeyDown }: NoteFormProps) {
  const [SimpleMDE, setSimpleMDE] = useState<any>(null);
  const [options, setOptions] = useState({
    spellChecker: false,
    placeholder: "Write in Markdown...",
    toolbar: ["bold", "italic", "heading", "|", "unordered-list", "ordered-list", "|", "code", "link", "preview"],
  });

  const memoizedOptions = useMemo(() => {
    return options;
  }, [options]);

  // Dynamically import SimpleMDE
  useEffect(() => {
    import("react-simplemde-editor").then((mod) => {
      setSimpleMDE(() => mod.default);
    });
  }, []);

  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
      style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)" }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">New Note</h2>
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
          {/* <motion.textarea
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            value={data.content}
            onChange={(e) => setData("content", e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Note content"
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200"
            required
          /> */}
          {SimpleMDE && (
            <SimpleMDE
              value={data.content}
              onChange={(value) => setData("content", value)}
              options={memoizedOptions}
            />
        )}

        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={processing}
          className="w-full bg-[#0A84FF] text-white px-4 py-3 rounded-lg hover:bg-[#0A74FF] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-2 focus:ring-offset-[#2C2C2E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {processing ? "Adding..." : "Add Note"}
        </motion.button>
        <p className="text-center text-sm text-[#98989D] mt-2">
          Hit {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"} + Enter to add note
        </p>
      </form>
    </motion.div>
  )
} 