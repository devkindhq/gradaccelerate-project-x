import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Note from '#models/note'

export default class NoteSeeder extends BaseSeeder {
  public async run() {
    await Note.createMany([
      {
        title: 'Welcome Note',
        content: '# Welcome to Notes App\n\nThis is a **markdown-enabled** note taking application.',
        pinned: true,
      },
      {
        title: 'Project Ideas',
        content: '## Future Project Ideas\n\n- Build a task management system\n- Create a personal budget tracker\n- Design a recipe organizer',
        pinned: true,
      },
      {
        title: 'Meeting Notes',
        content: 'Discussion about upcoming release:\n- Improve UI/UX\n- Fix reported bugs\n- Add requested features',
        pinned: false,
      },
      {
        title: 'Learning Resources',
        content: '### Resources to check out\n\n1. [TypeScript Documentation](https://www.typescriptlang.org/docs/)\n2. [AdonisJS Guides](https://docs.adonisjs.com/guides/introduction)',
        pinned: false,
      }
    ])
  }
}
