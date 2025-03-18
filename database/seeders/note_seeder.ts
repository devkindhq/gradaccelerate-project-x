import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Note from '#models/note'

export default class NoteSeeder extends BaseSeeder {
  async run() {
    // Create sample notes
    await Note.createMany([
      {
        title: 'Uzair Ahmed Dahraj',
        content: 'Built a MERN-based complaint system with secure authentication and RESTful APIs.',
      },
      {
        title: 'Projects & Experience',
        content: 'Project Lead | ResolveSuite | SZABIST | 2024.',
      },
      {
        title: 'Professional Summary',
        content: 'Full-stack MERN developer with expertise in scalable apps and secure backends.',
      },
      {
        title: 'Academic History',
        content: 'O Levels - The City School. HSC - Aga Khan College. BS CS - SZABIST (3.3 CGPA).',
      },
      {
        title: 'Technical Skills',
        content: 'JavaScript, React, Tailwind, Node, Express, MongoDB, Git, Postman.',
      },
      {
        title: 'Contact',
        content: 'LinkedIn/GitHub: UzairAhmedDahraj | Karachi | +923322666723.',
      }
    ])
  }
}
