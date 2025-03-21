import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notes'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('pinned').defaultTo(false)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('pinned')
    })
  }
}
