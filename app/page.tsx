import { Metadata } from 'next';
import Link from 'next/link';
import { getActiveExams } from '@/lib/supabase/queries';
import { Logo } from '@/components/branding/Logo';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';
import { AdSlotHomepage } from '@/components/ads/AdSlot';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Exam photos. Signatures. Ready to submit.',
  description: 'Resize photographs and signatures to the exact dimensions, format, and file-size requirements specified for your exam application. Free, private, browser-based.',
};

const popularExams = [
  { slug: 'tnpsc-group-ii', name: 'TNPSC Group II', org: 'TNPSC', tools: ['Photo', 'Signature'] },
  { slug: 'upsc-civil-services', name: 'UPSC Civil Services', org: 'UPSC', tools: ['Photo', 'Signature'] },
  { slug: 'ssc-cgl', name: 'SSC CGL', org: 'SSC', tools: ['Photo', 'Signature'] },
  { slug: 'ibps-po', name: 'IBPS PO', org: 'IBPS', tools: ['Photo', 'Signature'] },
  { slug: 'rrb-ntpc', name: 'RRB NTPC', org: 'RRB', tools: ['Photo', 'Signature'] },
  { slug: 'afcat', name: 'AFCAT', org: 'IAF', tools: ['Photo', 'Signature'] },
];

