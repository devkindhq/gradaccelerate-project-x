import type { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'

export default class TodosController {
     // Fetch all todos
  public async index({ response }: HttpContext) {
    const todos = await Todo.all()
    return response.json(todos)
  }

  // Create a new todo
  public async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description', 'completed', 'labels', 'dueDate'])
    const todo = await Todo.create(data)
    return response.status(201).json(todo)
  }

  // Get a single todo
  public async show({ params, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    return response.json(todo)
  }

  // Update a todo
  public async update({ params, request, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    const data = request.only(['title', 'description', 'completed', 'labels', 'dueDate'])
    todo.merge(data)
    await todo.save()
    return response.json(todo)
  }

  // Delete a todo
  public async destroy({ params, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    await todo.delete()
    return response.status(204).send('')
  }
}