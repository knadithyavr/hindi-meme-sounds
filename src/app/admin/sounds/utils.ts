import { Category, Sound, Tag } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeSoundAdmin(data: any): Sound {
  return {
    ...data,
    categories: (data.categories ?? []).map((c: { category: Category }) => c.category).filter(Boolean),
    tags: (data.tags ?? []).map((t: { tag: Tag }) => t.tag).filter(Boolean),
  }
}
