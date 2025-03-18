import { HttpContext } from '@adonisjs/core/http'
import Project, { ProjectStatus } from '#models/project'

export default class ProjectsController {
  /**
   * Display a paginated list of projects
   */
  async index({ request, inertia, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    
    const projects = await Project.query().paginate(page, limit)
    
    if (request.accepts(['html'])) {
      return inertia.render('projects/index', { projects })
    }
    
    return response.json(projects)
  }

  /**
   * Show the form for creating a new project
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('projects/create')
  }

  /**
   * Store a newly created project
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description', 'status'])
    const project = await Project.create(data)
    
    return response.redirect().toRoute('projects.index')
  }

  /**
   * Display the specified project
   */
  async show({ params, request, response, inertia }: HttpContext) {
    const project = await Project.find(params.id)
    
    if (!project) {
      return response.notFound({ message: 'Project not found' })
    }
    
    if (request.accepts(['html'])) {
      return inertia.render('projects/show', { project })
    }
    
    return response.json(project)
  }

  /**
   * Show the form for editing the specified project
   */
  async edit({ params, inertia, response }: HttpContext) {
    const project = await Project.find(params.id)
    
    if (!project) {
      return response.notFound({ message: 'Project not found' })
    }
    
    return inertia.render('projects/edit', { project })
  }

  /**
   * Update the specified project
   */
  async update({ params, request, response }: HttpContext) {
    const project = await Project.find(params.id)
    
    if (!project) {
      return response.notFound({ message: 'Project not found' })
    }
    
    const data = request.only(['title', 'description', 'status'])
    await project.merge(data).save()
    
    return response.redirect().toRoute('projects.index')
  }

  /**
   * Update the status of the specified project
   */
  async updateStatus({ params, request, response }: HttpContext) {
    const project = await Project.find(params.id)
    
    if (!project) {
      return response.notFound({ message: 'Project not found' })
    }
    
    const { status } = request.only(['status'])
    
    // Validate status
    if (!Object.values(ProjectStatus).includes(status)) {
      return response.badRequest({ message: 'Invalid status value' })
    }
    
    await project.merge({ status }).save()
    
    return response.json(project)
  }

  /**
   * Remove the specified project
   */
  async destroy({ params, response }: HttpContext) {
    const project = await Project.find(params.id)
    
    if (!project) {
      return response.notFound({ message: 'Project not found' })
    }
    
    await project.delete()
    
    return response.redirect().toRoute('projects.index')
  }
}