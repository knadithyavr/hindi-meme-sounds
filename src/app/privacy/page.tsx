import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-neutral dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().getFullYear()}</p>
      <p>
        Hindi Meme Sounds does not collect personal information from visitors. We use Google Analytics
        to understand aggregate site usage. No account is required to use the site.
      </p>
      <p>
        Audio files are served from Cloudflare&apos;s CDN. Standard server logs (IP address, browser, pages visited)
        may be retained for up to 30 days for security and debugging purposes.
      </p>
    </div>
  )
}
