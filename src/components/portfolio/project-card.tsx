'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  slug: string;
  title: string;
  client: string;
  vimeoId: string;
  thumbnailUrl: string | null;
  isFeatured: boolean;
  description: string;
}

export function ProjectCard({
  id,
  slug,
  title,
  client,
  vimeoId,
  thumbnailUrl,
  isFeatured,
  description,
}: ProjectCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasTrackedPlay = useRef<boolean>(false);

  // IntersectionObserver for lazy loading
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

  // Track VIDEO_PLAY once per card per page load when hover-to-play activates
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

  return (
    <div
      className={`group relative transition-transform duration-200 hover:scale-[1.02]${isFeatured ? ' sm:col-span-2' : ''}`}
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/projects/${slug}`} className="block">
        {/* Card container with aspect ratio */}
        <div className="relative aspect-video bg-bg-card overflow-hidden">
          {/* Thumbnail or placeholder */}
          {isVisible && thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              sizes={isFeatured ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
            />
          ) : (
            /* Dark placeholder before visible or if no thumbnail */
            <div className="absolute inset-0 bg-bg-card flex items-center justify-center">
              {!isVisible && (
                <span className="text-text-muted text-sm uppercase tracking-widest opacity-30">
                  {title}
                </span>
              )}
            </div>
          )}

          {/* Hover: Vimeo iframe preview (desktop only via CSS) */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none hidden-on-touch"
              style={{ zIndex: 1 }}
            >
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?background=1&quality=360p&autoplay=1&loop=1&muted=1`}
                className="absolute inset-0 w-full h-full scale-105"
                frameBorder="0"
                allow="autoplay"
                title={`${title} preview`}
              />
            </div>
          )}

          {/* Hover overlay: gradient + info (desktop) */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
            style={{ zIndex: 2 }}
          >
            <p className="text-white font-semibold text-sm uppercase tracking-wide">{title}</p>
            <p className="text-white/70 text-xs mt-1">{client}</p>
          </div>

          {/* Mobile: subtle play icon instead of hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mobile-play-icon">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="white"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Below card: title + description */}
        <div className="py-3 px-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-text-primary truncate">
            {title}
          </p>
          <p className="text-xs text-text-muted mt-1 truncate">{description}</p>
        </div>
      </Link>
    </div>
  );
}
