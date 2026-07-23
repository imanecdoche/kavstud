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
  description?: React.ReactNode;
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
  description,
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
      className={`inline-flex items-start gap-2.5 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
      htmlFor={id}
    >
      <div 
        className={`relative shrink-0 flex items-center justify-center border-2 rounded transition-colors duration-200 mt-0.5
          ${(checked || indeterminate) 
            ? 'bg-[#66C0F4] border-[#66C0F4]' 
            : 'bg-black/40 border-white/20 hover:border-[#66C0F4]'
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
        {(checked && !indeterminate) && <Check className={`text-[#171A21] ${iconSizes[size]} shrink-0 stroke-[3]`} />}
        {indeterminate && <div className={`bg-[#171A21] rounded-sm ${size === 'sm' ? 'w-2 h-0.5' : size === 'md' ? 'w-2.5 h-0.5' : 'w-3 h-0.5'} shrink-0`} />}
      </div>
      {(label || description) && (
        <div className="space-y-0.5 select-none">
          {label && (
            <span className="block text-xs text-white font-medium">
              {label}
            </span>
          )}
          {description && (
            <span className="block text-[11px] text-[#8A8A8A] font-normal leading-normal">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
