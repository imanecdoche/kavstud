import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet, 
  LayoutGrid, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  Calendar, 
  MessageSquare, 
  Loader2, 
  Edit3,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { PackageRegistration } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function PackageRegistrationsDev() {
  const [registrations, setRegistrations] = useState<PackageRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Schedule assignment modal state
  const [selectedReg, setSelectedReg] = useState<PackageRegistration | null>(null);
  const [assignedScheduleInput, setAssignedScheduleInput] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const availableScheduleOptions = [
    'Senin & Rabu (15.30 - 17.00 WIB)',
    'Selasa & Kamis (15.30 - 17.00 WIB)',
    'Senin & Rabu (19.00 - 20.30 WIB)',
    'Sabtu & Minggu (09.00 - 11.00 WIB)',
    'Custom (Jadwal Khusus Sesuai Kesepakatan)'
  ];

  // Function to load and combine registrations from Firestore + localStorage
  const loadRegistrations = (firestoreDocs: PackageRegistration[] = []) => {
    let localItems: PackageRegistration[] = [];
    try {
      const saved = localStorage.getItem('kavio_local_registrations');
      if (saved) localItems = JSON.parse(saved);
    } catch {}

    const combined = new Map<string, PackageRegistration>();

    // 1. Add local items first
    localItems.forEach(item => { 
      if (item.id) combined.set(item.id, item); 
    });

    // 2. Add Firestore items (overwriting matching IDs with cloud data)
    firestoreDocs.forEach(item => { 
      if (item.id) combined.set(item.id, item); 
    });

    let finalItems = Array.from(combined.values());

    // Sort by createdAt newest first
    finalItems.sort((a, b) => {
      const getTs = (val: any) => {
        if (!val) return 0;
        if (typeof val.toDate === 'function') return val.toDate().getTime();
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return new Date(val).getTime();
        return 0;
      };
      return getTs(b.createdAt) - getTs(a.createdAt);
    });

    setRegistrations(finalItems);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    let firestoreDocs: PackageRegistration[] = [];

    // 1. Initial load from LocalStorage
    loadRegistrations([]);

    // 2. Listen to Firestore
    let unsub = () => {};
    if (db) {
      try {
        const regRef = collection(db, 'package_registrations');
        unsub = onSnapshot(regRef, (snapshot) => {
          firestoreDocs = [];
          snapshot.forEach((docSnap) => {
            firestoreDocs.push({ id: docSnap.id, ...docSnap.data() } as PackageRegistration);
          });
          loadRegistrations(firestoreDocs);
        }, (err) => {
          console.warn('Firestore snapshot error, loading local fallback:', err);
          loadRegistrations(firestoreDocs);
        });
      } catch (err) {
        console.warn('Firestore listener error:', err);
        loadRegistrations([]);
      }
    }

    // 3. Listen to local storage & custom event changes
    const handleStorageChange = () => loadRegistrations(firestoreDocs);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('kavio_registration_added', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      unsub();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('kavio_registration_added', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      reg.studentName.toLowerCase().includes(searchLower) ||
      reg.guardianName.toLowerCase().includes(searchLower) ||
      reg.selectedPackageName.toLowerCase().includes(searchLower) ||
      reg.guardianPhone.toLowerCase().includes(searchLower) ||
      reg.studentAddress.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  // Export to CSV Function
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('Tidak ada data pendaftaran untuk diekspor.');
      return;
    }

    const headers = [
      'ID Pendaftaran',
      'Nama Wali',
      'Nama Siswa',
      'Umur Siswa',
      'Tanggal Lahir',
      'Alamat Siswa',
      'No WA Wali',
      'Paket Terpilih',
      'Tingkat Sekolah',
      'Opsi Sesi Favorit',
      'Jadwal Ditetapkan (DEV)',
      'Instruksi Tutor',
      'Status Pendaftaran',
      'Tanggal Mendaftar'
    ];

    const rows = filteredRegistrations.map((r) => {
      const dateStr = r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString('id-ID') : '-';
      return [
        `"${r.id || ''}"`,
        `"${r.guardianName.replace(/"/g, '""')}"`,
        `"${r.studentName.replace(/"/g, '""')}"`,
        `"${r.studentAge || 0} Tahun"`,
        `"${r.studentDob || ''}"`,
        `"${r.studentAddress.replace(/"/g, '""')}"`,
        `"${r.guardianPhone}"`,
        `"${r.selectedPackageName}"`,
        `"${r.gradeLevel || ''}"`,
        `"${(r.preferredSchedule || '').replace(/"/g, '""')}"`,
        `"${(r.assignedSchedule || '-').replace(/"/g, '""')}"`,
        `"${(r.tutorInstructions || '-').replace(/"/g, '""')}"`,
        `"${r.status.toUpperCase()}"`,
        `"${dateStr}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kavio_pendaftaran_paket_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenApproveModal = (reg: PackageRegistration) => {
    setSelectedReg(reg);
    setAssignedScheduleInput(reg.assignedSchedule || reg.preferredSchedule || availableScheduleOptions[0]);
    setIsAssignModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedReg || !selectedReg.id) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'package_registrations', selectedReg.id), {
        status: 'approved',
        assignedSchedule: assignedScheduleInput,
        updatedAt: serverTimestamp()
      });
      setIsAssignModalOpen(false);
      setSelectedReg(null);
    } catch (err) {
      console.error('Error approving registration:', err);
      alert('Gagal menyetujui pendaftaran.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (reg: PackageRegistration) => {
    if (!reg.id) return;
    if (!window.confirm(`Apakah Anda yakin ingin menolak pendaftaran paket untuk ${reg.studentName}?`)) return;

    try {
      await updateDoc(doc(db, 'package_registrations', reg.id), {
        status: 'rejected',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error rejecting registration:', err);
      alert('Gagal menolak pendaftaran.');
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans pb-16 text-white">
      
      {/* Header Banner */}
      <div className="bg-[#2F3138] rounded-[4px] p-6 sm:p-8 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[2px] bg-[#66C0F4] text-[#171A21] flex items-center justify-center font-bold shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#A1CD44] text-[#171A21] text-[10px] font-bold px-2 py-0.5 rounded-[2px] uppercase tracking-wider">
                  DEV / ADMIN PANEL
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-0.5">
                PENDAFTARAN PAKET SISWA
              </h1>
              <p className="text-xs text-[#C6D4DF]">
                Kelola pendaftaran paket, persetujuan admin, penentuan jadwal, dan ekspor spreadsheet CSV.
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbar: View Switcher & CSV Export */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between shrink-0">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-black/40 p-1 rounded-[2px] border border-white/15">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#66C0F4] text-[#171A21]'
                  : 'text-[#C6D4DF] hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Spreadsheet</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-[#66C0F4] text-[#171A21]'
                  : 'text-[#C6D4DF] hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Card View</span>
            </button>
          </div>

          {/* Export to CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#66C0F4] hover:bg-[#5DADE2] text-white text-xs font-bold py-2.5 px-4 rounded-[2px] transition-all cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            id="btn-export-csv"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#848E94]" />
          <input
            type="text"
            placeholder="Cari siswa, wali, paket, atau alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/15 text-white placeholder-[#8A8A8A] pl-10 pr-4 py-2 rounded-[2px] text-xs focus:outline-none focus:border-[#66C0F4]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'pending', label: 'Menunggu' },
            { id: 'approved', label: 'Disetujui' },
            { id: 'rejected', label: 'Ditolak' }
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-[2px] text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#66C0F4] text-[#171A21] border-[#66C0F4]'
                    : 'bg-transparent text-[#C6D4DF] border-white/15 hover:border-white/40'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-12 text-center space-y-3 border-2 border-gray-200 dark:border-slate-700">
          <Loader2 className="w-8 h-8 text-[#1CB0F6] animate-spin mx-auto" />
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Memuat Data Pendaftaran Paket...</p>
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-12 text-center space-y-3 border-2 border-dashed border-gray-200 dark:border-slate-700">
          <FileSpreadsheet className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-black text-gray-800 dark:text-slate-200">Belum Ada Pendaftaran Paket</h3>
          <p className="text-xs text-gray-400 font-bold max-w-sm mx-auto">
            Belum ada data pendaftaran siswa yang sesuai dengan filter atau kata kunci pencarian kamu.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* SPREADSHEET TABLE VIEW */
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-300 dark:border-b-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-900/80 text-gray-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b-2 border-gray-200 dark:border-slate-700">
                  <th className="p-4 font-black">Siswa & Umur</th>
                  <th className="p-4 font-black">Wali & WhatsApp</th>
                  <th className="p-4 font-black">Paket Dipilih</th>
                  <th className="p-4 font-black">Jadwal Sesi (Favorit vs Ditetapkan)</th>
                  <th className="p-4 font-black">Instruksi Tutor</th>
                  <th className="p-4 font-black">Status</th>
                  <th className="p-4 font-black text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-700/40 transition-colors">
                    {/* Siswa & Umur */}
                    <td className="p-4">
                      <p className="font-extrabold text-gray-900 dark:text-white text-sm">{reg.studentName}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">TGL: {reg.studentDob} ({reg.studentAge} Thn) • {reg.gradeLevel || 'SD'}</p>
                    </td>

                    {/* Wali & WA */}
                    <td className="p-4">
                      <p className="font-extrabold text-gray-800 dark:text-slate-200">{reg.guardianName}</p>
                      <a 
                        href={`https://wa.me/${reg.guardianPhone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-[#1CB0F6] hover:underline font-bold inline-flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{reg.guardianPhone}</span>
                      </a>
                    </td>

                    {/* Paket Dipilih */}
                    <td className="p-4">
                      <span className="inline-block bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-extrabold px-2.5 py-1 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        {reg.selectedPackageName}
                      </span>
                    </td>

                    {/* Jadwal */}
                    <td className="p-4 space-y-1">
                      <p className="text-gray-600 dark:text-slate-300 text-[11px]">
                        <span className="text-gray-400">Fav:</span> {reg.preferredSchedule || '-'}
                      </p>
                      {reg.assignedSchedule && (
                        <p className="text-[#58CC02] font-black text-[11px] bg-[#58CC02]/10 px-2 py-0.5 rounded-lg border border-[#58CC02]/20">
                          Fix: {reg.assignedSchedule}
                        </p>
                      )}
                    </td>

                    {/* Instruksi Tutor */}
                    <td className="p-4 max-w-[200px]">
                      <p className="text-gray-600 dark:text-slate-300 line-clamp-2 text-[11px] italic">
                        {reg.tutorInstructions ? `"${reg.tutorInstructions}"` : '-'}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {reg.status === 'approved' ? (
                        <span className="bg-[#58CC02] text-white text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider shadow-2xs">
                          Disetujui
                        </span>
                      ) : reg.status === 'rejected' ? (
                        <span className="bg-[#FF4B4B] text-white text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider shadow-2xs">
                          Ditolak
                        </span>
                      ) : (
                        <span className="bg-[#FFC800] text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider shadow-2xs">
                          Menunggu
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenApproveModal(reg)}
                          className="bg-[#58CC02] hover:bg-[#46A302] text-white text-[11px] font-black py-1.5 px-3 rounded-xl border-b-3 border-[#3b8c00] active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer"
                        >
                          {reg.status === 'approved' ? 'Ubah Jadwal' : 'Setujui & Jadwal'}
                        </button>
                        {reg.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(reg)}
                            className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-[11px] font-bold py-1.5 px-2.5 rounded-xl border border-gray-200 cursor-pointer"
                          >
                            Tolak
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistrations.map((reg) => (
            <div 
              key={reg.id}
              className="bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-gray-200 dark:border-slate-700 border-b-6 border-b-gray-300 dark:border-b-slate-900 p-6 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase">
                    {reg.selectedPackageName}
                  </span>
                  {reg.status === 'approved' ? (
                    <span className="bg-[#58CC02] text-white text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase">
                      Disetujui
                    </span>
                  ) : reg.status === 'rejected' ? (
                    <span className="bg-[#FF4B4B] text-white text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase">
                      Ditolak
                    </span>
                  ) : (
                    <span className="bg-[#FFC800] text-gray-900 text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase">
                      Menunggu
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase leading-tight font-display">
                    {reg.studentName}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 mt-0.5">
                    Wali: {reg.guardianName} • WA: {reg.guardianPhone}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-900 p-3.5 rounded-2xl space-y-2 text-xs font-bold text-gray-700 dark:text-slate-300 border border-gray-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Lahir: {reg.studentDob} ({reg.studentAge} Thn)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-[11px]">{reg.studentAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#1CB0F6] shrink-0" />
                    <span className="text-[11px]">Waktu Fav: {reg.preferredSchedule || '-'}</span>
                  </div>
                  {reg.assignedSchedule && (
                    <div className="flex items-center gap-2 text-[#58CC02]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] font-black">Jadwal Fix: {reg.assignedSchedule}</span>
                    </div>
                  )}
                  {reg.tutorInstructions && (
                    <div className="pt-1 border-t border-gray-200/60 dark:border-slate-800">
                      <span className="text-[10px] text-gray-400 block">Instruksi Tutor:</span>
                      <span className="italic text-[11px] font-medium text-gray-600 dark:text-slate-300">"{reg.tutorInstructions}"</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 border-t border-gray-100 dark:border-slate-700/60">
                <button
                  onClick={() => handleOpenApproveModal(reg)}
                  className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white text-xs font-black py-2.5 rounded-xl border-b-3 border-[#3b8c00] active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer text-center"
                >
                  {reg.status === 'approved' ? 'Ubah Jadwal' : 'Setujui & Jadwal'}
                </button>
                {reg.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(reg)}
                    className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-bold py-2.5 px-3 rounded-xl border border-gray-200 cursor-pointer"
                  >
                    Tolak
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Assignment Modal ("Pilihin Jadwal yang Available") */}
      <AnimatePresence>
        {isAssignModalOpen && selectedReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssignModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-400 z-50 space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-[#58CC02] tracking-widest bg-[#58CC02]/10 px-2 py-0.5 rounded-md">
                  PERSETUJUAN & PENENTUAN JADWAL
                </span>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase font-display mt-1">
                  PILIH JADWAL UNTUK {selectedReg.studentName.toUpperCase()}
                </h3>
                <p className="text-xs font-bold text-gray-500 dark:text-slate-400">
                  Paket: <strong className="text-indigo-600">{selectedReg.selectedPackageName}</strong> • Opsi Siswa: "{selectedReg.preferredSchedule || 'Tidak diisi'}"
                </p>
              </div>

              {/* Schedule Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                  Pilih / Ketik Jadwal Sesi Yang Tersedia (Available):
                </label>
                
                {/* Available Quick Options */}
                <div className="space-y-1.5">
                  {availableScheduleOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAssignedScheduleInput(opt)}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all border ${
                        assignedScheduleInput === opt
                          ? 'bg-[#58CC02]/10 border-[#58CC02] text-[#58CC02] font-black'
                          : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="pt-2 space-y-1">
                  <label className="block text-[11px] font-bold text-gray-500">Atau ketik opsi jadwal custom:</label>
                  <input
                    type="text"
                    value={assignedScheduleInput}
                    onChange={(e) => setAssignedScheduleInput(e.target.value)}
                    placeholder="Contoh: Rabu & Jumat 16.00 WIB"
                    className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#58CC02] focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white text-xs font-black py-3 rounded-2xl border-b-4 border-gray-300 dark:border-slate-900 cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleConfirmApprove}
                  className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white text-xs font-black py-3 rounded-2xl shadow-lg border-b-4 border-[#3b8c00] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
                  id="btn-confirm-assign-approve"
                >
                  {isUpdating ? 'Memproses...' : 'SETUJUI & SIMPAN'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
