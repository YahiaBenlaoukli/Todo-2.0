import { useState, useEffect } from 'react'

// components
import Navbar from './components/Navbar.tsx'
import CreateTodoModal from './components/CreateTodoModal.tsx'
import EditTodoModal from './components/EditTodoModal.tsx'
import TodoItem from './components/TodoItem.tsx'

import type { todo } from '../electron/services/types.ts'
import { FiEdit2, FiPlus } from 'react-icons/fi'
import './index.css'

function App() {
  const [todos, setTodos] = useState<todo[]>([])
  const [showPopUpSection, setShowPopUpSection] = useState<boolean>(false)
  const [showEditSection, SetEditSection] = useState<boolean>(false)
  const [updateTodo, setUpdateTodo] = useState<todo | null>(null)


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


  const handleAddTodoTask = async (name: string, description: string) => {
    const response: any = await window.ipcRenderer.invoke('add-todo', name, description)

    const newTodo: todo = {
      id: response.data.id,
      name: name,
      description: description,
      created_at: new Date().toISOString()
    }
    if (response.status === 'success') {
      setTodos(prev => [...prev, newTodo])
    } else {
      console.error('Failed to add todo:', response.message)
    }
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

  const handleUpdateTodo = async (id: number, name: string, description: string) => {
    const response: any = await window.ipcRenderer.invoke('update-todo', id, name, description)
    const todo: todo = {
      id: id || 0,
      name: name,
      description: description,
      created_at: updateTodo?.created_at || new Date().toISOString()
    }
    if (response.status === 'success') {
      setTodos(prev => prev.filter(t => t.id !== todo.id))
      setTodos(prev => [...prev, todo])
    } else {
      console.error('Failed to update todo:', response.message)
    }
    SetEditSection(false)
    setUpdateTodo(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="md:ml-64 ml-0 min-h-screen transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-lora font-bold text-secondary mb-2">My Tasks</h1>
              <p className="text-accent">Manage your daily goals and projects</p>
            </div>
            <button
              onClick={() => setShowPopUpSection(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <FiPlus className="text-xl" />
              <span className="font-medium">New Task</span>
            </button>
          </div>

          {todos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-gray-300 mb-4 flex justify-center">
                <FiEdit2 className="text-6xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">No tasks yet</h3>
              <p className="text-gray-500 mt-2">Get started by creating a new task above.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onEdit={(t) => {
                    setUpdateTodo(t)
                    SetEditSection(true)
                  }}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}

          <CreateTodoModal
            isOpen={showPopUpSection}
            onClose={() => setShowPopUpSection(false)}
            onAdd={handleAddTodoTask}
          />

          <EditTodoModal
            isOpen={showEditSection}
            onClose={() => {
              SetEditSection(false)
              setUpdateTodo(null)
            }}
            onUpdate={handleUpdateTodo}
            todo={updateTodo}
          />
        </div>
      </div>
    </div>
  )
}

export default App
