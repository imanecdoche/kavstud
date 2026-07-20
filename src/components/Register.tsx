import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../types';

interface RegisterProps {
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function Register({ onNavigate, onSetLoading }: RegisterProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
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

    setIsSubmitting(true);
    setError(null);
    onSetLoading(true);

    try {
      // Create user auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName,
        email,
        role,
        createdAt: new Date().toISOString()
      });

      // Automatically navigate to role dashboard
      if (role === 'teacher') {
        onNavigate('/teacher');
      } else {
        onNavigate('/student');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Alamat email sudah digunakan oleh akun lain.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format email tidak valid.');
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8" id="register-page">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-logo font-black text-2xl tracking-wider text-gray-900">
            KAVIO<span className="text-indigo-600">EDU</span>
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold text-gray-900 tracking-tight">
            Daftar Akun Baru
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Gabung dengan sistem pendidikan cerdas berbasis real-time bersama ribuan pengajar dan siswa.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-gray-100 rounded-3xl shadow-xs space-y-6 sm:px-10">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600 flex items-start gap-2.5 animate-fadeIn" id="register-error-alert">
              <span className="font-bold shrink-0">Kesalahan:</span>
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="register-form">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700">
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
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="Nama Lengkap Anda"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="name@school.com"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Peran Pengguna <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-3 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 ${
                    role === 'student'
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold'
                      : 'border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <User className="w-4 h-4" />
                  Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`py-3 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 ${
                    role === 'teacher'
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold'
                      : 'border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Guru
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
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
                  className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700">
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
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="Ulangi kata sandi"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
              style={{ minHeight: '44px' }}
              id="register-submit-button"
            >
              {isSubmitting ? 'Memproses Daftar...' : 'Buat Akun Baru'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400">Sudah memiliki akun?</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/login')}
            className="w-full py-3 px-4 border border-gray-200 hover:border-gray-300 text-gray-700 bg-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-98"
            style={{ minHeight: '44px' }}
            id="go-to-login-button"
          >
            Masuk Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
