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
import CustomDropdown from './CustomDropdown';

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
      title: 'Pembaruan Sistem: Desain & Antarmuka Kavio Edu',
      message: 'Kavio Edu kini menggunakan sistem desain antarmuka terpadu untuk memberikan pengalaman belajar yang profesional dan efisien.',
      date: dtFeature.date,
      time: dtFeature.time,
      timestamp: dtFeature.timestamp,
      isRead: readNotifIds.has('system-feature-1'),
      actionUrl: '/blog',
      actionLabel: 'Lihat Pengumuman',
      iconBg: 'bg-[#66C0F4]/20 border border-[#66C0F4]/30',
      badgeBg: 'bg-[#66C0F4]/20 border border-[#66C0F4]/30',
      badgeText: 'text-[#66C0F4]'
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
      iconBg: 'bg-[#B9A074]/20 border border-[#B9A074]/30',
      badgeBg: 'bg-[#B9A074]/20 border border-[#B9A074]/30',
      badgeText: 'text-[#B9A074]'
    });

    const dtEvent = parseDateTime(null, 2);
    notifMap.set('system-event-1', {
      id: 'system-event-1',
      category: 'Event',
      title: 'Undangan Workshop Pembelajaran Interaktif Kavio Edu',
      message: 'Ikuti sesi webinar bersama para pengajar berpengalaman tentang strategi belajar efektif dan persiapan ujian.',
      date: dtEvent.date,
      time: dtEvent.time,
      timestamp: dtEvent.timestamp,
      isRead: readNotifIds.has('system-event-1'),
      actionUrl: '/blog',
      actionLabel: 'Lihat Detail Event',
      iconBg: 'bg-[#A1CD44]/20 border border-[#A1CD44]/30',
      badgeBg: 'bg-[#A1CD44]/20 border border-[#A1CD44]/30',
      badgeText: 'text-[#A1CD44]'
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
              iconBg: 'bg-[#66C0F4]/20 border border-[#66C0F4]/30',
              badgeBg: 'bg-[#66C0F4]/20 border border-[#66C0F4]/30',
              badgeText: 'text-[#66C0F4]'
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
              iconBg: 'bg-[#66C0F4]/20 border border-[#66C0F4]/30',
              badgeBg: 'bg-[#66C0F4]/20 border border-[#66C0F4]/30',
              badgeText: 'text-[#66C0F4]'
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
            iconBg: sub.status === 'graded' ? 'bg-[#A1CD44]/20 border border-[#A1CD44]/30' : 'bg-[#66C0F4]/20 border border-[#66C0F4]/30',
            badgeBg: sub.status === 'graded' ? 'bg-[#A1CD44]/20 border border-[#A1CD44]/30' : 'bg-[#66C0F4]/20 border border-[#66C0F4]/30',
            badgeText: sub.status === 'graded' ? 'text-[#A1CD44]' : 'text-[#66C0F4]'
          });
        } else {
          if (sub.studentId === user.uid) {
            if (sub.status === 'graded') {
              const notifId = `sub-graded-${subId}`;
              notifMap.set(notifId, {
                id: notifId,
                category: 'Penilaian',
                title: `Tugas Selesai Dinilai: ${sub.assignmentTitle || 'Tugas'}`,
                message: `EXP kamu untuk tugas "${sub.assignmentTitle}": ${sub.score ?? 0} EXP.${sub.feedback ? ` Catatan Guru: "${sub.feedback}"` : ''}`,
                date: dtSubmitted.date,
                time: dtSubmitted.time,
                timestamp: dtSubmitted.timestamp,
                isRead: readNotifIds.has(notifId),
                actionUrl: '/assignments',
                actionLabel: 'Lihat Hasil Nilai',
                iconBg: 'bg-[#A1CD44]/20 border border-[#A1CD44]/30',
                badgeBg: 'bg-[#A1CD44]/20 border border-[#A1CD44]/30',
                badgeText: 'text-[#A1CD44]'
              });
            } else if (sub.status === 'remedial') {
              const notifId = `sub-remedial-${subId}`;
              notifMap.set(notifId, {
                id: notifId,
                category: 'Remedial',
                title: `Permintaan Perbaikan (Remedial): ${sub.assignmentTitle || 'Tugas'}`,
                message: `Guru telah meninjau jawabanmu pada "${sub.assignmentTitle}" dan memberikan catatan perbaikan: "${sub.feedback || 'Silakan pelajari ulang dan kirimkan perbaikan.'}"`,
                date: dtSubmitted.date,
                time: dtSubmitted.time,
                timestamp: dtSubmitted.timestamp,
                isRead: readNotifIds.has(notifId),
                actionUrl: '/assignments',
                actionLabel: 'Kerjakan Perbaikan',
                iconBg: 'bg-[#FF4B4B]/20 border border-[#FF4B4B]/30',
                badgeBg: 'bg-[#FF4B4B]/20 border border-[#FF4B4B]/30',
                badgeText: 'text-[#FF4B4B]'
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
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn font-sans pb-16 text-white">
      
      {/* Header Banner */}
      <div className="bg-[#2F3138] rounded-[4px] p-6 sm:p-8 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[2px] bg-[#66C0F4] text-[#171A21] flex items-center justify-center font-bold shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
              <InboxIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                KOTAK MASUK & NOTIFIKASI
              </h1>
              <p className="text-xs text-[#C6D4DF]">
                Pemberitahuan real-time mengenai pengiriman tugas, nilai, remedial, event, dan update sistem.
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar: Unread Counter, Mark Read, Clear All & Auto-Clean Retention */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between md:justify-end shrink-0">
          {unreadCount > 0 ? (
            <div className="flex items-center gap-2 bg-[#FF4B4B]/20 border border-[#FF4B4B]/30 px-3.5 py-2 rounded-[2px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4B4B] animate-ping" />
              <span className="text-xs font-bold text-[#FF4B4B]">
                {unreadCount} Belum Dibaca
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#A1CD44]/20 border border-[#A1CD44]/30 px-3.5 py-2 rounded-[2px]">
              <CheckCircle2 className="w-4 h-4 text-[#A1CD44]" />
              <span className="text-xs font-bold text-[#A1CD44]">
                Semua Dibaca
              </span>
            </div>
          )}

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold py-2.5 px-4 rounded-[2px] transition-all cursor-pointer shadow-md uppercase tracking-wider"
              id="btn-mark-all-read"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Tandai Semua Dibaca</span>
            </button>
          )}

          {filteredNotifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 bg-transparent hover:bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]/40 text-xs font-bold py-2.5 px-4 rounded-[2px] transition-all cursor-pointer shadow-xs uppercase tracking-wider"
              id="btn-clear-inbox"
              title="Bersihkan semua notifikasi dari inbox"
            >
              <Trash2 className="w-4 h-4 text-[#FF4B4B]" />
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
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Cari notifikasi berdasarkan judul tugas, pesan, nama siswa/guru, atau tanggal/jam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 text-white placeholder-[#8A8A8A] pl-11 pr-4 py-3 rounded-[2px] font-normal text-xs border border-white/15 focus:outline-none focus:border-[#66C0F4]"
              id="input-search-inbox"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8A8A8A] hover:text-white"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Auto-Clean Retention Selector Dropdown */}
          <div className="flex flex-col min-w-[180px] shrink-0">
            <label className="block text-[9px] font-bold text-[#8A8A8A] uppercase tracking-widest mb-1 ml-1">
              Pembersihan Otomatis
            </label>
            <CustomDropdown
              value={autoCleanDays}
              onChange={(val) => handleAutoCleanChange(val as any)}
              options={[
                { value: 'never', label: 'Jangan Hapus Otomatis' },
                { value: '3', label: 'Hapus setelah 3 Hari' },
                { value: '7', label: 'Hapus setelah 7 Hari' },
                { value: '30', label: 'Hapus setelah 30 Hari' }
              ]}
            />
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
                className={`px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#66C0F4] text-[#171A21] border-[#66C0F4] shadow-md'
                    : 'bg-[#2F3138] text-[#C6D4DF] border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{cat}</span>
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-[2px] text-[10px] ${
                  isSelected ? 'bg-[#171A21]/20 text-[#171A21]' : 'bg-black/40 text-[#8A8A8A]'
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
          <div className="bg-[#2F3138] rounded-[3px] p-12 text-center space-y-3 border border-white/10">
            <Loader2 className="w-8 h-8 text-[#66C0F4] animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#C6D4DF] uppercase tracking-widest">Memuat Notifikasi Real-time...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-[#2F3138] rounded-[3px] p-12 text-center space-y-3 border border-dashed border-white/10">
            <Bell className="w-12 h-12 text-[#8A8A8A] mx-auto" />
            <h3 className="text-base font-bold text-white uppercase">Inbox Kosong / Tidak Ada Notifikasi</h3>
            <p className="text-xs text-[#C6D4DF] max-w-sm mx-auto">
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
                  className={`bg-[#2F3138] rounded-[3px] p-5 sm:p-6 border transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)] relative overflow-hidden text-white ${
                    !item.isRead 
                      ? 'border-[#66C0F4] bg-[#66C0F4]/10' 
                      : 'border-white/10 opacity-90'
                  }`}
                >
                  {/* Unread Accent Line */}
                  {!item.isRead && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#66C0F4]" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Category Icon Badge */}
                    <div className={`w-11 h-11 rounded-[2px] bg-black/40 border border-white/10 text-[#66C0F4] flex items-center justify-center shrink-0 shadow-sm`}>
                      <IconComp className="w-5 h-5 text-[#66C0F4]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`bg-[#66C0F4]/20 border border-[#66C0F4]/30 text-[#66C0F4] text-[10px] font-bold px-2.5 py-0.5 rounded-[2px] uppercase tracking-wider`}>
                            {item.category}
                          </span>
                          {!item.isRead && (
                            <span className="bg-[#FF4B4B]/20 border border-[#FF4B4B]/40 text-[#FF4B4B] text-[9px] font-bold px-2 py-0.5 rounded-[2px] uppercase">
                              BARU
                            </span>
                          )}
                        </div>

                        {/* Real Date & Time Stamp */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#8A8A8A]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                          <span>•</span>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.time}</span>
                        </div>
                      </div>

                      <h3 className={`text-base font-bold leading-snug uppercase ${
                        !item.isRead ? 'text-white' : 'text-[#C6D4DF]'
                      }`}>
                        {item.title}
                      </h3>

                      <p className="text-xs font-normal text-[#C6D4DF] leading-relaxed">
                        {item.message}
                      </p>

                      {/* Bottom Action Footer */}
                      <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/10">
                        {item.actionLabel ? (
                          <button
                            onClick={() => handleAction(item)}
                            className="bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] text-xs font-bold py-2 px-4 rounded-[2px] transition-all cursor-pointer flex items-center gap-1.5 shadow-md uppercase tracking-wider"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : <div />}

                        {!item.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(item.id)}
                            className="text-xs font-bold text-[#8A8A8A] hover:text-[#A1CD44] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#A1CD44]" />
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
