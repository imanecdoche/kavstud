import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowRight, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';

interface LoginProps {
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function Login({ onNavigate, onSetLoading }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safely clear any stuck global loading overlay on mount
  useEffect(() => {
    onSetLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple clicks
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    onSetLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'teacher') {
          onNavigate('/teacher');
        } else {
          onNavigate('/student');
        }
      } else {
        setError('Profil pengguna tidak ditemukan di database.');
        await auth.signOut();
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email atau password salah. Silakan coba lagi.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format email tidak valid.');
      } else {
        setError('Terjadi kesalahan saat masuk. Coba lagi nanti.');
      }
    } finally {
      setIsSubmitting(false);
      onSetLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#F7F7F7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#58CC02] selection:text-white" 
      id="login-page"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Typemark Logo */}
        <div className="flex justify-center cursor-pointer" onClick={() => onNavigate('/')}>
          <Logo className="h-10 w-auto" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#3C3C3C] tracking-tight uppercase">
            Masuk ke Akun Anda
          </h2>
          <p className="text-sm text-[#4B4B4B] max-w-sm mx-auto font-medium">
            Akses dashboard LMS Kavio Edu untuk memulai kegiatan belajar mengajar secara real-time.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-duo !bg-white space-y-6 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] relative rounded-2xl p-6 sm:p-8 border border-[#E5E5E5]">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2.5 animate-fadeIn" id="login-error-alert">
              <span className="font-bold shrink-0">Kesalahan:</span>
              <p className="leading-relaxed font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-[#3C3C3C] uppercase tracking-wider">
                Email / Username <span className="text-[#FF4B4B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-duo input-duo-has-icon-left !bg-white !text-[#3C3C3C]"
                  placeholder="name@kavio.stud.edu"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-[#3C3C3C] uppercase tracking-wider">
                Kata Sandi <span className="text-[#FF4B4B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-duo input-duo-has-icon-both !bg-white !text-[#3C3C3C]"
                  placeholder="Masukkan kata sandi"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-duo-green h-[50px] text-[15px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              id="login-submit-button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menghubungkan ke sistem...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-gray-200 text-center space-y-3">
            <p className="text-xs text-gray-600 font-bold">Belum memiliki akun Siswa?</p>
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="w-full btn-duo-blue py-2.5 text-xs font-black flex items-center justify-center cursor-pointer"
              id="go-to-register-button"
              disabled={isSubmitting}
            >
              <span>Daftar Akun Baru</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
