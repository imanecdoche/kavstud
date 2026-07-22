import React from 'react';
import Logo from './Logo';

interface RegisterProps {
  onNavigate: (path: string) => void;
  onSetLoading?: (loading: boolean) => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="flex justify-center cursor-pointer" onClick={() => onNavigate('/')}>
          <Logo className="h-10 w-auto" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-gray-900 tracking-tight uppercase">
            Pendaftaran Akun Terbuka
          </h2>
          <p className="text-xs text-gray-600 max-w-sm mx-auto font-bold">
            Sistem Pendaftaran Akses Siswa KAVIO Edu
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border-2 border-gray-200 border-b-6 border-b-gray-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative text-center">
          <div className="p-4 bg-[#1CB0F6]/10 border-2 border-[#1CB0F6] rounded-2xl text-left space-y-2">
            <span className="text-xs font-black text-[#1CB0F6] uppercase tracking-wider block">
              PEMBERITAHUAN PENDAFTARAN
            </span>
            <p className="text-xs text-gray-800 leading-relaxed font-bold">
              Pembuatan akun siswa baru diatur secara khusus oleh Guru atau Admin KAVIO Edu demi menjaga keamanan dan akurasi data kelas.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed font-semibold">
              Silakan hubungi Guru/Pengajar Anda untuk mendapatkan kredensial akun akses siswa (Email & Password).
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="w-full btn-duo-green py-3.5 text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Masuk ke Akun (Login)
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full btn-duo-slate py-3 text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Kembali ke Halaman Utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
