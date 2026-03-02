import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://exxodus.io'),
  title: {
    default: 'EXXODUS — Navigating the Post-Labour Transition',
    template: '%s | EXXODUS',
  },
  description: 'EXXODUS is a post-labour transition operator. We map cognitive work, redesign organizations and build infrastructure for the transition between labour-based economies and post-labour societies.',
  keywords: ['post-labour', 'future of work', 'AI automation', 'workforce transition', 'cognitive task mapping', 'ALTER', 'organizational design'],
  authors: [{ name: 'EXXODUS' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://exxodus.io/',
    title: 'EXXODUS — Navigating the Post-Labour Transition',
    description: 'EXXODUS is a post-labour transition operator. We map cognitive work, redesign organizations and build infrastructure for the transition between labour-based economies and post-labour societies.',
    images: [{ url: 'https://devops.supernaturale.it/dir/exxodus/img/02-exx.jpeg', width: 1200, height: 630 }],
    siteName: 'EXXODUS',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EXXODUS — Navigating the Post-Labour Transition',
    description: 'EXXODUS is a post-labour transition operator.',
    images: ['https://devops.supernaturale.it/dir/exxodus/img/02-exx.jpeg'],
  },
  icons: {
    icon: 'https://devops.supernaturale.it/dir/exxodus/ex-fav.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
