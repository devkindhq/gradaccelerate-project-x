import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notes'

  public async up() {
    // Only create if it doesn't exist
    if (!(await this.schema.hasTable(this.tableName))) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id').primary()
        table.string('title').notNullable()
        table.text('content').nullable()
        table.boolean('pinned').defaultTo(false)
        table.timestamp('created_at').notNullable()
        table.timestamp('updated_at').nullable()
      })
    }
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
