import { promises as fs } from 'fs';
import type { FileNode } from './types';
import path from 'path';

const NOTES_PATH = path.join(process.cwd(), "notes");

/** Resolve a relative path against NOTES_PATH; absolute paths pass through */
function resolvePath(p: string): string {
    if (path.isAbsolute(p)) return p;
    return path.join(NOTES_PATH, p);
}

async function buildFileTree(dir: string): Promise<FileNode[]> {
    const files = await fs.readdir(dir, { withFileTypes: true });

    const filesTree = await Promise.all(
        files.map(async (file) => {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                return {
                    name: file.name,
                    type: "folder" as "folder",
                    children: await buildFileTree(fullPath),
                };
            }

            return {
                name: file.name,
                type: "file" as "file",
            };
        })
    );

    return filesTree;
}
export async function getFiles() {
    try {
        await fs.mkdir(NOTES_PATH, { recursive: true });
        const tree = await buildFileTree(NOTES_PATH);

        return {
            status: "success",
            data: tree,
        };
    } catch (error) {
        return {
            status: "an error occurred",
            message: (error as Error).message,
        };
    }
}
export async function getFileContent(filePath: string) {
    try {
        const content = await fs.readFile(resolvePath(filePath), 'utf-8');
        return { status: 'success', data: content };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function createFile(filePath: string) {
    try {
        await fs.writeFile(resolvePath(filePath), '', 'utf-8');
        return { status: 'success', message: 'File created successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function deleteFile(filePath: string) {
    try {
        await fs.unlink(resolvePath(filePath));
        return { status: 'success', message: 'File deleted successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function updateFile(filePath: string, content: string) {
    try {
        await fs.writeFile(resolvePath(filePath), content, 'utf-8');
        return { status: 'success', message: 'File updated successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function renameFile(filePath: string, newName: string) {
    try {
        const resolved = resolvePath(filePath);
        const newPath = path.join(path.dirname(resolved), newName);
        await fs.rename(resolved, newPath);
        return { status: 'success', message: 'File renamed successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function createFolder(folderPath: string) {
    try {
        await fs.mkdir(resolvePath(folderPath));
        return { status: 'success', message: 'Folder created successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function deleteFolder(folderPath: string) {
    try {
        await fs.rm(resolvePath(folderPath), { recursive: true });
        return { status: 'success', message: 'Folder deleted successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function renameFolder(folderPath: string, newName: string) {
    try {
        const resolved = resolvePath(folderPath);
        const newPath = path.join(path.dirname(resolved), newName);
        await fs.rename(resolved, newPath);
        return { status: 'success', message: 'Folder renamed successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function moveFile(src: string, dest: string) {
    try {
        await fs.rename(resolvePath(src), resolvePath(dest));
        return { status: 'success', message: 'File moved successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function moveFolder(src: string, dest: string) {
    try {
        await fs.rename(resolvePath(src), resolvePath(dest));
        return { status: 'success', message: 'Folder moved successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}

export async function copyFile(src: string, dest: string) {
    try {
        await fs.copyFile(resolvePath(src), resolvePath(dest));
        return { status: 'success', message: 'File copied successfully' };
    } catch (error) {
        return { status: "an error occurred", message: (error as Error).message };
    }
}


