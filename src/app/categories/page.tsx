export const revalidate = 60

import Link from 'next/link'
import { getCategories } from '@/lib/actions'
import { formatCount } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Categories' }

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6"><span className="text-primary">All</span> Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${cat.color} flex-shrink-0`} />
            <span className="font-medium text-sm leading-tight">{cat.name}</span>
            {cat.audio_count != null && (
              <span className="text-xs text-muted-foreground">{formatCount(cat.audio_count)} sounds</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
