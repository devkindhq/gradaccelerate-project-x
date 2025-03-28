const NotesController = () => import('#controllers/notes_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const PageController = () => import('#controllers/page_controller')
const TodosController = () => import('#controllers/todos_controller')

  
import router from '@adonisjs/core/services/router'

// Home and Misc pages
router.get('/', [PageController, 'home'])
router.get('/todos', [PageController, 'todos'])

// Notes UI Pages
router.get('/notes', [PageController, 'notesIndex'])
router.post('/notes/upload', [NotesController, 'uploadImage'])
router.post('/notes/save-with-image', [NotesController, 'saveNoteWithImage']) // New route for saving notes with images
// Projects UI Pages
router.get('/projects', [PageController, 'projectsIndex'])
router.get('/projects/create', [PageController, 'projectsCreate'])
router.get('/projects/:id', [PageController, 'projectsShow'])
router.get('/projects/:id/edit', [PageController, 'projectsEdit'])

// Notes API
router.group(() => {
  // Standard CRUD routes
  router.get('notes', [NotesController, 'index'])
  router.post('notes', [NotesController, 'store'])
  router.get('notes/:id', [NotesController, 'show'])
  router.put('notes/:id', [NotesController, 'update'])
  router.delete('notes/:id', [NotesController, 'destroy'])
  router.patch('notes/:id/toggle-pin', [NotesController, 'togglePin'])
}).prefix('/api')

// Todos API
router.group(() => {
  router.get('todos', [TodosController, 'index'])
  router.post('todos', [TodosController, 'store'])
  router.get('todos/:id', [TodosController, 'show'])
  router.put('todos/:id', [TodosController, 'update'])
  router.delete('todos/:id', [TodosController, 'destroy'])
}).prefix('/api')

// Projects API
router.group(() => {
  router.get('projects', [ProjectsController, 'index'])         
  router.post('projects', [ProjectsController, 'store'])        
  router.get('projects/:id', [ProjectsController, 'show'])      
  router.put('projects/:id', [ProjectsController, 'update'])    
  router.delete('projects/:id', [ProjectsController, 'destroy'])
}).prefix('/api')



