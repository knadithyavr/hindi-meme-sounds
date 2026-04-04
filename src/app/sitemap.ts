import { MetadataRoute } from 'next'
import { db } from '@/lib/supabase'

export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hindimemesounds.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: sounds }, { data: categories }] = await Promise.all([
    db.from('sounds').select('slug, created_at').eq('is_published', true),
    db.from('categories').select('slug'),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  const soundRoutes: MetadataRoute.Sitemap = (sounds ?? []).map(s => ({
    url: `${BASE_URL}/sound/${s.slug}`,
    lastModified: new Date(s.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map(c => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...soundRoutes, ...categoryRoutes]
}
