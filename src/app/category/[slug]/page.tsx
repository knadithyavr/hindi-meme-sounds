export const revalidate = 60

import { notFound } from 'next/navigation'
import { getCategoryBySlug, getSoundsByCategory, getCategories } from '@/lib/actions'
import { SoundGrid } from '@/components/sounds/SoundGrid'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: category.name,
    description: category.description ?? `Browse ${category.name} Hindi meme sounds`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [category, { data: sounds, hasMore }] = await Promise.all([
    getCategoryBySlug(slug),
    getSoundsByCategory(slug, 1),
  ])

  if (!category) notFound()

  async function loadMore(page: number) {
    'use server'
    const result = await getSoundsByCategory(slug, page)
    return { sounds: result.data, hasMore: result.hasMore }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.color}`} />
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="text-sm text-muted-foreground">{category.description}</p>
          )}
        </div>
      </div>
      <SoundGrid initialSounds={sounds} hasMore={hasMore} loadMore={loadMore} />
    </div>
  )
}
