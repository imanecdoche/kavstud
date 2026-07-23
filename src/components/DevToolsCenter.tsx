import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { 
  Terminal, 
  Wrench, 
  Users, 
  Sliders, 
  FileSpreadsheet, 
  Database, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  Search, 
  Trash2, 
  Edit3, 
  Mail, 
  Phone, 
  Activity, 
  Cpu, 
  Clock, 
  Lock, 
  Server, 
  Zap, 
  RefreshCw, 
  Download, 
  Check, 
  X, 
  ChevronDown, 
  Layers, 
  Globe,
  BookOpen,
  NotebookText,
  CircleDot,
  Package,
  Newspaper,
  Inbox,
  Filter,
  UserCheck,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, PackageRegistration } from '../types';
import { FeatureFlag, DEFAULT_FEATURE_FLAGS, getLocalFeatureFlags, saveLocalFeatureFlags } from '../utils/featureFlags';

interface DevToolsCenterProps {
  userProfile?: UserProfile | null;
  onNavigate?: (path: string) => void;
  onSetLoading?: (loading: boolean) => void;
}

type DevSubTab = 'overview' | 'users' | 'flags' | 'registrations' | 'logs' | 'seed';

export default function DevToolsCenter({ userProfile, onNavigate, onSetLoading }: DevToolsCenterProps) {
  const [activeSubTab, setActiveSubTab] = useState<DevSubTab>('overview');

  // --- 1. USER MANAGEMENT STATES ---
  const [devUsers, setDevUsers] = useState<UserProfile[]>([]);
  const [devUsersLoading, setDevUsersLoading] = useState(true);
  const [editingDevUser, setEditingDevUser] = useState<UserProfile | null>(null);
  const [devUserSearch, setDevUserSearch] = useState('');
  const [devRoleFilter, setDevRoleFilter] = useState<'all' | 'teacher' | 'student'>('all');
  const [devNewEmail, setDevNewEmail] = useState('');
  const [devEditFullName, setDevEditFullName] = useState('');
  const [devEditPhone, setDevEditPhone] = useState('');

  // --- 2. FEATURE FLAGS STATES ---
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(() => getLocalFeatureFlags());
  const [flagSavedToast, setFlagSavedToast] = useState(false);

  // --- 3. PACKAGE REGISTRATIONS STATES ---
  const [registrations, setRegistrations] = useState<PackageRegistration[]>([]);
  const [regLoading, setRegLoading] = useState(true);
  const [regViewMode, setRegViewMode] = useState<'card' | 'table'>('table');
  const [regStatusFilter, setRegStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [regSearchQuery, setRegSearchQuery] = useState('');
  const [selectedReg, setSelectedReg] = useState<PackageRegistration | null>(null);
  const [assignedScheduleInput, setAssignedScheduleInput] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // --- 4. LOGS & STORAGE INSPECTOR STATES ---
  const [storageItems, setStorageItems] = useState<{ key: string; value: string }[]>([]);
  const [logs, setLogs] = useState<{ time: string; text: string; type: 'info' | 'warn' | 'error' }[]>([]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- REAL-TIME LISTENERS ---
  // Fetch users from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach(doc => {
        users.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setDevUsers(users);
      setDevUsersLoading(false);
    }, (err) => {
      console.error('Error fetching dev users:', err);
      setDevUsersLoading(false);
    });

    return () => unsub();
  }, []);

  // Fetch package registrations
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'packageRegistrations'), (snapshot) => {
      const list: PackageRegistration[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as PackageRegistration);
      });
      
      // Combine with local storage items
      let localItems: PackageRegistration[] = [];
      try {
        const saved = localStorage.getItem('kavio_local_registrations');
        if (saved) localItems = JSON.parse(saved);
      } catch {}

      const combined = new Map<string, PackageRegistration>();
      localItems.forEach(item => { if (item.id) combined.set(item.id, item); });
      list.forEach(item => { if (item.id) combined.set(item.id, item); });

      const sorted = Array.from(combined.values()).sort((a, b) => {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA;
      });

      setRegistrations(sorted);
      setRegLoading(false);
    });

    return () => unsub();
  }, []);

  // Sync feature flags listener
  useEffect(() => {
    const handleFlagsUpdate = () => setFeatureFlags(getLocalFeatureFlags());
    window.addEventListener('kavio_feature_flags_updated', handleFlagsUpdate);
    return () => window.removeEventListener('kavio_feature_flags_updated', handleFlagsUpdate);
  }, []);

  // Refresh LocalStorage Inspector
  const refreshStorageInspector = () => {
    const items: { key: string; value: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        items.push({ key, value: localStorage.getItem(key) || '' });
      }
    }
    setStorageItems(items);
  };

  useEffect(() => {
    refreshStorageInspector();
    // Log init event
    setLogs([
      { time: new Date().toLocaleTimeString(), text: 'Dev Tools Console initialized successfully.', type: 'info' },
      { time: new Date().toLocaleTimeString(), text: 'Connected to Firebase Firestore real-time listener.', type: 'info' }
    ]);
  }, []);

  // --- HANDLERS FOR USER MANAGEMENT ---
  const handleDevResetPassword = async (targetUser: UserProfile) => {
    if (!targetUser.email) return;
    try {
      await sendPasswordResetEmail(auth, targetUser.email);
      showToast(`Email reset kata sandi berhasil dikirim ke ${targetUser.email}`);
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal mengirim reset password: ${err.message}`, 'error');
    }
  };

  const handleDevUpdateEmail = async (targetUser: UserProfile) => {
    if (!devNewEmail.trim() || !targetUser.uid) return;
    try {
      await updateDoc(doc(db, 'users', targetUser.uid), {
        email: devNewEmail.trim()
      });
      showToast(`Email pengguna berhasil diperbarui menjadi ${devNewEmail.trim()}`);
      setEditingDevUser(null);
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal mengupdate email: ${err.message}`, 'error');
    }
  };

  const handleDevUpdateProfile = async (targetUser: UserProfile) => {
    if (!targetUser.uid) return;
    try {
      await updateDoc(doc(db, 'users', targetUser.uid), {
        fullName: devEditFullName.trim(),
        phone: devEditPhone.trim()
      });
      showToast(`Profil pengguna ${devEditFullName.trim()} berhasil disimpan.`);
      setEditingDevUser(null);
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal mengupdate profil: ${err.message}`, 'error');
    }
  };

  const handleDevDeleteUser = async (targetUser: UserProfile) => {
    if (!targetUser.uid) return;
    if (!window.confirm(`HAPUS PERMANEN: Apakah Anda yakin ingin menghapus akun ${targetUser.fullName} (${targetUser.email}) dari database?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', targetUser.uid));
      showToast(`Akun ${targetUser.fullName} telah dihapus permanen.`);
    } catch (err: any) {
      console.error(err);
      showToast(`Gagal menghapus pengguna: ${err.message}`, 'error');
    }
  };

  // --- HANDLERS FOR FEATURE FLAGS ---
  const handleToggleFlag = (id: string) => {
    const next = featureFlags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f);
    setFeatureFlags(next);
    saveLocalFeatureFlags(next);
    setFlagSavedToast(true);
    setTimeout(() => setFlagSavedToast(false), 2000);
  };

  const handleMessageChange = (id: string, msg: string) => {
    const next = featureFlags.map(f => f.id === id ? { ...f, maintenanceMessage: msg } : f);
    setFeatureFlags(next);
    saveLocalFeatureFlags(next);
  };

  const handleResetFlags = () => {
    if (window.confirm('Reset seluruh feature flag ke kondisi aktif default?')) {
      setFeatureFlags(DEFAULT_FEATURE_FLAGS);
      saveLocalFeatureFlags(DEFAULT_FEATURE_FLAGS);
      showToast('Seluruh Feature Flags berhasil di-reset ke default.');
    }
  };

  // --- HANDLERS FOR REGISTRATIONS ---
  const handleUpdateRegStatus = async (regId: string, status: 'approved' | 'rejected', schedule?: string) => {
    try {
      const regRef = doc(db, 'packageRegistrations', regId);
      const updateData: any = { status, updatedAt: serverTimestamp() };
      if (schedule) updateData.assignedSchedule = schedule;
      
      await updateDoc(regRef, updateData);

      // Update local storage if present
      try {
        const saved = localStorage.getItem('kavio_local_registrations');
        if (saved) {
          let items: PackageRegistration[] = JSON.parse(saved);
          items = items.map(item => item.id === regId ? { ...item, status, assignedSchedule: schedule || item.assignedSchedule } : item);
          localStorage.setItem('kavio_local_registrations', JSON.stringify(items));
        }
      } catch {}

      showToast(`Status pendaftaran berhasil diubah menjadi ${status.toUpperCase()}.`);
    } catch (err: any) {
      console.error('Error updating status:', err);
      showToast(`Gagal mengupdate status: ${err.message}`, 'error');
    }
  };

  // Filtered Users
  const filteredUsers = devUsers.filter(u => {
    const matchesRole = devRoleFilter === 'all' || u.role === devRoleFilter;
    const matchesSearch = 
      (u.fullName || '').toLowerCase().includes(devUserSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(devUserSearch.toLowerCase()) ||
      (u.phone || '').includes(devUserSearch);
    return matchesRole && matchesSearch;
  });

  // Filtered Registrations
  const filteredRegs = registrations.filter(reg => {
    const matchesStatus = regStatusFilter === 'all' || reg.status === regStatusFilter;
    const matchesSearch = 
      (reg.studentName || '').toLowerCase().includes(regSearchQuery.toLowerCase()) ||
      (reg.packageName || '').toLowerCase().includes(regSearchQuery.toLowerCase()) ||
      (reg.parentPhone || '').includes(regSearchQuery) ||
      (reg.id || '').includes(regSearchQuery);
    return matchesStatus && matchesSearch;
  });

  const SUB_TABS = [
    { id: 'overview' as const, label: 'Overview', icon: Activity },
    { id: 'users' as const, label: 'Users & Auth', icon: Users },
    { id: 'flags' as const, label: 'Feature Flags', icon: Sliders },
    { id: 'registrations' as const, label: 'Registrations', icon: FileSpreadsheet },
    { id: 'logs' as const, label: 'Storage & Logs', icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-[#171A21] text-white font-sans p-4 sm:p-8 space-y-8 w-full" id="dev-tools-workspace">
      
      {/* Toast Notification (Spotify Styled) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2.5 border ${
              toastMessage.type === 'error' 
                ? 'bg-[#E91429] text-white border-[#E91429]' 
                : 'bg-[#1DB954] text-black border-[#1ED760]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Spotify Hero Card */}
      <div className="bg-gradient-to-r from-[#181818] via-[#282828] to-[#121212] rounded-3xl p-6 sm:p-8 border border-[#282828] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1DB954]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#1DB954] text-black font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
              SPOTIFY DESIGN SYSTEM POWERED
            </span>
            <span className="bg-[#282828] text-[#B3B3B3] font-bold text-[10px] px-3 py-1 rounded-full uppercase border border-[#3E3E3E]">
              DEV TOOLS CENTER
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display">
            Developer Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-[#B3B3B3] max-w-xl font-medium leading-relaxed">
            Pusat kendali internal khusus pengembang <strong className="text-white">KAVIO EDU</strong>. Kelola pengguna, manipulasi bypass, feature flags, pendaftaran paket, dan log sistem secara terpusat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto shrink-0">
          <button
            onClick={handleResetFlags}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#282828] hover:bg-[#3E3E3E] text-white text-xs font-bold transition-all cursor-pointer border border-[#3E3E3E] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-[#1DB954]" />
            <span>Reset Flags</span>
          </button>
          
          <button
            onClick={() => onNavigate?.('/')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <Globe className="w-4 h-4" />
            <span>Ke App Utama</span>
          </button>
        </div>
      </div>

      {/* Spotify Sub-Navigation Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#282828]">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#1DB954] text-black shadow-lg' 
                  : 'bg-[#181818] text-[#B3B3B3] hover:text-white hover:bg-[#282828] border border-[#282828]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#181818] p-5 rounded-2xl border border-[#282828] space-y-2 hover:border-[#3E3E3E] transition-all">
              <div className="flex items-center justify-between text-[#B3B3B3]">
                <span className="text-xs font-bold uppercase tracking-wider">Total Pengguna</span>
                <Users className="w-5 h-5 text-[#1DB954]" />
              </div>
              <p className="text-3xl font-black text-white">{devUsers.length}</p>
              <p className="text-[11px] text-[#B3B3B3]">
                {devUsers.filter(u => u.role === 'teacher').length} Guru | {devUsers.filter(u => u.role === 'student').length} Siswa
              </p>
            </div>

            <div className="bg-[#181818] p-5 rounded-2xl border border-[#282828] space-y-2 hover:border-[#3E3E3E] transition-all">
              <div className="flex items-center justify-between text-[#B3B3B3]">
                <span className="text-xs font-bold uppercase tracking-wider">Feature Flags</span>
                <Sliders className="w-5 h-5 text-[#1DB954]" />
              </div>
              <p className="text-3xl font-black text-white">{featureFlags.filter(f => f.enabled).length} / {featureFlags.length}</p>
              <p className="text-[11px] text-[#B3B3B3]">Fitur Aktif Real-time</p>
            </div>

            <div className="bg-[#181818] p-5 rounded-2xl border border-[#282828] space-y-2 hover:border-[#3E3E3E] transition-all">
              <div className="flex items-center justify-between text-[#B3B3B3]">
                <span className="text-xs font-bold uppercase tracking-wider">Pendaftaran Paket</span>
                <FileSpreadsheet className="w-5 h-5 text-[#1DB954]" />
              </div>
              <p className="text-3xl font-black text-white">{registrations.length}</p>
              <p className="text-[11px] text-[#B3B3B3]">
                {registrations.filter(r => r.status === 'pending').length} Menunggu Persetujuan
              </p>
            </div>

            <div className="bg-[#181818] p-5 rounded-2xl border border-[#282828] space-y-2 hover:border-[#3E3E3E] transition-all">
              <div className="flex items-center justify-between text-[#B3B3B3]">
                <span className="text-xs font-bold uppercase tracking-wider">Status Maintenance</span>
                <Wrench className="w-5 h-5 text-[#FFA42B]" />
              </div>
              <p className="text-xl font-black text-white">
                {featureFlags.filter(f => !f.enabled).length > 0 ? 'Mode Aktif' : 'Normal'}
              </p>
              <p className="text-[11px] text-[#B3B3B3]">
                {featureFlags.filter(f => !f.enabled).length} Fitur Sedang Pemeliharaan
              </p>
            </div>
          </div>

          {/* System Environment Info Box */}
          <div className="bg-[#181818] p-6 sm:p-8 rounded-2xl border border-[#282828] space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#1DB954]" />
              <span>Informasi Lingkungan Sistem (System & Runtime Info)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#121212] rounded-xl border border-[#282828] space-y-2">
                <span className="text-[#B3B3B3] font-bold uppercase tracking-wider block">IDENTITAS APLIKASI</span>
                <p className="text-white"><strong>App Name:</strong> KAVIO EDU Platform</p>
                <p className="text-white"><strong>Version:</strong> 1.0 (Draft Production Ready)</p>
                <p className="text-white"><strong>Environment Mode:</strong> Development / Staging</p>
                <p className="text-white"><strong>Design System:</strong> Dual (Duolingo Main / Spotify Dev Tools)</p>
              </div>

              <div className="p-4 bg-[#121212] rounded-xl border border-[#282828] space-y-2">
                <span className="text-[#B3B3B3] font-bold uppercase tracking-wider block">LOKAL & BROWSER RUNTIME</span>
                <p className="text-white"><strong>Platform:</strong> {navigator.platform}</p>
                <p className="text-white"><strong>User Agent:</strong> {navigator.userAgent.slice(0, 50)}...</p>
                <p className="text-white"><strong>Screen Resolution:</strong> {window.innerWidth} x {window.innerHeight}</p>
                <p className="text-white"><strong>Timezone:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: USERS & AUTH */}
      {activeSubTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#181818] p-4 rounded-2xl border border-[#282828]">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#B3B3B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={devUserSearch}
                onChange={(e) => setDevUserSearch(e.target.value)}
                placeholder="Cari berdasarkan nama, email, atau telepon..."
                className="w-full bg-[#121212] text-white pl-10 pr-4 py-2 rounded-full text-xs border border-[#282828] focus:border-[#1DB954] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {(['all', 'teacher', 'student'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDevRoleFilter(r)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    devRoleFilter === r 
                      ? 'bg-[#1DB954] text-black' 
                      : 'bg-[#121212] text-[#B3B3B3] hover:text-white border border-[#282828]'
                  }`}
                >
                  {r === 'all' ? 'Semua' : r}
                </button>
              ))}
            </div>
          </div>

          {/* User List */}
          {devUsersLoading ? (
            <div className="p-12 text-center text-[#B3B3B3]"><RefreshCw className="w-8 h-8 text-[#1DB954] animate-spin mx-auto" /></div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 bg-[#181818] rounded-2xl text-center text-[#B3B3B3]">Tidak ada pengguna yang cocok.</div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((u) => {
                const isEditing = editingDevUser?.uid === u.uid;
                return (
                  <div key={u.uid} className="bg-[#181818] p-5 rounded-2xl border border-[#282828] space-y-4 hover:border-[#3E3E3E] transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{u.fullName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            u.role === 'teacher' ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'bg-sky-500/20 text-sky-400'
                          }`}>
                            {u.role}
                          </span>
                        </div>
                        <p className="text-xs text-[#B3B3B3] font-mono">{u.email}</p>
                        {u.phone && <p className="text-xs text-[#B3B3B3]">Telepon: {u.phone}</p>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            if (isEditing) {
                              setEditingDevUser(null);
                            } else {
                              setEditingDevUser(u);
                              setDevNewEmail(u.email || '');
                              setDevEditFullName(u.fullName || '');
                              setDevEditPhone(u.phone || '');
                            }
                          }}
                          className="px-4 py-2 bg-[#282828] hover:bg-[#3E3E3E] text-white rounded-full text-xs font-bold cursor-pointer transition-colors border border-[#3E3E3E]"
                        >
                          {isEditing ? 'Batal' : 'Edit / Bypass'}
                        </button>

                        {u.email !== 'fatih@kavio.tec.edu' && (
                          <button
                            onClick={() => handleDevDeleteUser(u)}
                            className="p-2 bg-[#E91429]/20 hover:bg-[#E91429] text-[#E91429] hover:text-white rounded-full transition-colors cursor-pointer"
                            title="Hapus Permanen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Editing Form */}
                    {isEditing && (
                      <div className="p-4 bg-[#121212] rounded-xl border border-[#282828] space-y-4 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#282828]">
                          <div>
                            <h5 className="font-bold text-white uppercase text-xs">Autentikasi & Reset Password Bypass</h5>
                            <p className="text-[11px] text-[#B3B3B3]">Kirim email tautan atur ulang kata sandi instan.</p>
                          </div>
                          <button
                            onClick={() => handleDevResetPassword(u)}
                            className="px-4 py-2 bg-[#1DB954] hover:bg-[#1ED760] text-black font-extrabold rounded-full cursor-pointer text-xs"
                          >
                            Kirim Reset Password
                          </button>
                        </div>

                        <div className="space-y-2 pb-3 border-b border-[#282828]">
                          <h5 className="font-bold text-white uppercase text-xs">Ubah Email Pengguna (Database)</h5>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              value={devNewEmail}
                              onChange={(e) => setDevNewEmail(e.target.value)}
                              className="flex-1 bg-[#181818] border border-[#3E3E3E] text-white px-3 py-2 rounded-lg text-xs"
                              placeholder="Email baru"
                            />
                            <button
                              onClick={() => handleDevUpdateEmail(u)}
                              className="px-4 py-2 bg-[#282828] hover:bg-[#3E3E3E] text-white font-bold rounded-lg cursor-pointer text-xs"
                            >
                              Update Email
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-bold text-white uppercase text-xs">Ubah Profil (Nama & Telepon)</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={devEditFullName}
                              onChange={(e) => setDevEditFullName(e.target.value)}
                              className="bg-[#181818] border border-[#3E3E3E] text-white px-3 py-2 rounded-lg text-xs"
                              placeholder="Nama Lengkap"
                            />
                            <input
                              type="text"
                              value={devEditPhone}
                              onChange={(e) => setDevEditPhone(e.target.value)}
                              className="bg-[#181818] border border-[#3E3E3E] text-white px-3 py-2 rounded-lg text-xs"
                              placeholder="Telepon"
                            />
                          </div>
                          <button
                            onClick={() => handleDevUpdateProfile(u)}
                            className="px-5 py-2 bg-[#1DB954] hover:bg-[#1ED760] text-black font-black rounded-full cursor-pointer text-xs mt-2"
                          >
                            Simpan Perubahan
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
      )}

      {/* SUB-TAB 3: FEATURE FLAGS */}
      {activeSubTab === 'flags' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#181818] p-6 sm:p-8 rounded-2xl border border-[#282828] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#1DB954]" />
                  <span>Kontrol Feature Flags & Pemeliharaan System</span>
                </h3>
                <p className="text-xs text-[#B3B3B3] mt-1">
                  Matikan atau aktifkan fitur secara instan. Fitur yang dimatikan akan menampilkan layar pemeliharaan pada role siswa.
                </p>
              </div>
              {flagSavedToast && (
                <span className="px-3 py-1 bg-[#1DB954] text-black font-extrabold text-xs rounded-full uppercase animate-bounce">
                  TERSIMPAN!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureFlags.map((flag) => (
                <div key={flag.id} className="bg-[#121212] p-5 rounded-2xl border border-[#282828] space-y-4 hover:border-[#3E3E3E] transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{flag.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          flag.enabled ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'bg-[#E91429]/20 text-[#E91429]'
                        }`}>
                          {flag.enabled ? 'ONLINE' : 'MAINTENANCE'}
                        </span>
                      </div>
                      <p className="text-xs text-[#B3B3B3]">{flag.description}</p>
                    </div>

                    <button
                      onClick={() => handleToggleFlag(flag.id)}
                      className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer shrink-0 ${
                        flag.enabled ? 'bg-[#1DB954] justify-end' : 'bg-[#3E3E3E] justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-black shadow-md" />
                    </button>
                  </div>

                  {!flag.enabled && (
                    <div className="space-y-1.5 pt-2 border-t border-[#282828]">
                      <label className="text-[10px] font-bold text-[#B3B3B3] uppercase">Pesan Pengumuman Pemeliharaan</label>
                      <input
                        type="text"
                        value={flag.maintenanceMessage || ''}
                        onChange={(e) => handleMessageChange(flag.id, e.target.value)}
                        className="w-full bg-[#181818] border border-[#3E3E3E] text-white px-3 py-1.5 rounded-lg text-xs"
                        placeholder="Pesan pemeliharaan untuk siswa..."
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: REGISTRATIONS */}
      {activeSubTab === 'registrations' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#181818] p-4 rounded-2xl border border-[#282828]">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#B3B3B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={regSearchQuery}
                onChange={(e) => setRegSearchQuery(e.target.value)}
                placeholder="Cari nama siswa, paket, atau nomor telepon..."
                className="w-full bg-[#121212] text-white pl-10 pr-4 py-2 rounded-full text-xs border border-[#282828] focus:border-[#1DB954] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setRegStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    regStatusFilter === st 
                      ? 'bg-[#1DB954] text-black' 
                      : 'bg-[#121212] text-[#B3B3B3] hover:text-white border border-[#282828]'
                  }`}
                >
                  {st === 'all' ? 'Semua' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Registrations List */}
          {regLoading ? (
            <div className="p-12 text-center text-[#B3B3B3]"><RefreshCw className="w-8 h-8 text-[#1DB954] animate-spin mx-auto" /></div>
          ) : filteredRegs.length === 0 ? (
            <div className="p-12 bg-[#181818] rounded-2xl text-center text-[#B3B3B3]">Tidak ada data pendaftaran paket.</div>
          ) : (
            <div className="space-y-3">
              {filteredRegs.map((reg) => (
                <div key={reg.id} className="bg-[#181818] p-5 rounded-2xl border border-[#282828] space-y-3 hover:border-[#3E3E3E] transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{reg.studentName}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          reg.status === 'approved' ? 'bg-[#1DB954]/20 text-[#1DB954]' :
                          reg.status === 'rejected' ? 'bg-[#E91429]/20 text-[#E91429]' : 'bg-[#FFA42B]/20 text-[#FFA42B]'
                        }`}>
                          {reg.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#B3B3B3]">Paket: <strong>{reg.packageName}</strong> ({reg.classType})</p>
                      <p className="text-xs text-[#B3B3B3]">Orang Tua: {reg.parentName} ({reg.parentPhone})</p>
                      {reg.assignedSchedule && (
                        <p className="text-xs text-[#1DB954]">Jadwal Terpasang: {reg.assignedSchedule}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {reg.status !== 'approved' && (
                        <button
                          onClick={() => {
                            setSelectedReg(reg);
                            setAssignedScheduleInput(reg.assignedSchedule || '');
                            setIsAssignModalOpen(true);
                          }}
                          className="px-4 py-2 bg-[#1DB954] hover:bg-[#1ED760] text-black font-black rounded-full text-xs cursor-pointer"
                        >
                          Setujui & Jadwal
                        </button>
                      )}

                      {reg.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateRegStatus(reg.id, 'rejected')}
                          className="px-4 py-2 bg-[#E91429]/20 hover:bg-[#E91429] text-[#E91429] hover:text-white font-bold rounded-full text-xs cursor-pointer transition-colors"
                        >
                          Tolak
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: LOGS & STORAGE */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Storage Inspector */}
          <div className="bg-[#181818] p-6 sm:p-8 rounded-2xl border border-[#282828] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-5 h-5 text-[#1DB954]" />
                <span>LocalStorage Key-Value Inspector</span>
              </h3>
              <button
                onClick={refreshStorageInspector}
                className="px-3.5 py-1.5 bg-[#282828] hover:bg-[#3E3E3E] text-white rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {storageItems.map((item) => (
                <div key={item.key} className="p-3 bg-[#121212] rounded-xl border border-[#282828] text-xs flex items-center justify-between gap-4 font-mono">
                  <span className="text-[#1DB954] font-bold shrink-0">{item.key}</span>
                  <span className="text-[#B3B3B3] truncate max-w-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Console Logs */}
          <div className="bg-[#181818] p-6 sm:p-8 rounded-2xl border border-[#282828] space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#1DB954]" />
              <span>Event Logs & System Monitor</span>
            </h3>

            <div className="bg-[#121212] p-4 rounded-xl border border-[#282828] font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
              {logs.map((l, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-[#B3B3B3]">[{l.time}]</span>
                  <span className="text-[#1DB954] font-bold">INFO:</span>
                  <span className="text-white">{l.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assign Schedule Modal */}
      {isAssignModalOpen && selectedReg && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#181818] border border-[#282828] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg text-white uppercase">Setujui & Pass Jadwal Belajar</h4>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-[#B3B3B3] hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#B3B3B3]">Pendaftaran Siswa: <strong className="text-white">{selectedReg.studentName}</strong></p>
              <p className="text-[#B3B3B3]">Paket: <strong className="text-white">{selectedReg.packageName}</strong></p>
              
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-white uppercase">Pilih / Ketik Jadwal Belajar</label>
                <input
                  type="text"
                  value={assignedScheduleInput}
                  onChange={(e) => setAssignedScheduleInput(e.target.value)}
                  placeholder="misal: Senin & Rabu (15.30 - 17.00 WIB)"
                  className="w-full bg-[#121212] border border-[#3E3E3E] text-white p-3 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="flex-1 py-3 bg-[#282828] text-white text-xs font-bold rounded-full cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleUpdateRegStatus(selectedReg.id, 'approved', assignedScheduleInput);
                  setIsAssignModalOpen(false);
                }}
                className="flex-1 py-3 bg-[#1DB954] hover:bg-[#1ED760] text-black text-xs font-black rounded-full cursor-pointer shadow-lg"
              >
                Setujui Pendaftaran
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
