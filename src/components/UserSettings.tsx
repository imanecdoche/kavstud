import React, { useState, useEffect, useRef } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword 
} from 'firebase/auth';
import { 
  User, 
  Shield, 
  Sliders, 
  UserCheck, 
  Camera, 
  Check, 
  X, 
  Loader2, 
  Lock, 
  Mail, 
  Phone, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  Globe, 
  Palette, 
  Bell,
  Trash2,
  Terminal,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import CustomDropdown from './CustomDropdown';
import CustomDatePicker from './CustomDatePicker';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Dialog } from '@capacitor/dialog';

interface UserSettingsProps {
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

type SettingsTab = 'profile' | 'security' | 'preferences' | 'account' | 'dev';

export default function UserSettings({ onNavigate, onSetLoading }: UserSettingsProps) {
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [loading, setLoading] = useState(true);
  
  // General feedback toasts
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  
  // Profile Picture States
  const [photoURL, setPhotoURL] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword] = useState(''); // wait, let's define both state or combine
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Sangat Lemah', color: 'bg-red-500' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Preferences Form States
  const [language, setLanguage] = useState<'English' | 'Bahasa Indonesia'>('English');
  const [theme, setTheme] = useState<'Light' | 'Dark' | 'System'>('Light');
  const [emailNotification, setEmailNotification] = useState(true);
  const [assignmentNotification, setAssignmentNotification] = useState(true);
  const [scoreNotification, setScoreNotification] = useState(true);

  // Push Notifications Hook
  const { fcmToken, notificationPermissionStatus, requestPermission } = usePushNotifications();

  // Save changes states
  const [isSaving, setIsSaving] = useState(false);

  // Check if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Developer Tools States
  const [devUsers, setDevUsers] = useState<UserProfile[]>([]);
  const [devLoading, setDevLoading] = useState(false);
  const [editingDevUser, setEditingDevUser] = useState<UserProfile | null>(null);
  const [devNewEmail, setDevNewEmail] = useState('');
  const [devEditFullName, setDevEditFullName] = useState('');
  const [devEditPhone, setDevEditPhone] = useState('');
  const [systemMaintenance, setSystemMaintenance] = useState(false);

  // Load all users for Developer Tools
  useEffect(() => {
    if (activeTab === 'dev' && currentUserProfile?.email === 'fatih@kavio.tec.edu') {
      const fetchAllUsers = async () => {
        try {
          setDevLoading(true);
          const { collection, getDocs, query, orderBy, doc, getDoc } = await import('firebase/firestore');
          const snap = await getDocs(query(collection(db, 'users'), orderBy('role', 'asc')));
          const fetched: UserProfile[] = [];
          snap.forEach((doc) => {
            fetched.push({ uid: doc.id, ...doc.data() } as UserProfile);
          });
          setDevUsers(fetched);
          
          const sysSnap = await getDoc(doc(db, 'modules', 'system_config'));
          if (sysSnap.exists()) {
            setSystemMaintenance(sysSnap.data().maintenanceMode || false);
          }
        } catch (err) {
          console.error('Error fetching dev tools data:', err);
          showToast('error', 'Gagal memuat data Developer Tools.');
        } finally {
          setDevLoading(false);
        }
      };
      fetchAllUsers();
    }
  }, [activeTab, currentUserProfile]);

