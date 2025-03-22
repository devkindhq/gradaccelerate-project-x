export interface Note {
  id: number
  title: string
  content: string
  pinned?: boolean
  createdAt: string
  updatedAt: string | null
}

export interface Project {
  id: number
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  updatedAt: string | null
}

export interface PaginatedProjects {
  data: Project[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export type ViewType = 'grid' | 'list'
export type SortField = 'created_at' | 'updated_at' | 'title'
export type SortOrder = 'asc' | 'desc'
