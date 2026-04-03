'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface VideoPlaylistProps {
  vimeoIds: string[]
  thumbnailUrl: string | null
  title: string
}

export function VideoPlaylist({ vimeoIds, thumbnailUrl, title }: VideoPlaylistProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const totalVideos = vimeoIds.length
  const hasMultiple = totalVideos > 1

  // Poll the Vimeo iframe for progress — when video ends, advance
  useEffect(() => {
    if (!isPlaying || !iframeRef.current) return

    const iframe = iframeRef.current
    let polling: ReturnType<typeof setInterval>

    // Wait for iframe to load, then start polling
    const startPolling = () => {
      // Ask Vimeo for current time and duration
      polling = setInterval(() => {
        try {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ method: 'getCurrentTime' }),
            'https://player.vimeo.com'
          )
          iframe.contentWindow?.postMessage(
            JSON.stringify({ method: 'getDuration' }),
            'https://player.vimeo.com'
          )
        } catch {
          // iframe might not be ready
        }
      }, 1000)
    }

    let duration = 0
    let currentTime = 0

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('vimeo.com')) return

      let data: Record<string, unknown> | null = null
      if (typeof event.data === 'string') {
        try { data = JSON.parse(event.data) } catch { return }
      } else if (typeof event.data === 'object') {
        data = event.data as Record<string, unknown>
      }
      if (!data) return

      if (data.method === 'getCurrentTime' && typeof data.value === 'number') {
        currentTime = data.value
      }
      if (data.method === 'getDuration' && typeof data.value === 'number') {
        duration = data.value
      }

      // Check if video finished (within 1 second of end)
      if (duration > 0 && currentTime > 0 && currentTime >= duration - 1) {
        if (currentIndex < totalVideos - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          setCurrentIndex(0)
          setIsPlaying(false)
        }
      }

      // Also check for explicit finish event
      if (data.event === 'finish' || data.event === 'ended') {
        if (currentIndex < totalVideos - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          setCurrentIndex(0)
          setIsPlaying(false)
        }
      }
    }

    window.addEventListener('message', handleMessage)
    const loadTimer = setTimeout(startPolling, 2000)

    return () => {
      window.removeEventListener('message', handleMessage)
      clearInterval(polling)
      clearTimeout(loadTimer)
    }
  }, [isPlaying, currentIndex, totalVideos])

  if (!isPlaying) {
    return (
      <div className="relative w-full aspect-video bg-black">
        <button
          onClick={() => setIsPlaying(true)}
          aria-label={`Play ${title}`}
          className="relative w-full h-full group"
        >
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-black" />
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center transition-colors group-hover:bg-accent">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-white ml-1" aria-hidden="true">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </span>
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black">
      <iframe
        ref={iframeRef}
        key={`${vimeoIds[currentIndex]}-${currentIndex}`}
        src={`https://player.vimeo.com/video/${vimeoIds[currentIndex]}?autoplay=1&api=1&player_id=playlist&dnt=1&title=0&byline=0&portrait=0`}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />

      {hasMultiple && (
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 rounded-full text-[11px] text-white/70 tracking-wider pointer-events-none select-none">
          {currentIndex + 1} / {totalVideos}
        </div>
      )}
    </div>
  )
}
