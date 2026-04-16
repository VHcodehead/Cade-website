'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  slug: string;
  title: string;
  client: string;
  vimeoId: string;
  thumbnailUrl: string | null;
  layout: 'full' | 'half';
  previewClipUrl?: string;
}

export function ProjectCard({
  id,
  slug,
  title,
  client,
  vimeoId,
  thumbnailUrl,
  layout,
  previewClipUrl,
}: ProjectCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTrackedPlay = useRef<boolean>(false);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  // Play/pause video based on hover or mobile viewport intersection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isHovered) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isHovered]);

  // Lazy-load thumbnail when card enters viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mobile: autoplay MP4 when card is centered on screen
  useEffect(() => {
    if (!isTouchDevice || !previewClipUrl) return;
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsHovered(entries[0].isIntersecting);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isTouchDevice, previewClipUrl]);

  // Analytics tracking
  useEffect(() => {
    if (isHovered && !hasTrackedPlay.current) {
      hasTrackedPlay.current = true;
      const payload = JSON.stringify({
        eventType: 'VIDEO_PLAY',
        page: '/projects/' + slug,
        projectId: id,
      });
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/event',
          new Blob([payload], { type: 'application/json' })
        );
      } else {
        fetch('/api/analytics/event', {
          method: 'POST',
          body: payload,
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => {});
      }
    }
  }, [isHovered, slug, id]);

  const aspectClass = layout === 'full'
    ? 'aspect-[4/5] sm:aspect-[21/9]'
    : 'aspect-[4/5] sm:aspect-[16/9]';

  return (
    <div
      className="group relative overflow-hidden"
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/projects/${slug}`} className="block">
        <div className={`relative ${aspectClass} overflow-hidden bg-bg-card`}>
          {/* Thumbnail */}
          {isVisible && thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-bg-card" />
          )}

          {/* Hover: native MP4 (instant) or Vimeo iframe (fallback) */}
          {previewClipUrl ? (
            <div
              className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <video
                ref={videoRef}
                src={previewClipUrl}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ) : (
            isHovered && !isTouchDevice && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}?background=1&quality=auto&autoplay=1&loop=1&muted=1&playsinline=1`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay"
                  title={`${title} preview`}
                />
              </div>
            )
          )}

          {/* Gradient overlay — appears with scroll on mobile, hover on desktop */}
          <div className={`absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-700 ${
            isTouchDevice
              ? (isHovered ? 'opacity-100' : 'opacity-0')
              : 'opacity-0 group-hover:opacity-100'
          }`} />

          {/* Title + Client — appears with scroll on mobile, slide up on desktop hover */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-500 ease-out ${
              isTouchDevice
                ? (isHovered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0')
                : 'translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
            }`}
            style={{ padding: '1.5rem 2rem' }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
              {client}
            </p>
            <h3
              className="text-white text-base sm:text-lg uppercase tracking-[0.12em] leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
}
