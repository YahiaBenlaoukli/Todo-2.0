export type todo = {
    id: number,
    name: string,
    description: string,
    created_at: string
}
export const NODE_TYPES = {
    TASKNODE: 1,
    NOTENODE: 2,
    RESOURCENODE: 3,
    MILESTONENODE: 4
} as const;

export type NodeType =
    typeof NODE_TYPES[keyof typeof NODE_TYPES];

export type TaskNode = {
    id: number;
    roadmapId: number;
    title: string;
    content?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export type NoteNode = {
    id: number;
    roadmapId: number;
    title: string;
    content?: string;

}

export type ResourceNode = {
    id: number;
    roadmapId: number;
    title: string;
    content?: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

export type MilestoneNode = {
    id: number;
    roadmapId: number;
    title: string;
    content?: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export type Node = TaskNode | NoteNode | ResourceNode | MilestoneNode;


