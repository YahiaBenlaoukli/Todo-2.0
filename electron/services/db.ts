import Database from 'better-sqlite3'
import { todo } from './types'

const db = new Database('todo2.0.db', { verbose: console.log })
db.pragma('journal_mode = WAL');


/*const quertyCreateTable = `
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;
db.exec(quertyCreateTable);*/

export async function getTodos() {
    try {
        const row = db.prepare('SELECT * FROM todos').all();
        return { status: 'success', data: row };
    }
    catch (error: any) {
        console.error('Error fetching todos:', error);
        return { status: 'error', message: error.message };
    }
}

export async function addTodo(todo: todo) {
    try {
        const { name, description, created_at } = todo;
        const stmt = db.prepare('INSERT INTO todos (name,description,created_at) VALUES (?,?,?)');
        stmt.run(name, description, created_at);
        return { status: 'success', message: 'Todo added successfully' };
    } catch (error: any) {
        console.error('Error adding todo:', error);
        return { status: 'error', message: error.message };
    }
}

export async function deleteTodo(id: number) {
    try {
        const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
        stmt.run(id);
        return { status: 'success', message: 'Todo deleted successfully' };
    } catch (error: any) {
        console.error('Error deleting todo  :', error);
        return { status: 'error', message: error.message };
    }
}




export async function updateTodo(todo: todo) {
    try {
        const { id, name, description } = todo;
        const stmt = db.prepare('UPDATE todos SET name = ?, description = ? WHERE id = ?');
        stmt.run(name, description, id);
        return { status: 'success', message: 'Todo updated successfully' };
    } catch (error: any) {
        console.error('Error updating todo:', error);
        return { status: 'error', message: error.message };
    }

}
