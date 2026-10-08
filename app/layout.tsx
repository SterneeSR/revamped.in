import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://revamped.in'),
  title: {
    default: 'revamped.in — Prepare your exam files',
    template: '%s | revamped.in',
  },
  description: 'Resize photographs and signatures to the exact dimensions, format, and file-size requirements specified for your exam application. Free, private, browser-based.',
  keywords: ['exam photo resize', 'signature resize', 'TNPSC photo', 'UPSC photo', 'SSC photo', 'IBPS photo', 'RRB photo', 'AFCAT photo'],
  authors: [{ name: 'revamped.in' }],
  creator: 'revamped.in',
  publisher: 'revamped.in',
  robots: 'index, follow',
  icons: {
    icon: '/branding/logo.png',
    shortcut: '/branding/logo.png',
    apple: '/branding/logo.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-white text-neutral-900 min-h-screen flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 btn-primary"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}