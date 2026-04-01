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
              className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                className="absolute inset-0 w-full h-full scale-110"
                frameBorder="0"
                allow="autoplay"
                title={`${title} preview`}
              />
            </div>
          )}

          {/* Gradient overlay — always subtle, stronger on hover */}
          <div
            className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Title + Client — bottom left, always visible but more prominent on hover */}
          <div className="absolute bottom-0 left-0 right-0 z-30 p-6">
            <h3 className="text-white text-sm font-medium uppercase tracking-[0.2em] group-hover:text-accent transition-colors duration-300">
              {title}
            </h3>
            <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">
              {client}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
