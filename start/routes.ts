/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

const NotesController = () => import('#controllers/notes_controller')
const ProjectsController = () => import('#controllers/projects_controller')

import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import Note from '#models/note'
import type { HttpContext } from '@adonisjs/core/http'

/* ------------------------------
| Inertia Page Routes
|------------------------------ */

// Home and Misc
router.get('/', ({ inertia }) => inertia.render('home'))
router.get('/todos', ({ inertia }) => inertia.render('todos/empty'))
router.get('/api-tester', ({ inertia }) => inertia.render('api_tester'))

// Notes UI Pages
router.get('/notes', ({ inertia }) => inertia.render('notes/index'))

/* ------------------------------
| Projects UI Pages - Update order to fix route conflicts
|------------------------------ */
router.get('/projects/create', ({ inertia }) => inertia.render('projects/create'))

router.get('/projects/:id/edit', async ({ params, inertia }) => {
  try {
    const { default: ProjectsControllerClass } = await ProjectsController()
    const projectsController = new ProjectsControllerClass()
    
    // Create a minimal context object that matches the structure ProjectController expects
    const ctx = {
      params: { id: params.id },
      request: { input: () => undefined }
    } as unknown as HttpContext
    
    const project = await projectsController.show(ctx)
    return inertia.render('projects/edit', { project, params })
  } catch (error) {
    console.error('Error loading project for edit:', error)
    return inertia.render('projects/index')
  }
})

router.get('/projects/:id', async ({ params, inertia }) => {
  try {
    const { default: ProjectsControllerClass } = await ProjectsController()
    const projectsController = new ProjectsControllerClass()
    
    // Create a minimal context object that matches the structure ProjectController expects
    const ctx = {
      params: { id: params.id },
      request: { input: () => undefined }
    } as unknown as HttpContext
    
    const project = await projectsController.show(ctx)
    return inertia.render('projects/show', { project, params })
  } catch (error) {
    console.error('Error loading project for view:', error)
    return inertia.render('projects/index')
  }
})

router.get('/projects', ({ inertia }) => inertia.render('projects/index'))

/* ------------------------------
| Diagnostic Routes
|------------------------------ */

router.get('/debug/db-check', async ({ response }) => {
  try {
    await db.connection().rawQuery('SELECT 1')
    const hasNotesTable = await db.connection().schema.hasTable('notes')
    
    return response.json({
      success: true,
      databaseConnected: true,
      hasNotesTable,
      dbConfig: {
        connection: process.env.DB_CONNECTION,
        connectionString: process.env.DB_CONNECTION_STRING
      }
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: String(error),
      errorType: error.constructor.name,
      dbConfig: {
        connection: process.env.DB_CONNECTION,
        connectionString: process.env.DB_CONNECTION_STRING
      }
    })
  }
})

router.get('/debug/notes-count', async ({ response }) => {
  try {
    const count = await Note.query().count('* as total')
    return response.json({
      success: true,
      count: count[0].$extras.total
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: String(error)
    })
  }
})

router.get('/debug/notes-api', async ({ response }) => {
  try {
    const controller = await import('#controllers/notes_controller')
    const noteCount = await Note.query().count('* as total')

    return response.json({
      success: true,
      controllerLoaded: !!controller.default,
      controllerMethods: Object.getOwnPropertyNames(controller.default.prototype).filter(m => m !== 'constructor'),
      noteCount: noteCount[0].$extras.total,
      routes: {
        get: '/notes',
        post: '/notes',
        getOne: '/notes/:id',
        put: '/notes/:id',
        delete: '/notes/:id',
        togglePin: '/notes/:id/toggle-pin'
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

/* ------------------------------
| API Routes - Notes
|------------------------------ */
router.group(() => {
  router.get('notes', [NotesController, 'index'])
  router.post('notes', [NotesController, 'store'])
  router.get('notes/:id', [NotesController, 'show'])
  router.put('notes/:id', [NotesController, 'update'])
  router.delete('notes/:id', [NotesController, 'destroy'])
  router.patch('notes/:id/toggle-pin', [NotesController, 'togglePin'])
}).prefix('/api')

/* ------------------------------
| API Routes - Projects (Full CRUD)
|------------------------------ */
router.group(() => {
  router.get('projects', [ProjectsController, 'index'])         // GET /api/projects
  router.post('projects', [ProjectsController, 'store'])        // POST /api/projects
  router.get('projects/:id', [ProjectsController, 'show'])      // GET /api/projects/:id
  router.put('projects/:id', [ProjectsController, 'update'])    // PUT /api/projects/:id
  router.delete('projects/:id', [ProjectsController, 'destroy'])// DELETE /api/projects/:id
}).prefix('/api')


