'use client';

import { useRef, useState } from 'react';
import { m } from 'framer-motion';
import { DURATION } from '@/lib/animation-config';

interface HeroClientProps {
  heroVimeoId: string;
}

function HeroClient({ heroVimeoId }: HeroClientProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  function toggleSound() {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);

    iframe.contentWindow?.postMessage(
      JSON.stringify({
        method: 'setVolume',
        value: newMuted ? 0 : 1,
      }),
      'https://player.vimeo.com'
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Vimeo background iframe */}
      <div className="absolute inset-0 scale-110 pointer-events-none">
        <iframe
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${heroVimeoId}?autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&quality=auto`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          frameBorder="0"
          title="Hero background video"
        />
      </div>

      {/* Top-left brand name */}
      <m.div
        className="absolute top-6 left-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.cinematic, delay: 0.5 }}
      >
        <span
          className="text-2xl uppercase tracking-widest text-text-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          VLACOVISION
        </span>
      </m.div>

      {/* Bottom-right sound toggle */}
      <button
        onClick={toggleSound}
        className="absolute bottom-8 right-6 z-10 p-2 text-text-primary opacity-80 hover:opacity-100 transition-opacity"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? (
          /* Speaker with X (muted) */
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          /* Speaker with waves (unmuted) */
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* Bottom gradient fade to bg */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-base to-transparent pointer-events-none z-10" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-60 animate-bounce">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}

// Server Component wrapper — Hero fetches its own data via db
// For now, heroVimeoId is passed as a prop from the page
// (The page.tsx fetches SiteConfig and passes it down)
export function Hero({ heroVimeoId }: { heroVimeoId: string }) {
  return <HeroClient heroVimeoId={heroVimeoId} />;
}
