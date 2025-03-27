import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Todo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column({ prepare: (value) => value || null })
  declare description: string | null

  @column()
  declare completed: boolean

  @column()
  declare labels: string | null

  @column.dateTime({ columnName: 'due_date' })
  declare dueDate: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Helper methods
  public getLabelsArray(): string[] {
    return this.labels ? this.labels.split(',').map(label => label.trim()) : []
  }

  public setLabelsArray(labels: string[]): void {
    this.labels = labels.join(',')
  }
}