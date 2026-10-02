import type { Metadata, Viewport } from 'next';
import Link from 'next/link';

import { LogoWithText } from '@/components/branding/Logo';

export const viewport: Viewport = {
  themeColor: '#0d0d0d',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://revamped.in'),
  title: {
    default: 'revamped.in — Exam photos. Signatures. Ready to submit.',
    template: '%s | revamped.in',
  },
  description: 'Resize photographs and signatures to the exact dimensions, format, and file-size requirements specified for your exam application. Free, private, browser-based.',
  keywords: ['exam photo resize', 'signature resize', 'TNPSC photo', 'UPSC photo', 'SSC photo', 'IBPS photo', 'RRB photo', 'AFCAT photo'],
  authors: [{ name: 'revamped.in' }],
  creator: 'revamped.in',
  publisher: 'revamped.in',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'revamped.in',
    title: 'revamped.in — Exam photos. Signatures. Ready to submit.',
    description: 'Resize photographs and signatures to the exact dimensions, format, and file-size requirements specified for your exam application.',
    images: [
      {
        url: '/branding/og-image.png',
        width: 1200,
        height: 630,
        alt: 'revamped.in — Exam photo and signature preparation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'revamped.in — Exam photos. Signatures. Ready to submit.',
    description: 'Resize photographs and signatures to the exact dimensions, format, and file-size requirements specified for your exam application.',
    images: ['/branding/og-image.png'],
  },
  icons: {
    icon: '/branding/logo.svg',
    shortcut: '/branding/logo.svg',
    apple: '/branding/logo.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-white text-charcoal-900 min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 btn-primary"
        >
          Skip to main content
        </a>
        <header className="border-b border-charcoal-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2" aria-label="revamped.in homepage">
                <LogoWithText size="lg" />
              </Link>
              <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
                <Link href="/#exams" className="text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">
                  Exams
                </Link>
                <Link href="/#tools" className="text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">
                  Tools
                </Link>
                <Link href="/about" className="text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors">
                  About
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <footer className="border-t border-charcoal-200 bg-charcoal-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <LogoWithText size="lg" className="mb-4" />
                <p className="text-charcoal-600 text-sm max-w-xs">
                  Exam photos. Signatures. Ready to submit.
                  Free, private, browser-based utility for Indian exam applications.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal-900 mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm text-charcoal-600">
                  <li><Link href="/privacy" className="hover:text-charcoal-900 transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-charcoal-900 transition-colors">Terms</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-charcoal-900 transition-colors">Disclaimer</Link></li>
                  <li><Link href="/contact" className="hover:text-charcoal-900 transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal-900 mb-3">Popular Exams</h4>
                <ul className="space-y-2 text-sm text-charcoal-600">
                  <li><Link href="/tnpsc/group-ii" className="hover:text-charcoal-900 transition-colors">TNPSC Group II</Link></li>
                  <li><Link href="/upsc/civil-services" className="hover:text-charcoal-900 transition-colors">UPSC Civil Services</Link></li>
                  <li><Link href="/ssc/cgl" className="hover:text-charcoal-900 transition-colors">SSC CGL</Link></li>
                  <li><Link href="/ibps/po" className="hover:text-charcoal-900 transition-colors">IBPS PO</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-charcoal-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-charcoal-500">
                © {new Date().getFullYear()} revamped.in. Independent utility. Not affiliated with any government body.
              </p>
              <div className="flex items-center gap-4 text-sm text-charcoal-500">
                <span>Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}