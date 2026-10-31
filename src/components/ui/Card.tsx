import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'white' | 'sunken' | 'forest' | 'outlined';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  hoverable = false,
  padding = 'md',
  variant = 'white',
  className = '',
  ...props
}, ref) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-12'
  };

  const variantClasses = {
    white: 'bg-[#FFFBF2] border border-[#D6A323]/25 shadow-[0_1px_3px_rgba(0,143,135,0.04),0_12px_32px_-12px_rgba(0,107,102,0.1)] text-[#252A2A]',
    sunken: 'bg-[#FFF4DC] border border-[#D6A323]/20 text-[#252A2A]',
    forest: 'bg-gradient-to-br from-[#006B66] to-[#003330] border border-[#D6A323]/40 text-white shadow-2xl',
    outlined: 'bg-transparent border-2 border-[#D6A323]/30 hover:border-[#008F87]/50 text-[#252A2A]'
  };

  const hoverClass = hoverable
    ? 'transition-all duration-300 hover:-translate-y-1 hover:border-[#008F87]/40 hover:shadow-[0_4px_6px_rgba(0,143,135,0.06),0_24px_48px_-16px_rgba(0,107,102,0.2)]'
    : '';

  return (
    <div
      ref={ref}
      className={`rounded-3xl ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
