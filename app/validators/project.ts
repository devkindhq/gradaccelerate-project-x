import { ProjectStatus } from '#enums/project-enum'
import vine from '@vinejs/vine'


export const schemaProject = vine.compile(
    vine.object({
        name: vine.string(),
        description: vine.string(),
        status: vine.enum([ProjectStatus.PENDING, ProjectStatus.INPROGRESS, ProjectStatus.COMPLETED]),
    })
)

