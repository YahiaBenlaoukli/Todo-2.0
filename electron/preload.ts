import { ipcRenderer, contextBridge } from 'electron'
import type { todo } from './services/types.ts'

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
  addTodo: (todo: todo) => ipcRenderer.invoke("add-todo", todo),
  deleteTodo: (id: number) => ipcRenderer.invoke("delete-todo", id),
  updateTodo: (todo: todo) => ipcRenderer.invoke("update-todo", todo),
})
