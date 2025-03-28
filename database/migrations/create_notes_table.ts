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
        table.string('imageUrl').nullable() // Add imageUrl column
        table.timestamp('created_at').notNullable()
        table.timestamp('updated_at').nullable()
      })
    } else {
      // If table exists but needs the imageUrl column
      if (!(await this.schema.hasColumn(this.tableName, 'imageUrl'))) {
        this.schema.alterTable(this.tableName, (table) => {
          table.string('imageUrl').nullable()
        })
      }
    }
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
