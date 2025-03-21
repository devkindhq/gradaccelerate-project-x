import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'

// Define possible status values as enum
export enum ProjectStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  
  // Validate and normalize status before saving
  @beforeSave()
  public static validateStatus(project: Project) {
    // If status is not set, default to pending
    if (!project.status) {
      project.status = ProjectStatus.PENDING
      return
    }
    
    // Make sure status is one of the allowed values
    if (!Object.values(ProjectStatus).includes(project.status as ProjectStatus)) {
      project.status = ProjectStatus.PENDING
    }
  }
  
  // Helper method to check if a project is completed
  public isCompleted(): boolean {
    return this.status === ProjectStatus.COMPLETED
  }
  
  // Helper method to check if a project is in progress
  public isInProgress(): boolean {
    return this.status === ProjectStatus.IN_PROGRESS
  }
  
  // Helper method to check if a project is pending
  public isPending(): boolean {
    return this.status === ProjectStatus.PENDING
  }
}