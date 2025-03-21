const NotesController = () => import('#controllers/notes_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const PageController = () => import('#controllers/page_controller')
import router from '@adonisjs/core/services/router'
import Note from '#models/note'


// Home and Misc pages
router.get('/', [PageController, 'home'])
router.get('/todos', [PageController, 'todos'])

// Notes UI Pages
router.get('/notes', [PageController, 'notesIndex'])

// Projects UI Pages
router.get('/projects', [PageController, 'projectsIndex'])
router.get('/projects/create', [PageController, 'projectsCreate'])
router.get('/projects/:id', [PageController, 'projectsShow'])
router.get('/projects/:id/edit', [PageController, 'projectsEdit'])

router.group(() => {
  router.get('debug/notes', async ({ response }) => {
    try {
      const noteCount = await Note.query().count('* as total')
      return response.json({
        success: true,
        noteCount: noteCount[0].$extras.total,
        routes: {
          get: '/api/notes',
          post: '/api/notes',
          getOne: '/api/notes/:id',
          put: '/api/notes/:id',
          delete: '/api/notes/:id',
          togglePin: '/api/notes/:id/toggle-pin'
        }
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        error: String(error),
        errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    }
  })
}).prefix('/api')

router.group(() => {
  router.get('notes', [NotesController, 'index'])
  router.post('notes', [NotesController, 'store'])
  router.get('notes/:id', [NotesController, 'show'])
  router.put('notes/:id', [NotesController, 'update'])
  router.delete('notes/:id', [NotesController, 'destroy'])
  router.patch('notes/:id/toggle-pin', [NotesController, 'togglePin'])
}).prefix('/api')


router.group(() => {
  router.get('projects', [ProjectsController, 'index'])         // GET /api/projects
  router.post('projects', [ProjectsController, 'store'])        // POST /api/projects
  router.get('projects/:id', [ProjectsController, 'show'])      // GET /api/projects/:id
  router.put('projects/:id', [ProjectsController, 'update'])    // PUT /api/projects/:id
  router.delete('projects/:id', [ProjectsController, 'destroy'])// DELETE /api/projects/:id
}).prefix('/api')


