/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const NotesController = () => import('#controllers/notes_controller')
import ProjectsController from '#controllers/projects_controller'
import TodosController from '#controllers/todos_controller'
import router from '@adonisjs/core/services/router'

router.get('/', ({ inertia }) => inertia.render('home'))
router.get('/todos', ({ inertia }) => inertia.render('todos/empty'))

router.get('/notes', [NotesController, 'index'])
router.post('/notes', [NotesController, 'store'])
router.put('/notes/:id', [NotesController, 'update'])
router.delete('/notes/:id', [NotesController, 'destroy'])
router.post('/notes/upload', [NotesController, 'upload'])


router.group(() => {
  router.get('/', [ProjectsController, 'index'])
  router.post('/',  [ProjectsController, 'store'])
  router.get('/:id', [ProjectsController, 'show'])
  router.put('/:id', [ProjectsController, 'update'])
  router.delete('/:id', [ProjectsController, 'destroy'])
}).prefix('/projects')


router.group(() => {
  router.get('/', [TodosController, 'index'])
  router.post('/',  [TodosController, 'store'])
  router.get('/:id', [TodosController, 'show'])
  router.put('/:id', [TodosController, 'update'])
  router.delete('/:id', [TodosController, 'destroy'])
}).prefix('/todo')