  // Dev actions handlers
  const handleDevUpdateEmail = async (u: UserProfile) => {
    if (!devNewEmail.trim()) return;
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'users', u.uid), { email: devNewEmail.trim() });
      setDevUsers(prev => prev.map(usr => usr.uid === u.uid ? { ...usr, email: devNewEmail.trim() } : usr));
      setEditingDevUser(null);
      showToast('success', `Email untuk ${u.fullName} berhasil diperbarui di database!`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Gagal memperbarui email.');
    }
  };

  const handleDevUpdateProfile = async (u: UserProfile) => {
    if (!devEditFullName.trim()) return;
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'users', u.uid), {
        fullName: devEditFullName.trim(),
        phone: devEditPhone.trim()
      });
      setDevUsers(prev => prev.map(usr => usr.uid === u.uid ? { ...usr, fullName: devEditFullName.trim(), phone: devEditPhone.trim() } : usr));
      setEditingDevUser(null);
      showToast('success', `Profil ${u.fullName} berhasil diperbarui!`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Gagal memperbarui profil.');
    }
  };

  const handleDevResetPassword = async (u: UserProfile) => {
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, u.email);
      showToast('success', `Email reset kata sandi telah dikirim ke ${u.email}!`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Gagal mengirim email reset.');
    }
  };

  const handleDevDeleteUser = async (u: UserProfile) => {
    const { value } = await Dialog.confirm({
      title: 'Hapus Akun Permanen',
      message: `Apakah Anda yakin ingin menghapus akun ${u.fullName} secara permanen dari database? Tindakan ini tidak dapat dibatalkan.`,
      okButtonTitle: 'Hapus',
      cancelButtonTitle: 'Batal'
    });
    if (!value) return;
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'users', u.uid));
      setDevUsers(prev => prev.filter(usr => usr.uid !== u.uid));
      showToast('success', `Akun ${u.fullName} berhasil dihapus permanen.`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Gagal menghapus akun.');
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const next = !systemMaintenance;
      await setDoc(doc(db, 'modules', 'system_config'), { maintenanceMode: next }, { merge: true });
      setSystemMaintenance(next);
      showToast('success', `Mode Pemeliharaan (Maintenance) berhasil ${next ? 'Diaktifkan' : 'Dinonaktifkan'}.`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Gagal memperbarui mode pemeliharaan.');
    }
  };

  // Calculate age based on birthdate
  const getAge = (dobString: string): number | null => {
    if (!dobString) return null;
    const today = new Date();
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  // Load User Profile from Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      onNavigate('/login');
      return;
    }

    const loadProfileData = async () => {
      try {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const profile = userDocSnap.data() as UserProfile;
          setCurrentUserProfile(profile);
          setOriginalProfile(profile);

          // Populate Form States
          setFullName(profile.fullName || '');
          setPhone(profile.phone || '');
          setDateOfBirth(profile.dateOfBirth || '');
          setGender(profile.gender || '');
          setBio(profile.bio || '');
          setPhotoURL(profile.photoURL || '');

          // Preferences
          setLanguage(profile.language || 'English');
          setTheme(profile.theme || 'Light');
          if (profile.notifications) {
            setEmailNotification(profile.notifications.email);
            setAssignmentNotification(profile.notifications.assignment);
            setScoreNotification(profile.notifications.score);
          }
        }
      } catch (err) {
        console.error('Error loading user profile settings:', err);
        showToast('error', 'Gagal memuat profil pengguna.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [onNavigate]);

  // Handle Automatic Age Calculation whenever Date of Birth changes
  useEffect(() => {
    if (dateOfBirth) {
      const calculated = getAge(dateOfBirth);
      setCalculatedAge(calculated);
    } else {
      setCalculatedAge(null);
    }
  }, [dateOfBirth]);

  // Monitor Unsaved Changes
  useEffect(() => {
    if (!originalProfile) {
      setHasUnsavedChanges(false);
      return;
    }

    const matchesOriginal = 
      fullName === (originalProfile.fullName || '') &&
      phone === (originalProfile.phone || '') &&
      dateOfBirth === (originalProfile.dateOfBirth || '') &&
      gender === (originalProfile.gender || '') &&
      bio === (originalProfile.bio || '') &&
      photoURL === (originalProfile.photoURL || '') &&
      language === (originalProfile.language || 'English') &&
      theme === (originalProfile.theme || 'Light') &&
      emailNotification === (originalProfile.notifications?.email ?? true) &&
      assignmentNotification === (originalProfile.notifications?.assignment ?? true) &&
      scoreNotification === (originalProfile.notifications?.score ?? true);

    setHasUnsavedChanges(!matchesOriginal);
  }, [
    fullName, phone, dateOfBirth, gender, bio, photoURL, 
    language, theme, emailNotification, assignmentNotification, scoreNotification, 
    originalProfile
  ]);

  // Monitor Password Strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, text: 'Sangat Lemah', color: 'bg-red-500' });
      return;
    }

    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[a-z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    let text = 'Sangat Lemah';
    let color = 'bg-red-500';

    if (score === 5) {
      text = 'Sangat Kuat (Kavio Fortress)';
      color = 'bg-emerald-600';
    } else if (score >= 4) {
      text = 'Kuat';
      color = 'bg-green-500';
    } else if (score >= 3) {
      text = 'Sedang';
      color = 'bg-amber-500';
    } else if (score >= 2) {
      text = 'Lemah';
      color = 'bg-orange-500';
    }

    setPasswordStrength({ score, text, color });
  }, [newPassword]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Profile Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Tipe file tidak didukung. Harap unggah file JPG, PNG, atau WEBP.');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // Increase tolerance to 10 MB for local resizing
    if (file.size > maxSize) {
      setUploadError('Ukuran file terlalu besar. Harap pilih gambar di bawah 10 MB.');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setUploadError(null);
    setUploadProgress(10); // Start progress bar

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadProgress(40);
      const img = new Image();
      img.onload = () => {
        setUploadProgress(70);
        
        // Canvas resizing to keep base64 string small and light for Firestore
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Export canvas to high-quality compressed JPEG
          try {
            const dataURL = canvas.toDataURL('image/jpeg', 0.8);
            setUploadProgress(100);
            setTimeout(() => {
              setPhotoURL(dataURL);
              setUploadProgress(null);
              showToast('success', 'Foto profil berhasil diunggah secara lokal. Klik "Simpan Perubahan" di bagian bawah untuk menyimpan ke cloud.');
            }, 300);
          } catch (err) {
            console.error('Error generating canvas data URL:', err);
            // Fallback to original image data URL
            setPhotoURL(event.target?.result as string);
            setUploadProgress(null);
            showToast('success', 'Foto profil berhasil diproses. Klik "Simpan Perubahan" di bagian bawah.');
          }
        } else {
          // Fallback if canvas context is not supported
          setPhotoURL(event.target?.result as string);
          setUploadProgress(null);
          showToast('success', 'Foto profil berhasil diproses. Klik "Simpan Perubahan" di bagian bawah.');
        }
      };
      img.onerror = () => {
        setUploadError('Gagal memproses file gambar. Silakan coba file lain.');
        setUploadProgress(null);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca file.');
      setUploadProgress(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo Removal
  const handleRemovePhoto = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setUploadProgress(10);
      setPhotoURL('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadProgress(null);
      showToast('success', 'Foto profil dilepas. Klik Simpan Perubahan untuk memperbarui database.');
    } catch (err) {
      console.error('Error removing profile photo:', err);
      showToast('error', 'Gagal melepas foto.');
      setUploadProgress(null);
    }
  };

  // Profile Save Action
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    // Validate Phone Number
    if (phone.trim()) {
      const cleanPhone = phone.replace(/\s+/g, '');
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(cleanPhone)) {
        showToast('error', 'Format nomor telepon tidak valid. Gunakan format angka saja atau sertakan kode negara (misal +628123456789).');
        return;
      }
    }

    setIsSaving(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      const payload: Partial<UserProfile> = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        dateOfBirth: dateOfBirth,
        age: calculatedAge !== null ? calculatedAge : undefined,
        gender: gender,
        bio: bio.trim(),
        photoURL: photoURL,
        language: language,
        theme: theme,
        notifications: {
          email: emailNotification,
          assignment: assignmentNotification,
          score: scoreNotification
        },
        updatedAt: serverTimestamp()
      };

      await updateDoc(userDocRef, payload);

      // Refresh original profile state to avoid unsaved changes popup
      const updatedProfile: UserProfile = {
        ...originalProfile!,
        ...payload
      };
      
      setOriginalProfile(updatedProfile);
      setCurrentUserProfile(updatedProfile);
      setHasUnsavedChanges(false);

      showToast('success', 'Pengaturan profil Anda berhasil disimpan secara real-time!');
    } catch (err) {
      console.error('Error saving profile changes:', err);
      showToast('error', 'Gagal menyimpan perubahan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset/Cancel Changes
  const handleCancelChanges = () => {
    if (!originalProfile) return;

    // Revert States
    setFullName(originalProfile.fullName || '');
    setPhone(originalProfile.phone || '');
    setDateOfBirth(originalProfile.dateOfBirth || '');
    setGender(originalProfile.gender || '');
    setBio(originalProfile.bio || '');
    setPhotoURL(originalProfile.photoURL || '');
    setLanguage(originalProfile.language || 'English');
    setTheme(originalProfile.theme || 'Light');
    
    if (originalProfile.notifications) {
      setEmailNotification(originalProfile.notifications.email);
      setAssignmentNotification(originalProfile.notifications.assignment);
      setScoreNotification(originalProfile.notifications.score);
    }

    setHasUnsavedChanges(false);
    showToast('success', 'Perubahan dibatalkan dan dikembalikan ke data asli.');
  };

  // Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !user.email) return;

    if (!currentPassword) {
      setPasswordError('Sandi saat ini wajib diisi untuk keamanan autentikasi.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Sandi baru harus terdiri dari minimal 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi sandi baru tidak cocok dengan sandi baru.');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError(null);

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Reset fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      showToast('success', 'Kata sandi Anda berhasil diperbarui.');
    } catch (err: any) {
      console.error('Error changing password:', err);
      if (err.code === 'auth/wrong-password') {
        setPasswordError('Kata sandi saat ini salah.');
      } else if (err.code === 'auth/weak-password') {
        setPasswordError('Kata sandi baru dinilai terlalu lemah oleh sistem keamanan.');
      } else {
        setPasswordError('Gagal mengubah kata sandi. Pastikan kredensial Anda benar.');
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleBack = () => {
    if (currentUserProfile?.role === 'teacher') {
      onNavigate('/teacher');
    } else {
      onNavigate('/student');
    }
  };

  const isTeacher = currentUserProfile?.role === 'teacher';

  return (
    <div className="min-h-screen bg-[#171A21] text-white flex flex-col font-sans" id="user-settings-page">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-[2px] shadow-[0_8px_24px_rgba(0,0,0,0.8)] border text-xs font-bold flex items-center gap-3 bg-[#2F3138] text-white ${
              toast.type === 'success' 
                ? 'border-[#A1CD44]' 
                : 'border-[#FF4B4B]'
            }`}
            id="toast-notification"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#A1CD44] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#FF4B4B] shrink-0" />
            )}
            <span className="uppercase tracking-wider">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <header className="bg-[#2F3138] border-b border-white/10 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-[0_4px_16px_rgba(0,0,0,0.6)] w-full">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="bg-black/40 hover:bg-white/10 text-white border border-white/15 p-2.5 rounded-[2px] flex items-center justify-center cursor-pointer transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-widest leading-none font-mono">Konfigurasi Pengguna</span>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight uppercase mt-1">
                Pengaturan Akun & Profil
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Sidebar navigation tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          
          {/* User Profile Summary Card */}
          <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
            <div className="flex items-center gap-3.5">
              <div className="relative group">
                <div className="w-12 h-12 bg-black/40 border border-white/15 rounded-full flex items-center justify-center text-[#66C0F4] font-bold text-base overflow-hidden shrink-0 shadow-xs">
                  <img 
                    src={photoURL || '/aset/default-avatar.svg'} 
                    alt={fullName} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/aset/default-avatar.svg';
                    }}
                  />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white truncate">{fullName || 'Memuat...'}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-[2px] text-[9px] font-bold uppercase border ${
                  isTeacher 
                    ? 'bg-[#66C0F4]/20 text-[#66C0F4] border-[#66C0F4]/40' 
                    : 'bg-[#A1CD44]/20 text-[#A1CD44] border-[#A1CD44]/40'
                }`}>
                  {isTeacher ? 'Pengajar' : 'Siswa'}
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <p className="text-[10px] text-[#C6D4DF] font-mono truncate">{currentUserProfile?.email}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-3 flex flex-row md:flex-col gap-1.5 overflow-x-auto shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-[2px] text-xs font-bold flex items-center gap-3 transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#66C0F4] text-[#171A21]'
                  : 'text-[#C6D4DF] hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profil Saya</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-[2px] text-xs font-bold flex items-center gap-3 transition-all ${
                activeTab === 'security'
                  ? 'bg-[#66C0F4] text-[#171A21]'
                  : 'text-[#C6D4DF] hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Keamanan</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-[2px] text-xs font-bold flex items-center gap-3 transition-all ${
                activeTab === 'preferences'
                  ? 'bg-[#66C0F4] text-[#171A21]'
                  : 'text-[#C6D4DF] hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Preferensi</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-[2px] text-xs font-bold flex items-center gap-3 transition-all ${
                activeTab === 'account'
                  ? 'bg-[#66C0F4] text-[#171A21]'
                  : 'text-[#C6D4DF] hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>Status Akun</span>
            </button>

            {currentUserProfile?.email === 'fatih@kavio.tec.edu' && (
              <button
                type="button"
                onClick={() => setActiveTab('dev')}
                className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-[2px] text-xs font-bold flex items-center gap-3 transition-all ${
                  activeTab === 'dev'
                    ? 'bg-[#FF4B4B] text-[#171A21]'
                    : 'text-[#FF4B4B] hover:bg-[#FF4B4B]/10 border border-dashed border-[#FF4B4B]/40'
                }`}
              >
                <Terminal className="w-4 h-4 shrink-0" />
                <span>Dev Tools</span>
              </button>
            )}
          </div>

          {/* Unsaved Warning Banner */}
          {hasUnsavedChanges && (
            <div className="bg-[#2F3138] border border-[#B9A074]/50 p-4 rounded-[3px] space-y-3 text-white">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-[#B9A074] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Perubahan Belum Disimpan</p>
                  <p className="text-[10px] text-[#C6D4DF] leading-relaxed mt-0.5">
                    Anda memodifikasi beberapa informasi profil. Simpan perubahan sebelum meninggalkan halaman.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 py-1.5 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] rounded-[2px] text-[10px] font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Simpan
                </button>
                <button
                  onClick={handleCancelChanges}
                  className="flex-1 py-1.5 bg-transparent hover:bg-white/10 border border-white/20 text-white rounded-[2px] text-[10px] font-bold transition-all cursor-pointer"
                >
                  Batalkan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Active Form Container */}
        <div className="flex-1 min-w-0">
          
          {loading ? (
            /* Loading Skeletons */
            <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 sm:p-8 space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.5)] animate-pulse">
              <div className="h-6 w-48 bg-black/40 rounded-[2px]" />
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-black/40 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-black/40 rounded-[2px] w-1/3" />
                  <div className="h-3 bg-black/40 rounded-[2px] w-1/4" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-10 bg-black/40 rounded-[2px]" />
                <div className="h-10 bg-black/40 rounded-[2px]" />
                <div className="h-10 bg-black/40 rounded-[2px]" />
                <div className="h-10 bg-black/40 rounded-[2px]" />
              </div>
            </div>
          ) : (
            <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 sm:p-8 space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
              
              {/* TAB 1: PROFILE FORM */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Profil Publik Saya</h2>
                    <p className="text-[11px] text-[#C6D4DF] mt-0.5">Kelola foto identitas, nomor kontak, serta deskripsi biografi akademis.</p>
                  </div>

                  {/* Profile Photo Uploader */}
                  <div className="p-5 bg-black/40 border border-white/10 rounded-[3px] flex flex-col sm:flex-row items-center gap-5 text-white">
                    <div className="relative">
                      <div className="w-20 h-20 bg-black/40 border border-white/20 rounded-full flex items-center justify-center text-[#66C0F4] font-bold text-2xl overflow-hidden shadow-xs">
                        {photoURL ? (
                          <img src={photoURL} alt="Avatar Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          fullName?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1.5 -right-1.5 bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] p-1.5 rounded-full border border-white/20 shadow-xs cursor-pointer transition-transform hover:scale-110"
                        style={{ minWidth: '28px', minHeight: '28px' }}
                        aria-label="Ubah Foto"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <p className="text-xs font-bold text-white">Foto Identitas Akun</p>
                      <p className="text-[10px] text-[#C6D4DF] leading-relaxed max-w-sm">
                        Mendukung file format JPG, PNG, atau WEBP. Maksimal ukuran 5 MB.
                      </p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-[36px] bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] px-4 text-xs font-bold uppercase rounded-[2px] transition-all cursor-pointer"
                        >
                          Pilih Foto Baru
                        </button>
                        
                        {photoURL && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="h-[36px] bg-transparent hover:bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]/40 px-4 text-xs font-bold uppercase rounded-[2px] flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Lepas Foto</span>
                          </button>
                        )}
                      </div>

                      {uploadProgress !== null && (
                        <div className="space-y-1.5 max-w-xs pt-1 mx-auto sm:mx-0">
                          <div className="flex justify-between items-center text-[10px] font-bold text-[#66C0F4]">
                            <span>Mengunggah file...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                            <div className="h-full bg-[#66C0F4] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        </div>
                      )}

                      {uploadError && (
                        <p className="text-[10px] font-bold text-[#FF4B4B] flex items-center justify-center sm:justify-start gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {uploadError}
                        </p>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">Nama Lengkap <span className="text-[#FF4B4B]">*</span></label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                        placeholder="Nama lengkap Anda"
                      />
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#8A8A8A] uppercase tracking-wider">Alamat Email (Akun Utama)</label>
                      <div className="relative">
                        <input
                          type="email"
                          readOnly
                          value={currentUserProfile?.email || ''}
                          className="block w-full px-4 py-2.5 bg-black/60 border border-white/10 text-[#C6D4DF] rounded-[2px] text-xs cursor-not-allowed"
                        />
                        <Mail className="absolute right-3.5 top-3 w-4 h-4 text-[#8A8A8A]" />
                      </div>
                      <p className="text-[9px] text-[#8A8A8A] mt-1">Guna mengganti alamat email silakan hubungi administrator Kavio Edu.</p>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">Nomor Telepon</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="block w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                          placeholder="+628123456789"
                        />
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#8A8A8A]" />
                      </div>
                      <p className="text-[9px] text-[#8A8A8A] mt-1">Gunakan format angka internasional (misal +628123456789).</p>
                    </div>

                    {/* Date of Birth & Age Block */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">Tanggal Lahir</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <CustomDatePicker
                            value={dateOfBirth}
                            onChange={(val) => setDateOfBirth(val)}
                            placeholder="Pilih Tanggal Lahir"
                          />
                        </div>
                        <div className="col-span-1 bg-black/40 border border-white/15 rounded-[2px] px-2.5 py-2 text-center flex flex-col justify-center min-w-0">
                          <span className="text-[8px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Umur</span>
                          <span className="text-xs font-bold text-white block truncate">
                            {calculatedAge !== null ? `${calculatedAge} Thn` : '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">Jenis Kelamin</label>
                      <CustomDropdown
                        value={gender}
                        placeholder="Pilih jenis kelamin"
                        onChange={(val) => setGender(val)}
                        options={[
                          { value: '', label: 'Pilih jenis kelamin' },
                          { value: 'Laki-laki', label: 'Laki-laki' },
                          { value: 'Perempuan', label: 'Perempuan' },
                          { value: 'Lainnya', label: 'Lainnya' }
                        ]}
                      />
                    </div>

                    {/* Bio / About */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">Tentang Saya / Bio Singkat</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        maxLength={500}
                        className="block w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] resize-none"
                        placeholder="Tuliskan biografi akademis singkat Anda..."
                      />
                      <div className="flex justify-end">
                        <span className="text-[9px] text-[#8A8A8A] font-mono">{bio.length} / 500 karakter</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Footer Action */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleCancelChanges}
                      disabled={!hasUnsavedChanges || isSaving}
                      className="h-[40px] px-5 bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs font-bold uppercase rounded-[2px] cursor-pointer transition-all disabled:opacity-40"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!hasUnsavedChanges || isSaving}
                      className="h-[40px] px-6 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold uppercase rounded-[2px] disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                    >
                      {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: SECURITY (PASSWORD CHANGE) */}
              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Keamanan & Sandi Akses</h2>
                    <p className="text-[11px] text-[#C6D4DF] mt-0.5">Amankan akses sistem dengan memperbarui kata sandi secara periodik.</p>
                  </div>

                  {passwordError && (
                    <div className="p-4 bg-[#FF4B4B]/20 border border-[#FF4B4B]/40 rounded-[2px] text-xs text-[#FF4B4B] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#FF4B4B]" />
                      <p className="font-bold">{passwordError}</p>
                    </div>
                  )}

                  <div className="space-y-4 max-w-lg">
                    {/* Current Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">Kata Sandi Saat Ini <span className="text-[#FF4B4B]">*</span></label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                          placeholder="Masukkan kata sandi lama"
                        />
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8A8A8A]" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-2.5 text-[#8A8A8A] hover:text-white p-1 rounded-md"
                        >
                          {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">Kata Sandi Baru <span className="text-[#FF4B4B]">*</span></label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                          placeholder="Minimal 8 karakter"
                        />
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8A8A8A]" />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-[#8A8A8A] hover:text-white p-1 rounded-md"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">Konfirmasi Kata Sandi Baru <span className="text-[#FF4B4B]">*</span></label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                          placeholder="Masukkan ulang kata sandi baru"
                        />
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8A8A8A]" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-[#8A8A8A] hover:text-white p-1 rounded-md"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="submit"
                      disabled={isUpdatingPassword || !newPassword || !currentPassword}
                      className="h-[40px] px-6 bg-[#66C0F4] hover:bg-[#5DADE2] disabled:opacity-40 text-[#171A21] text-xs font-bold uppercase rounded-[2px] shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      {isUpdatingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Ubah Kata Sandi
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: PREFERENCES */}
              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Preferensi Aplikasi</h2>
                    <p className="text-[11px] text-[#C6D4DF] mt-0.5">Atur bahasa tampilan, preferensi visual, dan notifikasi aktivitas kelas digital.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Column 1: Localization & Appearance */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Globe className="w-4 h-4 text-[#66C0F4]" />
                        <h3 className="text-xs font-bold text-white">Tampilan & Regional</h3>
                      </div>

                      {/* Language */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">Bahasa Tampilan (Localization)</label>
                        <CustomDropdown
                          value={language}
                          onChange={(val) => setLanguage(val as any)}
                          options={[
                            { value: 'English', label: 'English' },
                            { value: 'Bahasa Indonesia', label: 'Bahasa Indonesia' }
                          ]}
                        />
                      </div>
                    </div>

                    {/* Column 2: Notification Toggle Panel */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Bell className="w-4 h-4 text-[#66C0F4]" />
                        <h3 className="text-xs font-bold text-white">Pemberitahuan & Notifikasi</h3>
                      </div>

                      <div className="space-y-4">
                        {/* Email Notification */}
                        <div className="flex items-start justify-between gap-4 p-3 bg-black/40 rounded-[2px] border border-white/10">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white block">Notifikasi Email</span>
                            <span className="text-[10px] text-[#C6D4DF] block leading-relaxed">Terima laporan dan pengumuman kelas via email terdaftar.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEmailNotification(!emailNotification)}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                              emailNotification ? 'bg-[#A1CD44]' : 'bg-black/60 border border-white/10'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-[#171A21] transition-transform duration-200 ${
                              emailNotification ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save preference button */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={!hasUnsavedChanges || isSaving}
                      className="h-[40px] px-6 bg-[#A1CD44] hover:bg-[#86AE33] disabled:opacity-40 text-[#171A21] font-bold text-xs uppercase rounded-[2px] shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Simpan Preferensi
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: ACCOUNT DETAIL (READ-ONLY) */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Informasi Status Akun</h2>
                    <p className="text-[11px] text-[#C6D4DF] mt-0.5">Detail pendaftaran akademis, peran pengguna, dan metadata keamanan login.</p>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-[3px] p-5 space-y-4 text-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      
                      <div className="p-4 bg-[#171A21] border border-white/10 rounded-[2px] space-y-1">
                        <span className="text-[10px] text-[#8A8A8A] font-bold uppercase tracking-wider block">Peran Sistem (Account Role)</span>
                        <span className="text-xs font-bold text-white block flex items-center gap-1.5 mt-1">
                          <UserCheck className={`w-4 h-4 ${isTeacher ? 'text-[#66C0F4]' : 'text-[#A1CD44]'}`} />
                          {isTeacher ? 'Teacher / Pengajar Utama' : 'Student / Siswa Terdaftar'}
                        </span>
                      </div>

                      <div className="p-4 bg-[#171A21] border border-white/10 rounded-[2px] space-y-1">
                        <span className="text-[10px] text-[#8A8A8A] font-bold uppercase tracking-wider block">Tanggal Registrasi (Member Since)</span>
                        <span className="text-xs font-bold text-white block flex items-center gap-1.5 mt-1">
                          <Clock className="w-4 h-4 text-[#8A8A8A]" />
                          {currentUserProfile?.createdAt?.seconds 
                            ? new Date(currentUserProfile.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})
                            : auth.currentUser?.metadata.creationTime 
                              ? new Date(auth.currentUser.metadata.creationTime).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})
                              : 'Baru saja'
                          }
                        </span>
                      </div>

                      <div className="p-4 bg-[#171A21] border border-white/10 rounded-[2px] space-y-1 sm:col-span-2">
                        <span className="text-[10px] text-[#8A8A8A] font-bold uppercase tracking-wider block">Aktivitas Login Terakhir (Last Logged In)</span>
                        <span className="text-xs font-mono font-bold text-[#C6D4DF] block flex items-center gap-1.5 mt-1">
                          <Clock className="w-4 h-4 text-[#66C0F4]" />
                          {auth.currentUser?.metadata.lastSignInTime 
                            ? new Date(auth.currentUser.metadata.lastSignInTime).toLocaleString('id-ID', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'})
                            : 'Sekarang'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#66C0F4]/10 border border-[#66C0F4]/30 rounded-[3px] flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#66C0F4] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white uppercase">Edisi Kavio Enterprise</p>
                      <p className="text-[10px] text-[#C6D4DF] leading-relaxed mt-0.5">
                        Akun Anda dilindungi oleh enkripsi modern Kavio Edu. Data profil Anda disimpan secara aman dan real-time di server Cloud Firestore Enterprise.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dev' && currentUserProfile?.email === 'fatih@kavio.tec.edu' && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">DEVELOPER & ADMINISTRATOR TOOLS</h2>
                    <p className="text-[10px] text-[#C6D4DF] mt-0.5">Seluruh alat pengembang, pemeliharaan sistem, feature flags, dan inspektor database telah dipusatkan pada DEV TOOLS CENTER.</p>
                  </div>

                  {/* Dev Redirection Banner */}
                  <div className="bg-[#171A21] text-white p-6 sm:p-8 rounded-[3px] space-y-6 shadow-md border border-white/10 font-sans">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#66C0F4] text-[#171A21] font-bold text-[10px] px-3 py-1 rounded-[2px] uppercase tracking-wider">
                        STEAM DESIGN SYSTEM
                      </span>
                      <span className="bg-black/40 text-[#C6D4DF] font-bold text-[10px] px-3 py-1 rounded-[2px] uppercase border border-white/10">
                        PENGALIHAN TERPUSAT
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                        DEV TOOLS CENTER TELAH SIAP
                      </h3>
                      <p className="text-xs text-[#C6D4DF] leading-relaxed max-w-xl">
                        Untuk pengalaman pengelolaan yang lebih cepat, aman, dan terorganisir, seluruh fitur developer (User Bypass, Feature Flags, Maintenance Mode, Package Registrations, dan Terminal Logs) telah dipindahkan ke <strong className="text-white">DEV TOOLS CENTER</strong> pada Sidebar utama.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate?.('/teacher');
                        }}
                        className="px-6 py-3 bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] text-xs font-bold uppercase rounded-[2px] transition-all cursor-pointer inline-flex items-center gap-2 shadow-md"
                      >
                        <Terminal className="w-4 h-4" />
                        <span>Buka DEV TOOLS CENTER di Sidebar</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
