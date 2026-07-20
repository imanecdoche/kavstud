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
      className="py-12 px-6 text-center space-y-4 border border-dashed border-gray-100 rounded-3xl bg-white flex flex-col items-center justify-center max-w-md mx-auto"
    >
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 animate-pulse">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-2 btn-duo-blue px-5 py-2.5 text-xs font-black cursor-pointer shadow-xs"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
}
