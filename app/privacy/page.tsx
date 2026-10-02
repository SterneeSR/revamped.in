import { Metadata } from 'next';
import { LogoWithText } from '@/components/branding/Logo';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'revamped.in privacy policy - How we handle your data and protect your privacy.',
  robots: 'index, follow',
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="relative min-h-screen py-16 md:py-24">
      <GeometricAccent variant="hero" className="absolute top-0 left-0 right-0 h-48 -z-10" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <LogoWithText size="xl" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">Privacy Policy</h1>
          <p className="text-charcoal-600">Last updated: {lastUpdated}</p>
        </header>

        <article className="card p-8 md:p-12 space-y-8 prose prose-charcoal max-w-none">
          <section>
            <h2>Overview</h2>
            <p>
              revamped.in ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our website and tools.
            </p>
            <p>
              In short: <strong>We do not collect, store, or process your photographs or signatures.</strong> All image processing happens locally in your browser.
            </p>
          </section>

          <section>
            <h2>Information We Do Not Collect</h2>
            <ul>
              <li>Your photographs or signatures</li>
              <li>Personal identification information</li>
              <li>Account credentials (we have no user accounts)</li>
              <li>Location data</li>
              <li>Device identifiers</li>
            </ul>
          </section>

          <section>
            <h2>How Our Tools Work</h2>
            <p>
              When you use our photo or signature preparation tools:
            </p>
            <ol>
              <li>You select an image file from your device</li>
              <li>The image is processed entirely in your browser using JavaScript (HTML5 Canvas API)</li>
              <li>No data is sent to our servers at any point</li>
              <li>The processed file is downloaded directly to your device</li>
            </ol>
            <p>
              This means your sensitive documents never leave your computer or phone.
            </p>
          </section>

          <section>
            <h2>Information We May Collect</h2>
            <h3>Analytics (Minimal)</h3>
            <p>
              We may use privacy-respecting analytics to understand aggregate usage patterns:
            </p>
            <ul>
              <li>Page views and popular exam pages</li>
              <li>Browser and device types (aggregated)</li>
              <li>Referrer information (aggregated)</li>
            </ul>
            <p>
              We do not use tracking cookies, fingerprinting, or individual user profiling.
            </p>

            <h3>Advertising</h3>
            <p>
              We display Google AdSense advertisements to support the free service. Google may collect data as described in their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>. You can opt out of personalized ads via <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Ads Settings</a>.
            </p>
          </section>

          <section>
            <h2>Third-Party Services</h2>
            <ul>
              <li><strong>Google AdSense:</strong> Displays advertisements</li>
              <li><strong>Supabase:</strong> Hosts our exam requirement database (public data only)</li>
              <li><strong>Vercel:</strong> Hosts the website</li>
            </ul>
            <p>
              These services have their own privacy policies. We encourage you to review them.
            </p>
          </section>

          <section>
            <h2>Data Security</h2>
            <p>
              Since we do not receive or store your images, there is no risk of server-side data breaches involving your photographs or signatures.
            </p>
            <p>
              Our website uses HTTPS encryption. The admin panel is protected by Supabase Auth with Row Level Security.
            </p>
          </section>

          <section>
            <h2>Children's Privacy</h2>
            <p>
              Our service is not directed at children under 13. We do not knowingly collect information from children. The service is intended for exam applicants who are typically adults.
            </p>
          </section>

          <section>
            <h2>Your Rights</h2>
            <p>
              Since we do not collect personal data, there is no personal data to access, correct, or delete. If you have concerns about analytics data, you can use browser privacy features (incognito mode, tracker blockers) or contact us.
            </p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this policy occasionally. Changes will be posted on this page with an updated "Last updated" date. Continued use of the site constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about this policy? <a href="/contact" className="underline">Contact us</a>.
            </p>
          </section>

          <hr className="border-charcoal-200" />

          <p className="text-sm text-charcoal-500">
            <strong>Important:</strong> revamped.in is an independent utility website and is not affiliated with any government examination body, commission, or board. We provide tools to help you prepare application files according to publicly available requirements. Always verify requirements with the official notification before submitting your application.
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