'use server'

import { db, adminDb } from './supabase'
import { Sound, Category, Tag, PaginatedResponse } from '@/types'

const PAGE_LIMIT = 24

// ─── Sounds ──────────────────────────────────────────────────────────────────

export async function getSounds(page = 1): Promise<PaginatedResponse<Sound>> {
  const from = (page - 1) * PAGE_LIMIT
  const to = from + PAGE_LIMIT - 1

  const { data, error, count } = await db
    .from('sounds')
    .select(`
      *,
      categories:sound_categories(category:categories(*)),
      tags:sound_tags(tag:tags(*))
    `, { count: 'exact' })
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  return {
    data: normalizeSounds(data ?? []),
    total: count ?? 0,
    page,
    limit: PAGE_LIMIT,
    hasMore: (count ?? 0) > to + 1,
  }
}

export async function getTrendingSounds(page = 1): Promise<PaginatedResponse<Sound>> {
  const from = (page - 1) * PAGE_LIMIT
  const to = from + PAGE_LIMIT - 1

  const { data, error, count } = await db
    .from('sounds')
    .select(`
      *,
      categories:sound_categories(category:categories(*)),
      tags:sound_tags(tag:tags(*))
    `, { count: 'exact' })
    .eq('is_published', true)
    .order('play_count', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  return {
    data: normalizeSounds(data ?? []),
    total: count ?? 0,
    page,
    limit: PAGE_LIMIT,
    hasMore: (count ?? 0) > to + 1,
  }
}

export async function getSoundsByCategory(categorySlug: string, page = 1): Promise<PaginatedResponse<Sound>> {
  const from = (page - 1) * PAGE_LIMIT
  const to = from + PAGE_LIMIT - 1

  // Step 1: Resolve category slug → id
  const { data: cat } = await db
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!cat) return { data: [], total: 0, page, limit: PAGE_LIMIT, hasMore: false }

  // Step 2: Get sound IDs in this category (correct filter via junction table)
  const { data: junction } = await db
    .from('sound_categories')
    .select('sound_id')
    .eq('category_id', cat.id)

  const soundIds = (junction ?? []).map(r => r.sound_id)
  if (!soundIds.length) return { data: [], total: 0, page, limit: PAGE_LIMIT, hasMore: false }

  // Step 3: Fetch published sounds matching those IDs, with full joins
  const { data, error, count } = await db
    .from('sounds')
    .select(`
      *,
      categories:sound_categories(category:categories(*)),
      tags:sound_tags(tag:tags(*))
    `, { count: 'exact' })
    .eq('is_published', true)
    .in('id', soundIds)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  return {
    data: normalizeSounds(data ?? []),
    total: count ?? 0,
    page,
    limit: PAGE_LIMIT,
    hasMore: (count ?? 0) > to + 1,
  }
}

export async function getRelatedSounds(categoryId: string, excludeId: string): Promise<Sound[]> {
  const { data: junction } = await db
    .from('sound_categories')
    .select('sound_id')
    .eq('category_id', categoryId)

  const soundIds = (junction ?? [])
    .map((r: { sound_id: string }) => r.sound_id)
    .filter((id: string) => id !== excludeId)

  if (!soundIds.length) return []

  const { data } = await db
    .from('sounds')
    .select(`
      *,
      categories:sound_categories(category:categories(*)),
      tags:sound_tags(tag:tags(*))
    `)
    .eq('is_published', true)
    .in('id', soundIds)
    .order('play_count', { ascending: false })
    .limit(6)

  return normalizeSounds(data ?? [])
}

export async function getTrendingSoundsExcluding(excludeIds: string[], limit: number): Promise<Sound[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = db
    .from('sounds')
    .select(`
      *,
      categories:sound_categories(category:categories(*)),
      tags:sound_tags(tag:tags(*))
    `)
    .eq('is_published', true)
    .order('play_count', { ascending: false })
    .limit(limit)

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`)
  }

  const { data } = await query
  return normalizeSounds(data ?? [])
}

export async function getSoundBySlug(slug: string): Promise<Sound | null> {
  const { data, error } = await db
    .from('sounds')
    .select(`
      *,
      categories:sound_categories(category:categories(*)),
      tags:sound_tags(tag:tags(*))
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !data) return null
  return normalizeSounds([data])[0]
}

export async function searchSounds(query: string, page = 1): Promise<PaginatedResponse<Sound>> {
  const from = (page - 1) * PAGE_LIMIT
  const to = from + PAGE_LIMIT - 1

  // Sanitize and convert to prefix-aware tsquery: "jame" → "jame:*"
  // Strip special chars that would break to_tsquery, then build prefix terms
  const tsQuery = query.trim()
    .replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '') // keep latin, devanagari, spaces
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => `${w}:*`)
    .join(' & ')

  if (!tsQuery || query.trim().length < 3) return { data: [], total: 0, page, limit: PAGE_LIMIT, hasMore: false }

  // Lean count query (no joins — avoids nested join count inflation)
  const { count } = await db
    .from('sounds')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)
    .filter('search_vector', 'fts', tsQuery)

  // Data query with full joins
  const { data, error } = await db
    .from('sounds')
    .select(`
      *,
      categories:sound_categories(category:categories(*)),
      tags:sound_tags(tag:tags(*))
    `)
    .eq('is_published', true)
    .filter('search_vector', 'fts', tsQuery)
    .range(from, to)

  if (error) throw new Error(error.message)

  return {
    data: normalizeSounds(data ?? []),
    total: count ?? 0,
    page,
    limit: PAGE_LIMIT,
    hasMore: (count ?? 0) > to + 1,
  }
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await db
    .from('categories')
    .select('*, audio_count:sound_categories(count)')
    .order('name')

  if (error) throw new Error(error.message)
  return (data ?? []).map(c => ({
    ...c,
    audio_count: c.audio_count?.[0]?.count ?? 0,
  }))
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await db
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

// ─── Tracking (uses service role — RPCs do UPDATE, not covered by anon SELECT policy) ──

export async function trackPlay(soundId: string): Promise<void> {
  await adminDb.rpc('increment_play_count', { sound_id: soundId })
}

export async function trackDownload(soundId: string): Promise<void> {
  await adminDb.rpc('increment_download_count', { sound_id: soundId })
}

export async function trackShare(soundId: string): Promise<void> {
  await adminDb.rpc('increment_share_count', { sound_id: soundId })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSounds(data: any[]): Sound[] {
  return data.map(s => ({
    ...s,
    categories: (s.categories ?? []).map((c: { category: Category }) => c.category).filter(Boolean),
    tags: (s.tags ?? []).map((t: { tag: Tag }) => t.tag).filter(Boolean),
  }))
}
