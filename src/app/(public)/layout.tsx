import type { ReactNode } from 'react';
import { Nav } from '@/components/layout/nav';
import { Footer } from '@/components/layout/footer';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://player.vimeo.com" />
      <link rel="preconnect" href="https://i.vimeocdn.com" />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
