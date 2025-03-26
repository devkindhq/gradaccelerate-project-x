import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createTodoValidator = vine.compile(
    vine.object({
        title: vine.string(),
        description: vine.string(),
        dueDate: vine.string().transform((value) => DateTime.fromISO(value)),
        labels: vine.array(vine.string()).optional(),
    })
)

export const updateTodoValidator = vine.compile(
    vine.object({
        title: vine.string().optional(),
        description: vine.string().optional(),
        dueDate: vine.string().optional().transform((value) => ( value ? DateTime.fromISO(value) : undefined)),
        isCompleted: vine.boolean().optional(),
        labels: vine.array(vine.string()).optional(),
    })
)

