'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'glass' | 'surface' | 'kpi';
  hover?: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
}

const variantClassMap: Record<NonNullable<GlassCardProps['variant']>, string> = {
  glass: 'glass-card',
  surface: 'surface-card',
  kpi: 'kpi-card',
};

export function GlassCard({
  variant = 'glass',
  hover = false,
  delay = 0,
  className = '',
  children,
  ...motionProps
}: GlassCardProps) {
  const base = variantClassMap[variant];
  const hoverClass = hover && variant === 'glass' ? 'glass-card-hover' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      className={`${base} ${hoverClass} ${className}`.trim()}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
