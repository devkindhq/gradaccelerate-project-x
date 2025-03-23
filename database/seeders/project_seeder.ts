import Project, { ProjectStatus } from '#models/project'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Project.createMany([
      {
        name: 'First Project',
        description: 'This is the description of the first project.',
        status: ProjectStatus.PENDING, 
      },
      {
        name: 'Second Project',
        description: 'This is the description of the second project.',
        status: ProjectStatus.PENDING, 
      },
    ])
  }  
}