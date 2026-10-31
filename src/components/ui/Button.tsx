import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}, ref) => {
  // Base classes ensure touch target >= 44px, smooth micro-interactions, accessible focus rings
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full select-none cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 disabled:hover:brightness-100';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-xs px-4 py-2 min-h-[38px] sm:min-h-[40px] gap-1.5',
    md: 'text-sm px-6 py-2.5 min-h-[44px] gap-2',
    lg: 'text-base px-8 py-3.5 min-h-[50px] gap-2.5'
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-[#008F87] to-[#006B66] text-white shadow-md shadow-[#008F87]/25 hover:brightness-110 active:brightness-95 focus-visible:ring-[#008F87]',
    secondary: 'bg-[#FFF4DC] text-[#006B66] border border-[#008F87]/20 hover:bg-[#FFECC2] focus-visible:ring-[#008F87]',
    gold: 'bg-gradient-to-r from-[#D6A323] to-[#A97912] text-[#003330] font-bold shadow-md shadow-[#D6A323]/30 hover:brightness-108 active:brightness-95 focus-visible:ring-[#D6A323]',
    outline: 'bg-[#FFFBF2] text-[#008F87] border-2 border-[#008F87]/30 hover:border-[#008F87] hover:bg-[#FFF4DC] focus-visible:ring-[#008F87]',
    ghost: 'bg-transparent text-[#252A2A]/80 hover:bg-[#FFF4DC] hover:text-[#252A2A] focus-visible:ring-[#008F87]',
    danger: 'bg-red-600 text-white shadow-md shadow-red-600/25 hover:bg-red-700 focus-visible:ring-red-600'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" aria-hidden="true" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      
      <span>{children}</span>
      
      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
