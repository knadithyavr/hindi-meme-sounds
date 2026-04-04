export const revalidate = 60

import { Suspense } from 'react'
import { getSounds } from '@/lib/actions'
import { SoundGrid, SoundGridSkeleton } from '@/components/sounds/SoundGrid'
import { SearchBar } from '@/components/sounds/SearchBar'
import { loadMoreSounds } from './actions'

export default async function HomePage() {
  const { data: sounds, hasMore } = await getSounds(1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          The <span className="text-primary">हिंदी</span> meme audio library.
        </h1>
        <p className="text-muted-foreground mb-6">
          For reels, edits, and WhatsApp forwards
        </p>
        <Suspense><SearchBar /></Suspense>
      </div>

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
