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
    <div className="min-h-screen bg-[#171A21] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-white select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="flex justify-center cursor-pointer" onClick={() => onNavigate('/')}>
          <Logo className="h-10 w-auto text-[#66C0F4]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
            Pendaftaran Akun Terbuka
          </h2>
          <p className="text-xs text-[#C6D4DF] max-w-sm mx-auto font-normal">
            Sistem Pendaftaran Akses Siswa KAVIO Edu
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#2F3138] border border-white/20 rounded-[4px] p-6 sm:p-8 space-y-6 shadow-[0_6px_16px_rgba(0,0,0,0.6)] text-white text-center relative">
          <div className="p-4 bg-[#66C0F4]/10 border border-[#66C0F4]/30 rounded-[2px] text-left space-y-2">
            <span className="text-xs font-bold text-[#66C0F4] uppercase tracking-wider block">
              PEMBERITAHUAN PENDAFTARAN
            </span>
            <p className="text-xs text-white leading-relaxed font-bold">
              Pembuatan akun siswa baru diatur secara khusus oleh Guru atau Admin KAVIO Edu demi menjaga keamanan dan akurasi data kelas.
            </p>
            <p className="text-xs text-[#C6D4DF] leading-relaxed font-normal">
              Silakan hubungi Guru/Pengajar Anda untuk mendapatkan kredensial akun akses siswa (Email & Password).
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="w-full h-11 bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] text-xs font-bold uppercase tracking-wider cursor-pointer rounded-[2px] transition-all shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            >
              Masuk ke Akun (Login)
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full h-10 bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs font-bold uppercase tracking-wider cursor-pointer rounded-[2px] transition-all"
            >
              Kembali ke Halaman Utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
