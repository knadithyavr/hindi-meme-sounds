import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-neutral dark:prose-invert">
      <h1>Contact</h1>
      <p>
        For copyright removal requests, suggestions, or general enquiries, email us at:
      </p>
      <p>
        <strong>hello@hindimemesounds.com</strong>
      </p>
      <p>We typically respond within 48 hours.</p>
    </div>
  )
}
