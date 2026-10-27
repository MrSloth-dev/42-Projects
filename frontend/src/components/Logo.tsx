import React from 'react';
import { cn } from '@/lib/utils';

export const NavigatorMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    className={cn('h-8 w-8', className)}
  >
    <circle cx="16" cy="16" r="14" stroke="var(--brand-magenta)" strokeWidth="2" />
    <path
      d="M21.5 10.5L18 18L10.5 21.5L14 14L21.5 10.5Z"
      fill="var(--brand-magenta)"
    />
    <circle cx="23" cy="7" r="2" fill="var(--brand-cyan)" />
  </svg>
);

export const Logo: React.FC<{
  className?: string;
  wordmarkClassName?: string;
}> = ({ className, wordmarkClassName }) => (
  <span className={cn('inline-flex items-center gap-2.5', className)}>
    <NavigatorMark />
    <span
      className={cn(
        'text-[17px] font-bold tracking-[-0.02em] text-foreground',
        wordmarkClassName
      )}
    >
      Project Navigator
    </span>
  </span>
);

export default Logo;
