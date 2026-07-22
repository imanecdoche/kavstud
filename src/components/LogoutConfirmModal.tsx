import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: LogoutConfirmModalProps) {
  // Body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overscroll-contain overflow-y-auto animate-fadeIn"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl w-full max-w-sm p-6 sm:p-7 flex flex-col items-center text-center shadow-2xl overflow-hidden relative my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 3D Warning Icon Container */}
          <div className="relative w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800/50 shadow-inner mb-4">
            <div className="absolute inset-0 rounded-2xl bg-rose-500/20 blur-md animate-pulse pointer-events-none" />
            <LogOut className="w-8 h-8 relative z-10" />
          </div>

          <h3 className="text-lg font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
            Konfirmasi Keluar Akun
          </h3>

          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-medium mt-2 max-w-xs">
            Apakah Anda yakin ingin keluar dari akun Kavio Edu saat ini? Sesi belajar Anda akan diakhiri secara aman.
          </p>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 w-full pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Mengeluarkan...</span>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Ya, Keluar Akun</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
