import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: {
    text: string;
    className: string;
  };
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  dropdownWidth?: string;
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = '-- Pilih --',
  className = '',
  id,
  size = 'md',
  variant = 'default',
  dropdownWidth = 'w-full'
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (val: string) => {
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-[10px] rounded-lg',
    md: 'px-3 py-2 text-xs rounded-xl',
    lg: 'px-4 py-3 text-xs rounded-xl'
  };

  const listPaddingClasses = {
    sm: 'max-h-48 mt-0.5',
    md: 'max-h-60 mt-1',
    lg: 'max-h-60 mt-1'
  };

  const buttonStyle = variant === 'minimal'
    ? 'bg-transparent border-none p-0 text-gray-700 dark:text-slate-200 hover:text-gray-950 font-bold focus:ring-0 focus:outline-none'
    : `w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold ${sizeClasses[size]}`;

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`} id={id}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left cursor-pointer disabled:bg-gray-50 dark:bg-slate-900 disabled:text-gray-400 disabled:cursor-not-allowed ${buttonStyle}`}
      >
        <span className="truncate mr-1">
          {selectedOption ? (
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${selectedOption.badge.className}`}>
                  {selectedOption.badge.text}
                </span>
              )}
            </span>
          ) : (
            <span className="text-gray-400 font-normal">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`text-gray-400 transition-transform duration-200 shrink-0 ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 z-50 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-xl shadow-lg py-1 overflow-y-auto focus:outline-none ${dropdownWidth} ${listPaddingClasses[size]}`}>
          {options.length === 0 ? (
            <div className="px-4 py-2 text-xs text-gray-400 text-center">Tidak ada pilihan</div>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors hover:bg-gray-50 dark:bg-slate-900 cursor-pointer ${
                    isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30/50 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{option.label}</span>
                      {option.badge && (
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${option.badge.className}`}>
                          {option.badge.text}
                        </span>
                      )}
                    </div>
                    {option.sublabel && (
                      <span className="text-[10px] text-gray-400 truncate mt-0.5">{option.sublabel}</span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
