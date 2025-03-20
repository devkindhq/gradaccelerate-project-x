import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppException extends Exception {
  async handle(error: this, { response }: HttpContext) {
    response.status(error.status || 500).json({
      message: error.message || 'Something went wrong',
      status: error.status || 500,
    })
  }
}
