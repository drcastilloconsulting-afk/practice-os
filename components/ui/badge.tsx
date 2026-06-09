import { type ReactNode } from 'react';

type BadgeVariant = 'os' | 'violet' | 'green' | 'amber' | 'rose' | 'gray';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

const badgeClassMap: Record<BadgeVariant, string> = {
  os: 'badge-os',
  violet: 'badge-violet',
  green: 'badge-green',
  amber: 'badge-amber',
  rose: 'badge-rose',
  gray: 'badge-gray',
};

const dotColorMap: Record<BadgeVariant, string> = {
  os: '#818CF8',
  violet: '#A78BFA',
  green: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
  gray: '#94A3B8',
};

export function Badge({ variant, children, dot = false, className = '' }: BadgeProps) {
  return (
    <span className={`badge ${badgeClassMap[variant]} ${className}`.trim()}>
      {dot && (
        <span
          className="inline-block w-[7px] h-[7px] rounded-full flex-shrink-0 mr-1.5"
          style={{
            background: dotColorMap[variant],
            boxShadow: `0 0 6px ${dotColorMap[variant]}99`,
          }}
        />
      )}
      {children}
    </span>
  );
}
