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
}

export function ProjectCard({
  id,
  slug,
  title,
  client,
  vimeoId,
  thumbnailUrl,
  isFeatured,
}: ProjectCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasTrackedPlay = useRef<boolean>(false);

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
      className={`group relative overflow-hidden bg-bg-base${isFeatured ? ' sm:col-span-2' : ''}`}
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/projects/${slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* Thumbnail */}
          {isVisible && thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              sizes={isFeatured ? '100vw' : '(max-width: 640px) 100vw, 50vw'}
            />
          ) : (
            <div className="absolute inset-0 bg-bg-card" />
          )}

          {/* Hover: Vimeo iframe */}
          {isHovered && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?background=1&quality=360p&autoplay=1&loop=1&muted=1`}
                className="absolute inset-0 w-full h-full scale-[1.15]"
                frameBorder="0"
                allow="autoplay"
                title={`${title} preview`}
              />
            </div>
          )}

          {/* Gradient overlay — cinematic bottom wash, not full cover */}
          <div
            className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />

          {/* Title + Client — revealed on hover, clean and minimal */}
          <div className="absolute bottom-0 left-0 right-0 z-30 p-6 sm:p-8 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
              {client}
            </p>
            <h3
              className="text-white text-sm sm:text-base uppercase tracking-[0.15em] leading-tight"
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
