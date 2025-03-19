import Note from '#models/note'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class NoteSeeder extends BaseSeeder {
  public async run() {
    await Note.createMany([
      {
        title: 'First Note',
        content: 'This is the content of the first note.',
      },
      {
        title: 'Second Note',
        content: 'This is the content of the second note.',
      },
    ])
  }
}