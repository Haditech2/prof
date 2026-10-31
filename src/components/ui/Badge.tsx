import React from 'react';

export type BadgeVariant = 'green' | 'gold' | 'lilac' | 'gray' | 'red' | 'amber' | 'blue';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5'
  };

  const variantClasses = {
    green: 'bg-[#008F87]/15 text-[#006B66] border border-[#008F87]/30 font-bold',
    gold: 'bg-[#FFF4DC] text-[#A97912] border border-[#D6A323]/40 font-bold',
    lilac: 'bg-[#B9A1D0]/20 text-[#6B4B8A] border border-[#B9A1D0]/40 font-bold',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200 font-semibold',
    red: 'bg-red-50 text-red-700 border border-red-200 font-bold',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200 font-bold',
    blue: 'bg-blue-50 text-blue-800 border border-blue-200 font-bold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full uppercase tracking-wider ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
