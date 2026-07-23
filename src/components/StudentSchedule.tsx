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
      if (isCircleStudent) {
        if (s.circleId && userCircleId && s.circleId.toLowerCase() === userCircleId) return true;
        if (s.circleName && userCircleId && (s.circleName.toLowerCase().includes(userCircleId) || userCircleId.includes(s.circleName.toLowerCase()))) return true;
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

    if (dateStr === today) return { label: 'HARI INI', color: 'bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/40 font-mono' };
    if (dateStr === tomorrowStr) return { label: 'BESOK', color: 'bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/40 font-mono' };
    return { label: dateStr, color: 'bg-black/40 text-[#8A8A8A] border border-white/10 font-mono' };
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn font-sans pb-16 text-white">
      
      {/* Header Banner - Full Width Top Banner */}
      <div className="bg-[#2F3138] border border-white/10 p-6 sm:p-8 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
        <div className="space-y-2">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[2px] bg-black/40 text-[#66C0F4] flex items-center justify-center border border-white/10 shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#66C0F4]/20 text-[#66C0F4] text-[9px] font-bold px-2 py-0.5 rounded-[2px] border border-[#66C0F4]/30 uppercase tracking-wider font-mono">
                  JADWAL BELAJAR SAYA
                </span>
                <span className="bg-[#A1CD44]/20 text-[#A1CD44] text-[9px] font-bold px-2 py-0.5 rounded-[2px] border border-[#A1CD44]/30 uppercase tracking-wider font-mono">
                  {userProfile?.classType === 'CIRCLE' ? 'KELAS CIRCLE' : 'KELAS PRIVATE'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-1">
                KALENDER & SESI BIMBINGAN
              </h1>
              <p className="text-xs text-[#C6D4DF] mt-0.5">
                Lihat sesi bimbingan terjadwal Anda bersama guru serta slot waktu konsultasi yang tersedia.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-[2px] border border-white/15 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('reserved')}
            className={`px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full sm:w-auto ${
              activeSubTab === 'reserved'
                ? 'bg-[#66C0F4] text-[#171A21]'
                : 'text-[#C6D4DF] hover:bg-white/10 hover:text-white'
            }`}
          >
            Terjadwal ({reservedSchedules.length})
          </button>
          <button
            onClick={() => setActiveSubTab('available')}
            className={`px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full sm:w-auto ${
              activeSubTab === 'available'
                ? 'bg-[#A1CD44] text-[#171A21]'
                : 'text-[#C6D4DF] hover:bg-white/10 hover:text-white'
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
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              SESI BIMBINGAN TERJADWAL ({reservedSchedules.length})
            </h2>
          </div>

          {reservedSchedules.length === 0 ? (
            <div className="bg-[#2F3138] rounded-[3px] p-12 text-center space-y-3 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              <CalendarIcon className="w-10 h-10 text-[#8A8A8A] mx-auto" />
              <h3 className="text-sm font-bold text-white uppercase">Belum Ada Jadwal Sesi</h3>
              <p className="text-xs text-[#C6D4DF] max-w-sm mx-auto">
                Anda belum memiliki sesi bimbingan terjadwal. Guru pengajar Anda akan menentukan jadwal dalam waktu dekat.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservedSchedules.map((item) => {
                const countdown = getCountdownLabel(item.date);

                return (
                  <div
                    key={item.id}
                    className="bg-[#2F3138] rounded-[3px] p-6 border border-white/10 hover:border-[#66C0F4] shadow-[0_2px_8px_rgba(0,0,0,0.5)] space-y-4 flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-[2px] uppercase tracking-wider bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/30 font-mono">
                          {item.type === 'PRIVATE' ? 'PRIVATE 1-ON-1' : 'KAVIO CIRCLE'}
                        </span>

                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-[2px] uppercase tracking-wider ${countdown.color}`}>
                          {countdown.label}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white uppercase leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#C6D4DF] mt-1">
                          Pengajar: <strong className="text-white">{item.teacherName || 'Guru Kavio'}</strong>
                        </p>
                      </div>

                      <div className="bg-black/40 p-4 rounded-[2px] border border-white/10 space-y-2 text-xs font-medium text-[#C6D4DF]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#66C0F4] shrink-0" />
                          <span>Waktu Sesi: <strong className="text-white font-mono">{item.timeLabel}</strong></span>
                        </div>
                        {item.notes && (
                          <div className="pt-2 border-t border-white/10">
                            <span className="text-[10px] text-[#8A8A8A] block uppercase">Catatan Guru:</span>
                            <span className="italic text-[#C6D4DF]">"{item.notes}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Join Session Button */}
                    <div className="pt-2 border-t border-white/10">
                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-[40px] bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold rounded-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                          <Video className="w-4 h-4 text-[#171A21]" />
                          <span>MASUK SESI GOOGLE MEET</span>
                        </a>
                      ) : (
                        <div className="text-center py-2 text-xs text-[#8A8A8A] italic">
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
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
              SLOT WAKTU TERSEDIA / AVAILABLE ({availableSlots.length})
            </h2>
          </div>

          {availableSlots.length === 0 ? (
            <div className="bg-[#2F3138] rounded-[3px] p-12 text-center space-y-3 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              <Sparkles className="w-10 h-10 text-[#8A8A8A] mx-auto" />
              <h3 className="text-sm font-bold text-white uppercase">Tidak Ada Slot Tambahan</h3>
              <p className="text-xs text-[#C6D4DF] max-w-sm mx-auto">
                Saat ini belum ada slot waktu konsultasi ekstra yang dibuka oleh pengajar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSlots.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#2F3138] rounded-[3px] p-6 border border-[#A1CD44]/50 shadow-[0_2px_8px_rgba(0,0,0,0.5)] space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#A1CD44]/20 text-[#A1CD44] text-[9px] font-bold px-2.5 py-0.5 rounded-[2px] border border-[#A1CD44]/30 uppercase font-mono">
                        SLOT KONSULTASI AVAILABLE
                      </span>
                      <span className="text-xs font-bold text-[#8A8A8A] font-mono">{item.date}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white uppercase leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#C6D4DF] mt-1">
                        Pengajar: <strong className="text-white">{item.teacherName || 'Guru Kavio'}</strong>
                      </p>
                    </div>

                    <div className="bg-black/40 p-4 rounded-[2px] border border-white/10 space-y-1 text-xs text-[#C6D4DF]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#A1CD44] shrink-0" />
                        <span>Waktu: <strong className="text-white font-mono">{item.timeLabel}</strong></span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-[#C6D4DF] italic pt-1">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <a
                      href={item.meetingLink || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-[40px] bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] text-xs font-bold rounded-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                    >
                      <Video className="w-4 h-4 text-[#171A21]" />
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
