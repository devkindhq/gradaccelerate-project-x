import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class ProjectsController {
  public async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    const projects = await Project.query().paginate(page, limit)
    return projects
  }

  public async store({ request }: HttpContext) {
    const data = request.only(['title', 'description', 'status'])
    const project = await Project.create(data)
    return project
  }

  public async show({ params }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    return project
  }

  public async update({ params, request }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    const data = request.only(['title', 'description', 'status'])
    project.merge(data)
    await project.save()
    return project
  }

  public async destroy({ params }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    await project.delete()
    return { message: 'Project deleted successfully' }
  }
}