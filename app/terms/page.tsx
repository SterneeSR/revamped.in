import { Metadata } from 'next';
import { LogoWithText } from '@/components/branding/Logo';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'revamped.in terms of service - Terms and conditions for using our exam preparation tools.',
  robots: 'index, follow',
};

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="relative min-h-screen py-16 md:py-24">
      <GeometricAccent variant="hero" className="absolute top-0 left-0 right-0 h-48 -z-10" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <LogoWithText size="xl" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">Terms of Service</h1>
          <p className="text-charcoal-600">Last updated: {lastUpdated}</p>
        </header>

        <article className="card p-8 md:p-12 space-y-8 prose prose-charcoal max-w-none">
          <section>
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using revamped.in ("the Site", "we", "us", "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not use the Site.
            </p>
          </section>

          <section>
            <h2>Description of Service</h2>
            <p>
              revamped.in provides free, browser-based tools to help users resize and prepare photographs and signatures for Indian exam applications. The tools process images locally in your browser and do not upload files to our servers.
            </p>
          </section>

          <section>
            <h2>No Warranty on Requirements</h2>
            <p>
              <strong>Important:</strong> The examination requirements (dimensions, file sizes, formats, overlays) displayed on this Site are sourced from publicly available official notifications and websites. While we make reasonable efforts to ensure accuracy:
            </p>
            <ul>
              <li>Requirements may change between notification cycles</li>
              <li>Official sources may contain errors or ambiguities</li>
              <li>We do not guarantee that files prepared using our tools will be accepted by any examination authority</li>
            </ul>
            <p>
              <strong>You are solely responsible for verifying all requirements against the official notification before submitting your application.</strong>
            </p>
          </section>

          <section>
            <h2>No Government Affiliation</h2>
            <p>
              revamped.in is an independent utility website. We are not affiliated with, endorsed by, or connected to any government examination body, commission, board, or agency (including but not limited to UPSC, SSC, TNPSC, IBPS, RRB, NTA, SBI, AFCAT, or any State PSC).
            </p>
          </section>

          <section>
            <h2>Use of Tools</h2>
            <ul>
              <li>You may use the tools for personal, non-commercial purposes only</li>
              <li>You must not attempt to reverse engineer, decompile, or extract the source code</li>
              <li>You must not use automated scripts, bots, or scrapers to access the tools</li>
              <li>You must not upload illegal, harmful, or copyrighted content</li>
            </ul>
          </section>

          <section>
            <h2>Privacy</h2>
            <p>
              Your use of the Site is also governed by our <a href="/privacy" className="underline">Privacy Policy</a>. Key points:
            </p>
            <ul>
              <li>Images are processed locally in your browser</li>
              <li>We do not upload, store, or access your photographs or signatures</li>
              <li>Minimal analytics may be collected (see Privacy Policy)</li>
            </ul>
          </section>

          <section>
            <h2>Advertisements</h2>
            <p>
              The Site displays Google AdSense advertisements. We are not responsible for the content, accuracy, or practices of advertisers. Interactions with advertisements are solely between you and the advertiser.
            </p>
          </section>

          <section>
            <h2>Intellectual Property</h2>
            <p>
              The Site's design, code, branding (including the geometric sphere logo), and original content are owned by revamped.in. You may not reproduce, distribute, or create derivative works without permission.
            </p>
            <p>
              Examination requirements are factual information sourced from public notifications and are not subject to copyright.
            </p>
          </section>

          <section>
            <h2>Disclaimer of Warranties</h2>
            <p>
              THE SITE AND TOOLS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES. WE DO NOT WARRANT THE ACCURACY, COMPLETENESS, OR TIMELINESS OF ANY REQUIREMENTS DATA.
            </p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL REVAMPED.IN BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR TOOLS.
            </p>
            <p>
              OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID TO USE THE SITE (WHICH IS ZERO).
            </p>
          </section>

          <section>
            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless revamped.in from any claims, damages, or expenses (including legal fees) arising from your use of the Site or violation of these Terms.
            </p>
          </section>

          <section>
            <h2>Termination</h2>
            <p>
              We may suspend or terminate your access to the Site at any time, without notice, for violation of these Terms or for any other reason. Upon termination, your right to use the Site ceases immediately.
            </p>
          </section>

          <section>
            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.
            </p>
          </section>

          <section>
            <h2>Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the Site after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about these Terms? <a href="/contact" className="underline">Contact us</a>.
            </p>
          </section>

          <hr className="border-charcoal-200" />

          <p className="text-sm text-charcoal-500">
            <strong>Summary:</strong> revamped.in is a free utility tool. We provide exam requirements as a reference only. Always verify with official sources. We are not responsible for rejected applications. Use at your own risk.
          </p>
        </article>

        <footer className="mt-12 text-center">
          <Link href="/" className="text-charcoal-500 hover:text-charcoal-900 text-sm">
            ← Back to revamped.in
          </Link>
        </footer>
      </div>
    </div>
  );
}