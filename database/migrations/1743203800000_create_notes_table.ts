import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notes'

  async up() {
    // Check if table exists first to avoid errors
    const hasTable = await this.db
      .rawQuery(`SELECT name FROM sqlite_master WHERE type='table' AND name='${this.tableName}'`)
      .then(result => result.length > 0)
    
    if (!hasTable) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.string('title').notNullable()
        table.text('content').notNullable()
        table.boolean('pinned').defaultTo(false)
        table.string('image_url').nullable() // Include image_url in the initial table creation
        
        table.timestamp('created_at', { useTz: true }).notNullable()
        table.timestamp('updated_at', { useTz: true }).nullable()
      })
    }
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
