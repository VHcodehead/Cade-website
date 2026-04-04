import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';
import { MotionProvider } from '@/components/providers/motion-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'VLACOVISION — Premium Video Production | Cade Vlaco',
    template: '%s — VLACOVISION',
  },
  description: 'Vlacovision (Vlaco Vision) is a San Francisco Bay Area video production company founded by Cade Vlaco (CadeVlaco). Premium commercial film, brand storytelling, and creative direction for Nike, Disney, Lululemon, and more.',
  keywords: ['vlacovision', 'vlaco vision', 'cade vlaco', 'cadevlaco', 'video production', 'Bay Area video production', 'Bay Area cinematography', 'commercial film', 'brand storytelling', 'San Francisco videographer', 'San Francisco cinematographer'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    siteName: 'VLACOVISION',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="bg-bg-base text-text-primary font-body overflow-x-hidden">
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
