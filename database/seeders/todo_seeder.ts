import Todo from '#models/todo'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    await Todo.createMany([
      {
        title: 'Buy groceries',
        description: 'Milk, bread, eggs',
        dueDate: '2025-03-25 00:00:00',
      },
      {
        title: 'Finish homework',
        description: 'Math and Science',
        isCompleted: true,
        dueDate: '2025-03-28 00:00:00',
      },
      {
        title: 'Call mom',
        description: 'Check in',
        dueDate: '2025-03-29 00:00:00',
        labels: ['personal', 'urgent'],
      },
    ])
  }
}