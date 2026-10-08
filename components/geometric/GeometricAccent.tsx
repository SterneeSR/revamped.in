'use client';

import { clsx } from 'clsx';

interface GeometricAccentProps {
  variant?: 'hero' | 'divider' | 'corner' | 'empty' | 'success' | 'ad';
  className?: string;
}

export function GeometricAccent({ variant = 'hero', className }: GeometricAccentProps) {
  if (variant === 'hero') {
    return (
      <div className={clsx('overflow-hidden pointer-events-none select-none', className)} aria-hidden="true">
        <svg
          viewBox="0 0 540 500"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background glow */}
          <defs>
            <radialGradient id="hexGlow" cx="80%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#1b998b" stopOpacity="0.08" />
              <stop offset="60%" stopColor="#e87d0e" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexGlow)" />

          {/* Isometric Faceted Tessellation matching reference */}
          <g transform="translate(180, -20)">
            {/* Cluster 1 - Deep Navy & Teal Facets */}
            <polygon points="120,40 180,75 120,110 60,75" fill="#0d1b2a" opacity="0.95" />
            <polygon points="180,75 240,40 240,110 180,145" fill="#142d45" opacity="0.9" />
            <polygon points="120,110 180,145 180,215 120,180" fill="#1b998b" opacity="0.95" />
            <polygon points="60,75 120,110 120,180 60,145" fill="#136f65" opacity="0.9" />

            {/* Cluster 2 - Turquoise & Teal */}
            <polygon points="180,145 240,110 300,145 240,180" fill="#2ec4b6" opacity="0.9" />
            <polygon points="240,180 300,145 300,215 240,250" fill="#1b998b" opacity="0.85" />
            <polygon points="180,215 240,180 240,250 180,285" fill="#0f4c5c" opacity="0.95" />

            {/* Cluster 3 - Vibrant Coral & Orange Peak (Reference highlight) */}
            <polygon points="240,40 300,75 240,110 180,75" fill="#e87d0e" opacity="0.95" />
            <polygon points="300,75 360,40 360,110 300,145" fill="#ff6b6b" opacity="0.95" />
            <polygon points="300,145 360,110 360,180 300,215" fill="#f4845f" opacity="0.85" />
            <polygon points="240,40 300,5 360,40 300,75" fill="#f79d65" opacity="0.9" />

            {/* Accent Triangles / Small Facets */}
            <polygon points="360,110 420,145 360,180" fill="#e76f51" opacity="0.75" />
            <polygon points="120,180 180,215 120,250 60,215" fill="#1b998b" opacity="0.7" />
            <polygon points="180,285 240,250 240,320 180,355" fill="#0d1b2a" opacity="0.85" />
            <polygon points="240,250 300,215 300,285 240,320" fill="#2ec4b6" opacity="0.65" />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'ad') {
    return (
      <div className={clsx('overflow-hidden w-full h-full relative flex items-center justify-center', className)} aria-hidden="true">
        <svg viewBox="0 0 728 90" className="w-full h-full object-cover" preserveAspectRatio="none">
          <defs>
            <linearGradient id="adGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d1b2a" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#1b998b" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#2ec4b6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e87d0e" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#adGrad)" />
          {/* Faceted geometric lines overlay */}
          <g stroke="#ffffff" strokeWidth="0.75" strokeOpacity="0.25">
            <line x1="40" y1="0" x2="100" y2="90" />
            <line x1="100" y1="90" x2="160" y2="0" />
            <line x1="160" y1="0" x2="220" y2="90" />
            <line x1="220" y1="90" x2="280" y2="0" />
            <line x1="500" y1="0" x2="560" y2="90" />
            <line x1="560" y1="90" x2="620" y2="0" />
            <line x1="620" y1="0" x2="680" y2="90" />
          </g>
        </svg>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex flex-col items-center justify-center text-white/90">
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-75">ADVERTISEMENT</span>
          <span className="text-xs font-medium">AdSense banner slot reserved</span>
        </div>
      </div>
    );
  }

  if (variant === 'divider') {
    return (
      <div className={clsx('overflow-hidden w-full h-4', className)} aria-hidden="true">
        <svg viewBox="0 0 400 16" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,8 L180,8 L190,0 L200,16 L210,0 L220,8 L400,8" stroke="#E5E5E5" strokeWidth="1" fill="none" />
        </svg>
      </div>
    );
  }

  return null;
}