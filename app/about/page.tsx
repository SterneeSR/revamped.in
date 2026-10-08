import { Metadata } from 'next';
import Link from 'next/link';
import { LogoWithText } from '@/components/branding/Logo';

export const metadata: Metadata = {
  title: 'About revamped.in',
  description: 'Independent browser-based utility for Indian exam applicants to prepare compliant photographs and signatures.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <LogoWithText size="lg" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
          About revamped.in
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed">
          A free, fast, browser-based utility built to solve one specific problem: helping Indian competitive exam applicants prepare photo and signature files that match official recruitment standards.
        </p>
      </div>

      <div className="space-y-8 text-neutral-700 text-sm md:text-base leading-relaxed border-t border-neutral-200 pt-8">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Why revamped.in exists</h2>
          <p>
            Every competitive examination (TNPSC, UPSC, SSC, IBPS, RRB, SBI, NTA, AFCAT, State PSCs) specifies rigid technical requirements: exact pixel dimensions, tight file-size limits (often 20–50 KB), specific formats, and bottom name/date banners.
          </p>
          <p className="mt-2">
            Candidates often struggle with complex editing software or internet cafes that compromise image quality or fail compliance. revamped.in makes preparation instant, precise, and completely free.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">100% Client-side & Private</h2>
          <p>
            Your privacy is non-negotiable. All image processing—cropping, resizing, compression, and overlays—runs locally in your browser using modern Web APIs. Your photographs and signatures never leave your device and are never sent or stored on our servers.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Independent utility</h2>
          <p>
            revamped.in is an independent internet utility and is not affiliated with, endorsed by, or sponsored by any government commission, recruitment board, or official examination authority.
          </p>
        </div>
      </div>
    </div>
  );
}
