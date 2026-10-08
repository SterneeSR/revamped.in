'use client';

import Image from 'next/image';
import { clsx } from 'clsx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  inverted?: boolean;
}

const sizeConfig = {
  sm: { px: 24, className: 'w-6 h-6' },
  md: { px: 32, className: 'w-8 h-8' },
  lg: { px: 40, className: 'w-10 h-10' },
  xl: { px: 48, className: 'w-12 h-12' },
};

export function Logo({ size = 'md', className, inverted = false }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={clsx(
        'relative inline-flex items-center justify-center shrink-0 rounded-full select-none overflow-hidden',
        config.className,
        className
      )}
    >
      <Image
        src="/branding/logo.png"
        alt="revamped.in"
        width={config.px}
        height={config.px}
        className={clsx('object-contain', inverted && 'brightness-200')}
        priority
      />
    </div>
  );
}

export function LogoWithText({
  size = 'md',
  className,
  inverted = false,
}: LogoProps) {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <Logo size={size} inverted={inverted} />
      <span
        className={clsx(
          'font-bold tracking-tight',
          textSizes[size],
          inverted ? 'text-white' : 'text-neutral-900'
        )}
      >
        revamped.in
      </span>
    </div>
  );
}