import React from 'react'
import { FiTrash2, FiEdit2 } from 'react-icons/fi'
import type { todo } from '../../electron/services/types.ts'

interface TodoItemProps {
    todo: todo
    onEdit: (todo: todo) => void
    onDelete: (id: number) => void
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onDelete }) => {
    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 transition-all duration-200 flex flex-col justify-between h-full">
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
                    onClick={() => onEdit(todo)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-accent hover:bg-gray-50 rounded-md border border-gray-50 hover:border-primary transition-colors"
                >
                    <FiEdit2 /> Edit
                </button>
                <button
                    onClick={() => onDelete(todo.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-500 border border-gray-50 hover:bg-red-50 rounded-md  hover:border-red-600 transition-colors"
                >
                    <FiTrash2 /> Delete
                </button>
            </div>
        </div>
    )
}

export default TodoItem
