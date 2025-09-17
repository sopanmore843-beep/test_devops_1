import express from 'express'
import fs from 'fs'
import cors from 'cors'
import path from 'path'

const app = express()
const PORT = 3000
const DB_PATH = path.join(__dirname, 'db.json')

app.use(cors())
app.use(express.json())

const readTodos = (): any[] => {
  const data = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

const writeTodos = (todos: any[]): void => {
  fs.writeFileSync(DB_PATH, JSON.stringify(todos, null, 2))
}

app.get('/api/todos', (req, res) => {
  const todos = readTodos()
  res.json(todos)
})

app.post('/api/todos', (req, res) => {
  const todos = readTodos()
  const newTodo = {
    id: Date.now(),
    ...req.body
  }
  todos.push(newTodo)
  writeTodos(todos)
  res.status(201).json(newTodo)
})

app.put('/api/todos/:id', (req, res) => {
  const todos = readTodos()
  const id = parseInt(req.params.id)
  const index = todos.findIndex((t) => t.id === id)
  if (index === -1) return res.status(404).send('Not found')
  todos[index] = { ...todos[index], ...req.body }
  writeTodos(todos)
  res.json(todos[index])
})

app.delete('/api/todos/:id', (req, res) => {
  let todos = readTodos()
  const id = parseInt(req.params.id)
  todos = todos.filter((t) => t.id !== id)
  writeTodos(todos)
  res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
