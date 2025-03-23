import { Head, Link, router, useForm } from '@inertiajs/react'
import { motion} from 'framer-motion'
import { ArrowLeft, Folder, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import ProjectCard from './project-card'
import ProjectForm from './project-form'
import { ProjectInterface } from '#inertia/interfaces/project-interface'



interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  hasMorePages: boolean;
}

interface ProjectProps {
  projects: {
    data: ProjectInterface[];
    meta: PaginationMeta;
  };
}

export default function Project({ projects: initialProjects }: ProjectProps) {
  console.log(initialProjects)
  const [projects, setProjects] = useState<ProjectInterface[]>(initialProjects.data || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState('create')
  const [selectedProject, setSelectedProject] = useState({})
  const [isPostOrPut, setIsPostOrPut] = useState(0);
  const { data, setData, post, put, processing } = useForm({
    title: '',
    description: '',
    status: 'pending'
  })
  const [meta, setMeta] = useState<PaginationMeta>(initialProjects.meta || {
    total: 0,
    perPage: 5,
    currentPage: 1,
    lastPage: 1,
    firstPage: 1,
    hasMorePages: false,
  });
   
  useEffect(() => {
    router.get(
      '/projects', 
      { page: 1, limit: 5 }, 
      { 
        preserveState: true, 
        preserveScroll: true, 
        onSuccess: (data) => {
          const newProjects = data.props.projects as ProjectProps['projects'];
          setProjects(newProjects.data);
          setMeta(newProjects.meta);
        } 
      });
  }, [isPostOrPut]);



  const handlePageChange = (page: number) => {
    router.get(
      '/projects',
      { page, limit: meta.perPage },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          const newProjects = page.props.projects as ProjectProps['projects'];
          setProjects(newProjects.data);
          setMeta(newProjects.meta);
        },
      }
    );
  };

  const handleLimitChange = (limit: number) => {
    router.get(
      '/projects',
      { page: 1, limit }, // Reset to page 1 when changing limit
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          const newProjects = page.props.projects as ProjectProps['projects'];
          setProjects(newProjects.data);
          setMeta({ ...newProjects.meta, perPage: limit });
        },
      }
    );
  };


  const handleOpenCreate = () => {
    setSelectedProject({})
    setDialogMode('create')
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (project: ProjectInterface) => {
    setSelectedProject(project)
    setDialogMode('edit')
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
  }

  
  return (
    <div className='min-h-screen bg-[#1C1C1E] text-white'>
      <Head title="Projects" />
      <div className="relative pb-12">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <Folder className="w-6 h-6 text-gray-400" />
              <h1 className="text-2xl font-semibold">Projects</h1>
            </div>
          </div>

          <div className="mb-6 flex justify-end">
            <select
              value={meta.perPage}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="bg-[#252526] border border-gray-700/50 rounded-xl px-4 py-2 text-white 
                        focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                        transition-all duration-300 shadow-sm hover:bg-[#2D2D30] 
                        appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjN0E3QTdBIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTcuNDEgOC41N0wxMiAxMy4xNSA1Ni41NyA4LjU3IDEyIDE1LjQzIDE2LjU5IDguNTd6Ii8+PC9zdmc+')] 
                        bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_16px]"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={handleOpenEdit}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-x-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(meta.currentPage - 1)}
              disabled={meta.currentPage === 1}
              className="bg-[#252526] p-2 rounded-full border border-gray-700/50 
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        hover:bg-[#2D2D30] transition-all duration-300 
                        shadow-[0_0_10px_rgba(59,130,246,0.2)]"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </motion.button>
            <span className="flex items-center px-4 py-2 bg-[#252526] rounded-full 
                           border border-gray-700/50 text-gray-200 font-medium 
                           shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              Page {meta.currentPage} of {meta.lastPage}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(meta.currentPage + 1)}
              disabled={meta.currentPage === meta.lastPage}
              className="bg-[#252526] p-2 rounded-full border border-gray-700/50 
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        hover:bg-[#2D2D30] transition-all duration-300 
                        shadow-[0_0_10px_rgba(59,130,246,0.2)]"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </motion.button>
        </div>

        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenCreate}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-full 
                    shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] 
                    transition-all duration-300 z-50"
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>

        {/* Project Form Dialog */}
        <ProjectForm 
          isOpen={isDialogOpen} 
          onClose={handleClose} 
          initialData={selectedProject}
          mode={dialogMode}
          data={data}
          setData={setData}
          processing={processing}
          post={post}
          put={put}
          setProjects={setProjects}
          projects={projects}
          setIsPostOrPut={setIsPostOrPut}
        />
      </div>
    </div>
  )
}