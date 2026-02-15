import Database from 'better-sqlite3'
const db = new Database('todo2.0.db', { verbose: console.log })
db.pragma('journal_mode = WAL');


/*const quertyCreateTable = `
CREATE TABLE node_types (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);
CREATE TABLE nodes (
    id TEXT PRIMARY KEY,
    type_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    status TEXT,
    url TEXT,
    position_x REAL NOT NULL,
    position_y REAL NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    roadmap_id TEXT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES node_types(id),
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE

);
CREATE TABLE edges_types(
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);
CREATE TABLE edges (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    type_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (source) REFERENCES nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (target) REFERENCES nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES edges_types(id)
);
CREATE TABLE roadmaps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
);

`;

db.exec(quertyCreateTable);*/

