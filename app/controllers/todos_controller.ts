import Todo from '#models/todo'
import { createTodoValidator, updateTodoValidator } from '#validators/todo';
import type { HttpContext } from '@adonisjs/core/http'

export default class TodosController {
  /**
   * Display a list of resource
   */
  async index({request, inertia, response, logger}: HttpContext) {
    logger.info("todo get all items getting called")
    const todos = await Todo.all();

    return response.status(200).json({data: todos});
    // return inertia.render('todos/index', { todos });
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, logger  }: HttpContext) {
    logger.info("todo post getting called")
    const data = await request.validateUsing(createTodoValidator);
    const todo = await Todo.create(data);
    await todo.refresh();
    return response.status(201).json({message: 'Todo created successfully', data: todo});
    // return response.redirect().back();
  }

  /**
   * Show individual record
   */
  async show({ params, response, logger }: HttpContext) {
    logger.info("todo get single item getting called")
    const todo = await Todo.findByOrFail('id', params.id);
    return response.status(200).json({data: todo});
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, logger }: HttpContext) {
    const todo = await Todo.findByOrFail('id', params.id);
  
    const validatedData = await request.validateUsing(updateTodoValidator);
    logger.info("todo update item getting called", validatedData);

    todo.merge(validatedData);
    await todo.save();
    
    return response.status(200).json({ message: 'Todo updated successfully', data: todo });
    // return response.redirect().back();
  }

  /**
   * Delete record
   */
  async destroy({ params, response, logger }: HttpContext) {
    const todo = await Todo.findByOrFail('id', params.id);
    logger.info("todo destory getting called", todo)

    await todo.delete() // Sets deletedAt
    return response.json({ message: 'Todo soft deleted', data: todo });
  }
}