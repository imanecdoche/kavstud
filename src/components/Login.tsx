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

  useEffect(() => {
    onSetLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
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
      className="min-h-screen bg-[#171A21] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-white select-none" 
      id="login-page"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="flex justify-center cursor-pointer" onClick={() => onNavigate('/')}>
          <Logo className="h-10 w-auto text-[#66C0F4]" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
            Masuk ke Akun Anda
          </h2>
          <p className="text-xs text-[#C6D4DF] max-w-sm mx-auto font-normal">
            Akses dashboard LMS Kavio Edu untuk memulai kegiatan belajar mengajar secara real-time.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#2F3138] border border-white/20 rounded-[4px] p-6 sm:p-8 space-y-6 shadow-[0_6px_16px_rgba(0,0,0,0.6)] text-white relative">
          {error && (
            <div className="p-3.5 bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 rounded-[2px] text-xs text-[#FF4B4B] flex items-start gap-2.5 animate-fadeIn" id="login-error-alert">
              <span className="font-bold shrink-0">Kesalahan:</span>
              <p className="leading-relaxed font-normal">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-white uppercase tracking-wider">
                Email / Username <span className="text-[#FF4B4B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#848E94]">
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
                  className="w-full pl-10 pr-3.5 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                  placeholder="name@kavio.stud.edu"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-white uppercase tracking-wider">
                Kata Sandi <span className="text-[#FF4B4B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#848E94]">
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
                  className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                  placeholder="Masukkan kata sandi"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#848E94] hover:text-white transition-colors cursor-pointer"
                  style={{ minWidth: '40px', minHeight: '40px' }}
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
              className="w-full h-11 bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer rounded-[2px] transition-all disabled:opacity-50 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
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

          <div className="pt-3 border-t border-white/10 text-center space-y-3">
            <p className="text-xs text-[#C6D4DF] font-normal">Belum memiliki akun Siswa?</p>
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="w-full h-10 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] py-2 text-xs font-bold flex items-center justify-center cursor-pointer rounded-[2px] transition-all"
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
