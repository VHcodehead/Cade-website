'use client';

import { useRef, useState } from 'react';
import { m } from 'framer-motion';
import { DURATION, EASING_SMOOTH } from '@/lib/animation-config';

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
    <section className="relative h-dvh w-full overflow-hidden">
      {/* Vimeo background iframe — negative inset zoom avoids Safari transform-on-iframe bugs */}
      <div className="absolute pointer-events-none overflow-hidden" style={{ inset: '-7.5%' }}>
        <iframe
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${heroVimeoId}?autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&quality=auto&playsinline=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          frameBorder="0"
          title="Hero background video"
        />
      </div>

      {/* Cinematic vignette overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Bottom gradient — tall, smooth dissolve into bg */}
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent pointer-events-none z-10" />

      {/* SEO: H1 for search engines, visually hidden */}
      <h1 className="sr-only">VLACOVISION — Premium Video Production and Bay Area Cinematography by Cade Vlaco</h1>

      {/* Bottom-right sound toggle */}
      <button
        onClick={toggleSound}
        className="absolute bottom-10 right-8 z-20 p-2 text-text-primary/40 hover:text-text-primary transition-colors duration-300"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* Scroll indicator */}
      <m.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-text-primary">Scroll</span>
        <span className="w-[1px] h-10 bg-text-primary/40 animate-pulse" />
      </m.div>
    </section>
  );
}

export function Hero({ heroVimeoId }: { heroVimeoId: string }) {
  return <HeroClient heroVimeoId={heroVimeoId} />;
}
