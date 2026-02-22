import { ipcRenderer, contextBridge } from 'electron'
import type { todo } from './services/types.ts'
import { addNoteNode, addResourceNode, addTaskNode, updateNode } from './services/roadmap.ts'

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
  getTodos: () => ipcRenderer.invoke("get-todos"),
  addTodo: (taskName: string, taskDes: string) => ipcRenderer.invoke("add-todo", taskName, taskDes),
  deleteTodo: (id: number) => ipcRenderer.invoke("delete-todo", id),
  updateTodo: (id: number, taskName: string, taskDes: string) => ipcRenderer.invoke("update-todo", id, taskName, taskDes),
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
  updateNodePosition: (id: string, positionX: number, positionY: number) => ipcRenderer.invoke("update-node-position", id, positionX, positionY)
})
