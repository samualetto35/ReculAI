import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Recula - AI-Powered Video Interviews',
  description: 'Modern asenkron video mülakat platformu. Yapay zeka destekli aday değerlendirme.',
  keywords: ['video mülakat', 'işe alım', 'yapay zeka', 'HR', 'İK'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} light`}>
      <body className={`${inter.className} bg-surface-0 text-surface-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

