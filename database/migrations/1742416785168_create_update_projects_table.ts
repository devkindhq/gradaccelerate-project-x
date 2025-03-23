import { ProjectStatus } from '#models/project'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
         table.enum('status', [ProjectStatus.PENDING, ProjectStatus.INPROGRESS, ProjectStatus.COMPLETED]).defaultTo(ProjectStatus.PENDING)
   
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status') 
    })  
  }
}