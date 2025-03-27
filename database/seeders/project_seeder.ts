import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Project from '#models/project'

export default class ProjectSeeder extends BaseSeeder {
  public async run () {
    // Create initial sample projects
    const sampleProjects = [
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
    ]
    
    // Create additional projects to test pagination (total of 20 projects)
    const additionalProjects = []
    
    for (let i = 1; i <= 17; i++) {
      additionalProjects.push({
        title: `Project ${i + 3}`,
        description: `This is a sample project ${i + 3} for testing pagination`,
        status: ['pending', 'in-progress', 'completed'][i % 3],
      })
    }
    
    await Project.createMany([...sampleProjects, ...additionalProjects])
  }
}