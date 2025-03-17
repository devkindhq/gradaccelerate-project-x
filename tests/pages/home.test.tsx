import { render, screen } from '@testing-library/react'
import Home from '#inertia/pages/home'

// Mock the Inertia.js components
jest.mock('@inertiajs/react', () => ({
  Head: ({ title }: { title: string }) => <title>{title}</title>,
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Home Component', () => {
  test('renders the page title', () => {
    render(<Home />)
    expect(document.title).toBe('Race Track')
  })

  test('renders the welcome heading', () => {
    render(<Home />)
    expect(screen.getByText('Welcome to Race Track')).toBeInTheDocument()
  })

  test('renders the Notes card with link', () => {
    render(<Home />)
    const notesLink = screen.getByRole('link', { name: /notes/i })
    expect(notesLink).toBeInTheDocument()
    expect(notesLink).toHaveAttribute('href', '/notes')
    expect(screen.getByText('Manage your notes and thoughts in one place')).toBeInTheDocument()
  })

  test('renders the Todos card with link', () => {
    render(<Home />)
    const todosLink = screen.getByRole('link', { name: /todos/i })
    expect(todosLink).toBeInTheDocument()
    expect(todosLink).toHaveAttribute('href', '/todos')
    expect(screen.getByText('Keep track of your tasks and stay organized')).toBeInTheDocument()
  })
})
