import React, { useState, useEffect } from 'react'
import { Todo } from '../types'

interface Props {
  onSubmit: (todo: Todo | Omit<Todo, 'id'>) => void
  editingTodo?: Todo | null
}

const TodoForm: React.FC<Props> = ({ onSubmit, editingTodo }) => {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<'pending' | 'completed'>('pending')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title)
      setStatus(editingTodo.status)
    } else {
      setTitle('')
      setStatus('pending')
    }
  }, [editingTodo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title cannot be empty')
      return
    }
    setError(null)
    if (editingTodo) {
      onSubmit({ ...editingTodo, title, status })
    } else {
      onSubmit({ title, status })
    }
    setTitle('')
    setStatus('pending')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingTodo ? 'Edit ToDo' : 'New ToDo'}</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {error && <div role="alert" className="error">{error}</div>}
      <button type="submit">{editingTodo ? 'Update' : 'Add'}</button>
    </form>
  )
}

export default TodoForm
