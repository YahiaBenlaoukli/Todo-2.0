import React, { useState, useEffect } from 'react'
import type { todo } from '../electron/services/types.ts'
import './App.css'



function App() {
  const [todos, setTodos] = useState<todo[]>([])
  const [taskName, setTaskName] = useState<string>('')
  const [taskDes, setTaskDes] = useState<string>('')
  const [showPopUpSection, setShowPopUpSection] = useState<boolean>(false)


  const fetchTodos = async () => {
    const response: any = await window.ipcRenderer.invoke('get-todos')
    if (response.status === 'success') {
      setTodos(response.data)
    } else {
      console.error('Failed to fetch todos:', response.message)
    }
  }
  useEffect(() => {
    fetchTodos()
  }, [])


  const handleAddTodoTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newTodo: todo = {
      id: todos.length + 1,
      name: taskName,
      description: taskDes,
      created_at: new Date().toISOString()
    }
    const response: any = await window.ipcRenderer.invoke('add-todo', newTodo)

    if (response.status === 'success') {
      setTodos(prev => [...prev, newTodo])
    } else {
      console.error('Failed to add todo:', response.message)
    }
    setTaskName('')
    setTaskDes('')
    setShowPopUpSection(false)
  }

  const handleDeleteTodo = async (id: number) => {
    const response: any = await window.ipcRenderer.invoke('delete-todo', id)
    if (response.status === 'success') {
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } else {
      console.error('Failed to delete todo:', response.message)
    }
  }

  const handleUpdateTodo = async (todo: todo) => {
    const response: any = await window.ipcRenderer.invoke('update-todo', todo)
    if (response.status === 'success') {
      setTodos(prev => prev.filter(t => t.id !== todo.id))
      setTodos(prev => [...prev, todo])
    } else {
      console.error('Failed to update todo:', response.message)
    }
  }

  return (
    <>
      <h1>Welcome to My Todo App</h1>

      <ul>
        {todos.map(todo => (
          <div key={todo.id}>
            <li>
              <h3>{todo.name}</h3>
              <p>{todo.description}</p>
              <p>{todo.created_at}</p>
            </li>

            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            <button onClick={() => handleUpdateTodo(todo)}>Update</button>
          </div>
        ))}
      </ul>

      {!showPopUpSection && (
        <button onClick={() => setShowPopUpSection(true)}>
          Add Todo
        </button>
      )}

      {showPopUpSection && (
        <form onSubmit={handleAddTodoTask}>
          <label>Task Name:</label>
          <input
            type="text"
            placeholder="Your Task"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />

          <label>Task Content:</label>
          <input
            type="text"
            placeholder="Task Description"
            value={taskDes}
            onChange={(e) => setTaskDes(e.target.value)}
          />

          <button type="submit">Add Task</button>
        </form>
      )}
    </>
  )
}

export default App
