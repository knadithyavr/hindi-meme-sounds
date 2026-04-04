'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Maps language slug → script name for dynamic wordmark
// Update this when adding new languages
const LANGUAGE_SCRIPTS: Record<string, string> = {
  hindi:   'हिंदी',
  telugu:  'తెలుగు',
  tamil:   'தமிழ்',
  bengali: 'বাংলা',
  marathi: 'मराठी',
  kannada: 'ಕನ್ನಡ',
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/trending', label: 'Trending' },
  { href: '/categories', label: 'Categories' },
]

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Derive script name from path: "/hindi" → "हिंदी", anything else → null
  const langSlug = pathname.split('/')[1]
  const scriptName = LANGUAGE_SCRIPTS[langSlug] ?? null

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-1 leading-none select-none">
          {scriptName ? (
            <>
              <span className="font-bold text-lg text-primary tracking-tight">{scriptName}</span>
              <span className="font-bold text-lg text-foreground tracking-tight">&nbsp;Meme Studio</span>
            </>
          ) : (
            <span className="font-bold text-lg text-foreground tracking-tight">The Meme Studio</span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-foreground',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-3 bg-background">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'text-sm font-medium',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
