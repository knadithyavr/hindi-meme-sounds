import { Suspense } from 'react'
import { searchSounds } from '@/lib/actions'
import { SoundGrid } from '@/components/sounds/SoundGrid'
import { SearchBar } from '@/components/sounds/SearchBar'
import type { Metadata } from 'next'

interface Props { searchParams: Promise<{ q?: string; lang?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return { title: q ? `Search: ${q}` : 'Search' }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, lang } = await searchParams
  const query = q?.trim() ?? ''
  const languageId = lang ?? undefined

  const { data: sounds, hasMore, total } = query
    ? await searchSounds(query, 1, languageId)
    : { data: [], hasMore: false, total: 0 }

  async function loadMore(page: number) {
    'use server'
    const result = await searchSounds(query, page, languageId)
    return { sounds: result.data, hasMore: result.hasMore }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Suspense><SearchBar languageId={languageId} /></Suspense>
      </div>

      {query && (
        <p className="text-sm text-muted-foreground mb-6">
          <span className="text-primary font-medium">{total}</span> result{total !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>
      )}

      {query
        ? <SoundGrid key={`${query}-${languageId}`} initialSounds={sounds} hasMore={hasMore} loadMore={loadMore} />
        : <p className="text-center text-muted-foreground py-16">Type something to search</p>
      }
    </div>
  )
}
