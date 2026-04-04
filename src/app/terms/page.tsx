import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-neutral dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().getFullYear()}</p>
      <p>
        All audio clips on Hindi Meme Sounds are intended for personal, non-commercial use — memes, social sharing, and entertainment.
        We do not claim ownership of the underlying copyrighted material.
      </p>
      <p>
        If you are a rights holder and believe a clip should be removed, please contact us and we will act promptly.
      </p>
    </div>
  )
}
