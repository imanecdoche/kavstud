import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Users, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  BookOpen, 
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { ScheduleItem, UserProfile } from '../types';
import { db, auth } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface StudentScheduleProps {
  userProfile?: UserProfile | null;
}

export default function StudentSchedule({ userProfile }: StudentScheduleProps) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'reserved' | 'available'>('reserved');

  useEffect(() => {
    setLoading(true);

    const loadData = (firestoreItems: ScheduleItem[] = []) => {
      let localItems: ScheduleItem[] = [];
      try {
        const saved = localStorage.getItem('kavio_schedules');
        if (saved) localItems = JSON.parse(saved);
      } catch {}

      const map = new Map<string, ScheduleItem>();

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
          console.warn('Student schedules snapshot error:', err);
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
  }, [userProfile]);

  const currentUser = auth.currentUser;
  const userFullName = (userProfile?.fullName || '').toLowerCase().trim();
  const userEmail = (userProfile?.email || currentUser?.email || '').toLowerCase().trim();
  const userCircleId = (userProfile?.circleId || '').toLowerCase().trim();
  const isCircleStudent = userProfile?.classType === 'CIRCLE';

  const mySchedules = schedules.filter((s) => {
    // 1. Available extra consultation slots -> Always show to all students
    if (s.isAvailableSlot) return true;

    // 2. Direct student ID match
    if (s.studentId && currentUser && s.studentId === currentUser.uid) return true;

    // 3. Name or Email match
    if (s.studentName) {
      const sName = s.studentName.toLowerCase().trim();
      if (userFullName && (sName.includes(userFullName) || userFullName.includes(sName))) return true;
      if (userEmail && (sName.includes(userEmail) || userEmail.includes(sName))) return true;
    }

    // 4. Circle Match
    if (s.type === 'CIRCLE') {
      // If student is in CIRCLE class type
      if (isCircleStudent) {
        if (s.circleId && userCircleId && s.circleId.toLowerCase() === userCircleId) return true;
        if (s.circleName && userCircleId && (s.circleName.toLowerCase().includes(userCircleId) || userCircleId.includes(s.circleName.toLowerCase()))) return true;
        // General circle schedule -> show to all circle students
        return true;
      }
    }

    // 5. Fallback if no specific student/circle assigned (general schedule)
    if (!s.studentId && !s.studentName && !s.circleId && !s.circleName) {
      return true;
    }

    return false;
  });

  // Filter reserved vs available slots
  const reservedSchedules = mySchedules.filter(s => !s.isAvailableSlot);
  const availableSlots = mySchedules.filter(s => s.isAvailableSlot);

  // Helper for date countdown labels
  const getCountdownLabel = (dateStr: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    if (dateStr === today) return { label: 'HARI INI', color: 'bg-[#58CC02] text-white animate-pulse' };
    if (dateStr === tomorrowStr) return { label: 'BESOK', color: 'bg-[#1CB0F6] text-white' };
    return { label: dateStr, color: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300' };
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn font-sans pb-16">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-300 dark:border-b-slate-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#58CC02] text-white flex items-center justify-center shadow-md border-b-4 border-[#3b8c00] shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#58CC02] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  JADWAL BELAJAR SAYA
                </span>
                <span className="bg-purple-100 text-purple-800 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {userProfile?.classType === 'CIRCLE' ? 'KELAS CIRCLE 👥' : 'KELAS PRIVATE 👤'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-display mt-0.5">
                KALENDER & SESI BIMBINGAN
              </h1>
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400">
                Lihat sesi bimbingan terjadwal Anda bersama guru serta slot waktu konsultasi yang tersedia.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center bg-gray-100 dark:bg-slate-700/80 p-1.5 rounded-2xl border border-gray-200 dark:border-slate-600 shrink-0">
          <button
            onClick={() => setActiveSubTab('reserved')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'reserved'
                ? 'bg-[#1CB0F6] text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-300 hover:text-gray-900'
            }`}
          >
            Terjadwal ({reservedSchedules.length})
          </button>
          <button
            onClick={() => setActiveSubTab('available')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'available'
                ? 'bg-[#58CC02] text-white shadow-sm'
                : 'text-gray-600 dark:text-slate-300 hover:text-gray-900'
            }`}
          >
            Slot Available ({availableSlots.length})
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {activeSubTab === 'reserved' ? (
        /* RESERVED SCHEDULES LIST */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase font-display">
              SESI BIMBINGAN TERJADWAL ({reservedSchedules.length})
            </h2>
          </div>

          {reservedSchedules.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 text-center space-y-3 border-2 border-dashed border-gray-200 dark:border-slate-700">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-black text-gray-800 dark:text-slate-200">Belum Ada Jadwal Sesi</h3>
              <p className="text-xs text-gray-400 font-bold max-w-sm mx-auto">
                Anda belum memiliki sesi bimbingan terjadwal. Guru pengajar Anda akan menentukan jadwal dalam waktu dekat.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reservedSchedules.map((item) => {
                const countdown = getCountdownLabel(item.date);

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border-2 border-gray-200 dark:border-slate-700 border-b-6 border-b-gray-300 dark:border-b-slate-900 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${
                          item.type === 'PRIVATE' ? 'bg-[#1CB0F6] text-white' : 'bg-[#CE82FF] text-white'
                        }`}>
                          {item.type === 'PRIVATE' ? '👤 PRIVATE 1-ON-1' : '👥 KAVIO CIRCLE'}
                        </span>

                        <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${countdown.color}`}>
                          {countdown.label}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase leading-tight font-display">
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mt-1">
                          Pengajar: <strong className="text-gray-900 dark:text-white">{item.teacherName || 'Guru Kavio'}</strong>
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/60 space-y-2 text-xs font-bold text-gray-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#1CB0F6] shrink-0" />
                          <span>Waktu Sesi: <strong>{item.timeLabel}</strong></span>
                        </div>
                        {item.notes && (
                          <div className="pt-1 border-t border-gray-200/60 dark:border-slate-800">
                            <span className="text-[10px] text-gray-400 block">Catatan Guru:</span>
                            <span className="italic text-gray-600 dark:text-slate-300">"{item.notes}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Join Session Button */}
                    <div className="pt-2 border-t border-gray-100 dark:border-slate-700/60">
                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white text-xs font-black py-3 rounded-xl border-b-4 border-[#3b8c00] active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider shadow-xs"
                        >
                          <Video className="w-4 h-4" />
                          <span>MASUK SESI GOOGLE MEET</span>
                        </a>
                      ) : (
                        <div className="text-center py-2 text-xs font-bold text-gray-400 italic">
                          Link Google Meet akan diberikan sebelum sesi dimulai.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* AVAILABLE SLOTS LIST */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase font-display">
              SLOT WAKTU TERSEDIA / AVAILABLE ({availableSlots.length})
            </h2>
          </div>

          {availableSlots.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 text-center space-y-3 border-2 border-dashed border-gray-200 dark:border-slate-700">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-black text-gray-800 dark:text-slate-200">Tidak Ada Slot Tambahan</h3>
              <p className="text-xs text-gray-400 font-bold max-w-sm mx-auto">
                Saat ini belum ada slot waktu konsultasi ekstra yang dibuka oleh pengajar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableSlots.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border-2 border-[#58CC02] border-b-6 border-b-[#46A302] shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#58CC02] text-white text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase">
                        SLOT KONSULTASI AVAILABLE
                      </span>
                      <span className="text-xs font-black text-gray-500">{item.date}</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase leading-tight font-display">
                        {item.title}
                      </h3>
                      <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mt-1">
                        Pengajar: <strong>{item.teacherName || 'Guru Kavio'}</strong>
                      </p>
                    </div>

                    <div className="bg-emerald-50/50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800 space-y-1 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#58CC02] shrink-0" />
                        <span>Waktu: <strong>{item.timeLabel}</strong></span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 italic pt-1">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={item.meetingLink || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-[#1CB0F6] hover:bg-[#0092E0] text-white text-xs font-black py-3 rounded-xl border-b-4 border-[#0092E0] active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                    >
                      <Video className="w-4 h-4" />
                      <span>IKUTI KONSULTASI</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
