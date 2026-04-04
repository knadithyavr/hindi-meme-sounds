import { MetadataRoute } from 'next'
import { db } from '@/lib/supabase'

export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://memesaudio.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: sounds }, { data: categories }, { data: languages }] = await Promise.all([
    db.from('sounds').select('slug, created_at, language:languages(slug)').eq('is_published', true),
    db.from('categories').select('slug'),
    db.from('languages').select('slug').eq('is_active', true),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  const languageRoutes: MetadataRoute.Sitemap = (languages ?? []).map(l => ({
    url: `${BASE_URL}/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  const soundRoutes: MetadataRoute.Sitemap = (sounds ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter(s => (s.language as any)?.slug)
    .map(s => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      url: `${BASE_URL}/${(s.language as any).slug}/sound/${s.slug}`,
      lastModified: new Date(s.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map(c => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...languageRoutes, ...soundRoutes, ...categoryRoutes]
}
