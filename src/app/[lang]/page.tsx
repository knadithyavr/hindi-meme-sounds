export const revalidate = 60

import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getLanguageBySlug, getSounds } from '@/lib/actions'
import { SoundGrid, SoundGridSkeleton } from '@/components/sounds/SoundGrid'
import { SearchBar } from '@/components/sounds/SearchBar'
import { loadMoreByLanguage } from './actions'
import type { Metadata } from 'next'

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const language = await getLanguageBySlug(lang)
  if (!language) return {}
  return {
    title: `${language.script_name} Meme Sounds`,
    description: `Play and download ${language.name} meme sounds, dialogues and audio clips.`,
  }
}

export default async function LanguagePage({ params }: Props) {
  const { lang } = await params
  const language = await getLanguageBySlug(lang)
  if (!language) notFound()

  const { data: sounds, hasMore } = await getSounds(1, language.id)

  async function loadMore(page: number) {
    'use server'
    return loadMoreByLanguage(language!.id, page)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          The <span className="text-primary">{language.script_name}</span> meme audio library.
        </h1>
        <p className="text-muted-foreground mb-6">
          For reels, edits, and WhatsApp forwards
        </p>
        <Suspense><SearchBar languageId={language.id} /></Suspense>
      </div>

      {/* Sound grid */}
      <Suspense fallback={<SoundGridSkeleton />}>
        <SoundGrid
          initialSounds={sounds}
          hasMore={hasMore}
          loadMore={loadMore}
        />
      </Suspense>
    </div>
  )
}
