import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Todo from '#models/todo'
import { DateTime } from 'luxon'

export default class TodoSeeder extends BaseSeeder {
  async run() {
    await Todo.createMany([
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the API endpoints and models',
        completed: false,
        labels: 'work,documentation,urgent',
        dueDate: DateTime.now().plus({ days: 7 }),
      },
      {
        title: 'Fix navigation bug',
        description: 'The sidebar navigation collapses unexpectedly when clicking on submenu items',
        completed: false,
        labels: 'bug,frontend,high-priority',
        dueDate: DateTime.now().plus({ days: 2 }),
      },
      {
        title: 'Implement user authentication',
        description: 'Add login, registration, and password reset functionality',
        completed: true,
        labels: 'feature,security,backend',
        dueDate: DateTime.now().minus({ days: 5 }),
      },
      {
        title: 'Design landing page mockup',
        description: 'Create a mockup for the new landing page design with brand colors',
        completed: false,
        labels: 'design,marketing',
        dueDate: DateTime.now().plus({ days: 14 }),
      },
      {
        title: 'Update dependencies',
        description: 'Update all npm packages to their latest versions and test compatibility',
        completed: false,
        labels: 'maintenance,development',
        dueDate: DateTime.now().plus({ days: 10 }),
      },
      {
        title: 'Schedule team meeting',
        description: 'Organize weekly team sync meeting and prepare agenda',
        completed: true,
        labels: 'meeting,team',
        dueDate: DateTime.now().minus({ days: 2 }),
      },
      {
        title: 'Research new API integration',
        description: 'Explore options for integrating with payment gateway APIs',
        completed: false,
        labels: 'research,api,payments',
        dueDate: DateTime.now().plus({ days: 5 }),
      },
      {
        title: 'Optimize database queries',
        description: 'Improve performance of slow-running database queries',
        completed: false,
        labels: 'performance,database,optimization',
        dueDate: DateTime.now().plus({ days: 3 }),
      },
      {
        title: 'Create user onboarding flow',
        description: 'Design and implement the onboarding experience for new users',
        completed: false,
        labels: 'ux,frontend,onboarding',
        dueDate: DateTime.now().plus({ days: 8 }),
      },
      {
        title: 'Write unit tests',
        description: 'Increase test coverage for core functionality',
        completed: true,
        labels: 'testing,qa',
        dueDate: DateTime.now().minus({ days: 1 }),
      }
    ])
  }
}
