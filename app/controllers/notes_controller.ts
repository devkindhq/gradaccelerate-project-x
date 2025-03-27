import { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'

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
}