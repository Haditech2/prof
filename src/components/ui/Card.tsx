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
    white: 'bg-white border border-[#E3ECE6] shadow-[0_1px_3px_rgba(6,78,43,0.04),0_12px_32px_-12px_rgba(6,78,43,0.1)] text-[#0F1F17]',
    sunken: 'bg-[#F6FAF7] border border-[#E3ECE6] text-[#0F1F17]',
    forest: 'bg-gradient-to-br from-[#0B6B3A] to-[#043A20] border border-[#0B6B3A] text-white shadow-2xl',
    outlined: 'bg-transparent border-2 border-[#E3ECE6] hover:border-[#0B6B3A]/30 text-[#0F1F17]'
  };

  const hoverClass = hoverable
    ? 'transition-all duration-300 hover:-translate-y-1 hover:border-[#0B6B3A]/35 hover:shadow-[0_4px_6px_rgba(6,78,43,0.06),0_24px_48px_-16px_rgba(6,78,43,0.2)]'
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
