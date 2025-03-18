/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const NotesController = () => import('#controllers/notes_controller')
const ProjectsController = () => import('#controllers/projects_controller')
import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
// import { schema } from '@adonisjs/lucid/build/src/Schema'

import Note from '#models/note'

router.get('/', ({ inertia }) => inertia.render('home'))
router.get('/todos', ({ inertia }) => inertia.render('todos/empty'))
router.get('/notes', ({ inertia }) => inertia.render('notes/index'))
router.get('/projects', ({ inertia }) => inertia.render('projects/index'))

// Add API tester route
router.get('/api-tester', ({ inertia }) => inertia.render('api_tester'))

// Diagnostic routes for debugging
router.get('/debug/db-check', async ({ response }) => {
  try {
    // Check if we can connect to the database
    await db.connection().rawQuery('SELECT 1')
    
    // Check if notes table exists
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

// Add diagnostic endpoint for Notes API
router.get('/debug/notes-api', async ({ response }) => {
  try {
    // Verify the controller can be loaded
    const controller = await import('#controllers/notes_controller')
    
    // Check the model
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

// Add a direct debug endpoint for the Notes controller
router.get('/debug/notes-direct', async ({ response }) => {
  try {
    // Create a test note
    const noteData = {
      title: 'Debug Test Note',
      content: 'This is a **markdown** test note created directly for debugging.',
      pinned: false
    }
    
    // Try to add a note to the database
    let note
    try {
      note = await Note.create(noteData)
      console.log('Created test note for debugging')
    } catch (createError) {
      console.error('Error creating test note:', createError)
      return response.status(500).json({
        stage: 'create',
        error: String(createError),
        message: 'Failed to create test note'
      })
    }
    
    // Try to retrieve the controller
    let NotesControllerClass
    try {
      const controller = await import('#controllers/notes_controller')
      NotesControllerClass = controller.default
      console.log('Successfully imported NotesController')
    } catch (importError) {
      console.error('Error importing NotesController:', importError)
      return response.status(500).json({
        stage: 'import',
        error: String(importError),
        message: 'Failed to import NotesController'
      })
    }
    
    // Return diagnostic information
    return response.json({
      success: true,
      message: 'Debug test successful',
      note: note,
      controllerImported: !!NotesControllerClass,
      routes: {
        getAll: '/api/notes',
        getOne: `/api/notes/${note.id}`,
        update: `/api/notes/${note.id}`,
        delete: `/api/notes/${note.id}`,
        togglePin: `/api/notes/${note.id}/toggle-pin`
      }
    })
  } catch (error) {
    console.error('Error in notes-direct debug endpoint:', error)
    return response.status(500).json({
      success: false,
      error: String(error),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// Test route for Markdown - removed the direct import of marked, will be handled by controller

// Define API routes for Notes
router.group(() => {
  router.get('notes', [NotesController, 'index'])
  router.post('notes', [NotesController, 'store'])
  router.get('notes/:id', [NotesController, 'show'])
  router.put('notes/:id', [NotesController, 'update'])
  router.delete('notes/:id', [NotesController, 'destroy'])
  router.patch('notes/:id/toggle-pin', [NotesController, 'togglePin'])
}).prefix('/api')

// Define API routes for Projects
router.group(() => {
  router.get('projects', [ProjectsController, 'index'])
  router.post('projects', [ProjectsController, 'store'])
  router.get('projects/:id', [ProjectsController, 'show'])
  router.put('projects/:id', [ProjectsController, 'update'])
  router.delete('projects/:id', [ProjectsController, 'destroy'])
}).prefix('/api')


