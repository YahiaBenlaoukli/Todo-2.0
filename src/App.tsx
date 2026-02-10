import React, { useState, useEffect } from 'react'

// components
import Navbar from './components/Navbar.tsx'
import type { todo } from '../electron/services/types.ts'
import { FiTrash2, FiEdit2, FiPlus, FiX } from 'react-icons/fi'
import './App.css'
import './index.css'



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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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
              <div key={todo.id} className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 transition-all duration-200 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                      Task #{todo.id}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(todo.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-lora line-clamp-2">{todo.name}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-4 leading-relaxed">{todo.description}</p>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleUpdateTodo(todo)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-accent hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPopUpSection && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-secondary font-lora">Create New Task</h2>
                <button
                  onClick={() => setShowPopUpSection(false)}
                  className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleAddTodoTask} className="p-6">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Add details about this task..."
                    value={taskDes}
                    onChange={(e) => setTaskDes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPopUpSection(false)}
                    className="flex-1 px-4 py-3 font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
