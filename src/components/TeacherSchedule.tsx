import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  Users, 
  Video, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { ScheduleItem, UserProfile } from '../types';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function TeacherSchedule() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => new Date().toISOString().slice(0, 10));

  // DB Students & Circles
  const [dbStudents, setDbStudents] = useState<UserProfile[]>([]);
  const [dbCircles, setDbCircles] = useState<{ id: string; name: string }[]>([]);

  // Filters
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PRIVATE' | 'CIRCLE'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Form State
  const [sessionType, setSessionType] = useState<'PRIVATE' | 'CIRCLE'>('PRIVATE');
  const [sessionTitle, setSessionTitle] = useState('');
  const [studentOrCircleName, setStudentOrCircleName] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCircleId, setSelectedCircleId] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formDate, setFormDate] = useState('');
  const [startTime, setStartTime] = useState('15:30');
  const [endTime, setEndTime] = useState('17:00');
  const [status, setStatus] = useState<'scheduled' | 'completed' | 'rescheduled' | 'cancelled'>('scheduled');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load registered Students & Circles from DB
  useEffect(() => {
    if (!db) return;

    let unsubUsers = () => {};
    let unsubCircles = () => {};

    try {
      const usersRef = collection(db, 'users');
      unsubUsers = onSnapshot(usersRef, (snapshot) => {
        const list: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as UserProfile;
          if (data.role === 'student' || !data.role) {
            list.push({ uid: docSnap.id, ...data });
          }
        });
        setDbStudents(list);
      });

      const circlesRef = collection(db, 'circles');
      unsubCircles = onSnapshot(circlesRef, (snapshot) => {
        const list: { id: string; name: string }[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({ id: docSnap.id, name: data.name || docSnap.id });
        });
        setDbCircles(list);
      });
    } catch (err) {
      console.warn('Firestore users/circles subscription error:', err);
    }

    return () => {
      unsubUsers();
      unsubCircles();
    };
  }, []);

  // Load real-time Firestore schedules + local storage fallback
  useEffect(() => {
    setLoading(true);

    const loadData = (firestoreItems: ScheduleItem[] = []) => {
      let localItems: ScheduleItem[] = [];
      try {
        const saved = localStorage.getItem('kavio_schedules');
        if (saved) localItems = JSON.parse(saved);
      } catch {}

      const map = new Map<string, ScheduleItem>();
      
      // Default initial mock data if completely empty
      if (localItems.length === 0 && firestoreItems.length === 0) {
        const todayStr = new Date().toISOString().slice(0, 10);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().slice(0, 10);

        const sample1: ScheduleItem = {
          id: 'sched-sample-1',
          type: 'PRIVATE',
          title: 'Bimbingan Private Matematika',
          studentName: 'Faiz Ahmad',
          teacherName: 'Fatih Farhat',
          date: todayStr,
          startTime: '15:30',
          endTime: '17:00',
          timeLabel: '15:30 - 17:00 WIB',
          status: 'scheduled',
          notes: 'Pembahasan Soal OSN Matematika Bab 1',
          meetingLink: 'https://meet.google.com/kavio-edu-1'
        };

        const sample2: ScheduleItem = {
          id: 'sched-sample-2',
          type: 'CIRCLE',
          title: 'Sesi Kelompok Kavio Circle SD',
          circleName: 'Circle SD Juara 1',
          teacherName: 'Fatih Farhat',
          date: tomorrowStr,
          startTime: '16:00',
          endTime: '17:30',
          timeLabel: '16:00 - 17:30 WIB',
          status: 'scheduled',
          notes: 'Diskusi Kelompok & Quiz Interaktif',
          meetingLink: 'https://meet.google.com/kavio-circle-sd'
        };

        localItems = [sample1, sample2];
      }

      localItems.forEach(item => { if (item.id) map.set(item.id, item); });
      firestoreItems.forEach(item => { if (item.id) map.set(item.id, item); });

      setSchedules(Array.from(map.values()));
      setLoading(false);
    };

    let unsub = () => {};
    if (db) {
      try {
        const schedRef = collection(db, 'schedules');
        unsub = onSnapshot(schedRef, (snapshot) => {
          const items: ScheduleItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...docSnap.data() } as ScheduleItem);
          });
          loadData(items);
        }, (err) => {
          console.warn('Firestore schedules snapshot error:', err);
          loadData([]);
        });
      } catch {
        loadData([]);
      }
    } else {
      loadData([]);
    }

    const handleStorage = () => loadData([]);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('kavio_schedule_updated', handleStorage);

    return () => {
      unsub();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('kavio_schedule_updated', handleStorage);
    };
  }, []);

  // Calendar Date Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Generate calendar grid days
  const calendarDays = [];
  // Previous month padding
  const paddingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Start Monday
  for (let i = 0; i < paddingDays; i++) {
    calendarDays.push(null);
  }
  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    const fullDateStr = `${year}-${monthStr}-${dayStr}`;
    calendarDays.push({ day, dateStr: fullDateStr });
  }

  // Prev / Next Month Handlers
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().slice(0, 10));
  };

  // Filtered schedules for calendar grid & selected date
  const filteredSchedules = schedules.filter(s => typeFilter === 'ALL' || s.type === typeFilter);
  const selectedDateSchedules = filteredSchedules.filter(s => s.date === selectedDateStr);

  // Summary Statistics
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 7);

  const weeklyCount = filteredSchedules.filter(s => {
    const d = new Date(s.date);
    return d >= currentWeekStart && d <= currentWeekEnd;
  }).length;

  const monthlyCount = filteredSchedules.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  const privateCount = filteredSchedules.filter(s => s.type === 'PRIVATE').length;
  const circleCount = filteredSchedules.filter(s => s.type === 'CIRCLE').length;

  // Open Add Modal
  const handleOpenAddModal = (dateStr?: string) => {
    setEditingItem(null);
    setSessionType('PRIVATE');
    setSessionTitle('');
    setStudentOrCircleName('');
    setFormDate(dateStr || selectedDateStr);
    setStartTime('15:30');
    setEndTime('17:00');
    setStatus('scheduled');
    setMeetingLink('');
    setNotes('');
    setIsModalOpen(true);
  };

  // Open Edit / Reschedule Modal
  const handleOpenEditModal = (item: ScheduleItem) => {
    setEditingItem(item);
    setSessionType(item.type);
    setSessionTitle(item.title);
    setStudentOrCircleName(item.type === 'PRIVATE' ? (item.studentName || '') : (item.circleName || ''));
    setFormDate(item.date);
    setStartTime(item.startTime || '15:30');
    setEndTime(item.endTime || '17:00');
    setStatus(item.status);
    setMeetingLink(item.meetingLink || '');
    setNotes(item.notes || '');
    setIsModalOpen(true);
  };

  // Save Schedule Handler
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTitle.trim() || !formDate || !startTime || !endTime) {
      alert('Harap isi judul, tanggal, dan jam sesi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      const payload: ScheduleItem = {
        type: sessionType,
        title: sessionTitle.trim(),
        studentName: sessionType === 'PRIVATE' ? studentOrCircleName.trim() : undefined,
        circleName: sessionType === 'CIRCLE' ? studentOrCircleName.trim() : undefined,
        teacherName: user?.displayName || 'Pengajar Kavio',
        teacherId: user?.uid || undefined,
        date: formDate,
        startTime,
        endTime,
        timeLabel: `${startTime} - ${endTime} WIB`,
        status,
        notes: notes.trim(),
        meetingLink: meetingLink.trim(),
        createdAt: new Date().toISOString()
      };

      if (editingItem && editingItem.id) {
        // Edit existing
        if (db && !editingItem.id.startsWith('sched-sample-')) {
          await updateDoc(doc(db, 'schedules', editingItem.id), {
            ...payload,
            updatedAt: serverTimestamp()
          });
        }

        // Local storage sync
        const saved = localStorage.getItem('kavio_schedules');
        let list: ScheduleItem[] = saved ? JSON.parse(saved) : [];
        list = list.map(s => s.id === editingItem.id ? { ...payload, id: editingItem.id } : s);
        localStorage.setItem('kavio_schedules', JSON.stringify(list));
      } else {
        // Create new
        let newId = `sched-${Date.now()}`;
        if (db) {
          try {
            const docRef = await addDoc(collection(db, 'schedules'), {
              ...payload,
              createdAt: serverTimestamp()
            });
            newId = docRef.id;
          } catch (e) {
            console.warn('Firestore add schedule fallback to local:', e);
          }
        }

        const saved = localStorage.getItem('kavio_schedules');
        const list: ScheduleItem[] = saved ? JSON.parse(saved) : [];
        list.push({ id: newId, ...payload });
        localStorage.setItem('kavio_schedules', JSON.stringify(list));
      }

      window.dispatchEvent(new Event('kavio_schedule_updated'));
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving schedule:', err);
      alert('Gagal menyimpan jadwal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Schedule Handler
  const handleDeleteSchedule = async (id: string) => {
    if (!id) return;
    if (!window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;

    // 1. Immediately update local state
    setSchedules(prev => prev.filter(s => s.id !== id));

    // 2. Update local storage
    try {
      const saved = localStorage.getItem('kavio_schedules');
      if (saved) {
        const list: ScheduleItem[] = JSON.parse(saved);
        const filtered = list.filter(s => s.id !== id);
        localStorage.setItem('kavio_schedules', JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('Error removing schedule from localStorage:', e);
    }

    // 3. Safe Firestore deletion
    if (db && id && !id.startsWith('sched-sample-')) {
      try {
        await deleteDoc(doc(db, 'schedules', id));
      } catch (err) {
        console.warn('Firestore deleteDoc fallback (deleted locally):', err);
      }
    }

    window.dispatchEvent(new Event('kavio_schedule_updated'));
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn font-sans pb-16">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-300 dark:border-b-slate-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1CB0F6] text-white flex items-center justify-center shadow-md border-b-4 border-[#0092E0] shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#1CB0F6] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  MANAGEMENT KALENDER
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-display mt-0.5">
                JADWAL & BIMBINGAN GURU
              </h1>
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400">
                Kelola sesi bimbingan Private 1-on-1 dan Kavio Circle, atur tanggal, jam, dan perbaikan jadwal.
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between shrink-0">
          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-2 bg-[#58CC02] hover:bg-[#46A302] text-white text-xs font-black py-3 px-5 rounded-2xl border-b-4 border-[#3b8c00] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer shadow-xs uppercase tracking-wider"
            id="btn-add-schedule-teacher"
          >
            <Plus className="w-4 h-4" />
            <span>TAMBAH JADWAL SESI</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-gray-200 dark:border-slate-700 border-b-4 border-b-gray-300 dark:border-b-slate-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">SESI MINGGU INI</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white font-display">{weeklyCount} Sesi</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-gray-200 dark:border-slate-700 border-b-4 border-b-gray-300 dark:border-b-slate-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">SESI BULAN INI</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white font-display">{monthlyCount} Sesi</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-gray-200 dark:border-slate-700 border-b-4 border-b-gray-300 dark:border-b-slate-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase text-[#1CB0F6] tracking-wider block">JADWAL PRIVATE</span>
          <p className="text-2xl font-black text-[#1CB0F6] font-display">{privateCount} Sesi</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-gray-200 dark:border-slate-700 border-b-4 border-b-gray-300 dark:border-b-slate-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase text-[#CE82FF] tracking-wider block">JADWAL CIRCLE</span>
          <p className="text-2xl font-black text-[#CE82FF] font-display">{circleCount} Sesi</p>
        </div>
      </div>

      {/* Main Grid Section: Calendar Grid + Selected Date Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2-Cols: Interactive Calendar Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-300 dark:border-b-slate-900 shadow-sm space-y-6">
          
          {/* Calendar Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase font-display">
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={handleToday}
                className="text-[10px] font-black uppercase bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-gray-700 dark:text-slate-200 px-3 py-1 rounded-xl border border-gray-300 dark:border-slate-600 transition-all cursor-pointer"
              >
                Hari Ini
              </button>
            </div>

            {/* Month Nav Buttons & Type Filter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700/80 p-1 rounded-2xl border border-gray-200 dark:border-slate-600">
                <button
                  onClick={() => setTypeFilter('ALL')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                    typeFilter === 'ALL' ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setTypeFilter('PRIVATE')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                    typeFilter === 'PRIVATE' ? 'bg-[#1CB0F6] text-white shadow-xs' : 'text-gray-500'
                  }`}
                >
                  Private
                </button>
                <button
                  onClick={() => setTypeFilter('CIRCLE')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                    typeFilter === 'CIRCLE' ? 'bg-[#CE82FF] text-white shadow-xs' : 'text-gray-500'
                  }`}
                >
                  Circle
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-gray-700 dark:text-slate-200 rounded-xl cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-gray-700 dark:text-slate-200 rounded-xl cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-slate-700 pb-2">
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div>Sab</div>
            <div>Min</div>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, idx) => {
              if (!item) {
                return <div key={`pad-${idx}`} className="h-20 sm:h-24 bg-gray-50/50 dark:bg-slate-900/20 rounded-2xl" />;
              }

              const isSelected = item.dateStr === selectedDateStr;
              const isToday = item.dateStr === new Date().toISOString().slice(0, 10);
              const daySchedules = filteredSchedules.filter(s => s.date === item.dateStr);

              return (
                <div
                  key={item.dateStr}
                  onClick={() => setSelectedDateStr(item.dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? 'border-[#1CB0F6] bg-sky-50/60 dark:bg-sky-950/40 border-b-4 border-b-[#0092E0] shadow-sm'
                      : isToday
                      ? 'border-[#58CC02] bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-gray-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${
                      isToday ? 'bg-[#58CC02] text-white px-1.5 py-0.2 rounded-md' : 'text-gray-700 dark:text-slate-200'
                    }`}>
                      {item.day}
                    </span>

                    {daySchedules.length > 0 && (
                      <span className="bg-[#1CB0F6] text-white text-[9px] font-black px-1.5 py-0.2 rounded-md">
                        {daySchedules.length} Sesi
                      </span>
                    )}
                  </div>

                  {/* Day Badges Preview */}
                  <div className="space-y-1 overflow-hidden">
                    {daySchedules.slice(0, 2).map((s) => (
                      <div
                        key={s.id}
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-md truncate ${
                          s.type === 'PRIVATE' 
                            ? 'bg-[#1CB0F6]/15 text-[#1CB0F6] dark:text-[#1CB0F6]' 
                            : 'bg-[#CE82FF]/15 text-[#CE82FF]'
                        }`}
                      >
                        {s.type === 'PRIVATE' ? `👤 ${s.studentName || 'Private'}` : `👥 ${s.circleName || 'Circle'}`}
                      </div>
                    ))}
                    {daySchedules.length > 2 && (
                      <div className="text-[8px] font-bold text-gray-400 text-right">
                        +{daySchedules.length - 2} lagi
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1-Col: Selected Date Detail Drawer */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-300 dark:border-b-slate-900 shadow-sm space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">DETAIL TANGGAL</span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase font-display">
                  {selectedDateStr}
                </h3>
              </div>

              <button
                onClick={() => handleOpenAddModal(selectedDateStr)}
                className="p-2 bg-[#58CC02] text-white rounded-xl shadow-xs border-b-2 border-[#3b8c00] active:translate-y-[2px] cursor-pointer"
                title="Tambah Sesi Tanggal Ini"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* List of Scheds on Selected Date */}
            {selectedDateSchedules.length === 0 ? (
              <div className="p-8 text-center space-y-2 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl">
                <CalendarIcon className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs font-bold text-gray-400">Tidak ada sesi bimbingan pada tanggal ini.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {selectedDateSchedules.map((s) => (
                  <div
                    key={s.id}
                    className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        s.type === 'PRIVATE' ? 'bg-[#1CB0F6] text-white' : 'bg-[#CE82FF] text-white'
                      }`}>
                        {s.type}
                      </span>
                      <span className="text-[11px] font-black text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{s.timeLabel}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase leading-snug">
                        {s.title}
                      </h4>
                      <p className="text-xs font-bold text-gray-500 dark:text-slate-400">
                        {s.type === 'PRIVATE' ? `Siswa: ${s.studentName || 'Private'}` : `Circle: ${s.circleName || 'Circle'}`}
                      </p>
                    </div>

                    {s.meetingLink && (
                      <a
                        href={s.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1CB0F6] hover:underline"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Link Sesi Google Meet</span>
                      </a>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200/60 dark:border-slate-800">
                      <button
                        onClick={() => handleOpenEditModal(s)}
                        className="p-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 text-gray-700 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit / Pindah</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(s.id!)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit / Reschedule Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-400 z-50 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#1CB0F6] tracking-widest bg-[#1CB0F6]/10 px-2 py-0.5 rounded-md">
                    {editingItem ? 'EDIT / PINDAH JADWAL' : 'TAMBAH JADWAL SESI BARU'}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase font-display mt-1">
                    {editingItem ? 'ATUR ULANG SESI' : 'BUAT JADWAL BIMBINGAN'}
                  </h3>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveSchedule} className="space-y-4">
                {/* Type Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-slate-900 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setSessionType('PRIVATE')}
                    className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      sessionType === 'PRIVATE' ? 'bg-[#1CB0F6] text-white shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    👤 Private 1-on-1
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionType('CIRCLE')}
                    className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      sessionType === 'CIRCLE' ? 'bg-[#CE82FF] text-white shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    👥 Kavio Circle
                  </button>
                </div>

                {/* Judul Sesi */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">Judul Sesi / Topik</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bimbingan Intensif Matematika Dasar"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#1CB0F6] focus:outline-none"
                  />
                </div>

                {/* Nama Siswa / Circle Dropdown Suggestion from DB */}
                <div className="space-y-1 relative">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-200 flex items-center justify-between">
                    <span>{sessionType === 'PRIVATE' ? 'Nama Siswa Private (Ambil dari DB / Ketik)' : 'Nama Kelompok Circle (Ambil dari DB / Ketik)'}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {sessionType === 'PRIVATE' ? `${dbStudents.length} Siswa Terdaftar` : `${dbCircles.length} Circle Terdaftar`}
                    </span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={sessionType === 'PRIVATE' ? 'Ketik atau pilih dari daftar siswa...' : 'Ketik atau pilih dari daftar Circle...'}
                      value={studentOrCircleName}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={(e) => {
                        setStudentOrCircleName(e.target.value);
                        if (sessionType === 'PRIVATE') setSelectedStudentId('');
                        else setSelectedCircleId('');
                        setShowSuggestions(true);
                      }}
                      className={`w-full p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:outline-none ${
                        sessionType === 'PRIVATE' ? 'focus:border-[#1CB0F6]' : 'focus:border-[#CE82FF]'
                      }`}
                    />

                    {/* Suggestion Overlay Dropdown */}
                    {showSuggestions && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-700 shadow-2xl z-50 max-h-52 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700/60">
                        {sessionType === 'PRIVATE' ? (
                          dbStudents.filter(s => 
                            !studentOrCircleName.trim() || 
                            (s.fullName && s.fullName.toLowerCase().includes(studentOrCircleName.toLowerCase())) ||
                            (s.email && s.email.toLowerCase().includes(studentOrCircleName.toLowerCase()))
                          ).length === 0 ? (
                            <div className="p-3.5 text-center text-xs font-semibold text-gray-400">
                              Belum ada siswa terdaftar yang cocok di DB. Anda bisa tetap mengetikkan nama di atas.
                            </div>
                          ) : (
                            dbStudents
                              .filter(s => 
                                !studentOrCircleName.trim() || 
                                (s.fullName && s.fullName.toLowerCase().includes(studentOrCircleName.toLowerCase())) ||
                                (s.email && s.email.toLowerCase().includes(studentOrCircleName.toLowerCase()))
                              )
                              .map(student => (
                                <div
                                  key={student.uid || student.email}
                                  onClick={() => {
                                    setStudentOrCircleName(student.fullName || student.email || '');
                                    setSelectedStudentId(student.uid || '');
                                    setShowSuggestions(false);
                                  }}
                                  className="p-3 hover:bg-sky-50 dark:hover:bg-slate-700/60 cursor-pointer flex items-center justify-between transition-colors"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-sky-100 text-[#1CB0F6] flex items-center justify-center text-xs font-black shrink-0">
                                      {student.fullName?.charAt(0).toUpperCase() || 'S'}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-black text-gray-900 dark:text-white truncate leading-tight">
                                        {student.fullName || 'Siswa'}
                                      </p>
                                      <p className="text-[10px] text-gray-400 font-semibold truncate">{student.email}</p>
                                    </div>
                                  </div>

                                  <span className="bg-[#1CB0F6]/10 text-[#1CB0F6] text-[9px] font-black px-2 py-0.5 rounded-md uppercase shrink-0">
                                    {student.classType === 'CIRCLE' ? 'Circle' : 'Private'}
                                  </span>
                                </div>
                              ))
                          )
                        ) : (
                          dbCircles.filter(c => 
                            !studentOrCircleName.trim() || 
                            (c.name && c.name.toLowerCase().includes(studentOrCircleName.toLowerCase()))
                          ).length === 0 ? (
                            <div className="p-3.5 text-center text-xs font-semibold text-gray-400">
                              Belum ada Circle terdaftar yang cocok di DB. Anda bisa tetap mengetikkan nama Circle di atas.
                            </div>
                          ) : (
                            dbCircles
                              .filter(c => 
                                !studentOrCircleName.trim() || 
                                (c.name && c.name.toLowerCase().includes(studentOrCircleName.toLowerCase()))
                              )
                              .map(circle => (
                                <div
                                  key={circle.id}
                                  onClick={() => {
                                    setStudentOrCircleName(circle.name);
                                    setSelectedCircleId(circle.id);
                                    setShowSuggestions(false);
                                  }}
                                  className="p-3 hover:bg-purple-50 dark:hover:bg-slate-700/60 cursor-pointer flex items-center justify-between transition-colors"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-purple-100 text-[#CE82FF] flex items-center justify-center text-xs font-black shrink-0">
                                      👥
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-black text-gray-900 dark:text-white truncate leading-tight">
                                        {circle.name}
                                      </p>
                                      <p className="text-[10px] text-gray-400 font-semibold truncate">Group Circle</p>
                                    </div>
                                  </div>

                                  <span className="bg-[#CE82FF]/10 text-[#CE82FF] text-[9px] font-black px-2 py-0.5 rounded-md uppercase shrink-0">
                                    Circle DB
                                  </span>
                                </div>
                              ))
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tanggal & Jam */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-200">Tanggal</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-200">Jam Mulai</label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-200">Jam Selesai</label>
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Status & Meeting Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-200">Status Sesi</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold cursor-pointer"
                    >
                      <option value="scheduled">Scheduled (Terjadwal)</option>
                      <option value="completed">Completed (Selesai)</option>
                      <option value="rescheduled">Rescheduled (Dipindah)</option>
                      <option value="cancelled">Cancelled (Dibatalkan)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-200">Link Zoom / GMeet</label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">Catatan Sesi (Opsional)</label>
                  <textarea
                    rows={2}
                    placeholder="Masukkan catatan instruksi bimbingan..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white text-xs font-black py-3 rounded-2xl border-b-4 border-gray-300 dark:border-slate-900 cursor-pointer"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white text-xs font-black py-3 rounded-2xl shadow-lg border-b-4 border-[#3b8c00] active:border-b-0 active:translate-y-[4px] cursor-pointer uppercase tracking-wider"
                  >
                    {isSubmitting ? 'Memproses...' : 'SIMPAN JADWAL'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
