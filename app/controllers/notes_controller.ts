import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'
import fs from 'node:fs'
import path from 'node:path'
import Cloudinary from '#config/cloudinary'

// Simpler approach for markdown - avoid async import which might cause issues
let marked: any
try {
  // Static import with require to avoid any async loading issues
  marked = require('marked').marked
} catch (error) {
  // Create a simple fallback function that returns the original text
  marked = (text: string) => text
}

export default class NotesController {
  /**
   * Display a list of notes with sorting options
   */
  async index({ request, response }: HttpContext) {
    try {
      const sortBy = request.input('sort_by', 'created_at')
      const order = request.input('order', 'desc')
      
      // Validate sorting parameters
      const allowedSortFields = ['created_at', 'updated_at', 'title']
      const allowedOrders = ['asc', 'desc']
      
      const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at'
      const finalOrder = allowedOrders.includes(order) ? order : 'desc'
      
      // First get pinned notes, then get unpinned notes with the requested sorting
      const pinnedNotes = await Note.query()
        .where('pinned', true)
        .orderBy(finalSortBy, finalOrder)
      
      const unpinnedNotes = await Note.query()
        .where('pinned', false)
        .orderBy(finalSortBy, finalOrder)
      
      // Combine the results
      const notes = [...pinnedNotes, ...unpinnedNotes]
      
      return response.json(notes)
    } catch (error) {
      return response.status(500).json({
        error: 'An error occurred while fetching notes',
        details: String(error),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    }
  }
  
  /**
   * Store a new note
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['title', 'content', 'pinned'])
      
      // Add defaults if not provided
      const noteData = {
        title: data.title || 'Untitled Note',
        content: data.content || '',
        pinned: data.pinned === undefined ? false : data.pinned
      }
      
      const note = await Note.create(noteData)
      return response.status(201).json(note)
    } catch (error) {
      return response.status(500).json({
        error: 'An error occurred while creating the note',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      })
    }
  }
  
  /**
   * Display a specific note
   */
  async show({ params, response }: HttpContext) {
    try {
      const note = await Note.find(params.id)
      
      if (!note) {
        return response.status(404).json({ message: 'Note not found' })
      }
      
      // Parse markdown to HTML for frontend rendering
      if (note.content) {
        try {
          const renderedContent = marked(note.content)
          return response.json({ ...note.toJSON(), renderedHtml: renderedContent })
        } catch (markdownError) {
          // Return the note without rendered HTML if markdown parsing fails
          return response.json(note)
        }
      }
      
      return response.json(note)
    } catch (error) {
      return response.status(500).json({
        error: 'An error occurred while fetching the note',
        details: String(error),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    }
  }
  
  /**
   * Update a note
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const note = await Note.find(params.id)
      
      if (!note) {
        return response.status(404).json({ message: 'Note not found' })
      }
      
      const data = request.only(['title', 'content', 'pinned'])
      note.merge(data)
      await note.save()
      
      return response.json(note)
    } catch (error) {
      return response.status(500).json({
        error: 'An error occurred while updating the note',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      })
    }
  }
  
  /**
   * Delete a note
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const note = await Note.find(params.id)
      
      if (!note) {
        return response.status(404).json({ message: 'Note not found' })
      }
      
      await note.delete()
      return response.status(204).send('')
    } catch (error) {
      return response.status(500).json({
        error: 'An error occurred while deleting the note',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      })
    }
  }
  
  /**
   * Toggle the pinned status of a note
   */
  async togglePin({ params, response }: HttpContext) {
    try {
      const note = await Note.find(params.id)
      
      if (!note) {
        return response.status(404).json({ message: 'Note not found' })
      }
      
      note.pinned = !note.pinned
      await note.save()
      
      return response.json(note)
    } catch (error) {
      return response.status(500).json({
        error: 'An error occurred while toggling pin status',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      })
    }
  }

  public async uploadImage({ request, response }: HttpContext) {
    try {
      // Create upload directory in project if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'tmp', 'uploads')
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      // Use project's tmp directory instead of system temp dir
      const imageFile = request.file('image', {
        size: '10mb',
        extnames: ['jpg', 'png', 'jpeg', 'gif'],
      })
      
      if (!imageFile) {
        return response.badRequest({ error: 'No file uploaded' })
      }
      
      try {
        // Use a simple random filename in the project directory
        const uniqueId = Date.now().toString()
        const fileExt = imageFile.extname || 'png'
        const filename = `upload_${uniqueId}.${fileExt}`
        const filePath = path.join(uploadDir, filename)
        
        // Let AdonisJS handle the file move operation
        await imageFile.move(uploadDir, {
          name: filename,
          overwrite: true
        })
        
        // Verify the file exists and has content
        if (!fs.existsSync(filePath)) {
          return response.internalServerError({ error: 'Failed to save uploaded file' })
        }
        
        const stats = fs.statSync(filePath)
        
        if (stats.size === 0) {
          return response.badRequest({ error: 'Uploaded file is empty' })
        }
        
        // Upload to Cloudinary
        const cloudinaryResult = await Cloudinary.uploader.upload(filePath, {
          folder: 'notes_uploads',
          resource_type: 'auto'
        })
        
        // Clean up the file after successful upload
        try {
          fs.unlinkSync(filePath)
        } catch (cleanupError) {
          // Non-critical error, we can continue
        }
        
        return response.ok({
          message: 'Image uploaded successfully!',
          url: cloudinaryResult.secure_url
        })
      } catch (uploadError) {
        return response.internalServerError({
          error: 'Failed to process the image upload',
          details: String(uploadError)
        })
      }
    } catch (error) {
      return response.internalServerError({
        error: 'Failed to handle image upload request',
        details: String(error)
      })
    }
  }

  public async saveNoteWithImage({ request, response }: HttpContext) {
    try {
      const { title, content, imageUrl, pinned = false } = request.only(['title', 'content', 'imageUrl', 'pinned'])
      
      if (!title || !content) {
        return response.badRequest({ error: 'Title and content are required' })
      }
      
      const note = await Note.create({
        title,
        content,
        imageUrl: imageUrl || null,
        pinned: Boolean(pinned)
      })
      
      return response.created({ message: 'Note with image saved successfully!', note })
    } catch (error) {
      return response.internalServerError({ 
        error: 'Failed to save note with image',
        details: error.message
      })
    }
  }
}