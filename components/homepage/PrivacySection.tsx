import { AdSlot } from '@/components/ads/AdSlot';

export function PrivacySection() {
  return (
    <section className="py-12 md:py-14 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Privacy Box */}
          <div className="lg:col-span-6 flex items-start gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-950">Your Privacy Matters</h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Your image is processed in your browser and is not uploaded to our servers. We do not store your photographs or signatures.
              </p>
            </div>
          </div>

          {/* Ad Slot #2 on the Right side */}
          <div className="lg:col-span-6">
            <AdSlot
              slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE || 'homepage-privacy-banner'}
              className="h-[80px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
