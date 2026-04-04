import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-neutral dark:prose-invert">
      <h1>About Hindi Meme Sounds</h1>
      <p>
        Hindi Meme Sounds is a free library of the best Hindi meme audio clips from Bollywood, web series, and viral moments.
        Play, download, and share sounds directly to WhatsApp and other apps.
      </p>
      <p>
        Browse by category or search by title, description, and tags to find exactly what you need.
      </p>
    </div>
  )
}
