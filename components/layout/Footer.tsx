import Link from 'next/link';
import { LogoWithText } from '@/components/branding/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-850 border-neutral-900">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="revamped.in">
              <LogoWithText size="md" inverted />
            </Link>
            <span className="text-neutral-500 hidden sm:inline">•</span>
            <p className="text-neutral-400 text-xs max-w-md">
              A free browser utility to prepare photographs and signatures to meet official exam application specifications.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-neutral-400">
            <Link href="/#exams" className="hover:text-white transition-colors">Exams</Link>
            <Link href="/#tools" className="hover:text-white transition-colors">Tools</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <p>© {currentYear} revamped.in. All rights reserved.</p>
          <p className="font-medium text-neutral-400">
            Not affiliated with any government organization.
          </p>
        </div>
      </div>
    </footer>
  );
}
