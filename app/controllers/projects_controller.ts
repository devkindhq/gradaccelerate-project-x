import Project from '#models/project'
import { schemaProject } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
  /**
   * Display a list of resources
   */
  async index({ request, response, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    const projects = await Project.query().orderBy('created_at', 'desc').paginate(page, limit)

    return inertia.render('projects/index', { projects })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, logger }: HttpContext) {
      const data = await request.validateUsing(schemaProject)
      logger.info("Data received: %j", data)

      await Project.create(data)

      return response.redirect().back();
  }

  /**
   * Show individual record
   */
  async show({ params, response, logger }: HttpContext) {
      logger.info("params received: %j", params)

      const project = await Project.findByOrFail('id', params.id)
      return response.status(200).json({
        message: 'Project retrieved successfully',
        data: project,
      })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, logger }: HttpContext) {
      logger.info("params received: %j", params)

      const project = await Project.findByOrFail('id', params.id)
      project.merge(await request.validateUsing(schemaProject))
      await project.save()

      return response.redirect().back();
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const project = await Project.findByOrFail('id', params.id)
    await project.delete()
    return response.redirect().back()
  }
}
