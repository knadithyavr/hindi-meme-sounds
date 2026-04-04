import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSoundBySlug, getRelatedSounds, getTrendingSoundsExcluding } from '@/lib/actions'
import { SoundHero } from '@/components/sounds/SoundHero'
import { SoundCard } from '@/components/sounds/SoundCard'
import { Badge } from '@/components/ui/badge'
import { formatCount } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sound = await getSoundBySlug(slug)
  if (!sound) return {}
  const tags = sound.tags.map(t => t.name).join(', ')
  const categories = sound.categories.map(c => c.name).join(', ')
  return {
    title: sound.title,
    description: `Play and download ${sound.title} meme sound. ${sound.description ?? ''} Category: ${categories}. Tags: ${tags}.`,
    openGraph: {
      title: sound.title,
      description: sound.description ?? `${sound.title} Hindi meme sound`,
      type: 'article',
    },
  }
}

export default async function SoundPage({ params }: Props) {
  const { slug } = await params
  const sound = await getSoundBySlug(slug)
  if (!sound) notFound()

  const firstCategory = sound.categories[0]

  // Get related sounds, fill up to 6 with trending if needed
  const related = firstCategory
    ? await getRelatedSounds(firstCategory.id, sound.id)
    : []

  const moreSounds = related.length >= 6
    ? related
    : [
        ...related,
        ...(await getTrendingSoundsExcluding(
          [sound.id, ...related.map(s => s.id)],
          6 - related.length
        )),
      ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AudioObject',
    name: sound.title,
    description: sound.description,
    encodingFormat: 'audio/mpeg',
    contentUrl: sound.audio_url,
    inLanguage: 'hi',
    genre: firstCategory?.name ?? 'Meme Sound',
    license: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/terms`,
    creator: { '@type': 'Organization', name: 'Hindi Meme Sounds' },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Two-column hero */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">

        {/* Left: play + actions */}
        <div className="flex flex-col items-center md:w-52 shrink-0">
          <SoundHero sound={sound} />
        </div>

        {/* Right: metadata */}
        <div className="flex-1 space-y-6">

          {/* Title */}
          <h1 className="text-3xl font-bold">{sound.title}</h1>

          {/* Stats — large number blocks */}
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-primary">{formatCount(sound.play_count)}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Plays</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{formatCount(sound.download_count)}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Downloads</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{formatCount(sound.share_count)}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Shares</p>
            </div>
          </div>

          {sound.description && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Description</p>
              <p className="text-sm text-foreground leading-relaxed">{sound.description}</p>
            </div>
          )}

          {sound.categories.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Category</p>
              <div className="flex flex-wrap gap-2">
                {sound.categories.map(cat => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <Badge variant="secondary">{cat.name}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {sound.tags.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {sound.tags.map(tag => (
                  <Link key={tag.id} href={`/search?q=${encodeURIComponent(tag.name)}`}>
                    <Badge variant="outline" className="text-xs">#{tag.name}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* More sounds — always filled */}
      {moreSounds.length > 0 && (
        <div className="mt-14 pt-10 border-t border-border">
          <h2 className="text-lg font-semibold mb-4">
            <span className="text-primary">More</span> Sounds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {moreSounds.map((s, i) => (
              <SoundCard key={s.id} sound={s} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
