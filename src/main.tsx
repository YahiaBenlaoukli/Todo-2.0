import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import App from './Pages/App.tsx'
import RoadMap from './Pages/RoadMapPage.tsx'
import Notes from './Pages/Notes/Notes.tsx'
import Task from './Pages/Tasks.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/roadmaps" element={<RoadMap />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/tasks" element={<Task />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
