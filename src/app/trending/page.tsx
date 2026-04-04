export const revalidate = 60

import { getTrendingSounds } from '@/lib/actions'
import { SoundGrid } from '@/components/sounds/SoundGrid'
import { loadMoreTrending } from '../actions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Trending' }

export default async function TrendingPage() {
  const { data: sounds, hasMore } = await getTrendingSounds(1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6"><span className="text-primary">Trending</span> Sounds</h1>
      <SoundGrid initialSounds={sounds} hasMore={hasMore} loadMore={loadMoreTrending} />
    </div>
  )
}
