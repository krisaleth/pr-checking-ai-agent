import React from 'react';

export type BadgeVariant = 'critical' | 'warning' | 'safe' | 'info' | 'neutral' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  pulse = false,
  className = ''
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    critical: 'bg-red-500/15 text-red-400 border-red-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    safe: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    neutral: 'bg-[#182030] text-slate-300 border-[#232f48]'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded font-mono font-medium border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {pulse && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          variant === 'critical' ? 'bg-red-400' :
          variant === 'safe' ? 'bg-emerald-400' :
          variant === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
        }`} />
      )}
      {children}
    </span>
  );
};