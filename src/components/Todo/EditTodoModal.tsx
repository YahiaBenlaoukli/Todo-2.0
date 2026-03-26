import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import type { todo } from '../../electron/services/types.ts'

interface EditTodoModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdate: (id: number, name: string, description: string) => Promise<void>
    todo: todo | null
}

const EditTodoModal: React.FC<EditTodoModalProps> = ({ isOpen, onClose, onUpdate, todo }) => {
    const [taskName, setTaskName] = useState<string>('')
    const [taskDes, setTaskDes] = useState<string>('')

    useEffect(() => {
        if (todo) {
            setTaskName(todo.name)
            setTaskDes(todo.description)
        }
    }, [todo])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (todo) {
            await onUpdate(todo.id, taskName, taskDes)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-sidebar rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 border border-border/50">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-text font-lora">Edit Task</h2>
                        <button
                            onClick={onClose}
                            className="text-text/60 hover:text-text transition-colors"
                        >
                            <FiX className="text-2xl" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-text mb-2">Task Name</label>
                            <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-border bg-bg text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text/40"
                                required
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-text mb-2">Description</label>
                            <textarea
                                placeholder="Add details about this task..."
                                value={taskDes}
                                onChange={(e) => setTaskDes(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border border-border bg-bg text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text/40 resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 font-medium text-text bg-bg border border-border hover:bg-bg/80 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-3 font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                Update Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditTodoModal
