'use client';

import { clsx } from 'clsx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
};

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <svg
      className={clsx(sizeClasses[size], className)}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer hexagon */}
      <polygon
        points="60,10 110,35 110,85 60,110 10,85 10,35"
        stroke="#0d0d0d"
        strokeWidth="3"
      />
      {/* Middle hexagon */}
      <polygon
        points="60,25 95,47.5 95,72.5 60,95 25,72.5 25,47.5"
        stroke="#1a1a1a"
        strokeWidth="2"
      />
      {/* Inner hexagon */}
      <polygon
        points="60,40 80,55 80,70 60,85 40,70 40,55"
        fill="#0d0d0d"
      />
      {/* Central diamond/facet */}
      <polygon
        points="60,50 70,60 60,70 50,60"
        fill="#1a1a1a"
      />
      {/* Faceted accents */}
      <polygon
        points="60,25 72.5,42.5 60,60 47.5,42.5"
        stroke="#3d3d3d"
        strokeWidth="1"
        fill="none"
      />
      <polygon
        points="60,40 70,55 60,70 50,55"
        stroke="#525252"
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  );
}

export function LogoWithText({ size = 'md', className }: LogoProps) {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <Logo size={size} />
      <span className={clsx('font-semibold tracking-tight text-charcoal-900', textSizes[size])}>
        revamped.in
      </span>
    </div>
  );
}