import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AudioProvider } from '@/components/sounds/AudioProvider'

export const metadata: Metadata = {
  title: {
    default: 'Hindi Meme Sounds',
    template: '%s | Hindi Meme Sounds',
  },
  description: 'Play and download the best Hindi meme sounds. Browse by category, search by tags.',
  keywords: ['hindi meme sounds', 'hindi memes', 'bollywood meme sounds', 'funny hindi audio'],
  authors: [{ name: 'Hindi Meme Sounds' }],
  openGraph: {
    type: 'website',
    siteName: 'Hindi Meme Sounds',
    title: 'Hindi Meme Sounds',
    description: 'Play and download the best Hindi meme sounds.',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap"
        />
      </head>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}</Script>
        </>
      )}
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <AudioProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AudioProvider>
          <Toaster position="bottom-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
