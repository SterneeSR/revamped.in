'use client';

import { clsx } from 'clsx';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';

interface AdSlotProps {
  slotId: string;
  className?: string;
  label?: string;
  fallback?: React.ReactNode;
}

export function AdSlot({ slotId, className, label = 'ADVERTISEMENT', fallback }: AdSlotProps) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  
  if (!adClient) {
    return (
      <div className={clsx('ad-slot', className)} data-ad-slot={slotId}>
        <span className="ad-label">{label}</span>
        {fallback || (
          <GeometricAccent variant="ad" className="w-full h-full" />
        )}
      </div>
    );
  }

  return (
    <div className={clsx('ad-slot relative', className)} data-ad-slot={slotId}>
      <span className="ad-label">{label}</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client={adClient}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
}

export function AdSlotHomepage({ className }: { className?: string }) {
  return (
    <AdSlot
      slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE || 'homepage'}
      className={className}
    />
  );
}

export function AdSlotExamPage({ className }: { className?: string }) {
  return (
    <AdSlot
      slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_EXAM_PAGE || 'exam-page'}
      className={className}
    />
  );
}

export function AdSlotToolPage({ className }: { className?: string }) {
  return (
    <AdSlot
      slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_PAGE || 'tool-page'}
      className={className}
    />
  );
}