import Project from '#models/project'
import { schemaProject } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'
import AppException from '#exceptions/app_exception'

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
      logger.info("data: " + JSON.stringify(data))
      console.log(data, "data: " + JSON.stringify(data))

      await Project.create(data)

      return response.redirect().back();
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
      console.log(params, "params: " + JSON.stringify(params))
      logger.info(params, "params: " + JSON.stringify(params))

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
