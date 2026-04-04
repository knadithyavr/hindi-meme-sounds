'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Search } from 'lucide-react'

export function SearchBar() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim()
    if (!q) return
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(q)}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
      <input
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Search sounds, tags, descriptions..."
        className="w-full pl-4 pr-10 py-2.5 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
        disabled={isPending}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  )
}
