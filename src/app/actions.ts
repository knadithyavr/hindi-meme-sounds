'use server'

import { getSounds, getTrendingSounds } from '@/lib/actions'
import { Sound } from '@/types'

// Thin wrappers for client-side infinite scroll pagination
// Category and search pages define their own inline loadMore closures
// to correctly close over their slug/query values

export async function loadMoreSounds(page: number): Promise<{ sounds: Sound[]; hasMore: boolean }> {
  const result = await getSounds(page)
  return { sounds: result.data, hasMore: result.hasMore }
}

export async function loadMoreTrending(page: number): Promise<{ sounds: Sound[]; hasMore: boolean }> {
  const result = await getTrendingSounds(page)
  return { sounds: result.data, hasMore: result.hasMore }
}
