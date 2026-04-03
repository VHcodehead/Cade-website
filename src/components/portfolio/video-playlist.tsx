'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface VideoPlaylistProps {
  vimeoIds: string[]
  thumbnailUrl: string | null
  title: string
}

export function VideoPlaylist({ vimeoIds, thumbnailUrl, title }: VideoPlaylistProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const totalVideos = vimeoIds.length
  const hasMultiple = totalVideos > 1

  const currentVimeoId = vimeoIds[currentIndex]

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      let data: Record<string, unknown> | null = null

      if (typeof event.data === 'string') {
        try { data = JSON.parse(event.data) } catch { return }
      } else if (typeof event.data === 'object') {
        data = event.data
      }

      if (!data) return

      if (data.event === 'finish' || data.event === 'ended' || data.method === 'finish') {
        if (currentIndex < totalVideos - 1) {
          setCurrentIndex((prev) => prev + 1)
        } else {
          setCurrentIndex(0)
          setIsPlaying(false)
        }
      }
    },
    [currentIndex, totalVideos]
  )

  useEffect(() => {
    if (!isPlaying) return

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isPlaying, handleMessage])

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

          {/* Play button overlay */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center transition-colors group-hover:bg-accent">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white fill-white ml-1"
                aria-hidden="true"
              >
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
        key={currentVimeoId}
        src={`https://player.vimeo.com/video/${currentVimeoId}?autoplay=1&api=1&dnt=1&title=0&byline=0&portrait=0`}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />

      {/* Video counter indicator */}
      {hasMultiple && (
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 rounded-full text-[11px] text-white/70 tracking-wider pointer-events-none select-none">
          {currentIndex + 1} / {totalVideos}
        </div>
      )}
    </div>
  )
}
