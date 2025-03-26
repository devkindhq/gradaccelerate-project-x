import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Note extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare imageUrl: string

  @column({
    prepare: (value: boolean) => Number(value), 
    consume: (value: number) => Boolean(value), 
  })
  declare pinned: boolean

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
  declare updatedAt: DateTime | null
} 