'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { SoundCard } from './SoundCard'
import { Sound } from '@/types'

interface SoundGridProps {
  initialSounds: Sound[]
  hasMore: boolean
  loadMore: (page: number) => Promise<{ sounds: Sound[]; hasMore: boolean }>
}

export function SoundGrid({ initialSounds, hasMore: initialHasMore, loadMore }: SoundGridProps) {
  const [sounds, setSounds] = useState(initialSounds)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const nextPage = page + 1
    const result = await loadMore(nextPage)
    setSounds(prev => [...prev, ...result.sounds])
    setHasMore(result.hasMore)
    setPage(nextPage)
    setLoading(false)
  }, [loading, hasMore, page, loadMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) fetchMore() },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchMore])

  if (sounds.length === 0) {
    return <p className="text-center text-muted-foreground py-16 text-sm">No sounds found.</p>
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {sounds.map((sound, i) => (
          <SoundCard key={sound.id} sound={sound} index={i} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-8 mt-4 flex items-center justify-center">
        {loading && (
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export function SoundGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-card border border-border">
          <div className="w-10 h-10 rounded-md bg-muted animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="h-3 rounded bg-muted animate-pulse w-3/4" />
            <div className="h-2.5 rounded bg-muted animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
