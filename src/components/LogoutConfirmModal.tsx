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
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#2F3138] border border-white/20 rounded-[4px] w-full max-w-sm p-6 sm:p-7 flex flex-col items-center text-center shadow-[0_6px_16px_rgba(0,0,0,0.6)] overflow-hidden relative my-auto text-white font-sans"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Warning Icon Container */}
          <div className="w-12 h-12 rounded-[2px] bg-[#FF4B4B]/10 text-[#FF4B4B] flex items-center justify-center border border-[#FF4B4B]/30 mb-4">
            <LogOut className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            Konfirmasi Keluar Akun
          </h3>

          <p className="text-xs text-[#C6D4DF] leading-relaxed font-normal mt-2 max-w-xs">
            Apakah Anda yakin ingin keluar dari akun Kavio Edu saat ini? Sesi belajar Anda akan diakhiri secara aman.
          </p>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 w-full pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="bg-transparent hover:bg-white/10 text-white border border-white/20 py-2.5 rounded-[2px] text-xs font-normal transition-all cursor-pointer disabled:opacity-40"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-[#FF4B4B] hover:bg-[#E03E3E] text-white rounded-[2px] text-xs font-bold transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2 py-2.5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
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
