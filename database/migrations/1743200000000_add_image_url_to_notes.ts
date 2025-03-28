import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notes'

  // Skip this migration since we're now creating the table with the image_url column already included
  async up() {
    // Do nothing - we'll create the table with image_url in the other migration
  }

  async down() {
    // Do nothing
  }
}
