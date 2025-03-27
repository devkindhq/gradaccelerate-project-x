import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class ProjectsController {
  public async index({ request }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 9)
      
      const pageNumber = typeof page === 'string' ? parseInt(page) : page
      const limitNumber = typeof limit === 'string' ? parseInt(limit) : limit
      
      const projects = await Project.query()
        .orderBy('updatedAt', 'desc')
        .paginate(pageNumber, limitNumber)
      
      return projects
    } catch (error) {
      return { data: [], meta: { current_page: 1, last_page: 1, total: 0 } }
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['title', 'description', 'status'])
      
      // Basic validation
      if (!data.title?.trim()) {
        return response.status(400).json({
          error: 'Title is required'
        })
      }
      
      if (!data.description?.trim()) {
        return response.status(400).json({
          error: 'Description is required'
        })
      }
      
      // Validate status if present
      if (data.status && !['pending', 'in-progress', 'completed'].includes(data.status)) {
        return response.status(400).json({
          error: 'Status must be one of: pending, in-progress, completed'
        })
      }
      
      // Set default status if not provided
      if (!data.status) {
        data.status = 'pending'
      }
      
      // Create the project
      const project = await Project.create(data)
      return response.status(201).json(project)
    } catch (error) {
      return response.status(500).json({
        error: 'Failed to create project',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const project = await Project.findOrFail(params.id)
      return project
    } catch (error) {
      return response.status(404).json({ error: 'Project not found' })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const project = await Project.findOrFail(params.id)
      const data = request.only(['title', 'description', 'status'])
      
      // Validate status if present
      if (data.status && !['pending', 'in-progress', 'completed'].includes(data.status)) {
        return response.status(400).json({
          error: 'Status must be one of: pending, in-progress, completed'
        })
      }
      
      project.merge(data)
      await project.save()
      return project
    } catch (error) {
      return response.status(404).json({ error: 'Project not found' })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const project = await Project.findOrFail(params.id)
      await project.delete()
      return response.status(200).json({ message: 'Project deleted successfully' })
    } catch (error) {
      return response.status(404).json({ error: 'Project not found' })
    }
  }
}