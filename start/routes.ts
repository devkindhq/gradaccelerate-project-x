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
import { marked } from 'marked'
import db from '@adonisjs/lucid/services/db'
// import { schema } from '@adonisjs/lucid/build/src/Schema'

import Note from '#models/note'

router.get('/', ({ inertia }) => inertia.render('home'))
router.get('/todos', ({ inertia }) => inertia.render('todos/empty'))

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

// Test route for Markdown
router.get('/test-markdown', ({ response }) => {
  try {
    const markdown = '# Test Heading\n\nThis is a **bold** text.'
    const html = marked(markdown)
    return response.json({
      originalMarkdown: markdown,
      renderedHtml: html,
      success: true
    })
  } catch (error) {
    return response.status(500).json({
      error: String(error),
      success: false
    })
  }
})

// Notes routes - adding better RESTful structure and the pinning toggle route
router.get('/notes', [NotesController, 'index'])
router.post('/notes', [NotesController, 'store'])
router.get('/notes/:id', [NotesController, 'show'])
router.put('/notes/:id', [NotesController, 'update'])
router.delete('/notes/:id', [NotesController, 'destroy'])
router.patch('/notes/:id/toggle-pin', [NotesController, 'togglePin'])

router.group(() => {
  router.get('projects', [ProjectsController, 'index'])
  router.post('projects', [ProjectsController, 'store'])
  router.get('projects/:id', [ProjectsController, 'show'])
  router.put('projects/:id', [ProjectsController, 'update'])
  router.delete('projects/:id', [ProjectsController, 'destroy'])
}).prefix('/api')


