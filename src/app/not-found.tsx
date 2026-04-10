import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p
        className="text-[clamp(4rem,10vw,8rem)] uppercase tracking-[0.2em] text-text-primary/10 leading-none"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        404
      </p>
      <p className="text-[13px] uppercase tracking-[0.3em] text-text-muted/40 mt-6 mb-10">
        Page not found
      </p>
      <Link
        href="/"
        className="text-[11px] uppercase tracking-[0.25em] text-text-primary/60 hover:text-accent transition-colors duration-300 border-b border-white/10 pb-1"
      >
        Back to Home
      </Link>
    </div>
  );
}
