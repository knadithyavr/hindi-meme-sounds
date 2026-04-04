export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  audio_count?: number
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Sound {
  id: string
  title: string
  slug: string
  description: string | null
  audio_url: string
  play_count: number
  download_count: number
  share_count: number
  is_published: boolean
  // future user upload fields (not exposed in UI yet)
  is_user_upload: boolean
  uploaded_by: string | null
  status: 'approved' | 'pending' | 'rejected'
  created_at: string
  categories: Category[]
  tags: Tag[]
}

export interface SoundWithMeta extends Sound {
  gradient: string // assigned deterministically by ID
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
