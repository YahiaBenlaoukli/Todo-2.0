import React from 'react'
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState<string[]>([])
  const [showPopUpSection, setShowPopUpSection] = useState<boolean>(false)


  const handleAddTodoTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTodos(prev => [...prev, 'New Todo Item'])
  }

  const handleSumbitTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

  }
  return (
    <>
      <div>
        <h1>Welcome to My todo App</h1>
      </div>
      <div>
        <ul >
          {todos.map((todo, index) => <li key={index}>{todo}</li>)}
        </ul>
      </div>
      {!showPopUpSection && <div>
        <button
          onClick={() => setShowPopUpSection(true)}>Add Todo</button>
      </div >}
      {showPopUpSection && <div>
        <form onSubmit={handleAddTodoTask}>
          <label >Task Name:</label>
          <input type="text" placeholder='Your Task' />
          <label >TaskConetnt:</label>
          <input type="text" placeholder='TaskDescription' />
          <button type="submit" onClick={handleSumbitTask}>Add Task</button>
        </form>
      </div>}
    </>
  )
}

export default App
