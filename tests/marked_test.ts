import { marked } from 'marked'

console.log('Testing marked package:')
try {
  const html = marked('# Test Heading\n\nThis is a **bold** text.')
  console.log('Converted HTML:', html)
  console.log('Marked is working correctly!')
} catch (error) {
  console.error('Error using marked:', error)
}
