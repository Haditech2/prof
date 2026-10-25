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
    primary: 'bg-gradient-to-r from-[#0B6B3A] to-[#064E2B] text-white shadow-md shadow-[#0B6B3A]/25 hover:brightness-110 active:brightness-95 focus-visible:ring-[#0B6B3A]',
    secondary: 'bg-[#E7F3EC] text-[#064E2B] border border-[#0B6B3A]/20 hover:bg-[#D5EADB] focus-visible:ring-[#0B6B3A]',
    gold: 'bg-gradient-to-r from-[#E2BE4A] to-[#C9A227] text-[#043A20] font-bold shadow-md shadow-[#C9A227]/30 hover:brightness-108 active:brightness-95 focus-visible:ring-[#C9A227]',
    outline: 'bg-white text-[#0B6B3A] border-2 border-[#0B6B3A]/30 hover:border-[#0B6B3A] hover:bg-[#F6FAF7] focus-visible:ring-[#0B6B3A]',
    ghost: 'bg-transparent text-[#47554F] hover:bg-[#F6FAF7] hover:text-[#0F1F17] focus-visible:ring-[#0B6B3A]',
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
