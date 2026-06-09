'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  variant?: 'default' | 'green' | 'amber' | 'rose';
  showLabel?: boolean;
  animate?: boolean;
  className?: string;
}

const fillClassMap: Record<NonNullable<ProgressBarProps['variant']>, string> = {
  default: 'progress-fill',
  green: 'progress-fill progress-fill-green',
  amber: 'progress-fill progress-fill-amber',
  rose: 'progress-fill progress-fill-rose',
};

export function ProgressBar({
  value,
  variant = 'default',
  showLabel = false,
  animate = true,
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const fillClass = fillClassMap[variant];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="progress-bar flex-1">
        {animate ? (
          <motion.div
            className={fillClass}
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={fillClass}
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-[#94A3B8] tabular-nums whitespace-nowrap">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
