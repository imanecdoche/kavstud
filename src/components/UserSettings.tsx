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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col font-sans" id="user-settings-page">
      {/* Toast Alert Banner */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-lg border text-xs font-semibold flex items-center gap-3 animate-slideIn ${
            toast.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
          id="toast-notification"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700/50 px-4 py-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="btn-duo-slate p-2.5 flex items-center justify-center cursor-pointer"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-slate-200" />
            </button>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Konfigurasi Pengguna</span>
              <h1 className="text-lg sm:text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight mt-1">
                Pengaturan Akun & Profil
              </h1>
            </div>
          </div>

          <div className="hidden sm:block">
            <Logo className="h-6 w-auto text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Sidebar navigation tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          
          {/* User Profile Summary Card */}
          <div className="card-duo p-6 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative group">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-100 dark:border-indigo-800/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-base overflow-hidden shrink-0 shadow-3xs">
                  {photoURL ? (
                    <img src={photoURL} alt={fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    fullName?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate">{fullName || 'Memuat...'}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-md text-[9px] font-bold uppercase border ${
                  isTeacher 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 border-indigo-100 dark:border-indigo-800/50' 
                    : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-100 dark:border-emerald-800/50'
                }`}>
                  {isTeacher ? 'Pengajar' : 'Siswa'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-3">
              <p className="text-[10px] text-gray-400 font-mono truncate">{currentUserProfile?.email}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="card-duo p-3 flex flex-row md:flex-col gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-3 transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#1CB0F6] text-white border-b-4 border-[#0092E0] shadow-xs'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-slate-700'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profil Saya</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-3 transition-all ${
                activeTab === 'security'
                  ? 'bg-[#1CB0F6] text-white border-b-4 border-[#0092E0] shadow-xs'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-slate-700'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Keamanan</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-3 transition-all ${
                activeTab === 'preferences'
                  ? 'bg-[#1CB0F6] text-white border-b-4 border-[#0092E0] shadow-xs'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Preferensi</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-3 transition-all ${
                activeTab === 'account'
                  ? 'bg-[#1CB0F6] text-white border-b-4 border-[#0092E0] shadow-xs'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-slate-700'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>Status Akun</span>
            </button>

            {currentUserProfile?.email === 'fatih@kavio.tec.edu' && (
              <button
                type="button"
                onClick={() => setActiveTab('dev')}
                className={`flex-1 md:flex-initial text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-3 transition-all ${
                  activeTab === 'dev'
                    ? 'bg-[#E53E3E] text-white border-b-4 border-[#C53030] shadow-xs'
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50 border border-dashed border-red-200'
                }`}
              >
                <Terminal className="w-4 h-4 shrink-0" />
                <span>Dev Tools 🛠️</span>
              </button>
            )}
          </div>

          {/* Unsaved Warning Banner */}
          {hasUnsavedChanges && (
            <div className="bg-amber-50 dark:bg-amber-900/30/80 border border-amber-200 p-4 rounded-3xl space-y-3">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-100">Perubahan Belum Disimpan</p>
                  <p className="text-[10px] text-amber-700/90 leading-relaxed mt-0.5">
                    Anda memodifikasi beberapa informasi profil. Simpan perubahan sebelum meninggalkan halaman.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Simpan
                </button>
                <button
                  onClick={handleCancelChanges}
                  className="flex-1 py-1.5 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 rounded-xl text-[10px] font-bold active:scale-95 transition-all cursor-pointer"
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
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-3xs animate-pulse">
              <div className="h-6 w-48 bg-gray-200 dark:bg-slate-600 rounded-lg" />
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 dark:bg-slate-600 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded-lg w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-lg w-1/4" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 dark:bg-slate-600 rounded-xl" />
                <div className="h-10 bg-gray-200 dark:bg-slate-600 rounded-xl" />
                <div className="h-10 bg-gray-200 dark:bg-slate-600 rounded-xl" />
                <div className="h-10 bg-gray-200 dark:bg-slate-600 rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="card-duo p-6 sm:p-8 space-y-6">
              
              {/* TAB 1: PROFILE FORM */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Profil Publik Saya</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">Kelola foto identitas, nomor kontak, serta deskripsi biografi akademis.</p>
                  </div>

                  {/* Profile Photo Uploader */}
                  <div className="p-5 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 border-b-4 border-gray-300 dark:border-slate-600 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                    <div className="relative">
                      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-100 dark:border-indigo-800/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl overflow-hidden shadow-xs">
                        {photoURL ? (
                          <img src={photoURL} alt="Avatar Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          fullName?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1.5 -right-1.5 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg border-2 border-white shadow-xs cursor-pointer transition-transform hover:scale-110 active:scale-95"
                        style={{ minWidth: '28px', minHeight: '28px' }}
                        aria-label="Ubah Foto"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <p className="text-xs font-bold text-gray-800 dark:text-slate-100">Foto Identitas Akun</p>
                      <p className="text-[10px] text-gray-400 leading-relaxed max-w-sm">
                        Mendukung file format JPG, PNG, atau WEBP. Maksimal ukuran 5 MB.
                      </p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-duo-blue px-4 py-2 text-xs font-black"
                        >
                          Pilih Foto Baru
                        </button>
                        
                        {photoURL && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="btn-duo-red px-4 py-2 text-xs font-black flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Lepas Foto</span>
                          </button>
                        )}
                      </div>

                      {uploadProgress !== null && (
                        <div className="space-y-1.5 max-w-xs pt-1 mx-auto sm:mx-0">
                          <div className="flex justify-between items-center text-[10px] font-bold text-indigo-500">
                            <span>Mengunggah file...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        </div>
                      )}

                      {uploadError && (
                        <p className="text-[10px] font-semibold text-rose-600 flex items-center justify-center sm:justify-start gap-1">
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
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Nama Lengkap <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="Nama lengkap Anda"
                      />
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400">Alamat Email (Akun Utama)</label>
                      <div className="relative">
                        <input
                          type="email"
                          readOnly
                          value={currentUserProfile?.email || ''}
                          className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-400 rounded-xl text-xs cursor-not-allowed"
                        />
                        <Mail className="absolute right-3.5 top-3 w-4 h-4 text-gray-300" />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1">Guna mengganti alamat email silakan hubungi administrator Kavio Edu.</p>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Nomor Telepon</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="+628123456789"
                        />
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1">Gunakan format angka internasional (misal +628123456789).</p>
                    </div>

                    {/* Date of Birth & Age Block */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Tanggal Lahir</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <CustomDatePicker
                            value={dateOfBirth}
                            onChange={(val) => setDateOfBirth(val)}
                            placeholder="Pilih Tanggal Lahir"
                          />
                        </div>
                        <div className="col-span-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-center flex flex-col justify-center min-w-0">
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Umur</span>
                          <span className="text-xs font-bold text-gray-800 dark:text-slate-100 block truncate">
                            {calculatedAge !== null ? `${calculatedAge} Thn` : '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Jenis Kelamin</label>
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
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Tentang Saya / Bio Singkat</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        maxLength={500}
                        className="block w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                        placeholder="Tuliskan biografi akademis singkat Anda..."
                      />
                      <div className="flex justify-end">
                        <span className="text-[9px] text-gray-400 font-mono">{bio.length} / 500 karakter</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Footer Action */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700/50">
                    <button
                      type="button"
                      onClick={handleCancelChanges}
                      disabled={!hasUnsavedChanges || isSaving}
                      className="btn-duo-slate px-5 py-3 text-xs font-black disabled:opacity-40"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!hasUnsavedChanges || isSaving}
                      className="btn-duo-green px-6 py-3 text-xs font-black disabled:opacity-40 flex items-center justify-center gap-1.5"
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
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Keamanan & Sandi Akses</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">Amankan akses sistem dengan memperbarui kata sandi secara periodik.</p>
                  </div>

                  {passwordError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <p className="font-semibold">{passwordError}</p>
                    </div>
                  )}

                  <div className="space-y-4 max-w-lg">
                    {/* Current Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Kata Sandi Saat Ini <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Masukkan kata sandi lama"
                        />
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:text-slate-300 p-1 rounded-md"
                        >
                          {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Kata Sandi Baru <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Minimal 8 karakter"
                        />
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:text-slate-300 p-1 rounded-md"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {newPassword && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-semibold text-gray-500 dark:text-slate-400">Kekuatan Sandi:</span>
                            <span className="font-bold text-gray-700 dark:text-slate-200">{passwordStrength.text}</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden flex gap-0.5">
                            <div className={`h-full flex-1 transition-all ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-gray-100 dark:bg-slate-700'}`} />
                            <div className={`h-full flex-1 transition-all ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-gray-100 dark:bg-slate-700'}`} />
                            <div className={`h-full flex-1 transition-all ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-gray-100 dark:bg-slate-700'}`} />
                            <div className={`h-full flex-1 transition-all ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-gray-100 dark:bg-slate-700'}`} />
                            <div className={`h-full flex-1 transition-all ${passwordStrength.score >= 5 ? passwordStrength.color : 'bg-gray-100 dark:bg-slate-700'}`} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder="Masukkan ulang kata sandi baru"
                        />
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:text-slate-300 p-1 rounded-md"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                    <button
                      type="submit"
                      disabled={isUpdatingPassword || !newPassword || !currentPassword}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    >
                      {isUpdatingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Ubah Kata Sandi
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: PREFERENCES (LANGUAGE, THEME, NOTIFICATIONS) */}
              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Preferensi Aplikasi</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">Atur bahasa tampilan, preferensi visual, dan notifikasi aktivitas kelas digital.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    
                    {/* Column 1: Localization & Appearance */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-xs font-bold text-gray-800 dark:text-slate-100">Tampilan & Regional</h3>
                      </div>

                      {/* Language */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Bahasa Tampilan (Localization)</label>
                        <CustomDropdown
                          value={language}
                          onChange={(val) => setLanguage(val as any)}
                          options={[
                            { value: 'English', label: 'English' },
                            { value: 'Bahasa Indonesia', label: 'Bahasa Indonesia' }
                          ]}
                        />
                        <p className="text-[9px] text-gray-400 mt-1">Bahasa pengantar sistem yang diutamakan oleh Anda.</p>
                      </div>

                      {/* Theme selection placeholder */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Tema Visual (Theme Color)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Light', 'Dark', 'System'] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setTheme(t)}
                              className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                theme === t
                                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200'
                                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900'
                              }`}
                            >
                              {t === 'Light' && 'Terang'}
                              {t === 'Dark' && 'Gelap'}
                              {t === 'System' && 'Sistem'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Notification Toggle Panel */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                        <Bell className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-xs font-bold text-gray-800 dark:text-slate-100">Pemberitahuan & Notifikasi</h3>
                      </div>

                      <div className="space-y-4">
                        {/* PWA Push Notification */}
                        <div className="flex items-start justify-between gap-4 p-3 bg-indigo-50 dark:bg-indigo-900/30/50 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-gray-800 dark:text-slate-100 block">Push Notification (FCM)</span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400 block leading-relaxed">
                              Terima notifikasi di latar belakang meskipun browser ditutup.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (notificationPermissionStatus !== 'granted') {
                                requestPermission();
                              }
                            }}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                              notificationPermissionStatus === 'granted' ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-600'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-800 transition-transform duration-200 ${
                              notificationPermissionStatus === 'granted' ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* Email Notification */}
                        <div className="flex items-start justify-between gap-4 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-gray-800 dark:text-slate-100 block">Notifikasi Email</span>
                            <span className="text-[10px] text-gray-400 block leading-relaxed">Terima laporan dan pengumuman kelas via email terdaftar.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEmailNotification(!emailNotification)}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                              emailNotification ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-600'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-800 transition-transform duration-200 ${
                              emailNotification ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* Assignment Notification */}
                        <div className="flex items-start justify-between gap-4 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-gray-800 dark:text-slate-100 block">Notifikasi Tugas Baru</span>
                            <span className="text-[10px] text-gray-400 block leading-relaxed">
                              {isTeacher 
                                ? 'Terima notifikasi instan saat siswa mengumpulkan esai tugas.' 
                                : 'Terima notifikasi instan saat guru merilis esai tugas baru.'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAssignmentNotification(!assignmentNotification)}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                              assignmentNotification ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-600'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-800 transition-transform duration-200 ${
                              assignmentNotification ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* Score Notification */}
                        <div className="flex items-start justify-between gap-4 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-gray-800 dark:text-slate-100 block">Notifikasi Hasil Penilaian</span>
                            <span className="text-[10px] text-gray-400 block leading-relaxed">
                              {isTeacher 
                                ? 'Terima pengingat untuk tugas esai siswa yang belum dinilai.' 
                                : 'Terima pemberitahuan instan saat guru selesai menilai esai Anda.'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setScoreNotification(!scoreNotification)}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                              scoreNotification ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-600'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-800 transition-transform duration-200 ${
                              scoreNotification ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save preference button */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={!hasUnsavedChanges || isSaving}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
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
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Informasi Status Akun</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">Detail pendaftaran akademis, peran pengguna, dan metadata keamanan login.</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700/50 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      
                      <div className="p-4 bg-white dark:bg-slate-800 border border-gray-50 rounded-xl space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Peran Sistem (Account Role)</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white block flex items-center gap-1.5 mt-1">
                          <UserCheck className={`w-4 h-4 ${isTeacher ? 'text-indigo-500' : 'text-emerald-500'}`} />
                          {isTeacher ? 'Teacher / Pengajar Utama' : 'Student / Siswa Terdaftar'}
                        </span>
                      </div>

                      <div className="p-4 bg-white dark:bg-slate-800 border border-gray-50 rounded-xl space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tanggal Registrasi (Member Since)</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white block flex items-center gap-1.5 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {currentUserProfile?.createdAt?.seconds 
                            ? new Date(currentUserProfile.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})
                            : auth.currentUser?.metadata.creationTime 
                              ? new Date(auth.currentUser.metadata.creationTime).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})
                              : 'Baru saja'
                          }
                        </span>
                      </div>

                      <div className="p-4 bg-white dark:bg-slate-800 border border-gray-50 rounded-xl space-y-1 sm:col-span-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Aktivitas Login Terakhir (Last Logged In)</span>
                        <span className="text-xs font-mono font-bold text-gray-700 dark:text-slate-200 block flex items-center gap-1.5 mt-1">
                          <Clock className="w-4 h-4 text-indigo-500" />
                          {auth.currentUser?.metadata.lastSignInTime 
                            ? new Date(auth.currentUser.metadata.lastSignInTime).toLocaleString('id-ID', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'})
                            : 'Sekarang'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-indigo-900 dark:text-indigo-100">Edisi Kavio Enterprise</p>
                      <p className="text-[10px] text-indigo-700/90 leading-relaxed mt-0.5">
                        Akun Anda dilindungi oleh enkripsi modern Kavio Edu. Data profil Anda disimpan secara aman dan real-time di server Cloud Firestore Enterprise.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dev' && currentUserProfile?.email === 'fatih@kavio.tec.edu' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50 pb-3">
                    <div>
                      <h2 className="text-sm font-black text-red-650 uppercase tracking-wider">DEVELOPER & ADMINISTRATOR TOOLS</h2>
                      <p className="text-[10px] text-gray-400 mt-0.5">Akses bypass tingkat sistem untuk manajemen pengguna dan konfigurasi global.</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('account');
                        setTimeout(() => setActiveTab('dev'), 100);
                      }}
                      className="p-2 text-gray-500 dark:text-slate-400 hover:text-indigo-650 hover:bg-gray-100 dark:bg-slate-700 rounded-xl transition-all cursor-pointer"
                      title="Segarkan Data"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dev Settings Blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Maintenance Mode */}
                    <div className="p-5 bg-red-50/30 border border-red-100 rounded-2xl space-y-3">
                      <div className="flex gap-2.5">
                        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                        <div>
                          <h4 className="text-xs font-black text-red-950 uppercase tracking-wide">Mode Pemeliharaan (Maintenance)</h4>
                          <p className="text-[10px] text-red-700/90 leading-relaxed mt-0.5">
                            Aktifkan ini untuk memblokir siswa masuk ke dashboard sementara sistem diperbarui.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] font-black uppercase text-gray-400">Status: {systemMaintenance ? 'AKTIF (BLOCKED)' : 'NONAKTIF'}</span>
                        <button
                          type="button"
                          onClick={handleToggleMaintenance}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black cursor-pointer shadow-xs transition-all ${
                            systemMaintenance
                              ? 'bg-red-600 hover:bg-red-700 text-white border-b-4 border-red-800'
                              : 'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-200 border border-gray-250'
                          }`}
                        >
                          {systemMaintenance ? 'Matikan Mode' : 'Aktifkan Mode'}
                        </button>
                      </div>
                    </div>

                    {/* Stats summary */}
                    <div className="p-5 bg-gray-50 dark:bg-slate-900 border border-gray-150 rounded-2xl flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide">Informasi DB Kavio</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Data terdaftar di cloud database saat ini.</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center pt-2">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700/50">
                          <span className="block text-base font-black text-indigo-650">{devUsers.length}</span>
                          <span className="block text-[8px] font-bold text-gray-400 uppercase">Pengguna</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700/50">
                          <span className="block text-base font-black text-amber-600 dark:text-amber-400">{devUsers.filter(u => u.role === 'teacher').length}</span>
                          <span className="block text-[8px] font-bold text-gray-400 uppercase">Guru</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700/50">
                          <span className="block text-base font-black text-emerald-600 dark:text-emerald-400">{devUsers.filter(u => u.role === 'student').length}</span>
                          <span className="block text-[8px] font-bold text-gray-400 uppercase">Siswa</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Users Management list */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Kelola Seluruh Pengguna ({devUsers.length})</h3>

                    {devLoading ? (
                      <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" /></div>
                    ) : (
                      <div className="space-y-3">
                        {devUsers.map((u) => {
                          const isTargetEditing = editingDevUser?.uid === u.uid;

                          return (
                            <div key={u.uid} className="p-5 bg-white dark:bg-slate-800 border border-gray-150 rounded-2xl space-y-4 hover:border-gray-300 dark:border-slate-600 transition-colors shadow-3xs">
                              {/* Header info */}
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-gray-900 dark:text-white">{u.fullName}</span>
                                    <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-black uppercase border ${
                                      u.role === 'teacher' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 border-indigo-200' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200'
                                    }`}>
                                      {u.role}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 font-mono">{u.email}</p>
                                  {u.phone && <p className="text-[9px] text-gray-500 dark:text-slate-400 font-medium">Tlp: {u.phone}</p>}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isTargetEditing) {
                                        setEditingDevUser(null);
                                      } else {
                                        setEditingDevUser(u);
                                        setDevNewEmail(u.email || '');
                                        setDevEditFullName(u.fullName || '');
                                        setDevEditPhone(u.phone || '');
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-xl text-[10px] font-bold border border-gray-250 cursor-pointer"
                                  >
                                    {isTargetEditing ? 'Batal' : 'Edit / Bypass'}
                                  </button>
                                  
                                  {u.email !== 'fatih@fatihfarhat.com' && u.email !== 'fatih@kavio.tec.edu' && (
                                    <button
                                      type="button"
                                      onClick={() => handleDevDeleteUser(u)}
                                      className="p-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl cursor-pointer transition-colors"
                                      title="Hapus Permanen"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Action Options (If Editing) */}
                              {isTargetEditing && (
                                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl space-y-4 border border-gray-200 dark:border-slate-700 text-xs text-gray-800 dark:text-slate-100 animate-fadeIn">
                                  {/* Bypass Password resetting */}
                                  <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-700 pb-3">
                                    <div>
                                      <h5 className="font-black text-gray-900 dark:text-white uppercase text-[9px] tracking-wider">Autentikasi & Sandi</h5>
                                      <p className="text-[9px] text-gray-500 dark:text-slate-400 mt-0.5">Kirim email reset bypass instan ke kotak masuk siswa.</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDevResetPassword(u)}
                                      className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-250 text-indigo-750 text-[10px] font-black rounded-lg transition-colors cursor-pointer shadow-3xs"
                                    >
                                      Kirim Reset Password
                                    </button>
                                  </div>

                                  {/* Change Email Form */}
                                  <div className="space-y-2 border-b border-gray-200 dark:border-slate-700 pb-3">
                                    <h5 className="font-black text-gray-900 dark:text-white uppercase text-[9px] tracking-wider">Ubah Email Database</h5>
                                    <div className="flex gap-2">
                                      <input
                                        type="email"
                                        value={devNewEmail}
                                        onChange={(e) => setDevNewEmail(e.target.value)}
                                        placeholder="Email baru"
                                        className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-250 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleDevUpdateEmail(u)}
                                        className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg font-bold cursor-pointer"
                                      >
                                        Update Email
                                      </button>
                                    </div>
                                  </div>

                                  {/* Change Profile Details Form */}
                                  <div className="space-y-2">
                                    <h5 className="font-black text-gray-900 dark:text-white uppercase text-[9px] tracking-wider">Ubah Profil (Nama & Telepon)</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div className="space-y-1">
                                        <label className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">Nama Lengkap</label>
                                        <input
                                          type="text"
                                          value={devEditFullName}
                                          onChange={(e) => setDevEditFullName(e.target.value)}
                                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-250 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[8px] uppercase tracking-wider text-gray-400 font-bold">No. Telepon</label>
                                        <input
                                          type="text"
                                          value={devEditPhone}
                                          onChange={(e) => setDevEditPhone(e.target.value)}
                                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-250 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDevUpdateProfile(u)}
                                      className="px-4 py-2 mt-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg font-bold cursor-pointer inline-flex items-center"
                                    >
                                      Simpan Profil
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
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
