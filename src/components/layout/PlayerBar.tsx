'use client'

import { Play, Pause, X } from 'lucide-react'
import { useAudio } from '@/components/sounds/AudioProvider'

export function PlayerBar() {
  const { currentSound, playingId, pause, toggle } = useAudio()

  if (!currentSound) return null

  const isPlaying = playingId === currentSound.id

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
        {/* Play / Pause */}
        <button
          onClick={() => toggle(currentSound.id, currentSound.url, currentSound.title)}
          className="shrink-0 w-8 h-8 rounded-md bg-primary flex items-center justify-center hover:bg-primary/85 active:scale-95 transition-all"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying
            ? <Pause className="w-3.5 h-3.5 text-primary-foreground fill-current" />
            : <Play className="w-3.5 h-3.5 text-primary-foreground fill-current ml-0.5" />
          }
        </button>

        {/* Track info + equalizer */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">
            {currentSound.title}
          </p>
          {isPlaying && (
            <div className="flex items-end gap-px shrink-0" style={{ height: 14 }}>
              {[0, 1, 2, 3, 4].map(i => (
                <span
                  key={i}
                  className="w-[3px] bg-primary rounded-sm animate-sound-bar"
                  style={{ animationDelay: `${i * 0.12}s`, height: 14 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stop */}
        <button
          onClick={pause}
          className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close player"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
