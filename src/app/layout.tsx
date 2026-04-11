import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';
import { MotionProvider } from '@/components/providers/motion-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vlacovision.com'),
  title: {
    default: 'VLACOVISION — Premium Video Production | Cade Vlaco',
    template: '%s — VLACOVISION',
  },
  description: 'Vlacovision (Vlaco Vision) is a San Francisco Bay Area video production company founded by Cade Vlaco (CadeVlaco). Premium commercial film, brand storytelling, and creative direction for Nike, Disney, Lululemon, and more.',
  keywords: ['vlacovision', 'vlaco vision', 'cade vlaco', 'cadevlaco', 'video production', 'Bay Area video production', 'Bay Area cinematography', 'San Francisco videographer', 'San Francisco cinematographer', 'commercial film', 'brand storytelling', 'Bay Area videographer'],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://www.vlacovision.com',
              name: 'VLACOVISION',
              alternateName: ['Vlaco Vision', 'VlacoVision'],
              url: 'https://www.vlacovision.com',
              logo: 'https://www.vlacovision.com/assets/logo-cream.png',
              description: 'Premium video production, commercial film, and creative direction in the San Francisco Bay Area. Founded by Cade Vlaco.',
              founder: {
                '@type': 'Person',
                name: 'Cade Vlaco',
                alternateName: 'CadeVlaco',
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'San Francisco',
                addressRegion: 'CA',
                addressCountry: 'US',
              },
              areaServed: [
                { '@type': 'City', name: 'San Francisco' },
                { '@type': 'AdministrativeArea', name: 'Bay Area' },
                { '@type': 'AdministrativeArea', name: 'California' },
              ],
              sameAs: [
                'https://www.instagram.com/vlacovision',
                'https://vimeo.com/vlacovision',
              ],
              priceRange: '$$$',
              knowsAbout: [
                'video production',
                'cinematography',
                'commercial film',
                'brand storytelling',
                'creative direction',
              ],
            }),
          }}
        />
      </head>
      <body className="bg-bg-base text-text-primary font-body overflow-x-hidden">
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
