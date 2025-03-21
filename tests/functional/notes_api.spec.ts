import { test } from '@japa/runner'
import Note from '#models/note'
import { marked } from 'marked'

test.group('Notes API', (group) => {
  // Setup: clean database before each test
  group.each.setup(async () => {
    await Note.query().delete()
  })

  test('can fetch all notes with proper sorting', async ({ client }) => {
    // Create test notes
    await Note.createMany([
      {
        title: 'Pinned Note 1',
        content: 'Content for pinned note',
        pinned: true
      },
      {
        title: 'Unpinned Note',
        content: 'Content for unpinned note',
        pinned: false
      },
      {
        title: 'Pinned Note 2',
        content: 'Content for another pinned note',
        pinned: true
      },
    ])

    // Test default sorting (pinned first, then by created_at desc)
    const response = await client.get('/notes')
    response.assertStatus(200)
    const notes = response.body()
    
    // First notes should be pinned
    response.assert?.equal(notes[0].pinned, true)
    response.assert?.equal(notes[1].pinned, true)
    
    // Test custom sorting
    const sortedResponse = await client.get('/notes?sort_by=title&order=asc')
    sortedResponse.assertStatus(200)
    const sortedNotes = sortedResponse.body()

    // Verify pinned notes still come first but are sorted by title
    response.assert?.equal(sortedNotes[0].pinned, true)
    response.assert?.equal(sortedNotes[1].pinned, true)
    // Title of first should come before title of second alphabetically
    response.assert?.isTrue(sortedNotes[0].title < sortedNotes[1].title)
  })

  test('can create a note with markdown content', async ({ client, assert }) => {
    const noteData = {
      title: 'Markdown Test',
      content: '# Heading\n**Bold text**',
      pinned: false
    }

    const response = await client.post('/notes').json(noteData)
    response.assertStatus(201)
    
    const createdNote = response.body()
    assert.equal(createdNote.title, noteData.title)
    assert.equal(createdNote.content, noteData.content)
    assert.equal(createdNote.pinned, noteData.pinned)

    // Test that markdown is rendered when fetching single note
    const showResponse = await client.get(`/notes/${createdNote.id}`)
    showResponse.assertStatus(200)
    const returnedNote = showResponse.body()
    
    // Check if HTML rendering is present
    assert.exists(returnedNote.renderedHtml)
    assert.include(returnedNote.renderedHtml, '<h1>Heading</h1>')
    assert.include(returnedNote.renderedHtml, '<strong>Bold text</strong>')
  })

  test('can toggle pin status', async ({ client, assert }) => {
    // Create a note that's initially unpinned
    const note = await Note.create({
      title: 'Pin Toggle Test',
      content: 'Testing pin toggle functionality',
      pinned: false
    })

    // Toggle pin status
    const response = await client.patch(`/notes/${note.id}/toggle-pin`)
    response.assertStatus(200)
    const updatedNote = response.body()
    
    // Note should now be pinned
    assert.isTrue(updatedNote.pinned)
    
    // Toggle again
    const secondResponse = await client.patch(`/notes/${note.id}/toggle-pin`)
    secondResponse.assertStatus(200)
    const finalNote = secondResponse.body()
    
    // Note should now be unpinned again
    assert.isFalse(finalNote.pinned)
  })
})
