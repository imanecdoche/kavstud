import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
}

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onActionClick 
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="py-10 px-6 text-center space-y-4 border border-white/10 rounded-[3px] bg-[#2F3138] flex flex-col items-center justify-center max-w-md mx-auto shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
    >
      <div className="w-12 h-12 rounded-[2px] bg-[#66C0F4]/10 border border-[#66C0F4]/30 flex items-center justify-center text-[#66C0F4]">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-[#C6D4DF] max-w-xs mx-auto leading-relaxed font-normal">{description}</p>
      </div>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-2 bg-[#66C0F4] hover:bg-[#5DADE2] text-white px-4 py-2 text-xs font-bold rounded-[2px] cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
}
