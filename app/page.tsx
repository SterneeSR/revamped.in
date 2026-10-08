import { getActiveExams } from '@/lib/supabase/queries';
import { Hero } from '@/components/homepage/Hero';
import { PopularExams } from '@/components/homepage/PopularExams';
import { QuickTools } from '@/components/homepage/QuickTools';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { PrivacySection } from '@/components/homepage/PrivacySection';
import { FAQSection } from '@/components/homepage/FAQSection';
import { AdSlotHomepage } from '@/components/ads/AdSlot';

export const metadata = {
  title: 'Prepare your exam files | revamped.in',
  description:
    'Resize, crop and prepare photographs and signatures to match the exact requirements of your exam application. Fast, free, browser-based.',
};

export default async function HomePage() {
  const exams = await getActiveExams();

  return (
    <div className="relative overflow-hidden bg-white">
      {/* 1. Hero with visual mockup demonstration */}
      <Hero exams={exams} />

      {/* 2. Popular Exams Grid */}
      <PopularExams exams={exams} />

      {/* Advertisement Banner #1 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdSlotHomepage />
      </div>

      {/* 3. Quick Tools Section */}
      <QuickTools />

      {/* 4. Compact Horizontal Process Flow */}
      <HowItWorks />

      {/* 5. Privacy Assurance & Advertisement #2 */}
      <PrivacySection />

      {/* 6. FAQ Accordion */}
      <FAQSection />
    </div>
  );
}