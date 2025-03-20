import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'

export default class NotesController {
  /**
   * Display a list of notes
   */
  async index({ inertia, request }: HttpContext) {
    const { sortBy = 'created_at', sortOrder  = 'desc'} = request.qs();

    const query = Note.query()
    
    const validSortFields = ['created_at', 'updated_at']
    if (validSortFields.includes(sortBy)) {
      query.orderBy(sortBy, sortOrder)
    } else {
      query.orderBy('created_at', 'desc') // Default fallback
    }

    const notes = await query
    return inertia.render('notes/index', { notes })
  }

  /**
   * Get a specific note
   */
  async show({ params, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }
    return response.json(note)
  }

  /**
   * Store a new note
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'content', 'pinned'])
    await Note.create(data)
    return response.redirect().back()
  }

  /**
   * Update a note
   */
  async update({ params, request, response, inertia }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    const data = request.only(['pinned']); 
    await note.merge(data).save()
    return response.redirect().back();
  }

  /**
   * Delete a note
   */
  async destroy({ params, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    await note.delete()
    return response.redirect().back()
  }
} 