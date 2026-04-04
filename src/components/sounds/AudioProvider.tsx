'use client'

import { createContext, useContext, useRef, useState, useCallback } from 'react'
import { trackPlay } from '@/lib/actions'

interface CurrentSound {
  id: string
  title: string
  url: string
}

interface AudioContextValue {
  playingId: string | null
  currentSound: CurrentSound | null
  play: (id: string, url: string, title: string) => void
  pause: () => void
  toggle: (id: string, url: string, title: string) => void
}

const AudioContext = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [currentSound, setCurrentSound] = useState<CurrentSound | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const pendingRef = useRef(false)

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setPlayingId(null)
  }, [])

  const play = useCallback((id: string, url: string, title: string) => {
    if (pendingRef.current) return
    pendingRef.current = true

    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current

    if (playingId === id && !audio.paused) {
      pendingRef.current = false
      return
    }

    audio.pause()
    audio.src = url
    audio.load()

    audio.play()
      .then(() => {
        setPlayingId(id)
        setCurrentSound({ id, title, url })
        const key = `played_${id}`
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1')
          trackPlay(id)
        }
      })
      .catch(() => {})
      .finally(() => { pendingRef.current = false })

    audio.onended = () => setPlayingId(null)
  }, [playingId])

  const toggle = useCallback((id: string, url: string, title: string) => {
    if (playingId === id) {
      pause()
    } else {
      play(id, url, title)
    }
  }, [playingId, play, pause])

  return (
    <AudioContext.Provider value={{ playingId, currentSound, play, pause, toggle }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be used inside AudioProvider')
  return ctx
}
