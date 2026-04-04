'use client'

import { Play, Pause, Download, Share2 } from 'lucide-react'
import { useAudio } from './AudioProvider'
import { trackDownload, trackShare } from '@/lib/actions'
import { Sound } from '@/types'
import { toast } from 'sonner'

export function SoundHero({ sound }: { sound: Sound }) {
  const { playingId, toggle } = useAudio()
  const isPlaying = playingId === sound.id

  function handleDownload() {
    const a = document.createElement('a')
    a.href = `/api/download/${sound.slug}`
    a.click()
    trackDownload(sound.id)
  }

  async function handleShare() {
    const soundUrl = `${window.location.origin}/${sound.language_slug}/sound/${sound.slug}`

    if (navigator.canShare) {
      try {
        const res = await fetch(`/api/download/${sound.slug}`)
        const blob = await res.blob()
        const file = new File([blob], `${sound.slug}.mp3`, { type: 'audio/mpeg' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: sound.title })
          trackShare(sound.id)
          return
        }
      } catch {
        // fall through
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: sound.title, url: soundUrl })
        trackShare(sound.id)
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
    <div className="flex flex-col items-center gap-5">
      {/* Large play button */}
      <button
        onClick={() => toggle(sound.id, sound.audio_url, sound.title)}
        className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center hover:bg-primary/85 active:scale-95 transition-all shadow-lg shadow-primary/25"
        aria-label={isPlaying ? `Pause ${sound.title}` : `Play ${sound.title}`}
      >
        {isPlaying
          ? <Pause className="w-10 h-10 text-primary-foreground fill-current" />
          : <Play className="w-10 h-10 text-primary-foreground fill-current ml-1" />
        }
      </button>

      {/* Action buttons */}
      <div className="flex gap-2 w-full">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  )
}
