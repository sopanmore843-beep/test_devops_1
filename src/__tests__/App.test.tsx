import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import App from '../App'
import { vi } from 'vitest'
import * as api from '../services/api'
import { Todo } from '../types'

vi.mock('../services/api')

const mockTodos: Todo[] = [
  { id: 1, title: 'Test 1', status: 'pending' },
  { id: 2, title: 'Test 2', status: 'completed' }
]

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders todos', async () => {
    vi.spyOn(api, 'getTodos').mockResolvedValue(mockTodos)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Test 1')).toBeInTheDocument()
      expect(screen.getByText('Test 2')).toBeInTheDocument()
    })
  })

  it('can create todo', async () => {
    vi.spyOn(api, 'getTodos').mockResolvedValue([])
    vi.spyOn(api, 'createTodo').mockResolvedValue({
      id: 3,
      title: 'New Todo',
      status: 'pending'
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('No ToDos')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Todo' }
    })

    fireEvent.click(screen.getByText(/add/i))

    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument()
    })
  })
})
