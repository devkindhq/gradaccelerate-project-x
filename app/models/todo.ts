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
}