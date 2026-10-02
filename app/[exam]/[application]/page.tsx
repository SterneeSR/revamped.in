import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getApplicationBySlugs } from '@/lib/supabase/queries';
import { Logo } from '@/components/branding/Logo';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';
import { AdSlotExamPage } from '@/components/ads/AdSlot';
import { PhotoTool } from '@/components/photo-tool/PhotoTool';
import { SignatureTool } from '@/components/signature-tool/SignatureTool';

interface AppPageProps {
  params: Promise<{ exam: string; application: string }>;
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const { exam, application } = await params;
  const appData = await getApplicationBySlugs(exam, application);
  
  if (!appData) {
    return { title: 'Not Found' };
  }

  const examName = appData.exam.name;
  const appName = appData.name;
  
  return {
    title: `${examName} ${appName} Photo & Signature Requirements`,
    description: `Prepare your ${examName} ${appName} application photo and signature. Exact dimensions, file size, and format requirements with free browser-based tools.`,
    openGraph: {
      title: `${examName} ${appName} Photo & Signature Resize | revamped.in`,
      description: `Resize photographs and signatures to meet ${examName} ${appName} requirements. Free, private, browser-based.`,
    },
  };
}

export default async function ApplicationPage({ params }: AppPageProps) {
  const { exam, application } = await params;
  const appData = await getApplicationBySlugs(exam, application);
  
  if (!appData) {
    notFound();
  }

  const { exam: examData, photo_requirement, signature_requirement, ...applicationData } = appData;

  return (
    <div className="relative min-h-screen">
      <GeometricAccent variant="hero" className="absolute top-0 left-0 right-0 h-48 -z-10" />
      
      {/* Header */}
      <header className="relative py-12 md:py-16" aria-labelledby="app-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/${exam}`} className="hover:opacity-70 transition-opacity">
              <Logo size="md" />
            </Link>
            <span className="text-sm font-medium text-charcoal-500 uppercase tracking-wider">
              {examData.organization}
            </span>
            <span className="text-charcoal-300">/</span>
            <span className="text-sm font-medium text-charcoal-500">{examData.name}</span>
          </div>
          <h1 id="app-title" className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4 text-balance">
            {applicationData.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
              applicationData.status === 'active' ? 'bg-green-50 text-green-700' :
              applicationData.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
              applicationData.status === 'closed' ? 'bg-charcoal-100 text-charcoal-700' :
              'bg-amber-50 text-amber-700'
            }`}>
              {applicationData.status}
            </span>
            
            {applicationData.effective_date && (
              <time className="text-charcoal-500" dateTime={applicationData.effective_date}>
                Effective: {new Date(applicationData.effective_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            )}
            
            {applicationData.verified_at && (
              <span className="text-charcoal-400">
                Verified: {new Date(applicationData.verified_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            
            {applicationData.official_source_url && (
              <Link
                href={applicationData.official_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-charcoal-900 transition-colors underline underline-offset-2 text-charcoal-500"
              >
                Official source →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Ad Slot */}
      <section className="py-6 border-y border-charcoal-200" aria-label="Advertisement">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlotExamPage />
        </div>
      </section>

      {/* Requirements Overview */}
      <section className="py-12 md:py-16" aria-labelledby="requirements-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="requirements-heading" className="text-2xl md:text-3xl font-bold text-charcoal-900 mb-8">
            Requirements
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Photo Requirements */}
            {photo_requirement && (
              <article className="card p-6" aria-labelledby="photo-req-heading">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-charcoal-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 id="photo-req-heading" className="text-xl font-semibold text-charcoal-900">Photograph</h3>
                </div>
                
                <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <dt className="text-charcoal-500">Dimensions</dt>
                    <dd className="font-medium text-charcoal-900">{photo_requirement.width} × {photo_requirement.height} px</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal-500">File size</dt>
                    <dd className="font-medium text-charcoal-900">{photo_requirement.min_kb}–{photo_requirement.max_kb} KB</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal-500">Format</dt>
                    <dd className="font-medium text-charcoal-900">{photo_requirement.allowed_formats.map(f => f.toUpperCase()).join('/')}</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal-500">Name overlay</dt>
                    <dd className="font-medium text-charcoal-900">{photo_requirement.name_required ? 'Required' : 'Not required'}</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal-500">Date overlay</dt>
                    <dd className="font-medium text-charcoal-900">{photo_requirement.date_required ? 'Required' : 'Not required'}</dd>
                  </div>
                </dl>
                
                {photo_requirement.background_instructions && (
                  <div className="mb-4 p-4 bg-charcoal-50 rounded-lg">
                    <dt className="text-xs font-medium text-charcoal-500 uppercase tracking-wider mb-1">Background</dt>
                    <dd className="text-sm text-charcoal-700">{photo_requirement.background_instructions}</dd>
                  </div>
                )}
                
                {photo_requirement.additional_instructions && (
                  <div className="mb-4 p-4 bg-charcoal-50 rounded-lg">
                    <dt className="text-xs font-medium text-charcoal-500 uppercase tracking-wider mb-1">Instructions</dt>
                    <dd className="text-sm text-charcoal-700">{photo_requirement.additional_instructions}</dd>
                  </div>
                )}
                
                <PhotoTool 
                  requirement={{
                    width: photo_requirement.width,
                    height: photo_requirement.height,
                    minKB: photo_requirement.min_kb,
                    maxKB: photo_requirement.max_kb,
                    format: photo_requirement.allowed_formats[0] as 'jpeg' | 'png',
                    nameRequired: photo_requirement.name_required,
                    dateRequired: photo_requirement.date_required,
                    namePosition: photo_requirement.name_position as any,
                    datePosition: photo_requirement.date_position as any,
                  }}
                  examName={examData.name}
                  appName={applicationData.name}
                />
              </article>
            )}

            {/* Signature Requirements */}
            {signature_requirement && (
              <article className="card p-6" aria-labelledby="sig-req-heading">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-charcoal-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h3 id="sig-req-heading" className="text-xl font-semibold text-charcoal-900">Signature</h3>
                </div>
                
                <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <dt className="text-charcoal-500">Dimensions</dt>
                    <dd className="font-medium text-charcoal-900">{signature_requirement.width} × {signature_requirement.height} px</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal-500">File size</dt>
                    <dd className="font-medium text-charcoal-900">{signature_requirement.min_kb}–{signature_requirement.max_kb} KB</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal-500">Format</dt>
                    <dd className="font-medium text-charcoal-900">{signature_requirement.allowed_formats.map(f => f.toUpperCase()).join('/')}</dd>
                  </div>
                </dl>
                
                {signature_requirement.additional_instructions && (
                  <div className="mb-4 p-4 bg-charcoal-50 rounded-lg">
                    <dt className="text-xs font-medium text-charcoal-500 uppercase tracking-wider mb-1">Instructions</dt>
                    <dd className="text-sm text-charcoal-700">{signature_requirement.additional_instructions}</dd>
                  </div>
                )}
                
                <SignatureTool 
                  requirement={{
                    width: signature_requirement.width,
                    height: signature_requirement.height,
                    minKB: signature_requirement.min_kb,
                    maxKB: signature_requirement.max_kb,
                    format: signature_requirement.allowed_formats[0] as 'jpeg' | 'png',
                    nameRequired: false,
                    dateRequired: false,
                  }}
                  examName={examData.name}
                  appName={applicationData.name}
                />
              </article>
            )}

            {!photo_requirement && !signature_requirement && (
              <div className="col-span-2 text-center py-16">
                <GeometricAccent variant="empty" className="mb-6" />
                <h3 className="text-lg font-medium text-charcoal-900 mb-2">Requirements not configured</h3>
                <p className="text-charcoal-600">The administrator needs to configure photo and signature requirements for this application.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-12 md:py-16 bg-charcoal-50 border-t border-charcoal-200" aria-labelledby="mistakes-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="mistakes-heading" className="text-2xl md:text-3xl font-bold text-charcoal-900 mb-8 text-center">
            Common Mistakes to Avoid
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Wrong dimensions', desc: 'Always use the exact pixel dimensions specified. Even 1px off can cause rejection.' },
              { title: 'File size too large', desc: 'Compress to within the specified KB range. Use the tool\'s compression feature.' },
              { title: 'Incorrect format', desc: 'Convert to the required format (usually JPG/JPEG). PNG may be rejected.' },
              { title: 'Background issues', desc: 'Use a plain white/light background. No shadows, patterns, or objects.' },
              { title: 'Name/date missing', desc: 'If required, add name and date in the specified position and format.' },
              { title: 'Blurry or low quality', desc: 'Use a clear, well-lit photo. Avoid screenshots of photos.' },
              { title: 'Signature not clear', desc: 'Sign with black ink on white paper. Scan or photograph clearly.' },
              { title: 'Old photograph', desc: 'Most exams require a recent photo (typically within 3-6 months).' },
            ].map((item, index) => (
              <div key={index} className="card p-5">
                <h4 className="font-semibold text-charcoal-900 mb-2">{item.title}</h4>
                <p className="text-sm text-charcoal-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold text-charcoal-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {[
              {
                q: `What are the exact photo dimensions for ${examData.name} ${applicationData.name}?`,
                a: photo_requirement 
                  ? `The required photo dimensions are ${photo_requirement.width} × ${photo_requirement.height} pixels. The file size must be between ${photo_requirement.min_kb}–${photo_requirement.max_kb} KB in ${photo_requirement.allowed_formats.map(f => f.toUpperCase()).join('/')} format.`
                  : 'Photo requirements have not been configured for this application yet.'
              },
              {
                q: `What are the signature requirements for ${examData.name} ${applicationData.name}?`,
                a: signature_requirement
                  ? `The signature must be ${signature_requirement.width} × ${signature_requirement.height} pixels, ${signature_requirement.min_kb}–${signature_requirement.max_kb} KB in ${signature_requirement.allowed_formats.map(f => f.toUpperCase()).join('/')} format.`
                  : 'Signature requirements have not been configured for this application yet.'
              },
              {
                q: 'Is my photo uploaded to your servers?',
                a: 'No. All image processing happens entirely in your browser using JavaScript. Your photos and signatures never leave your device or get uploaded to our servers.'
              },
              {
                q: 'Can I use this tool on my phone?',
                a: 'Yes, the tool works on all modern mobile browsers (Chrome, Safari, Firefox, Edge). The interface adapts to your screen size.'
              },
              {
                q: 'What if I can\'t compress my photo enough?',
                a: 'If the tool cannot compress your photo to the required size without severe quality loss, it will warn you. Try retaking the photo with a plain background and good lighting, which compresses better.'
              },
            ].map((item, index) => (
              <div key={index} className="card p-5">
                <dt className="font-semibold text-charcoal-900 mb-2">{item.q}</dt>
                <dd className="text-sm text-charcoal-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-charcoal-50 border-t border-charcoal-200" aria-labelledby="disclaimer-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="disclaimer-heading" className="text-lg font-semibold text-charcoal-900 mb-2">Important</h2>
          <p className="text-charcoal-600 text-sm">
            revamped.in is an independent utility and is not affiliated with any government examination body.
            Requirements are sourced from official notifications but may change. Always verify with the
            official notification before submitting your application.
          </p>
          <Link href="/disclaimer" className="text-sm text-charcoal-500 hover:text-charcoal-900 underline underline-offset-1 mt-2 inline-block">
            Read full disclaimer →
          </Link>
        </div>
      </section>
    </div>
  );
}