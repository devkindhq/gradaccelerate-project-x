import router from '@adonisjs/core/services/router'
const NotesController = () => import('#controllers/notes_controller')
const ProjectsController = () => import('#controllers/projects_controller')

// Existing routes
router.get('/', ({ inertia }) => inertia.render('home'))
router.get('/todos', ({ inertia }) => inertia.render('todos/empty'))

// Notes routes
router.get('/notes', [NotesController, 'index'])
router.post('/notes', [NotesController, 'store'])
router.get('/notes/:id', [NotesController, 'show'])
router.put('/notes/:id', [NotesController, 'update'])
router.patch('/notes/:id/pin', [NotesController, 'togglePin']) // New route for toggling pin status
router.delete('/notes/:id', [NotesController, 'destroy'])
router.get('/notes/:id/edit', [NotesController, 'edit']).as('notes.edit') // New route for editing a note

// Projects routes
router.get('/projects', [ProjectsController, 'index']).as('projects.index')
router.get('/projects/create', [ProjectsController, 'create']).as('projects.create')
router.post('/projects', [ProjectsController, 'store']).as('projects.store')
router.get('/projects/:id', [ProjectsController, 'show']).as('projects.show')
router.get('/projects/:id/edit', [ProjectsController, 'edit']).as('projects.edit')
router.put('/projects/:id', [ProjectsController, 'update']).as('projects.update')
router.patch('/projects/:id/status', [ProjectsController, 'updateStatus']).as('projects.updateStatus')
router.delete('/projects/:id', [ProjectsController, 'destroy']).as('projects.destroy')