export default async function HomePage() {
  const exams = await getActiveExams();
  
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden" aria-labelledby="hero-heading">
        <GeometricAccent variant="hero" className="absolute inset-0 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-charcoal-200 text-sm font-medium text-charcoal-600 mb-8 backdrop-blur-sm">
            <Logo size="sm" />
            <span>revamped.in</span>
          </div>
          <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-charcoal-900 mb-6 text-balance">
            Prepare your exam files.
          </h1>
          <p className="text-lg md:text-xl text-charcoal-600 max-w-2xl mx-auto mb-10 text-balance">
            Resize photographs and signatures to the dimensions, format and file-size requirements specified for your application.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#exams">
              <Button size="lg" className="w-full sm:w-auto">
                Choose an Exam
              </Button>
            </Link>
            <Link href="#exams" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg">
                Browse Requirements
              </Button>
            </Link>
          </div>
          
          {/* Privacy badge */}
          <div className="mt-10 flex items-center justify-center gap-3 text-sm text-charcoal-500">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Your image is processed in your browser and is not uploaded to our servers.</span>
          </div>
        </div>
      </section>

      {/* Ad Slot */}
      <section className="py-8 border-y border-charcoal-200" aria-label="Advertisement">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlotHomepage />
        </div>
      </section>

      {/* Exam Search */}
      <section id="exams" className="py-20 md:py-28" aria-labelledby="exams-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="exams-heading" className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
              Find your exam
            </h2>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              Search for your examination or browse popular options below. Each exam page shows exact requirements and provides the preparation tool.
            </p>
          </div>
          
          {/* Search Input */}
          <div className="max-w-xl mx-auto mb-16">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                id="exam-search"
                placeholder="Search exams: TNPSC, UPSC, SSC, IBPS, RRB, AFCAT..."
                className="input-field pl-12 pr-4"
                aria-label="Search exams"
              />
            </div>
            <p className="mt-2 text-xs text-charcoal-500 text-center">
              Search by exam name, organization, or keyword
            </p>
          </div>

          {/* Popular Exams Grid */}
          <div>
            <h3 className="text-lg font-semibold text-charcoal-900 mb-6">Popular Exams</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
              {popularExams.map((exam) => (
                <Link
                  key={exam.slug}
                  href={`/${exam.slug}`}
                  className="card-hover p-6 flex items-center gap-4 group"
                  role="listitem"
                >
                  <div className="w-14 h-14 rounded-xl bg-charcoal-100 flex items-center justify-center group-hover:bg-charcoal-200 transition-colors">
                    <Logo size="lg" className="text-charcoal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-charcoal-900 group-hover:text-charcoal-700 transition-colors truncate">
                      {exam.name}
                    </h4>
                    <p className="text-sm text-charcoal-500">{exam.org}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {exam.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 text-xs font-medium text-charcoal-700 bg-charcoal-100 rounded-full"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* All Exams Link */}
          <div className="mt-12 text-center">
            <Link href="#all-exams" className="btn-ghost">
              View all exams ({exams.length})
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 md:py-28 bg-charcoal-50" aria-labelledby="how-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="how-heading" className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
              How it works
            </h2>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              Three simple steps to prepare your exam application files.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Select your exam',
                description: 'Find your examination and view the exact photo and signature requirements including dimensions, file size, and format.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 12a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Upload & prepare',
                description: 'Upload your photo or signature. Crop, resize, compress, and add name/date overlays as required — all in your browser.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Validate & download',
                description: 'Review the validation checklist confirming dimensions, file size, format, and overlays. Download the ready-to-submit file.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="text-2xl font-bold text-charcoal-300 mb-2">{item.step}</div>
                <div className="w-16 h-16 mx-auto mb-4 text-charcoal-600">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-charcoal-900 mb-2">{item.title}</h3>
                <p className="text-charcoal-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 md:py-28" aria-labelledby="privacy-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 md:p-12 max-w-3xl mx-auto text-center">
            <GeometricAccent variant="success" className="mb-6" />
            <h2 id="privacy-heading" className="text-2xl md:text-3xl font-bold text-charcoal-900 mb-4">
              Privacy by design
            </h2>
            <p className="text-charcoal-600 mb-6">
              Your photographs and signatures are processed entirely in your browser. They are never uploaded to our servers, stored in databases, or shared with third parties.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                { title: 'No uploads', desc: 'Files never leave your device' },
                { title: 'No accounts', desc: 'No registration required' },
                { title: 'No tracking', desc: 'Minimal analytics, no cookies' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-charcoal-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-charcoal-900">{item.title}</h4>
                    <p className="text-sm text-charcoal-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-charcoal-50" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-charcoal-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <dl className="space-y-6">
            {[
              {
                q: 'Is this tool free?',
                a: 'Yes, revamped.in is completely free to use. We monetize through non-intrusive advertisements displayed on the site.'
              },
              {
                q: 'Do I need to create an account?',
                a: 'No. You can use all tools without registration, login, or providing any personal information.'
              },
              {
                q: 'Are my images uploaded to your servers?',
                a: 'No. All image processing happens locally in your browser using JavaScript. Your photos and signatures never leave your device.'
              },
              {
                q: 'Are the requirements official?',
                a: 'We source requirements from official examination notifications and websites. Each page shows the official source URL and last verification date. Always verify with the official notification before submitting.'
              },
              {
                q: 'What if my compressed file doesn\'t meet the size requirement?',
                a: 'The tool shows real-time file size. If the target cannot be achieved without severe quality loss, it will warn you. You may need to retake the photo with better lighting/background.'
              },
              {
                q: 'Which browsers are supported?',
                a: 'All modern browsers: Chrome, Firefox, Safari, Edge (latest versions). The tool uses standard Web APIs (Canvas, FileReader) available in all current browsers.'
              },
            ].map((item, index) => (
              <div key={index} className="card p-6">
                <dt className="font-semibold text-charcoal-900 mb-2">{item.q}</dt>
                <dd className="text-charcoal-600 text-sm">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Ad Slot */}
      <section className="py-8 border-y border-charcoal-200" aria-label="Advertisement">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlotHomepage />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 text-center" aria-labelledby="cta-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GeometricAccent variant="divider" className="mx-auto mb-8 max-w-xs" />
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            Ready to prepare your files?
          </h2>
          <p className="text-charcoal-600 mb-8 max-w-2xl mx-auto">
            Select your examination and get started. No registration, no uploads, no hassle.
          </p>
          <Link href="#exams">
            <Button size="lg">
              Choose an Exam
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}