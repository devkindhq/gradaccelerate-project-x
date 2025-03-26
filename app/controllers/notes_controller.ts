import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'
import cloudinary from '#config/cloudinary';
import Todo from '#models/todo';
import { ImageValidator } from '#validators/note';

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
    const data = request.only(['title', 'content', 'pinned', 'imageUrl', "labels"])
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

    const data = request.only(['title', 'content', 'pinned', 'imageUrl', "labels"]); 
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
  
  /**
   * Upload an image
  */
  async upload({ request, response }: HttpContext) {
    const payload = await request.validateUsing(ImageValidator)
  
    if (!payload.image) {
      return response.badRequest({ error: 'No image file provided' })
    }
  
    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(payload.image.tmpPath!, {
      folder: 'adonis_uploads',
    })
  
    return response.ok({ message: 'Image uploaded successfully', imageUrl: result.secure_url })
  }

} 