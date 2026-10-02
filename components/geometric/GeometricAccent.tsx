'use client';

import { clsx } from 'clsx';

interface GeometricAccentProps {
  variant?: 'hero' | 'divider' | 'corner' | 'empty' | 'success' | 'ad';
  className?: string;
}

export function GeometricAccent({ variant = 'hero', className }: GeometricAccentProps) {
  const variants = {
    hero: (
      <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d1b2a" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#1b998b" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#2ec4b6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#heroGradient)" />
        <g opacity="0.15" transform="translate(200, 100)">
          <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" fill="none" stroke="#0d1b2a" strokeWidth="1.5" />
          <polygon points="0,-45 39,-22.5 39,22.5 0,45 -39,22.5 -39,-22.5" fill="none" stroke="#1b998b" strokeWidth="1" />
          <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="#2ec4b6" fillOpacity="0.2" />
        </g>
        <g opacity="0.08">
          <polygon points="0,0 80,0 0,80" fill="#1b998b" />
          <polygon points="400,0 320,0 400,80" fill="#2ec4b6" />
          <polygon points="0,200 80,200 0,120" fill="#e87d0e" />
          <polygon points="400,200 320,200 400,120" fill="#ff6b6b" />
        </g>
      </svg>
    ),
    divider: (
      <svg viewBox="0 0 400 40" className="w-full h-full" preserveAspectRatio="none">
        <g transform="translate(200, 20)" opacity="0.2">
          <polygon points="0,-15 13,-7.5 13,7.5 0,15 -13,7.5 -13,-7.5" fill="#1b998b" />
          <polygon points="0,-10 8.7,-5 8.7,5 0,10 -8.7,5 -8.7,-5" fill="#2ec4b6" />
        </g>
      </svg>
    ),
    corner: (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <polygon points="0,0 60,0 0,60" fill="#1b998b" fillOpacity="0.1" />
        <polygon points="0,0 40,0 0,40" fill="#2ec4b6" fillOpacity="0.15" />
      </svg>
    ),
    empty: (
      <svg viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="none">
        <g transform="translate(100, 100)" opacity="0.15">
          <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" fill="none" stroke="#0d1b2a" strokeWidth="1.5" />
          <polygon points="0,-35 30,-17.5 30,17.5 0,35 -30,17.5 -30,-17.5" fill="none" stroke="#1b998b" strokeWidth="1" />
          <polygon points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10" fill="#2ec4b6" fillOpacity="0.2" />
        </g>
      </svg>
    ),
    success: (
      <svg viewBox="0 0 120 120" className="w-full h-full" preserveAspectRatio="none">
        <g transform="translate(60, 60)">
          <polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" fill="#1b998b" fillOpacity="0.2" />
          <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="#1b998b" fillOpacity="0.3" />
          <path d="M-8 0 L0 8 L12 -12" stroke="#1b998b" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    ),
    ad: (
      <svg viewBox="0 0 728 90" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="adGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1b998b" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#2ec4b6" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#e87d0e" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <rect width="728" height="90" fill="url(#adGradient)" />
        <rect x="2" y="2" width="724" height="86" fill="none" stroke="#1b998b" strokeWidth="0.5" strokeOpacity="0.1" rx="4" />
      </svg>
    ),
  };

  const sizeClasses = {
    hero: 'w-full h-64 md:h-96',
    divider: 'w-full h-8',
    corner: 'absolute w-24 h-24',
    empty: 'w-48 h-48 mx-auto',
    success: 'w-24 h-24 mx-auto',
    ad: 'w-full h-full',
  };

  return (
    <div className={clsx('overflow-hidden', sizeClasses[variant], className)} aria-hidden="true">
      {variants[variant]}
    </div>
  );
}

export function GeometricPattern({ className, opacity = 0.04 }: { className?: string; opacity?: number }) {
  return (
    <div
      className={clsx('absolute inset-0 pointer-events-none', className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern id="hexPattern" patternUnits="userSpaceOnUse" width="80" height="69.28">
            <polygon points="40,0 80,34.64 80,103.92 40,138.56 0,103.92 0,34.64" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#hexPattern)" stroke="currentColor" />
      </svg>
    </div>
  );
}