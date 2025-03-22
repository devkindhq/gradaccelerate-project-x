import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Project from '#models/project'
import { ProjectStatus } from '../../app/enum/project.js'

export default class ProjectSeeder extends BaseSeeder {
  async run() {
    // Create sample projects
    await Project.createMany([
      {
        title: 'AdonisJS Web Application',
        description: 'Building a web application using AdonisJS with React and Inertia.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        title: 'Mobile App Development',
        description: 'Creating a cross-platform mobile application using React Native.',
        status: ProjectStatus.PENDING,
      },
      {
        title: 'Database Migration Tool',
        description: 'A tool to help with database migrations and schema changes.',
        status: ProjectStatus.COMPLETED,
      },
      {
        title: 'API Integration Service',
        description:
          'Building a service to integrate with third-party APIs and provide a unified interface.',
        status: ProjectStatus.IN_PROGRESS,
      },
      {
        title: 'Authentication Module',
        description:
          'Implementation of a secure authentication system with multi-factor authentication support.',
        status: ProjectStatus.COMPLETED,
      },
    ])
  }
}
