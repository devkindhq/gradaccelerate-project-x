import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class PageController {
    // Home pages
    public async home({ inertia }: HttpContext) {
        return inertia.render('home')
    }

    public async todos({ inertia }: HttpContext) {
        return inertia.render('todos/index')
    }

    // Notes pages
    public async notesIndex({ inertia }: HttpContext) {
        return inertia.render('notes/index')
    }

    // Projects pages
    public async projectsIndex({ inertia }: HttpContext) {
        return inertia.render('projects/index')
    }

    public async projectsCreate({ inertia }: HttpContext) {
        return inertia.render('projects/create')
    }

    public async projectsShow({ params, inertia }: HttpContext) {
        try {
            const project = await Project.findOrFail(params.id)
            return inertia.render('projects/show', { project, params })
        } catch (error) {

            return inertia.render('projects/index')
        }
    }

    public async projectsEdit({ params, inertia }: HttpContext) {
        try {
            const project = await Project.findOrFail(params.id)
            return inertia.render('projects/edit', { project, params })
        } catch (error) {

            return inertia.render('projects/index')
        }
    }
}
