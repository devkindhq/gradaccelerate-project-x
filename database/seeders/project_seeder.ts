import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Project from '#models/project'

export default class ProjectSeeder extends BaseSeeder {
  public async run () {
    await Project.createMany([
      {
        title: 'PetPalace Website',
        description: 'A web platform for pet services',
        status: 'pending',
      },
      {
        title: 'PetPalace Mobile App',
        description: 'A mobile app for customers and service providers',
        status: 'in-progress',
      },
      {
        title: 'Production Deployment',
        description: 'Final testing and deployment to production',
        status: 'completed',
      },
    ])
  }
}