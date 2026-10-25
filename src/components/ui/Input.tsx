import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  id,
  className = '',
  wrapperClassName = '',
  disabled,
  required,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className={`w-full space-y-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wider text-[#064E2B] select-none"
        >
          {label} {required && <span className="text-red-600 font-bold ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#6B7B73] pointer-events-none flex items-center justify-center shrink-0">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          required={required}
          className={`
            w-full min-h-[44px] rounded-xl text-sm transition-all duration-200
            bg-white text-[#0F1F17] placeholder:text-[#9AA8A0]
            border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-[#E3ECE6] hover:border-[#CAD7CE] focus:border-[#0B6B3A] focus:ring-[#0B6B3A]/20'}
            focus:outline-none focus:ring-2
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${rightIcon ? 'pr-10' : 'pr-3.5'}
            py-2.5
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 text-[#6B7B73] flex items-center justify-center shrink-0">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1 animate-fade-in" role="alert">
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-[11px] text-[#6B7B73] mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
