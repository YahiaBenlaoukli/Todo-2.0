import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'

interface CreateTodoModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (name: string, description: string) => Promise<void>
}

const CreateTodoModal: React.FC<CreateTodoModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [taskName, setTaskName] = useState<string>('')
    const [taskDes, setTaskDes] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await onAdd(taskName, taskDes)
        setTaskName('')
        setTaskDes('')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-sidebar rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 border border-border/50">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-secondary font-lora">Create New Task</h2>
                    <button
                        onClick={onClose}
                        className="text-text/40 hover:text-text bg-bg/50 hover:bg-bg border border-transparent hover:border-border p-2 rounded-full transition-colors"
                    >
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-5">
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
                            className="flex-1 px-4 py-3 font-medium text-text bg-bg hover:bg-bg/80 border border-border rounded-lg transition-colors"
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
    )
}

export default CreateTodoModal
