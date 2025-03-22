import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'
import { marked } from 'marked'

export default class NotesController {
  /**
   * Display a list of notes with sorting options
   */
  async index({ inertia, request, response }: HttpContext) {
    const sortBy = request.input('sort_by', 'created_at')
    const sortOrder = request.input('sort_order', 'desc')

    // Validate sortBy parameter to prevent SQL injection
    const allowedSortFields = ['created_at', 'updated_at', 'title']
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at'

    // Validate sortOrder parameter
    const validSortOrder = sortOrder === 'asc' ? 'asc' : 'desc'

    // Fetch notes with sorting, pinned notes always first
    const notes = await Note.query()
      .orderBy('pinned', 'desc')
      .orderBy(validSortBy, validSortOrder)
      .exec()

    // Parse markdown content if requested in HTML format
    if (request.accepts(['html'])) {
      return inertia.render('notes/index', {
        notes,
        // Pass current sort parameters to preserve state
        sortBy: validSortBy,
        sortOrder: validSortOrder,
      })
    }

    // For API requests, return JSON
    return response.json(notes)
  }

  /**
   * Get a specific note
   */
  async show({ params, response, request, inertia }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    // If HTML is requested, render the detail view with markdown parsed
    if (request.accepts(['html'])) {
      const htmlContent = marked(note.content || '')
      return inertia.render('notes/show', {
        note,
        htmlContent,
      })
    }

    // Parse markdown if format=html is requested in API
    if (request.input('format') === 'html' && note.content) {
      const htmlContent = marked(note.content)
      return response.json({
        ...note.toJSON(),
        html_content: htmlContent,
      })
    }

    return response.json(note)
  }

  /**
   * Store a new note
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'content', 'pinned'])

    // Default pinned to false if not provided
    if (data.pinned === undefined) {
      data.pinned = false
    }

    const note = await Note.create(data)

    if (request.accepts(['html'])) {
      return response.redirect().back()
    }

    return response.status(201).json(note)
  }

  /**
   * Update a note
   */
  async update({ params, request, response }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    const data = request.only(['title', 'content', 'pinned'])
    await note.merge(data).save()

    if (request.accepts(['html'])) {
      return response.redirect().back()
    }

    return response.json(note)
  }

  /**
   * Show form for editing a note
   */
  async edit({ params, response, inertia }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    // Return the note data for the edit form
    return inertia.render('notes/edit', { note })
  }

  /**
   * Toggle note pinned status
   */
  async togglePin({ params, response, request }: HttpContext) {
    const note = await Note.find(params.id)
    if (!note) {
      return response.notFound({ message: 'Note not found' })
    }

    note.pinned = !note.pinned
    await note.save()

    // Check if the request is from an Inertia page (accepts HTML)
    if (request.accepts(['html'])) {
      return response.redirect().back()
    }

    return response.json(note)
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
