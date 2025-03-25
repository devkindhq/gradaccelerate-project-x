import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'

export default class Todo extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare isCompleted: boolean

  @column.dateTime()
  declare dueDate: DateTime

   // Define labels as a column but use custom getter and setter
  @column({
    prepare: (value?: string[] | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value ? JSON.parse(value) : null),
  })
  declare labels?: string[] | null;


  set labels(value: string[] | null) {
    this.$setAttribute('labels', value ? JSON.stringify(value) : null);
  }
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @beforeCreate()
  public static assignUuid(todo: Todo) {
    todo.id = uuidv4() // Auto-set UUID before saving
  }

  // Override the delete method for soft delete
  async delete() {
    const now = DateTime.now();
    await Todo.query()
      .where('id', this.id)
      .update({ deleted_at: now.toSQL({ includeOffset: false }) });
    
    this.deletedAt = now; // Update instance
    this.$isDeleted = true; // Mark as deleted
  }

  // // Override the all method to exclude soft-deleted records
  // public static async all() {
  //   return this.query().whereNull('deleted_at').exec();
  // }
  
}