import type { ReactNode } from 'react';

interface CTAButtonProps {
  variant: 'primary' | 'secondary';
  href: string;
  children: ReactNode;
}

export function CTAButton({ variant, href, children }: CTAButtonProps) {
  if (variant === 'primary') {
    return (
      <a
        href={href}
        className="inline-block px-8 py-3 bg-accent text-white font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="inline-block px-8 py-3 border border-text-muted text-text-primary uppercase tracking-widest transition-colors hover:border-accent"
    >
      {children}
    </a>
  );
}
