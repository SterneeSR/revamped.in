import { Metadata } from 'next';
import { LogoWithText } from '@/components/branding/Logo';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact revamped.in - Questions, corrections, or feedback about exam photo and signature tools.',
  robots: 'index, follow',
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen py-16 md:py-24">
      <GeometricAccent variant="hero" className="absolute top-0 left-0 right-0 h-48 -z-10" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <LogoWithText size="xl" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">Contact</h1>
          <p className="text-charcoal-600">Questions, corrections, or feedback? We'd love to hear from you.</p>
        </header>

        <article className="card p-8 md:p-12 space-y-8 prose prose-charcoal max-w-none">
          <section>
            <h2>Get in Touch</h2>
            <p>
              You can reach us via email:
            </p>
            <p className="text-center my-6">
              <a href="mailto:contact@revamped.in" className="text-lg font-medium text-charcoal-900 hover:underline">
                contact@revamped.in
              </a>
            </p>
          </section>

          <section>
            <h2>What to Contact Us About</h2>
            <ul>
              <li><strong>Requirement corrections:</strong> If you find inaccurate exam requirements, please include the official source URL and notification reference.</li>
              <li><strong>Bug reports:</strong> Describe the issue, your browser, and steps to reproduce.</li>
              <li><strong>Feature requests:</strong> Suggestions for new exams or tool improvements.</li>
              <li><strong>General feedback:</strong> We appreciate hearing about your experience.</li>
            </ul>
          </section>

          <section>
            <h2>What We Cannot Help With</h2>
            <ul>
              <li>Application status or admit card queries (contact the examination authority)</li>
              <li>Technical support for official examination websites</li>
              <li>Legal advice on application rejections</li>
              <li>Personal data requests (we don't store your images)</li>
            </ul>
          </section>

          <section>
            <h2>Reporting Inaccurate Requirements</h2>
            <p>
              If you believe an exam's requirements on our site are incorrect, please email us with:
            </p>
            <ol>
              <li>The exam name and application cycle</li>
              <li>The specific requirement you believe is wrong (dimensions, file size, format, etc.)</li>
              <li>A link to the official notification PDF or webpage</li>
              <li>The relevant section/page number in the official document</li>
            </ol>
            <p>
              We will verify against the official source and update if confirmed.
            </p>
          </section>

          <section>
            <h2>Response Time</h2>
            <p>
              We typically respond within 2-3 business days. During peak exam seasons, it may take longer.
            </p>
          </section>

          <hr className="border-charcoal-200" />

          <p className="text-sm text-charcoal-500">
            <strong>Remember:</strong> revamped.in is an independent utility. For official information about examinations, applications, results, or admit cards, always refer to the examination authority's official website.
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