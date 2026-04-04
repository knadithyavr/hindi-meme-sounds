import Link from 'next/link'
import { Language } from '@/types'
import { formatCount } from '@/lib/utils'

export function LanguageCards({ languages }: { languages: Language[] }) {
  if (!languages.length) return null

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
      {languages.map(lang => (
        <Link key={lang.id} href={`/${lang.slug}`}>
          <div className="shrink-0 flex flex-col items-center gap-1.5 px-6 py-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-card/60 transition-colors text-center min-w-[130px]">
            <span className="text-2xl font-bold text-primary">{lang.script_name}</span>
            <span className="text-xs text-muted-foreground">
              {formatCount(lang.sound_count ?? 0)} sounds
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
