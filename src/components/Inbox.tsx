import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Inbox as InboxIcon, 
  Bell, 
  Search, 
  CheckCheck, 
  NotebookText, 
  Award, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Loader2,
  Trash2,
  Filter,
  ShieldAlert
} from 'lucide-react';
import { UserProfile } from '../types';
import { auth, db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface NotificationItem {
  id: string;
  category: 'Tugas Baru' | 'Penilaian' | 'Remedial' | 'Fitur Baru' | 'Event' | 'Perubahan Jadwal';
  title: string;
  message: string;
  date: string;
  time: string;
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  iconBg: string;
  badgeBg: string;
  badgeText: string;
}

interface InboxProps {
  onNavigate?: (path: string) => void;
  onSelectTab?: (tab: any) => void;
  userProfile?: UserProfile | null;
  role?: 'teacher' | 'student';
}

export default function Inbox({ onNavigate, onSelectTab, userProfile, role }: InboxProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Read notifications IDs stored in localStorage
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('kavio_read_notifications');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Cleared notifications IDs stored in localStorage
  const [clearedNotifIds, setClearedNotifIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('kavio_cleared_notifications');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Auto-clean retention setting (never | 3 | 7 | 30 days)
  const [autoCleanDays, setAutoCleanDays] = useState<'never' | '3' | '7' | '30'>(() => {
    try {
      const saved = localStorage.getItem('kavio_inbox_autoclean_days');
      return (saved as any) || 'never';
    } catch {
      return 'never';
    }
  });

  const categories = [
    'Semua',
    'Tugas Baru',
    'Penilaian',
    'Remedial',
    'Fitur Baru',
    'Event',
    'Perubahan Jadwal'
  ];

  // Helper to format timestamps to real date & time strings
  const parseDateTime = (dateInput: any, defaultDaysAgo: number = 0) => {
    let d: Date;
    if (dateInput && typeof dateInput.toDate === 'function') {
      d = dateInput.toDate();
    } else if (dateInput instanceof Date) {
      d = dateInput;
    } else if (typeof dateInput === 'number') {
      d = new Date(dateInput);
    } else if (typeof dateInput === 'string' && dateInput.trim() !== '') {
      d = new Date(dateInput);
    } else {
      d = new Date();
      if (defaultDaysAgo > 0) {
        d.setDate(d.getDate() - defaultDaysAgo);
      }
    }

    if (isNaN(d.getTime())) {
      d = new Date();
    }

    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${mins} WIB`;

    return { date: dateStr, time: timeStr, timestamp: d.getTime() };
  };

  // Listen to Real Firestore Data
  useEffect(() => {
    const user = auth.currentUser;
    const isTeacher = role === 'teacher' || userProfile?.role === 'teacher';
    setLoading(true);

    if (!user || !db) {
      setLoading(false);
      return;
    }

    const notifMap = new Map<string, NotificationItem>();

    // 1. System Features & Event Announcements
    const dtFeature = parseDateTime(null, 0);
    notifMap.set('system-feature-1', {
      id: 'system-feature-1',
      category: 'Fitur Baru',
      title: 'Pembaruan Sistem: Desain Duolingo & Font Resmi Feather Bold ✨',
      message: 'Kavio Edu kini menggunakan sistem warna resmi Duolingo (Feather Green, Eel, Macaw, dll.) serta font khusus Feather Bold & DIN Next Rounded!',
      date: dtFeature.date,
      time: dtFeature.time,
      timestamp: dtFeature.timestamp,
      isRead: readNotifIds.has('system-feature-1'),
      actionUrl: '/blog',
      actionLabel: 'Lihat Pengumuman',
      iconBg: 'bg-[#CE82FF]',
      badgeBg: 'bg-[#CE82FF]',
      badgeText: 'text-white'
    });

    const dtSchedule = parseDateTime(null, 1);
    notifMap.set('system-schedule-1', {
      id: 'system-schedule-1',
      category: 'Perubahan Jadwal',
      title: 'Pembaruan Jadwal Sesi Bimbingan & Pembelajaran Modul',
      message: 'Jadwal konsultasi materi dan evaluasi mingguan telah diperbarui. Silakan periksa tab Pustaka Modul & Kavio Circle.',
      date: dtSchedule.date,
      time: dtSchedule.time,
      timestamp: dtSchedule.timestamp,
      isRead: readNotifIds.has('system-schedule-1'),
      actionUrl: '/circles',
      actionLabel: 'Cek Circle & Modul',
      iconBg: 'bg-[#FF9600]',
      badgeBg: 'bg-[#FF9600]',
      badgeText: 'text-white'
    });

    const dtEvent = parseDateTime(null, 2);
    notifMap.set('system-event-1', {
      id: 'system-event-1',
      category: 'Event',
      title: 'Undangan Workshop Pembelajaran Interaktif Kavio Edu 🎓',
      message: 'Ikuti sesi webinar bersama para pengajar berpengalaman tentang strategi belajar efektif dan persiapan ujian.',
      date: dtEvent.date,
      time: dtEvent.time,
      timestamp: dtEvent.timestamp,
      isRead: readNotifIds.has('system-event-1'),
      actionUrl: '/blog',
      actionLabel: 'Lihat Detail Event',
      iconBg: 'bg-[#FFC800]',
      badgeBg: 'bg-[#FFC800]',
      badgeText: 'text-gray-900'
    });

    // 2. Real Assignments Listener
    const assignmentsRef = collection(db, 'assignments');
    const unsubAssignments = onSnapshot(assignmentsRef, (snapshot) => {
      snapshot.forEach((docSnap) => {
        const assign = docSnap.data();
        const assignId = docSnap.id;
        const dt = parseDateTime(assign.createdAt || assign.updatedAt, 0);

        if (isTeacher) {
          if (assign.teacherId === user.uid || !assign.teacherId) {
            const notifId = `assign-${assignId}`;
            notifMap.set(notifId, {
              id: notifId,
              category: 'Tugas Baru',
              title: `Tugas Diterbitkan: ${assign.title || 'Tugas Baru'}`,
              message: `Anda telah menerbitkan tugas "${assign.title}" untuk ${assign.assignmentTarget === 'CIRCLE' ? 'kelompok Circle' : (assign.studentName || 'siswa')}. ${assign.deadline ? `Tenggat: ${assign.deadline}` : ''}`,
              date: dt.date,
              time: dt.time,
              timestamp: dt.timestamp,
              isRead: readNotifIds.has(notifId),
              actionUrl: '/assignments',
              actionLabel: 'Kelola Tugas',
              iconBg: 'bg-[#1CB0F6]',
              badgeBg: 'bg-[#1CB0F6]',
              badgeText: 'text-white'
            });
          }
        } else {
          const isTargetedStudent = assign.studentId === user.uid || assign.targetId === user.uid;
          const isTargetedCircle = userProfile?.circleId && (assign.targetId === userProfile.circleId || assign.circleId === userProfile.circleId);
          
          if (isTargetedStudent || isTargetedCircle || !assign.studentId) {
            const notifId = `assign-student-${assignId}`;
            notifMap.set(notifId, {
              id: notifId,
              category: 'Tugas Baru',
              title: `Tugas Baru dari Guru: ${assign.title || 'Tugas Baru'}`,
              message: `Bapak/Ibu ${assign.teacherName || 'Guru'} telah memberikan tugas baru "${assign.title}". ${assign.deadline ? `Batas waktu pengumpulan: ${assign.deadline}` : 'Yuk segera dikerjakan!'}`,
              date: dt.date,
              time: dt.time,
              timestamp: dt.timestamp,
              isRead: readNotifIds.has(notifId),
              actionUrl: '/assignments',
              actionLabel: 'Kerjakan Tugas',
              iconBg: 'bg-[#1CB0F6]',
              badgeBg: 'bg-[#1CB0F6]',
              badgeText: 'text-white'
            });
          }
        }
      });

      setNotifications(Array.from(notifMap.values()));
      setLoading(false);
    }, (err) => {
      console.warn('Could not fetch assignments for inbox:', err);
      setLoading(false);
    });

    // 3. Real Submissions Listener
    const submissionsRef = collection(db, 'submissions');
    const unsubSubmissions = onSnapshot(submissionsRef, (snapshot) => {
      snapshot.forEach((docSnap) => {
        const sub = docSnap.data();
        const subId = docSnap.id;
        const dtSubmitted = parseDateTime(sub.submittedAt || sub.gradedAt, 0);

        if (isTeacher) {
          const notifId = `sub-teacher-${subId}`;
          notifMap.set(notifId, {
            id: notifId,
            category: sub.status === 'graded' ? 'Penilaian' : 'Tugas Baru',
            title: `Jawaban Dikumpulkan: ${sub.studentName || 'Siswa'}`,
            message: `${sub.studentName || 'Seorang siswa'} baru saja mengumpulkan jawaban untuk tugas "${sub.assignmentTitle || 'Tugas'}". ${sub.score !== null && sub.score !== undefined ? `Total EXP: ${sub.score} EXP` : 'Periksa & berikan penilaian EXP.'}`,
            date: dtSubmitted.date,
            time: dtSubmitted.time,
            timestamp: dtSubmitted.timestamp,
            isRead: readNotifIds.has(notifId),
            actionUrl: '/assignments',
            actionLabel: 'Periksa & Beri EXP',
            iconBg: sub.status === 'graded' ? 'bg-[#58CC02]' : 'bg-[#1CB0F6]',
            badgeBg: sub.status === 'graded' ? 'bg-[#58CC02]' : 'bg-[#1CB0F6]',
            badgeText: 'text-white'
          });
        } else {
          if (sub.studentId === user.uid) {
            if (sub.status === 'graded') {
              const notifId = `sub-graded-${subId}`;
              notifMap.set(notifId, {
                id: notifId,
                category: 'Penilaian',
                title: `Tugas Selesai Dinilai: ${sub.assignmentTitle || 'Tugas'} 🎉`,
                message: `EXP kamu untuk tugas "${sub.assignmentTitle}": ${sub.score ?? 0} EXP.${sub.feedback ? ` Catatan Guru: "${sub.feedback}"` : ''}`,
                date: dtSubmitted.date,
                time: dtSubmitted.time,
                timestamp: dtSubmitted.timestamp,
                isRead: readNotifIds.has(notifId),
                actionUrl: '/assignments',
                actionLabel: 'Lihat Hasil Nilai',
                iconBg: 'bg-[#58CC02]',
                badgeBg: 'bg-[#58CC02]',
                badgeText: 'text-white'
              });
            } else if (sub.status === 'remedial') {
              const notifId = `sub-remedial-${subId}`;
              notifMap.set(notifId, {
                id: notifId,
                category: 'Remedial',
                title: `Permintaan Perbaikan (Remedial): ${sub.assignmentTitle || 'Tugas'} ⚠️`,
                message: `Guru telah meninjau jawabanmu pada "${sub.assignmentTitle}" dan memberikan catatan perbaikan: "${sub.feedback || 'Silakan pelajari ulang dan kirimkan perbaikan.'}"`,
                date: dtSubmitted.date,
                time: dtSubmitted.time,
                timestamp: dtSubmitted.timestamp,
                isRead: readNotifIds.has(notifId),
                actionUrl: '/assignments',
                actionLabel: 'Kerjakan Perbaikan',
                iconBg: 'bg-[#FF4B4B]',
                badgeBg: 'bg-[#FF4B4B]',
                badgeText: 'text-white'
              });
            }
          }
        }
      });

      setNotifications(Array.from(notifMap.values()));
      setLoading(false);
    }, (err) => {
      console.warn('Could not fetch submissions for inbox:', err);
      setLoading(false);
    });

    return () => {
      unsubAssignments();
      unsubSubmissions();
    };
  }, [role, userProfile]);

  // Sort chronologically (newest timestamp first)
  const sortedNotifications = [...notifications].sort((a, b) => b.timestamp - a.timestamp);

  // Filter out cleared & auto-cleaned notifications + category & search filters
  const now = Date.now();
  const filteredNotifications = sortedNotifications.filter((item) => {
    // 1. Exclude manually cleared items
    if (clearedNotifIds.has(item.id)) return false;

    // 2. Exclude items older than autoCleanDays retention setting
    if (autoCleanDays !== 'never') {
      const limitDays = parseInt(autoCleanDays, 10);
      const maxAgeMs = limitDays * 24 * 60 * 60 * 1000;
      if (now - item.timestamp > maxAgeMs) {
        return false;
      }
    }

    // 3. Category Filter
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;

    // 4. Global Search Filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(searchLower) ||
      item.message.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.date.toLowerCase().includes(searchLower) ||
      item.time.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  // Calculate unread count from current active notifications
  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  // Sync unreadCount to localStorage for NavigationSidebar red dot badge!
  useEffect(() => {
    try {
      localStorage.setItem('kavio_unread_inbox_count', String(unreadCount));
    } catch {}
  }, [unreadCount]);

  // Handler: Mark single notification as read
  const handleMarkAsRead = (id: string) => {
    setReadNotifIds(prev => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem('kavio_read_notifications', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Handler: Mark all active notifications as read
  const handleMarkAllAsRead = () => {
    const allIds = new Set([...readNotifIds, ...filteredNotifications.map(n => n.id)]);
    setReadNotifIds(allIds);
    try {
      localStorage.setItem('kavio_read_notifications', JSON.stringify(Array.from(allIds)));
    } catch {}
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Handler: Clear all notifications immediately
  const handleClearAll = () => {
    if (window.confirm('Apakah Anda yakin ingin membersihkan semua notifikasi dari inbox?')) {
      const allCleared = new Set([...clearedNotifIds, ...filteredNotifications.map(n => n.id)]);
      setClearedNotifIds(allCleared);
      try {
        localStorage.setItem('kavio_cleared_notifications', JSON.stringify(Array.from(allCleared)));
        localStorage.setItem('kavio_unread_inbox_count', '0');
      } catch {}
    }
  };

  // Handler: Change auto-clean retention setting (never, 3, 7, 30 days)
  const handleAutoCleanChange = (val: 'never' | '3' | '7' | '30') => {
    setAutoCleanDays(val);
    try {
      localStorage.setItem('kavio_inbox_autoclean_days', val);
    } catch {}
  };

  const handleAction = (item: NotificationItem) => {
    handleMarkAsRead(item.id);
    if (item.actionUrl) {
      if (item.actionUrl === '/assignments' && onSelectTab) {
        onSelectTab('assignments');
      } else if (item.actionUrl === '/circles' && onSelectTab) {
        onSelectTab('circles');
      } else if (onNavigate) {
        onNavigate(item.actionUrl);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tugas Baru': return NotebookText;
      case 'Penilaian': return Award;
      case 'Remedial': return AlertTriangle;
      case 'Fitur Baru': return Sparkles;
      case 'Event': return Calendar;
      case 'Perubahan Jadwal': return Clock;
      default: return Bell;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn font-sans pb-16">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-300 dark:border-b-slate-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1CB0F6] text-white flex items-center justify-center shadow-md border-b-4 border-[#0092E0] shrink-0">
              <InboxIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-display">
                KOTAK MASUK & NOTIFIKASI
              </h1>
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400">
                Pemberitahuan real-time mengenai pengiriman tugas, nilai, remedial, event, dan update sistem.
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar: Unread Counter, Mark Read, Clear All & Auto-Clean Retention */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between md:justify-end shrink-0">
          {unreadCount > 0 ? (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-3.5 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-800">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4B4B] animate-ping" />
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-300">
                {unreadCount} Belum Dibaca
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3.5 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-[#58CC02]" />
              <span className="text-xs font-black text-[#58CC02]">
                Semua Dibaca
              </span>
            </div>
          )}

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 bg-[#58CC02] hover:bg-[#46A302] text-white text-xs font-black py-2.5 px-4 rounded-2xl border-b-4 border-[#46A302] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer shadow-xs"
              id="btn-mark-all-read"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Tandai Semua Dibaca</span>
            </button>
          )}

          {filteredNotifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 text-gray-700 dark:text-slate-200 text-xs font-black py-2.5 px-4 rounded-2xl border-b-4 border-gray-300 dark:border-slate-900 active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer shadow-xs"
              id="btn-clear-inbox"
              title="Bersihkan semua notifikasi dari inbox"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Bersihkan Inbox</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Search & Auto-Clean Settings Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Global Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari notifikasi berdasarkan judul tugas, pesan, nama siswa/guru, atau tanggal/jam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 pl-11 pr-4 py-3.5 rounded-2xl font-bold text-xs shadow-xs border-2 border-gray-200 dark:border-slate-700 border-b-4 focus:outline-none focus:border-[#1CB0F6]"
              id="input-search-inbox"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Auto-Clean Retention Selector Dropdown */}
          <div className="relative flex items-center bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 border-b-4 rounded-2xl px-3 py-1">
            <Clock className="w-4 h-4 text-indigo-500 shrink-0 mr-2" />
            <div className="flex-1 min-w-0">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Pembersihan Otomatis
              </label>
              <select
                value={autoCleanDays}
                onChange={(e) => handleAutoCleanChange(e.target.value as any)}
                className="w-full bg-transparent text-xs font-black text-gray-800 dark:text-slate-100 focus:outline-none cursor-pointer py-1"
                id="select-autoclean-inbox"
              >
                <option value="never" className="bg-white dark:bg-slate-800">Jangan Hapus Otomatis</option>
                <option value="3" className="bg-white dark:bg-slate-800">Hapus setelah 3 Hari</option>
                <option value="7" className="bg-white dark:bg-slate-800">Hapus setelah 7 Hari</option>
                <option value="30" className="bg-white dark:bg-slate-800">Hapus setelah 30 Hari</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'Semua' 
              ? filteredNotifications.length 
              : filteredNotifications.filter(n => n.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-b-4 ${
                  isSelected
                    ? 'bg-[#1CB0F6] text-white border-[#0092E0] shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
                }`}
              >
                <span>{cat}</span>
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-md text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-12 text-center space-y-3 border-2 border-gray-200 dark:border-slate-700">
            <Loader2 className="w-8 h-8 text-[#1CB0F6] animate-spin mx-auto" />
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Memuat Notifikasi Real-time...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-12 text-center space-y-3 border-2 border-dashed border-gray-200 dark:border-slate-700">
            <Bell className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-black text-gray-800 dark:text-slate-200">Inbox Kosong / Tidak Ada Notifikasi</h3>
            <p className="text-xs text-gray-400 font-bold max-w-sm mx-auto">
              Tidak ada pemberitahuan dalam kategori ini, telah dibersihkan, atau kata kunci pencarian kamu tidak cocok.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((item) => {
              const IconComp = getCategoryIcon(item.category);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white dark:bg-slate-800 rounded-[2rem] p-5 sm:p-6 border-2 transition-all shadow-xs relative overflow-hidden ${
                    !item.isRead 
                      ? 'border-[#1CB0F6] dark:border-[#1CB0F6]/70 border-b-6 border-b-[#0092E0]' 
                      : 'border-gray-200 dark:border-slate-700/80 border-b-4 border-b-gray-300 dark:border-b-slate-900 opacity-90'
                  }`}
                >
                  {/* Unread Accent Line */}
                  {!item.isRead && (
                    <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#1CB0F6]" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Category Icon Badge */}
                    <div className={`w-11 h-11 rounded-2xl ${item.iconBg} text-white flex items-center justify-center shrink-0 shadow-sm border-b-4 border-black/20`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`${item.badgeBg} ${item.badgeText} text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider`}>
                            {item.category}
                          </span>
                          {!item.isRead && (
                            <span className="bg-[#FF4B4B] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse">
                              BARU
                            </span>
                          )}
                        </div>

                        {/* Real Date & Time Stamp */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                          <span>•</span>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.time}</span>
                        </div>
                      </div>

                      <h3 className={`text-base sm:text-lg font-black leading-snug uppercase ${
                        !item.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-slate-300'
                      }`}>
                        {item.title}
                      </h3>

                      <p className="text-xs font-medium text-gray-600 dark:text-slate-300 leading-relaxed">
                        {item.message}
                      </p>

                      {/* Bottom Action Footer */}
                      <div className="pt-2 flex items-center justify-between gap-4 border-t border-gray-100 dark:border-slate-700/50">
                        {item.actionLabel ? (
                          <button
                            onClick={() => handleAction(item)}
                            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black py-2 px-4 rounded-xl border-b-4 border-black dark:border-gray-300 active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : <div />}

                        {!item.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(item.id)}
                            className="text-xs font-bold text-gray-400 hover:text-gray-700 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#58CC02]" />
                            <span>Tandai dibaca</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
