import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';
import { MotionProvider } from '@/components/providers/motion-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' });

export const metadata: Metadata = {
  title: 'VLACOVISION — Video Production',
  description: 'Premium video production for brands that move people. Bay Area and worldwide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="bg-bg-base text-text-primary font-body">
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
