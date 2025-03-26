
export interface NoteInterface {
    id: number;
    title: string;
    content: string;
    pinned: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface SortNotesInterface {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

