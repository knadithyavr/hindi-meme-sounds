'use server'

import { getSounds } from '@/lib/actions'
import { Sound } from '@/types'

export async function loadMoreByLanguage(
  languageId: string,
  page: number
): Promise<{ sounds: Sound[]; hasMore: boolean }> {
  const result = await getSounds(page, languageId)
  return { sounds: result.data, hasMore: result.hasMore }
}
