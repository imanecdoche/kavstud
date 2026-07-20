import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Logo from './Logo';
import { UserRole } from '../types';

interface RegisterProps {
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function Register({ onNavigate, onSetLoading }: RegisterProps) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const role: UserRole = 'student';
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '');

    if (!fullName || !cleanUsername || !password || !confirmPassword) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi harus minimal 6 karakter.');
      return;
    }

    const fullEmail = `${cleanUsername}@kavio.stud.edu`;

    setIsSubmitting(true);
    setError(null);
    onSetLoading(true);

    try {
      // Create user auth
      const userCredential = await createUserWithEmailAndPassword(auth, fullEmail, password);
      
      // Save profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName,
        email: fullEmail,
        role: 'student',
        classType: 'PRIVATE',
        createdAt: new Date().toISOString()
      });

      // Navigate to student dashboard
      onNavigate('/student');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError(`Email ${fullEmail} sudah terdaftar. Silakan pilih username lain.`);
      } else if (err.code === 'auth/invalid-email') {
        setError('Format username email tidak valid.');
      } else if (err.code === 'auth/weak-password') {
        setError('Kata sandi terlalu lemah.');
      } else {
        setError('Terjadi kesalahan saat pendaftaran. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
      onSetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans" id="register-page">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <Logo className="h-10 w-auto text-sky-600" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 tracking-tight">
            Daftar Akun Siswa Baru
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Daftarkan diri Anda untuk mengakses lembar tugas interaktif dan pembelajaran KAVIO Edu.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="modal-duo p-6 sm:p-8 space-y-6 shadow-xl relative">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-xs text-red-600 flex items-start gap-2.5 animate-fadeIn" id="register-error-alert">
              <span className="font-bold shrink-0">⚠️ Kesalahan:</span>
              <p className="leading-relaxed font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 border-b-4 border-gray-300 rounded-xl text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-400"
                  placeholder="Contoh: Jaisyrrahman"
                />
              </div>
            </div>

            {/* Fixed Domain Username Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                Username Email Siswa <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border-2 border-gray-200 border-b-4 border-gray-300 rounded-xl overflow-hidden focus-within:border-sky-400 bg-white">
                <div className="pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
                  className="flex-1 pl-2.5 pr-2 py-3 bg-white text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none font-mono"
                  placeholder="jais"
                />
                <span className="px-3.5 py-3 bg-sky-50 border-l-2 border-sky-100 text-xs font-black text-sky-600 font-mono select-none shrink-0">
                  @kavio.stud.edu
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                Email Anda akan otomatis menjadi: <span className="font-mono font-bold text-sky-600">{username.trim() ? `${username.trim().toLowerCase()}@kavio.stud.edu` : 'username@kavio.stud.edu'}</span>
              </p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-white border-2 border-gray-200 border-b-4 border-gray-300 rounded-xl text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-400"
                  placeholder="Min. 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                Konfirmasi Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 border-b-4 border-gray-300 rounded-xl text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-400"
                  placeholder="Ulangi kata sandi"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-duo-green py-3 px-4 text-xs font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{ minHeight: '44px' }}
              id="register-submit-button"
            >
              <span>{isSubmitting ? 'Memproses Daftar...' : 'Buat Akun Siswa Baru'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 text-center space-y-3">
            <p className="text-xs text-gray-500 font-semibold">Sudah memiliki akun Siswa atau Guru?</p>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="w-full btn-duo-slate py-2.5 text-xs font-black flex items-center justify-center cursor-pointer"
            >
              <span>Masuk Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
