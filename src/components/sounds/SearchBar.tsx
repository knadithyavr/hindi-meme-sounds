'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { Search } from 'lucide-react'

const MIN_CHARS = 3

export function SearchBar() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(query)
  const router = useRouter()

  const tooShort = value.trim().length > 0 && value.trim().length < MIN_CHARS

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = value.trim()
    if (q.length < MIN_CHARS) return
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(q)}`)
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          name="q"
          type="search"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Thoda sa repair karna hoga..."
          className="w-full pl-4 pr-10 py-2.5 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={tooShort || isPending}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
      {tooShort && (
        <p className="text-xs text-muted-foreground mt-1.5 pl-4">
          Type at least {MIN_CHARS} characters
        </p>
      )}
    </div>
  )
}
