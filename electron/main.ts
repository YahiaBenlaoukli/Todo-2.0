import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import { ipcMain } from 'electron'
import path from 'node:path'
import { getTodos, addTodo, deleteTodo, updateTodo } from './services/db.ts'
import { getRoadmaps, addRoadmap, deleteRoadmap, getRoadmapNodes, addTaskNode, addResourceNode, addNoteNode, addMilestoneNode, deleteNode, updateNode, updateNodePosition, addEdge, deleteEdge, updateEdge, getEdges } from './services/roadmap.ts'

/**
 * Main Process entry point for the Todo 2.0 Electron application.
 * Handles window creation, lifecycle events, and IPC communication with the renderer process.
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

/**
 * Creates the main application window.
 */
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {

  // --- Task IPC Handlers ---

  /** Fetches all todos from the database */
  ipcMain.handle('get-todos', () => getTodos());

  /** Adds a new todo */
  ipcMain.handle('add-todo', (_event, taskName, taskDes) => addTodo(taskName, taskDes));

  /** Deletes a todo by ID */
  ipcMain.handle('delete-todo', (_event, id) => deleteTodo(id));

  /** Updates an existing todo */
  ipcMain.handle('update-todo', (_event, id, taskName, taskDes) => updateTodo(id, taskName, taskDes));

  // --- Roadmap IPC Handlers ---

  /** Fetches all available roadmaps */
  ipcMain.handle('get-roadmaps', () => getRoadmaps());

  /** Creates a new roadmap */
  ipcMain.handle('add-roadmap', (_event, name) => addRoadmap(name));

  /** Deletes a roadmap and its associated nodes/edges */
  ipcMain.handle('delete-roadmap', (_event, id) => deleteRoadmap(id));

  /** Fetches all nodes for a specific roadmap */
  ipcMain.handle('get-roadmap-nodes', (_event, roadmapId) => getRoadmapNodes(roadmapId));

  /** Adds a task node to a roadmap */
  ipcMain.handle('add-task-node', (_event, roadmapId, title, content, status, type, positionX, positionY) => addTaskNode(roadmapId, title, content, status, type, positionX, positionY));

  /** Adds a resource node to a roadmap */
  ipcMain.handle('add-resource-node', (_event, roadmapId, title, content, url, type, positionX, positionY) => addResourceNode(roadmapId, title, content, url, type, positionX, positionY));

  /** Adds a note node to a roadmap */
  ipcMain.handle('add-note-node', (_event, roadmapId, title, content, type, positionX, positionY) => addNoteNode(roadmapId, title, content, type, positionX, positionY));

  /** Adds a milestone node to a roadmap */
  ipcMain.handle('add-milestone-node', (_event, roadmapId, title, content, dueDate, type, positionX, positionY) => addMilestoneNode(roadmapId, title, content, dueDate, type, positionX, positionY));

  /** Deletes a node by ID */
  ipcMain.handle('delete-node', (_event, id) => deleteNode(id));

  /** Updates node content and position */
  ipcMain.handle('update-node', (_event, id, title, content, status, positionX, positionY) => updateNode(id, title, content, status, positionX, positionY));

  /** Updates only the position of a node */
  ipcMain.handle('update-node-position', (_event, id, positionX, positionY) => updateNodePosition(id, positionX, positionY));

  // --- Edge IPC Handlers ---

  /** Fetches all edges for a specific roadmap */
  ipcMain.handle('get-roadmap-edges', (_event, roadmapId) => getEdges(roadmapId));

  /** Adds a new edge between two nodes */
  ipcMain.handle('add-edge', (_event, sourceId, targetId, type) => addEdge(sourceId, targetId, type));

  /** Deletes an edge by ID */
  ipcMain.handle('delete-edge', (_event, id) => deleteEdge(id));

  /** Updates the type/style of an edge */
  ipcMain.handle('update-edge-type', (_event, id, type) => updateEdge(id, type));


  createWindow();
});