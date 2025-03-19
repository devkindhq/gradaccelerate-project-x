import Project from '#models/project'
import { schemaProject } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'
import AppException from '#exceptions/app_exception'

export default class ProjectsController {
  /**
   * Display a list of resources
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const projects = await Project.query().paginate(page, limit)

      return response.status(200).json(projects)
    } catch (error) {
      throw new AppException('Failed to fetch projects', { status: 500 })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, logger }: HttpContext) {
    try {
      // Validate the request data
      const data = await request.validateUsing(schemaProject)
      logger.info("data: " + JSON.stringify(data))
      console.log(data, "data: " + JSON.stringify(data))

      const project = await Project.create(data)

      return response.status(201).json({
        message: 'Project created successfully',
        data: project,
      })
    } catch (error) {
      if ('messages' in error) {
        // Validation error
        throw new AppException(error.messages, { status: 422 }) 
      }
      throw new AppException(error.message || 'Failed to create project', { status: 400 })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response, logger }: HttpContext) {
    try {
      console.log(params, "params: " + JSON.stringify(params))
      logger.info(params, "params: " + JSON.stringify(params))
      const project = await Project.findByOrFail('id', params.id)
      return response.status(200).json({
        message: 'Project retrieved successfully',
        data: project,
      })
    } catch (error) {
      throw new AppException('Project not found', { status: 404 })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, logger }: HttpContext) {
    try {
      console.log(params, "params: " + JSON.stringify(params))
      logger.info(params, "params: " + JSON.stringify(params))

      const project = await Project.findByOrFail('id', params.id)
      project.merge(await request.validateUsing(schemaProject))
      await project.save()

      return response.status(200).json({
        message: 'Project updated successfully',
        data: project,
      })
    } catch (error) {
      if ('messages' in error) {
        // Validation error
        throw new AppException(error.messages, { status: 422 }) 
      }
      throw new AppException(error.message || 'Failed to update project', { status: 400 })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const project = await Project.findByOrFail('id', params.id)
      await project.delete()
      return response.status(200).json({
        message: 'Project deleted successfully',
        data: project,
      })
    } catch (error) {
      throw new AppException('Failed to delete project', { status: 400 })
    }
  }
}
