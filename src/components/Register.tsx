import React, { useEffect } from 'react';
import Logo from './Logo';

interface RegisterProps {
  onNavigate: (path: string) => void;
  onSetLoading?: (loading: boolean) => void;
}

export default function Register({ onNavigate, onSetLoading }: RegisterProps) {
  useEffect(() => {
    onSetLoading?.(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="flex justify-center cursor-pointer" onClick={() => onNavigate('/')}>
          <Logo className="h-10 w-auto" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
            Pendaftaran Akun Terbuka
          </h2>
          <p className="text-sm text-[#4B4B4B] max-w-sm mx-auto font-medium">
            Sistem Pendaftaran Akses Siswa KAVIO Edu
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-duo !bg-white space-y-6 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] relative text-center rounded-2xl p-6 sm:p-8 border border-[#E5E5E5]">
          <div className="p-4 bg-[#1CB0F6]/10 border border-[#1CB0F6] rounded-xl text-left space-y-2">
            <span className="text-xs font-bold text-[#1CB0F6] uppercase tracking-wider block">
              PEMBERITAHUAN PENDAFTARAN
            </span>
            <p className="text-sm text-[#3C3C3C] dark:text-slate-200 leading-relaxed font-bold">
              Pembuatan akun siswa baru diatur secara khusus oleh Guru atau Admin KAVIO Edu demi menjaga keamanan dan akurasi data kelas.
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-normal">
              Silakan hubungi Guru/Pengajar Anda untuk mendapatkan kredensial akun akses siswa (Email & Password).
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="w-full btn-duo-green h-[50px] text-[15px] font-bold uppercase tracking-wider cursor-pointer"
            >
              Masuk ke Akun (Login)
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full btn-duo-slate h-[50px] text-[15px] font-bold uppercase tracking-wider cursor-pointer"
            >
              Kembali ke Halaman Utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
