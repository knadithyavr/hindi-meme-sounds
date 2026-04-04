'use client'

import Link from 'next/link'
import { Play, Pause, Download, Share2 } from 'lucide-react'
import { useAudio } from './AudioProvider'
import { Sound } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface SoundCardProps {
  sound: Sound
  index?: number
}

export function SoundCard({ sound, index = 0 }: SoundCardProps) {
  const { playingId, toggle } = useAudio()
  const isPlaying = playingId === sound.id

  function handleDownload() {
    const a = document.createElement('a')
    a.href = `/api/download/${sound.slug}`
    a.click()
  }

  async function handleShare() {
    const soundUrl = `${window.location.origin}/sound/${sound.slug}`

    if (navigator.canShare) {
      try {
        const res = await fetch(`/api/download/${sound.slug}`)
        const blob = await res.blob()
        const file = new File([blob], `${sound.slug}.mp3`, { type: 'audio/mpeg' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: sound.title })
          return
        }
      } catch {
        // fall through
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: sound.title, url: soundUrl })
        return
      } catch {
        // fall through
      }
    }

    try {
      await navigator.clipboard.writeText(soundUrl)
      toast.success('Link copied')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <div
      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-card border border-border hover:border-primary/25 transition-colors animate-fade-in-up"
      style={{ animationDelay: `${index * 25}ms` }}
    >
      {/* Play / Pause */}
      <button
        onClick={() => toggle(sound.id, sound.audio_url, sound.title)}
        className={cn(
          'shrink-0 w-10 h-10 rounded-md flex items-center justify-center transition-all active:scale-95',
          isPlaying
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
        )}
        aria-label={isPlaying ? `Pause ${sound.title}` : `Play ${sound.title}`}
      >
        {isPlaying
          ? <Pause className="w-4 h-4 fill-current" />
          : <Play className="w-4 h-4 fill-current ml-0.5" />
        }
      </button>

      {/* Title + tags */}
      <div className="flex-1 min-w-0">
        <Link href={`/sound/${sound.slug}`} className="block">
          <p className="font-medium text-sm text-foreground truncate hover:text-primary transition-colors">
            {sound.title}
          </p>
        </Link>
        {sound.tags.length > 0 && (
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {sound.tags.slice(0, 4).map(t => `#${t.name}`).join('  ')}
          </p>
        )}
      </div>

      {/* Actions — always visible on mobile, hover-only on desktop */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleDownload}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded"
          aria-label="Download"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleShare}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded"
          aria-label="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
