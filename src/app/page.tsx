export const revalidate = 60

import { Suspense } from 'react'
import { getSounds, getLanguages } from '@/lib/actions'
import { SoundGrid, SoundGridSkeleton } from '@/components/sounds/SoundGrid'
import { SearchBar } from '@/components/sounds/SearchBar'
import { LanguageCards } from '@/components/sounds/LanguageCards'
import { loadMoreSounds } from './actions'

export default async function HomePage() {
  const [{ data: sounds, hasMore }, languages] = await Promise.all([
    getSounds(1),
    getLanguages(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          The <span className="text-primary">Indian</span> meme audio library.
        </h1>
        <p className="text-muted-foreground mb-6">
          For reels, edits, and WhatsApp forwards
        </p>
        <Suspense><SearchBar /></Suspense>
      </div>

      {/* Language cards */}
      {languages.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Browse by language</p>
          <LanguageCards languages={languages} />
        </div>
      )}

      {/* Sound grid */}
      <Suspense fallback={<SoundGridSkeleton />}>
        <SoundGrid
          initialSounds={sounds}
          hasMore={hasMore}
          loadMore={loadMoreSounds}
        />
      </Suspense>
    </div>
  )
}
