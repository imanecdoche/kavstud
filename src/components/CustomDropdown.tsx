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
    sm: 'px-3 py-1.5 text-xs rounded-[2px] min-h-[32px]',
    md: 'px-3.5 py-2 text-xs rounded-[2px] min-h-[38px]',
    lg: 'px-4 py-2.5 text-xs sm:text-sm rounded-[2px] min-h-[44px]'
  };

  const listPaddingClasses = {
    sm: 'max-h-48 mt-1',
    md: 'max-h-60 mt-1',
    lg: 'max-h-60 mt-1'
  };

  const buttonStyle = variant === 'minimal'
    ? 'bg-transparent border-none p-0 text-[#C6D4DF] hover:text-[#66C0F4] font-normal focus:ring-0 focus:outline-none'
    : `w-full bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#66C0F4] transition-all font-normal ${sizeClasses[size]}`;

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`} id={id}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left cursor-pointer disabled:bg-white/5 disabled:text-[#8A8A8A] disabled:cursor-not-allowed ${buttonStyle}`}
      >
        <span className="truncate mr-1">
          {selectedOption ? (
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold uppercase shrink-0 ${selectedOption.badge.className}`}>
                  {selectedOption.badge.text}
                </span>
              )}
            </span>
          ) : (
            <span className="text-[#8A8A8A] font-normal">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`text-[#66C0F4] transition-transform duration-200 shrink-0 ${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          onWheel={(e) => e.stopPropagation()}
          className={`absolute right-0 z-50 bg-[#2F3138] border border-white/20 rounded-[2px] shadow-[0px_6px_16px_rgba(0,0,0,0.6)] py-1 overflow-y-auto focus:outline-none overscroll-contain ${dropdownWidth} ${listPaddingClasses[size]}`}
          style={{ overscrollBehavior: 'contain' }}
        >
          {options.length === 0 ? (
            <div className="px-4 py-2.5 text-xs text-[#8A8A8A] text-center font-normal">Tidak ada pilihan</div>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs font-normal transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#66C0F4] text-[#171A21] font-bold' : 'text-[#C6D4DF] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{option.label}</span>
                      {option.badge && (
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[2px] text-[8px] font-bold uppercase shrink-0 ${option.badge.className}`}>
                          {option.badge.text}
                        </span>
                      )}
                    </div>
                    {option.sublabel && (
                      <span className={`text-[10px] truncate mt-0.5 font-normal ${isSelected ? 'text-[#171A21]/80' : 'text-[#8A8A8A]'}`}>{option.sublabel}</span>
                    )}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#171A21] shrink-0 ml-1 stroke-[3]" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
