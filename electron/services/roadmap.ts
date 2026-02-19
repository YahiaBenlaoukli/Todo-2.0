import Database from 'better-sqlite3'
const db = new Database('todo2.0.db', { verbose: console.log })
db.pragma('journal_mode = WAL');
import { type NodeType } from '../../electron/services/types';



/*const quertyCreateTable = `
PRAGMA foreign_keys = ON;

--  Roadmaps
CREATE TABLE roadmaps (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
);

--  Node types
CREATE TABLE node_types (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

--  Nodes
CREATE TABLE nodes (
    id INTEGER PRIMARY KEY,
    type_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    status TEXT,
    url TEXT,
    position_x REAL NOT NULL,
    position_y REAL NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    roadmap_id INTEGER NOT NULL,
    FOREIGN KEY (type_id) REFERENCES node_types(id),
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
);

--  Edge types
CREATE TABLE edges_types (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

--  Edges
CREATE TABLE edges (
    id INTEGER PRIMARY KEY,
    source INTEGER NOT NULL,
    target INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (source) REFERENCES nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (target) REFERENCES nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES edges_types(id)
);

-- Optional but recommended indexes
CREATE INDEX idx_nodes_roadmap ON nodes(roadmap_id);
CREATE INDEX idx_edges_source ON edges(source);
CREATE INDEX idx_edges_target ON edges(target);


`;

db.exec(quertyCreateTable);*/


export async function getRoadmaps() {
    try {
        const row = db.prepare('SELECT * FROM roadmaps').all();
        return { status: 'success', data: row };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function addRoadmap(name: string) {
    try {
        const created_at = new Date().toISOString();
        const stmt = db.prepare('INSERT INTO roadmaps (name, created_at) VALUES (?, ?)');
        const result = stmt.run(name, created_at);
        return { status: 'success', message: 'Roadmap added successfully', id: result.lastInsertRowid };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function deleteRoadmap(id: number) {
    try {
        const stmt = db.prepare('DELETE FROM roadmaps WHERE id = ?');
        stmt.run(id);
        return { status: 'success', message: 'Roadmap deleted successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function getRoadmapNodes(roadmapId: number) {
    try {
        const stmt = db.prepare('SELECT * FROM nodes WHERE roadmap_id = ?');
        const nodes = stmt.all(roadmapId);
        return { status: 'success', data: nodes };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function addTaskNode(roadmapId: number, title: string, content: string, status: string, type: NodeType, positionX: number, positionY: number) {
    try {
        const created_at = new Date().toISOString();
        const stmt = db.prepare('INSERT INTO nodes (roadmap_id, title, content, status, type_id, position_x, position_y, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const result = stmt.run(roadmapId, title, content, status, type, positionX, positionY, created_at);
        const newNode = db.prepare('SELECT * FROM nodes WHERE id = ?').get(result.lastInsertRowid);

        return { status: 'success', message: 'Task node added successfully', data: newNode };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}
export async function addResourceNode(roadmapId: number, title: string, content: string, url: string, type: NodeType, positionX: number, positionY: number) {
    try {
        const created_at = new Date().toISOString();
        const stmt = db.prepare('INSERT INTO nodes (roadmap_id, title, content, url, type_id, position_x, position_y, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const result = stmt.run(roadmapId, title, content, url, type, positionX, positionY, created_at);
        const newNode = db.prepare('SELECT * FROM nodes WHERE id = ?').get(result.lastInsertRowid);
        return { status: 'success', message: 'Resource node added successfully', data: newNode };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}
export async function addNoteNode(roadmapId: number, title: string, content: string, type: NodeType, positionX: number, positionY: number) {
    try {
        const created_at = new Date().toISOString();
        const stmt = db.prepare('INSERT INTO nodes (roadmap_id, title, content, type_id, position_x, position_y, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
        const result = stmt.run(roadmapId, title, content, type, positionX, positionY, created_at);
        const newNode = db.prepare('SELECT * FROM nodes WHERE id = ?').get(result.lastInsertRowid);
        return { status: 'success', message: 'Note node added successfully', data: newNode };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function addMilestoneNode(roadmapId: number, title: string, content: string, dueDate: string, type: NodeType, positionX: number, positionY: number) {
    try {
        const created_at = new Date().toISOString();
        const stmt = db.prepare('INSERT INTO nodes (roadmap_id, title, content, due_date, type_id, position_x, position_y, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const result = stmt.run(roadmapId, title, content, dueDate, type, positionX, positionY, created_at);
        const newNode = db.prepare('SELECT * FROM nodes WHERE id = ?').get(result.lastInsertRowid);

        return { status: 'success', message: 'Milestone node added successfully', data: newNode };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}
export async function deleteNode(id: string) {
    try {
        const stmt = db.prepare('DELETE FROM nodes WHERE id = ?');
        stmt.run(id);
        return { status: 'success', message: 'Node deleted successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function updateNode(id: string, title: string, content: string, status: string, positionX: number, positionY: number) {
    try {
        const updated_at = new Date().toISOString();
        const stmt = db.prepare('UPDATE nodes SET title = ?, content = ?, status = ?, position_x = ?, position_y = ?, updated_at = ? WHERE id = ?');
        stmt.run(title, content, status, positionX, positionY, updated_at, id);
        return { status: 'success', message: 'Node updated successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}