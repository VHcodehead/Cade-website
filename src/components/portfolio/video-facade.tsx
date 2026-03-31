'use client'

import { useState } from 'react'
import Image from 'next/image'

interface VideoFacadeProps {
  vimeoId: string
  thumbnailUrl: string | null
  title: string
}

export function VideoFacade({ vimeoId, thumbnailUrl, title }: VideoFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (isPlaying) {
    return (
      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

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
