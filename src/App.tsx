import React, { useEffect, useState } from 'react'
import { Todo } from './types'
import { getTodos, createTodo, updateTodo, deleteTodo } from './services/api'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const data = await getTodos()
      setTodos(data)
    } catch (err) {
      setError('Failed to load ToDos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleCreate = async (todo: Omit<Todo, 'id'>) => {
    try {
      const newTodo = await createTodo(todo)
      setTodos((prev) => [...prev, newTodo])
    } catch (err) {
      setError('Failed to create ToDo')
    }
  }

  const handleUpdate = async (todo: Todo) => {
    try {
      const updated = await updateTodo(todo)
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      setEditingTodo(null)
    } catch (err) {
      setError('Failed to update ToDo')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError('Failed to delete ToDo')
    }
  }

  return (
    <div className="app">
      <h1>ToDo App</h1>
      {error && <div role="alert" className="error">{error}</div>}
      <TodoForm onSubmit={editingTodo ? handleUpdate : handleCreate} editingTodo={editingTodo} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TodoList todos={todos} onEdit={setEditingTodo} onDelete={handleDelete} />
      )}
    </div>
  )
}

export default App
