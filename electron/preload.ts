import { ipcRenderer, contextBridge } from 'electron'
import type { todo } from './services/types.ts'
import { addEdge, addNoteNode, addResourceNode, addTaskNode, updateNode } from './services/roadmap.ts'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
  //todos
  getTodos: () => ipcRenderer.invoke("get-todos"),
  addTodo: (taskName: string, taskDes: string) => ipcRenderer.invoke("add-todo", taskName, taskDes),
  deleteTodo: (id: number) => ipcRenderer.invoke("delete-todo", id),
  updateTodo: (id: number, taskName: string, taskDes: string) => ipcRenderer.invoke("update-todo", id, taskName, taskDes),
  //roadmaps
  getRoadmaps: () => ipcRenderer.invoke("get-roadmaps"),
  addRoadmap: (name: string) => ipcRenderer.invoke("add-roadmap", name),
  deleteRoadmap: (id: number) => ipcRenderer.invoke("delete-roadmap", id),
  getRoadmapNodes: (roadmapId: number) => ipcRenderer.invoke("get-roadmap-nodes", roadmapId),
  addTaskNode: (roadmapId: number, title: string, content: string, status: string, type: number, positionX: number, positionY: number) => ipcRenderer.invoke("add-task-node", roadmapId, title, content, status, type, positionX, positionY),
  addResourceNode: (roadmapId: number, title: string, content: string, url: string, type: number, positionX: number, positionY: number) => ipcRenderer.invoke("add-resource-node", roadmapId, title, content, url, type, positionX, positionY),
  addNoteNode: (roadmapId: number, title: string, content: string, type: number, positionX: number, positionY: number) => ipcRenderer.invoke("add-note-node", roadmapId, title, content, type, positionX, positionY),
  addMilestoneNode: (roadmapId: number, title: string, content: string, dueDate: string, type: number, positionX: number, positionY: number) => ipcRenderer.invoke("add-milestone-node", roadmapId, title, content, dueDate, type, positionX, positionY),
  deleteNode: (id: string) => ipcRenderer.invoke("delete-node", id),
  updateNode: (id: string, title: string, content: string, status: string, type: number, positionX: number, positionY: number) => ipcRenderer.invoke("update-node", id, title, content, status, type, positionX, positionY),
  updateNodePosition: (id: string, positionX: number, positionY: number) => ipcRenderer.invoke("update-node-position", id, positionX, positionY),
  getEdges: (roadmapId: number) => ipcRenderer.invoke("get-roadmap-edges", roadmapId),
  addEdge: (sourceId: number, targetId: number, type: number) => ipcRenderer.invoke("add-edge", sourceId, targetId, type),
  deleteEdge: (id: number) => ipcRenderer.invoke("delete-edge", id),
  updateEdge: (id: number, type: number) => ipcRenderer.invoke("update-edge-type", id, type),
  exportRoadmap: (roadmapId: number) => ipcRenderer.invoke("export-roadmap", roadmapId),
  importRoadmap: (filePath: string) => ipcRenderer.invoke("import-roadmap", filePath),
  importRoadmapData: (data: any) => ipcRenderer.invoke("import-roadmap-data", data),
  generateRoadmap: (topic: string, difficulty: string, focus: string) => ipcRenderer.invoke("generate-roadmap", topic, difficulty, focus),
  // Explorer
  getFiles: () => ipcRenderer.invoke("get-files"),
  getFileContent: (filePath: string) => ipcRenderer.invoke("get-file-content", filePath),
  createFile: (filePath: string) => ipcRenderer.invoke("create-file", filePath),
  deleteFile: (filePath: string) => ipcRenderer.invoke("delete-file", filePath),
  updateFile: (filePath: string, content: string) => ipcRenderer.invoke("update-file", filePath, content),
  renameFile: (filePath: string, newName: string) => ipcRenderer.invoke("rename-file", filePath, newName),
  createFolder: (folderPath: string) => ipcRenderer.invoke("create-folder", folderPath),
  deleteFolder: (folderPath: string) => ipcRenderer.invoke("delete-folder", folderPath),
  renameFolder: (folderPath: string, newName: string) => ipcRenderer.invoke("rename-folder", folderPath, newName),
  moveFile: (src: string, dest: string) => ipcRenderer.invoke("move-file", src, dest),
  moveFolder: (src: string, dest: string) => ipcRenderer.invoke("move-folder", src, dest),
  copyFile: (src: string, dest: string) => ipcRenderer.invoke("copy-file", src, dest),
})
