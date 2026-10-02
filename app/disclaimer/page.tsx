import { Metadata } from 'next';
import { LogoWithText } from '@/components/branding/Logo';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'revamped.in disclaimer - Important information about the accuracy and use of exam requirements.',
  robots: 'index, follow',
};

export default function DisclaimerPage() {
  const lastUpdated = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="relative min-h-screen py-16 md:py-24">
      <GeometricAccent variant="hero" className="absolute top-0 left-0 right-0 h-48 -z-10" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <LogoWithText size="xl" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">Disclaimer</h1>
          <p className="text-charcoal-600">Last updated: {lastUpdated}</p>
        </header>

        <article className="card p-8 md:p-12 space-y-8 prose prose-charcoal max-w-none">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-amber-900 mb-3">⚠ Important Notice</h2>
            <p className="text-amber-800">
              <strong>revamped.in is an independent utility website.</strong> We are not affiliated with, endorsed by, authorized by, or connected to any government examination body, commission, board, agency, or department of the Government of India or any State Government.
            </p>
          </div>

          <section>
            <h2>No Government Affiliation</h2>
            <p>
              revamped.in has no official connection to any of the following (non-exhaustive list):
            </p>
            <ul>
              <li>Union Public Service Commission (UPSC)</li>
              <li>Staff Selection Commission (SSC)</li>
              <li>Tamil Nadu Public Service Commission (TNPSC)</li>
              <li>Institute of Banking Personnel Selection (IBPS)</li>
              <li>Railway Recruitment Board (RRB)</li>
              <li>National Testing Agency (NTA)</li>
              <li>State Bank of India (SBI)</li>
              <li>Air Force Common Admission Test (AFCAT)</li>
              <li>Any State Public Service Commission (State PSC)</li>
              <li>Any other government recruitment body</li>
            </ul>
            <p>
              Any reference to examination names, organizations, or requirements is for descriptive purposes only to help users identify the relevant tool.
            </p>
          </section>

          <section>
            <h2>Accuracy of Requirements</h2>
            <p>
              The photograph and signature requirements (dimensions, file sizes, formats, name/date overlays, background instructions) displayed on this Site are compiled from publicly available official notifications, advertisements, and websites.
            </p>
            <p>
              <strong>We do not guarantee the accuracy, completeness, or timeliness of any requirement data.</strong>
            </p>
            <p>
              Reasons why requirements may be inaccurate:
            </p>
            <ul>
              <li>Examination authorities may change requirements between notification cycles</li>
              <li>Official notifications may contain errors, ambiguities, or contradictory information</li>
              <li>Requirements may vary by category, region, or application mode</li>
              <li>We may have misinterpreted or incorrectly transcribed the official source</li>
              <li>Official sources may not be accessible or verifiable at the time of publication</li>
            </ul>
          </section>

          <section>
            <h2>Verification Is Your Responsibility</h2>
            <p>
              <strong>You are solely responsible for verifying all requirements against the current official notification before submitting your application.</strong>
            </p>
            <p>
              We strongly recommend that you:
            </p>
            <ol>
              <li>Download and read the official notification PDF from the examination authority's website</li>
              <li>Check the official website for any corrigenda, addenda, or updates</li>
              <li>Confirm the exact specifications (dimensions, file size, format, overlays) for your specific application cycle</li>
              <li>Contact the examination authority's helpdesk if requirements are unclear</li>
            </ol>
          </section>

          <section>
            <h2>Tool Output Not Guaranteed</h2>
            <p>
              The files produced by our tools are generated based on the configured requirements in our database. Even if a file passes our validation checks:
            </p>
            <ul>
              <li>It may not meet the actual requirements if our data is incorrect</li>
              <li>It may be rejected due to quality issues (lighting, background, clarity) not captured by technical specifications</li>
              <li>Examination authorities may apply additional subjective criteria</li>
              <li>File format nuances (color space, compression artifacts) may cause rejection</li>
            </ul>
            <p>
              <strong>We do not guarantee that any file prepared using our tools will be accepted by any examination authority.</strong>
            </p>
          </section>

          <section>
            <h2>No Liability for Rejected Applications</h2>
            <p>
              revamped.in shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from:
            </p>
            <ul>
              <li>Rejection of your application due to photograph or signature issues</li>
              <li>Inaccurate requirement data on this Site</li>
              <li>Technical issues with the tools</li>
              <li>Missed deadlines due to tool usage</li>
              <li>Any other consequence of using this Site</li>
            </ul>
          </section>

          <section>
            <h2>Third-Party Links</h2>
            <p>
              The Site contains links to official examination authority websites. We are not responsible for the content, accuracy, availability, or privacy practices of these external sites.
            </p>
          </section>

          <section>
            <h2>Source Attribution</h2>
            <p>
              Where possible, we provide the official source URL and the date we last verified the requirements. This information is provided for your reference and verification, not as a guarantee.
            </p>
          </section>

          <section>
            <h2>Updates and Corrections</h2>
            <p>
              We welcome corrections from users. If you find inaccurate requirements, please <a href="/contact" className="underline">contact us</a> with the official source. We will investigate and update if verified.
            </p>
          </section>

          <hr className="border-charcoal-200" />

          <p className="text-sm text-charcoal-500">
            <strong>Bottom line:</strong> revamped.in is a free helper tool. We try to be accurate, but we can make mistakes. Official requirements can change. <strong>Always verify with the official notification before submitting.</strong> Your application, your responsibility.
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