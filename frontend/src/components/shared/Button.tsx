import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 border-transparent',
    secondary: 'bg-[#141926] hover:bg-[#1c2336] text-slate-200 border-[#222a3d]',
    danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border-red-500/40',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 border-transparent',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border-transparent'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-xs px-3.5 py-1.5',
    lg: 'text-sm px-4 py-2'
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};