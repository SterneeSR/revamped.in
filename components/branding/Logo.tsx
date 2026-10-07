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
      <g transform="translate(60, 60)">
        {/* Top Cap Facets */}
        <polygon points="0,-52 23,-46 0,-33" fill="#2d2d2d" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="0,-52 -23,-46 0,-33" fill="#383838" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="23,-46 42,-31 26,-20" fill="#1c1c1c" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="-23,-46 -42,-31 -26,-20" fill="#444444" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />

        {/* Upper Middle Facets */}
        <polygon points="0,-33 26,-20 0,0" fill="#202020" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="0,-33 -26,-20 0,0" fill="#303030" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="26,-20 42,-31 51,-12 36,0" fill="#181818" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="-26,-20 -42,-31 -51,-12 -36,0" fill="#3a3a3a" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="26,-20 36,0 0,0" fill="#151515" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="-26,-20 -36,0 0,0" fill="#282828" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />

        {/* Outer Equator Rim Facets */}
        <polygon points="42,-31 51,-12 52,12 38,18" fill="#111111" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="-42,-31 -51,-12 -52,12 -38,18" fill="#4a4a4a" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />

        {/* Lower Middle Facets */}
        <polygon points="0,0 36,0 26,20" fill="#121212" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="0,0 -36,0 -26,20" fill="#222222" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="0,0 26,20 0,33" fill="#181818" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="0,0 -26,20 0,33" fill="#2b2b2b" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="36,0 51,12 38,28 26,20" fill="#0f0f0f" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="-36,0 -51,12 -38,28 -26,20" fill="#323232" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />

        {/* Bottom Cap Facets */}
        <polygon points="0,33 26,20 42,31 23,46" fill="#141414" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="0,33 -26,20 -42,31 -23,46" fill="#262626" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="0,33 23,46 0,52" fill="#191919" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="0,33 -23,46 0,52" fill="#242424" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="26,20 38,28 42,31" fill="#0d0d0d" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
        <polygon points="-26,20 -38,28 -42,31" fill="#2e2e2e" stroke="#141414" strokeWidth="0.75" strokeLinejoin="round" />
      </g>
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
    <div className={clsx('flex items-center gap-2.5', className)}>
      <Logo size={size} />
      <span className={clsx('font-bold tracking-tight text-charcoal-900', textSizes[size])}>
        revamped.in
      </span>
    </div>
  );
}