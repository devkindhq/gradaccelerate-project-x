import { ProjectStatus } from '#models/project'
import vine from '@vinejs/vine'


export const schemaProject = vine.compile(
    vine.object({
        name: vine.string(),
        description: vine.string(),
        status: vine.enum([ProjectStatus.PENDING, ProjectStatus.INPROGRESS, ProjectStatus.COMPLETED]),
    })
)

