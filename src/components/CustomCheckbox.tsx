import React from 'react';
import { Check } from 'lucide-react';

interface CustomCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
  label?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function CustomCheckbox({
  checked,
  indeterminate = false,
  onChange,
  id,
  disabled = false,
  className = '',
  label,
  size = 'md'
}: CustomCheckboxProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <label 
      className={`inline-flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
      htmlFor={id}
    >
      <div 
        className={`relative shrink-0 flex items-center justify-center border-2 rounded transition-colors duration-200 
          ${(checked || indeterminate) 
            ? 'bg-[#1CB0F6] border-[#1CB0F6]' 
            : 'bg-white dark:bg-slate-800 border-[#C1C1C1] dark:border-slate-600 hover:border-[#1CB0F6] dark:hover:border-[#1CB0F6]'
          } 
          ${sizeClasses[size]}`}
      >
        <input
          type="checkbox"
          id={id}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer disabled:cursor-not-allowed z-10"
          checked={checked}
          ref={(el) => {
            if (el) {
              el.indeterminate = indeterminate;
            }
          }}
          onChange={(e) => {
            if (!disabled) {
              onChange(e.target.checked);
            }
          }}
          disabled={disabled}
        />
        {(checked && !indeterminate) && <Check className={`text-white ${iconSizes[size]} shrink-0`} />}
        {indeterminate && <div className={`bg-white rounded-sm ${size === 'sm' ? 'w-2 h-0.5' : size === 'md' ? 'w-2.5 h-0.5' : 'w-3 h-0.5'} shrink-0`} />}
      </div>
      {label && (
        <span className="text-sm text-[#3C3C3C] dark:text-slate-200 font-medium select-none">
          {label}
        </span>
      )}
    </label>
  );
}
