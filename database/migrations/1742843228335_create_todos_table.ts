import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'todos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key
      table.string('title').notNullable() // Title of the todo
      table.text('description').nullable() // Description of the todo
      table.boolean('completed').defaultTo(false) // Whether the todo is completed
      table.timestamp('due_date').nullable() // Due date for the todo
      table.string('labels').nullable() // Labels for categorizing tasks
      table.timestamps(true, true) // created_at and updated_at timestamps
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}