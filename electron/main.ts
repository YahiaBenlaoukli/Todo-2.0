import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import { ipcMain } from 'electron'
import path from 'node:path'
import { getTodos, addTodo, deleteTodo, updateTodo } from './services/db.ts'
import { getRoadmaps, addRoadmap, deleteRoadmap, getRoadmapNodes, addTaskNode, addResourceNode, addNoteNode, addMilestoneNode, deleteNode, updateNode, updateNodePosition } from './services/roadmap.ts'

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


  ipcMain.handle('get-todos', () => getTodos());

  ipcMain.handle('add-todo', (_event, taskName, taskDes) => addTodo(taskName, taskDes));

  ipcMain.handle('delete-todo', (_event, id) => deleteTodo(id));

  ipcMain.handle('update-todo', (_event, id, taskName, taskDes) => updateTodo(id, taskName, taskDes));

  ipcMain.handle('get-roadmaps', () => getRoadmaps());

  ipcMain.handle('add-roadmap', (_event, name) => addRoadmap(name));

  ipcMain.handle('delete-roadmap', (_event, id) => deleteRoadmap(id));

  ipcMain.handle('get-roadmap-nodes', (_event, roadmapId) => getRoadmapNodes(roadmapId));

  ipcMain.handle('add-task-node', (_event, roadmapId, title, content, status, type, positionX, positionY) => addTaskNode(roadmapId, title, content, status, type, positionX, positionY));

  ipcMain.handle('add-resource-node', (_event, roadmapId, title, content, url, type, positionX, positionY) => addResourceNode(roadmapId, title, content, url, type, positionX, positionY));

  ipcMain.handle('add-note-node', (_event, roadmapId, title, content, type, positionX, positionY) => addNoteNode(roadmapId, title, content, type, positionX, positionY));

  ipcMain.handle('add-milestone-node', (_event, roadmapId, title, content, dueDate, type, positionX, positionY) => addMilestoneNode(roadmapId, title, content, dueDate, type, positionX, positionY));

  ipcMain.handle('delete-node', (_event, id) => deleteNode(id));

  ipcMain.handle('update-node', (_event, id, title, content, status, type, positionX, positionY) => updateNode(id, title, content, status, type, positionX, positionY));

  ipcMain.handle('update-node-position', (_event, id, positionX, positionY) => updateNodePosition(id, positionX, positionY));


  createWindow();
});