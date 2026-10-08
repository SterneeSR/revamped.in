import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getApplicationBySlugs } from '@/lib/supabase/queries';
import { AdSlotExamPage } from '@/components/ads/AdSlot';
import { PhotoTool } from '@/components/photo-tool/PhotoTool';
import { SignatureTool } from '@/components/signature-tool/SignatureTool';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';

interface AppPageProps {
  params: Promise<{ exam: string; application: string }>;
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const { exam, application } = await params;
  const appData = await getApplicationBySlugs(exam, application);

  if (!appData) {
    return { title: 'Requirements Not Found | revamped.in' };
  }

  const examName = appData.exam.name;
  const appName = appData.name;

  return {
    title: `${examName} ${appName} Photo & Signature Tool`,
    description: `Resize, crop, and compress photographs and signatures to meet official ${examName} ${appName} specifications. Free, private, client-side browser utility.`,
  };
}

export default async function ApplicationPage({ params }: AppPageProps) {
  const { exam, application } = await params;
  const appData = await getApplicationBySlugs(exam, application);

  if (!appData) {
    notFound();
  }

  const { exam: examData, photo_requirement, signature_requirement, ...applicationData } = appData;

  const photoReqObj = photo_requirement
    ? {
        width: photo_requirement.width,
        height: photo_requirement.height,
        minKB: photo_requirement.min_kb,
        maxKB: photo_requirement.max_kb,
        format: (photo_requirement.allowed_formats[0] || 'jpeg') as 'jpeg' | 'png',
        nameRequired: photo_requirement.name_required,
        dateRequired: photo_requirement.date_required,
        namePosition: photo_requirement.name_position as any,
        datePosition: photo_requirement.date_position as any,
      }
    : null;

  const sigReqObj = signature_requirement
    ? {
        width: signature_requirement.width,
        height: signature_requirement.height,
        minKB: signature_requirement.min_kb,
        maxKB: signature_requirement.max_kb,
        format: (signature_requirement.allowed_formats[0] || 'jpeg') as 'jpeg' | 'png',
        nameRequired: false,
        dateRequired: false,
      }
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header & Breadcrumb with subtle Geometric Accent */}
      <section className="relative border-b border-neutral-200 bg-white pt-8 pb-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-40 z-0">
          <GeometricAccent variant="hero" className="w-full h-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb matching Reference Image_1 */}
          <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-3" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>›</span>
            <Link href={`/${exam}`} className="hover:text-neutral-900 transition-colors">{examData.name}</Link>
            <span>›</span>
            <span className="text-neutral-600">{applicationData.name}</span>
            <span>›</span>
            <span className="text-neutral-950 font-semibold">Photo & Signature</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950">
                {examData.name} ({applicationData.name})
              </h1>
              <p className="text-sm md:text-base text-neutral-600 mt-1">
                Resize, crop and prepare your files to match the official {examData.organization} requirements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {applicationData.official_source_url && (
                <Link
                  href={applicationData.official_source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 transition-colors shadow-sm"
                >
                  <span>View Official Notification</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              )}
              {applicationData.verified_at && (
                <span className="text-xs text-neutral-400">
                  Last verified: {new Date(applicationData.verified_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* SECTION 1: PHOTOGRAPH TOOL WORKSPACE */}
        <section id="photo-tool">
          {photoReqObj ? (
            <PhotoTool
              requirement={photoReqObj}
              examName={examData.name}
              appName={applicationData.name}
              officialSourceUrl={applicationData.official_source_url}
              verifiedAt={applicationData.verified_at}
              backgroundInstructions={photo_requirement?.background_instructions}
              additionalInstructions={photo_requirement?.additional_instructions}
            />
          ) : (
            <div className="p-8 border border-dashed border-neutral-300 rounded-2xl text-center text-sm text-neutral-500">
              No photograph requirements configured for this cycle.
            </div>
          )}
        </section>

        {/* Ad Slot Divider */}
        <div className="py-2">
          <AdSlotExamPage />
        </div>

        {/* SECTION 2: SIGNATURE TOOL WORKSPACE */}
        <section id="signature-tool">
          {sigReqObj ? (
            <SignatureTool
              requirement={sigReqObj}
              examName={examData.name}
              appName={applicationData.name}
              officialSourceUrl={applicationData.official_source_url}
              verifiedAt={applicationData.verified_at}
              additionalInstructions={signature_requirement?.additional_instructions}
            />
          ) : (
            <div className="p-8 border border-dashed border-neutral-300 rounded-2xl text-center text-sm text-neutral-500">
              No signature requirements configured for this cycle.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}