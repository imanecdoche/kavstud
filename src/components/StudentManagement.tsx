import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Award, 
  Clock, 
  Send, 
  X, 
  ChevronRight, 
  CircleDot, 
  Calendar,
  TrendingUp,
  FileCheck,
  Edit,
  Save,
  Trash2,
  Sliders,
  ShieldAlert,
  Loader2,
  Plus,
  ExternalLink,
  Key,
  ArrowUpDown
} from 'lucide-react';
import { UserProfile, Assignment, Submission } from '../types';
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import CustomDropdown from './CustomDropdown';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog } from '@capacitor/dialog';

interface StudentManagementProps {
  students: UserProfile[];
  assignments: Assignment[];
  submissions: Submission[];
  circles: any[];
  onNavigate: (path: string) => void;
  onSendAssignmentToStudent: (studentId: string) => void;
}

export default function StudentManagement({
  students,
  assignments,
  submissions,
  circles,
  onNavigate,
  onSendAssignmentToStudent
}: StudentManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<'all' | 'PRIVATE' | 'CIRCLE'>('all');
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  // Teacher Control Panel Editing State
  const [editClassType, setEditClassType] = useState<'PRIVATE' | 'CIRCLE'>('PRIVATE');
  const [editCircleId, setEditCircleId] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('active');
  const [isSavingControl, setIsSavingControl] = useState(false);
  const [controlSuccessMsg, setControlSuccessMsg] = useState<string | null>(null);
  const [controlErrorMsg, setControlErrorMsg] = useState<string | null>(null);

  // Dynamic modules list for Direct Access panel
  const [allModules, setAllModules] = useState<any[]>([]);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [studentAccessModuleIds, setStudentAccessModuleIds] = useState<string[]>([]);
  const [isSavingAccess, setIsSavingAccess] = useState(false);
  const [accessSortOrder, setAccessSortOrder] = useState<'title-asc' | 'title-desc'>('title-asc');

  useEffect(() => {
    const fetchAllModules = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'modules'), orderBy('title', 'asc')));
        const fetched: any[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        setAllModules(fetched);
      } catch (err) {
        console.error('Error fetching modules for student management:', err);
      }
    };
    fetchAllModules();
  }, []);

  const handleOpenModuleAccessModal = () => {
    if (!selectedStudent) return;
    setStudentAccessModuleIds(selectedStudent.unlockedModules || []);
    setIsAccessModalOpen(true);
  };

  const handleSaveModuleAccess = async () => {
    if (!selectedStudent) return;

    try {
      setIsSavingAccess(true);
      await updateDoc(doc(db, 'users', selectedStudent.uid), {
        unlockedModules: studentAccessModuleIds
      });

      // Update in local state copy
      setSelectedStudent(prev => prev ? {
        ...prev,
        unlockedModules: studentAccessModuleIds
      } : null);

      setIsAccessModalOpen(false);
      setControlSuccessMsg('Akses modul siswa berhasil diperbarui!');
      setTimeout(() => setControlSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Error saving module access:', err);
      await Dialog.alert({
        title: 'Error',
        message: 'Gagal memperbarui akses modul siswa.'
      });
    } finally {
      setIsSavingAccess(false);
    }
  };

  // Initialize edit fields when student selected
  const handleOpenStudentModal = (student: UserProfile) => {
    setSelectedStudent(student);
    setEditClassType(student.classType || 'PRIVATE');
    setEditCircleId(student.circleId || '');
    setEditStatus((student as any).status || 'active');
    setControlSuccessMsg(null);
    setControlErrorMsg(null);
  };

  // Save student controls to Firestore
  const handleSaveStudentControls = async () => {
    if (!selectedStudent) return;

    // Strict Validation: If classType is CIRCLE, a circle must be selected!
    if (editClassType === 'CIRCLE' && !editCircleId) {
      setControlErrorMsg('Harap pilih Kelompok Circle Belajar!');
      setControlSuccessMsg(null);
      return;
    }

    try {
      setIsSavingControl(true);
      setControlSuccessMsg(null);
      setControlErrorMsg(null);

      await updateDoc(doc(db, 'users', selectedStudent.uid), {
        classType: editClassType,
        circleId: editClassType === 'CIRCLE' ? editCircleId : null,
        status: editStatus
      });

      // Update local state copy
      setSelectedStudent(prev => prev ? {
        ...prev,
        classType: editClassType,
        circleId: editClassType === 'CIRCLE' ? editCircleId : null,
        status: editStatus as any
      } : null);

      setControlSuccessMsg('Data kontrol siswa berhasil diperbarui!');
      setTimeout(() => setControlSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Error saving student controls:', err);
      setControlErrorMsg('Gagal memperbarui kontrol siswa.');
    } finally {
      setIsSavingControl(false);
    }
  };

  // Revoke/Delete assignment for this student
  const handleDeleteStudentAssignment = async (assignId: string) => {
    const { value } = await Dialog.confirm({
      title: 'Hapus Penugasan',
      message: 'Apakah Anda yakin ingin menghapus/membatalkan penugasan ini untuk siswa?',
      okButtonTitle: 'Hapus',
      cancelButtonTitle: 'Batal'
    });
    if (!value) return;
    try {
      await deleteDoc(doc(db, 'assignments', assignId));
      await Dialog.alert({
        title: 'Sukses',
        message: 'Penugasan berhasil dihapus.'
      });
    } catch (err) {
      console.error('Error deleting assignment:', err);
      await Dialog.alert({
        title: 'Error',
        message: 'Gagal menghapus penugasan.'
      });
    }
  };

  // Helper to get circle name by circleId
  const getCircleName = (circleId?: string | null) => {
    if (!circleId) return null;
    const found = circles.find(c => c.id === circleId);
    return found ? found.name : null;
  };

  // Helper stats calculation for a specific student
  const getStudentStats = (studentId: string, circleId?: string | null) => {
    // Student's received assignments (individual + circle assignments)
    const studentAssigns = assignments.filter(a => 
      a.studentId === studentId || (circleId && a.targetId === circleId)
    );

    // Student's submissions
    const studentSubs = submissions.filter(s => s.studentId === studentId);
    const completedSubs = studentSubs.filter(s => s.status === 'graded');

    // Scores
    const gradedScores = studentSubs
      .map(s => s.score)
      .filter((s): s is number => s !== null && s !== undefined);

    const averageScore = gradedScores.length > 0
      ? Math.round(gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length)
      : 0;

    // Weekly stats (last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklySubs = studentSubs.filter(s => {
      if (!s.submittedAt) return false;
      const subDate = new Date(s.submittedAt.seconds ? s.submittedAt.seconds * 1000 : s.submittedAt);
      return subDate >= sevenDaysAgo && s.score !== null;
    });

    const weeklyAvg = weeklySubs.length > 0
      ? Math.round(weeklySubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / weeklySubs.length)
      : averageScore;

    // Monthly stats (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthlySubs = studentSubs.filter(s => {
      if (!s.submittedAt) return false;
      const subDate = new Date(s.submittedAt.seconds ? s.submittedAt.seconds * 1000 : s.submittedAt);
      return subDate >= thirtyDaysAgo && s.score !== null;
    });

    const monthlyAvg = monthlySubs.length > 0
      ? Math.round(monthlySubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / monthlySubs.length)
      : averageScore;

    return {
      receivedCount: studentAssigns.length,
      submittedCount: studentSubs.length,
      completedCount: completedSubs.length,
      averageScore,
      weeklyAvg,
      monthlyAvg,
      studentAssigns,
      studentSubs
    };
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getCircleName(student.circleId) || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = 
      classFilter === 'all' || 
      (classFilter === 'PRIVATE' && student.classType === 'PRIVATE') ||
      (classFilter === 'CIRCLE' && (student.classType === 'CIRCLE' || student.circleId));

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto" id="student-management-page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-700/50 pb-6">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Manajemen Pembelajaran</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
            Manajemen Siswa ({students.length})
          </h1>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Class Type Filter */}
          <div className="flex bg-gray-100 dark:bg-slate-700/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setClassFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                classFilter === 'all' ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-3xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200'
              }`}
            >
              Semua ({students.length})
            </button>
            <button
              onClick={() => setClassFilter('PRIVATE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                classFilter === 'PRIVATE' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-3xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200'
              }`}
            >
              Privat
            </button>
            <button
              onClick={() => setClassFilter('CIRCLE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                classFilter === 'CIRCLE' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-3xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200'
              }`}
            >
              Circle
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari siswa berdasarkan nama, email, atau nama Circle..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs"
        />
      </div>

      {/* Students Cards Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => {
            const circleName = getCircleName(student.circleId);
            const stats = getStudentStats(student.uid, student.circleId);

            return (
              <div
                key={student.uid}
                onClick={() => handleOpenStudentModal(student)}
                className="card-duo-interactive p-5 flex flex-col justify-between space-y-5 shadow-xs"
              >
                <div className="space-y-4">
                  {/* Card Top Header: Avatar & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-base overflow-hidden border border-indigo-100 dark:border-indigo-800/50 shrink-0 group-hover:scale-105 transition-transform shadow-3xs">
                      <img 
                        src={student.photoURL || '/aset/default-avatar.svg'} 
                        alt={student.fullName} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/aset/default-avatar.svg';
                        }}
                      />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                        student.classType === 'CIRCLE' || circleName
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 border border-indigo-100 dark:border-indigo-800/50'
                          : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border border-emerald-100 dark:border-emerald-800/50'
                      }`}>
                        {student.classType === 'CIRCLE' || circleName ? 'Circle' : 'Privat'}
                      </span>

                      {circleName && (
                        <span className="text-[9px] font-bold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                          {circleName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Student Name & Email */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:text-indigo-400 transition-colors truncate">
                      {student.fullName}
                    </h3>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {student.email}
                    </p>
                  </div>

                  {/* Metrics preview */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-slate-700/50/80 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-slate-300 font-bold bg-gray-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-slate-700/50">
                      <BookOpen className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>{stats.submittedCount}/{stats.receivedCount} Tugas</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-amber-700 font-extrabold bg-amber-50 dark:bg-amber-900/30/60 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-800/50">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Skor {stats.averageScore}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action button (Icon Only) */}
                <button
                  type="button"
                  title="Buka Detail Siswa"
                  className="w-full btn-duo-blue py-2 text-xs font-black flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700 dark:text-slate-200">Tidak ada siswa yang ditemukan</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Coba ganti kata kunci pencarian atau pilih filter kelas yang berbeda.
          </p>
        </div>
      )}

      {/* Detail Modal Popup Window */}
      {selectedStudent && (() => {
        const circleName = getCircleName(selectedStudent.circleId);
        const stats = getStudentStats(selectedStudent.uid, selectedStudent.circleId);

        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="modal-duo w-[800px] max-h-[85vh] max-w-[95vw] overflow-hidden relative flex flex-col p-0 shadow-2xl">
              <div className="w-full h-full overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:bg-slate-700 rounded-full transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header: Student Info */}
              <div className="flex items-start gap-4 pr-8 border-b border-gray-100 dark:border-slate-700/50 pb-6">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-xl overflow-hidden border border-indigo-100 dark:border-indigo-800/50 shrink-0 shadow-xs">
                  {selectedStudent.photoURL ? (
                    <img 
                      src={selectedStudent.photoURL} 
                      alt={selectedStudent.fullName} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    selectedStudent.fullName.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                      {selectedStudent.fullName}
                    </h2>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      selectedStudent.classType === 'CIRCLE' || circleName
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 border border-indigo-100 dark:border-indigo-800/50'
                        : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border border-emerald-100 dark:border-emerald-800/50'
                    }`}>
                      {selectedStudent.classType === 'CIRCLE' || circleName ? 'Kelas Circle' : 'Kelas Privat'}
                    </span>
                    {circleName && (
                      <span className="text-[10px] font-bold text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                        {circleName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    {selectedStudent.email} {selectedStudent.phone ? `• ${selectedStudent.phone}` : ''}
                  </p>

                  {selectedStudent.bio && (
                    <p className="text-xs text-gray-600 dark:text-slate-300 italic pt-1">
                      "{selectedStudent.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* Four Performance Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Total Received */}
                <div className="bg-gray-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50 space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Total Tugas</span>
                  <span className="text-xl font-bold font-mono text-gray-900 dark:text-white block">{stats.receivedCount}</span>
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Diterima</span>
                </div>

                {/* Total Submitted */}
                <div className="bg-emerald-50 dark:bg-emerald-900/30/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 space-y-1">
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Dikerjakan</span>
                  <span className="text-xl font-bold font-mono text-emerald-700 block">{stats.submittedCount}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">{stats.completedCount} Sudah Dinilai</span>
                </div>

                {/* Average Score */}
                <div className="bg-indigo-50 dark:bg-indigo-900/30/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 space-y-1">
                  <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-wider block">Rata-Rata</span>
                  <span className="text-xl font-bold font-mono text-indigo-700 block">{stats.averageScore}</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block">Skor Akhir</span>
                </div>

                {/* Monthly/Weekly Accumulation */}
                <div className="bg-amber-50 dark:bg-amber-900/30/40 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/50 space-y-1">
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">Akumulasi Bulanan</span>
                  <span className="text-xl font-bold font-mono text-amber-700 block">{stats.monthlyAvg}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 block">Mingguan: {stats.weeklyAvg}</span>
                </div>
              </div>

              {/* Teacher Control Panel (Edit ClassType, Circle, Status) */}
              <div className="card-duo p-5 bg-sky-50/50 border-2 border-sky-200 border-b-4 border-sky-300 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4.5 h-4.5 text-sky-600" />
                    <h3 className="text-xs font-black text-sky-950 uppercase tracking-wider">
                      EDIT DATA SISWA
                    </h3>
                  </div>
                  {controlErrorMsg && (
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 animate-fadeIn flex items-center gap-1">
                      ⚠️ {controlErrorMsg}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Class Type Selector */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Tipe Kelas</label>
                    <CustomDropdown
                      value={editClassType}
                      onChange={(val) => {
                        const newType = val as 'PRIVATE' | 'CIRCLE';
                        setEditClassType(newType);
                        setControlErrorMsg(null);
                        if (newType === 'PRIVATE') {
                          setEditCircleId('');
                        } else if (newType === 'CIRCLE' && !editCircleId && circles.length > 0) {
                          setEditCircleId(circles[0].id);
                        }
                      }}
                      options={[
                        { value: 'PRIVATE', label: 'Kelas Privat' },
                        { value: 'CIRCLE', label: 'Kelas Circle' }
                      ]}
                      className="w-full"
                    />
                  </div>

                  {/* Circle Selector */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Circle Belajar</label>
                    <CustomDropdown
                      value={editCircleId}
                      onChange={(val) => setEditCircleId(val)}
                      disabled={editClassType !== 'CIRCLE'}
                      placeholder="(Tanpa Circle)"
                      options={[
                        { value: '', label: '(Tanpa Circle)' },
                        ...circles.map(c => ({ value: c.id, label: c.name }))
                      ]}
                      className="w-full"
                    />
                  </div>

                  {/* Status Selector */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Status Siswa</label>
                    <CustomDropdown
                      value={editStatus}
                      onChange={(val) => setEditStatus(val)}
                      options={[
                        { value: 'active', label: 'Aktif' },
                        { value: 'remedial', label: 'Remedial / Perlu Perhatian' },
                        { value: 'suspended', label: 'Nonaktif / Suspended' }
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleSaveStudentControls}
                    disabled={isSavingControl}
                    title="Simpan Perubahan"
                    className="btn-duo-green px-4 py-2.5 text-xs font-black flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    {isSavingControl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Direct Action Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-200 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-100">Kirim Tugas</span>
                  </div>
                  <button
                    onClick={() => {
                      const sId = selectedStudent.uid;
                      setSelectedStudent(null);
                      onSendAssignmentToStudent(sId);
                    }}
                    className="btn-duo-green px-5 py-2.5 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>TUGAS</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-extrabold text-purple-900">Akses Modul Belajar</span>
                  </div>
                  <button
                    onClick={handleOpenModuleAccessModal}
                    className="btn-duo-purple px-5 py-2.5 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Key className="w-4 h-4" />
                    <span>AKSES MODUL</span>
                  </button>
                </div>
              </div>

              {/* Assignments List for this Student */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Daftar Tugas Siswa</h4>

                {stats.studentAssigns.length > 0 ? (
                  <div className="space-y-2.5">
                    {stats.studentAssigns.map(assign => {
                      const sub = stats.studentSubs.find(s => s.assignmentId === assign.id);

                      return (
                        <div
                          key={assign.id}
                          className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl flex items-center justify-between gap-4 hover:border-indigo-100 dark:border-indigo-800/50 transition-colors"
                        >
                          <div className="min-w-0 space-y-1">
                            <h5 className="text-xs font-bold text-gray-900 dark:text-white truncate">{assign.title}</h5>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400">
                              {assign.deadline && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {assign.deadline}
                                </span>
                              )}
                              <span>Tipe: {assign.assignmentType || 'Standard'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {sub ? (
                              <div className="text-right">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                                  sub.status === 'graded' 
                                    ? 'bg-green-50 text-green-700 border border-green-100' 
                                    : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border border-amber-100 dark:border-amber-800/50'
                                }`}>
                                  {sub.status === 'graded' ? `Nilai: ${sub.score ?? '-'}` : 'Menunggu Review'}
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400">
                                Belum Dikerjakan
                              </span>
                            )}

                            {sub && (
                              <button
                                onClick={() => {
                                  setSelectedStudent(null);
                                  onNavigate(`/submission/${assign.id}`);
                                }}
                                className="p-1.5 bg-gray-50 dark:bg-slate-900 hover:bg-sky-50 text-gray-600 dark:text-slate-300 hover:text-sky-600 rounded-lg cursor-pointer transition-colors"
                                title="Lihat Lembar Jawaban"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteStudentAssignment(assign.id)}
                              className="p-1.5 bg-gray-50 dark:bg-slate-900 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                              title="Hapus Penugasan Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-gray-400 italic bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    Belum ada tugas yang dikirimkan untuk siswa ini.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
      })()}
      {/* Smooth Bottom-Right Toast Notification */}
      <AnimatePresence>
        {controlSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-[9999] bg-[#58CC02] text-white border-2 border-[#46A302] border-b-4 border-[#3b8a02] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black"
          >
            <CheckCircle className="w-5 h-5 text-white shrink-0" />
            <span>{controlSuccessMsg}</span>
            <button
              type="button"
              onClick={() => setControlSuccessMsg(null)}
              className="ml-2 p-1 hover:bg-[#46A302] rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Module Access Modal for Student */}
      <AnimatePresence>
        {isAccessModalOpen && selectedStudent && (() => {
          // Group modules by level
          const levels = ['elementary', 'junior', 'senior'] as const;
          
          // Sort modules function
          const sortModules = (mods: any[]) => {
            return [...mods].sort((a, b) => {
              const comparison = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
              return accessSortOrder === 'title-asc' ? comparison : -comparison;
            });
          };

          return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fadeIn">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="modal-duo w-[760px] max-h-[85vh] max-w-[95vw] p-6 space-y-4 bg-white dark:bg-slate-800 shadow-2xl relative flex flex-col"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsAccessModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:bg-slate-700 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header Title */}
                <div className="border-b border-gray-100 dark:border-slate-700/50 pb-3 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">KONTROL AKSES MODUL SISWA</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Pilih modul materi pembelajaran yang berhak diakses oleh {selectedStudent.fullName}.</p>
                  </div>

                  {/* Sorting Action button */}
                  <button
                    type="button"
                    onClick={() => setAccessSortOrder(prev => prev === 'title-asc' ? 'title-desc' : 'title-asc')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:bg-slate-700 transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>SORT: {accessSortOrder === 'title-asc' ? 'A-Z' : 'Z-A'}</span>
                  </button>
                </div>

                {/* Grouped Modules List */}
                <div className="flex-1 overflow-y-auto space-y-5 p-1 custom-scrollbar">
                  {allModules.length > 0 ? (
                    levels.map((level) => {
                      const levelModules = allModules.filter(m => m.level === level);
                      if (levelModules.length === 0) return null;

                      const sortedLevelModules = sortModules(levelModules);

                      // Check parent checkbox status
                      const checkedCount = sortedLevelModules.filter(m => studentAccessModuleIds.includes(m.id)).length;
                      const allChecked = checkedCount === sortedLevelModules.length;
                      const someChecked = checkedCount > 0 && !allChecked;

                      // Click parent action
                      const handleToggleLevelParent = () => {
                        const moduleIdsInLevel = sortedLevelModules.map(m => m.id);
                        if (allChecked) {
                          // Uncheck all in this level
                          setStudentAccessModuleIds(prev => prev.filter(id => !moduleIdsInLevel.includes(id)));
                        } else {
                          // Check all in this level
                          setStudentAccessModuleIds(prev => Array.from(new Set([...prev, ...moduleIdsInLevel])));
                        }
                      };

                      return (
                        <div key={level} className="space-y-3 bg-gray-50 dark:bg-slate-900/30 border border-gray-100 dark:border-slate-700/50 rounded-2xl p-4">
                          {/* Parent (Level Header) */}
                          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50 pb-2.5">
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={allChecked}
                                ref={(el) => {
                                  if (el) {
                                    el.indeterminate = someChecked;
                                  }
                                }}
                                onChange={handleToggleLevelParent}
                                className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400 rounded border-gray-350 focus:ring-indigo-500 cursor-pointer"
                              />
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                                level === 'elementary' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border-amber-200' :
                                level === 'junior' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200'
                              }`}>
                                {level}
                              </span>
                            </label>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {checkedCount} / {sortedLevelModules.length} Modul Terpilih
                            </span>
                          </div>

                          {/* Children Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
                            {sortedLevelModules.map((m) => {
                              const hasAccess = studentAccessModuleIds.includes(m.id);
                              return (
                                <label key={m.id} className={`flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border rounded-xl cursor-pointer hover:border-indigo-200 transition-colors select-none ${
                                  hasAccess ? 'border-indigo-100 dark:border-indigo-800/50 shadow-3xs' : 'border-gray-150'
                                }`}>
                                  <input
                                    type="checkbox"
                                    checked={hasAccess}
                                    onChange={() => {
                                      if (hasAccess) {
                                        setStudentAccessModuleIds(prev => prev.filter(id => id !== m.id));
                                      } else {
                                        setStudentAccessModuleIds(prev => [...prev, m.id]);
                                      }
                                    }}
                                    className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400 rounded border-gray-350 focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-800 dark:text-slate-100 truncate leading-snug">{m.title}</p>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic text-center py-6">Belum ada modul yang tersedia di database.</p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 pt-3 border-t border-gray-50 shrink-0 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsAccessModalOpen(false)}
                    className="btn-duo-slate px-4 py-2.5 font-black"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModuleAccess}
                    disabled={isSavingAccess}
                    className="btn-duo-green px-5 py-2.5 font-black flex items-center gap-1.5 shadow-xs disabled:opacity-40"
                  >
                    {isSavingAccess && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>SIMPAN AKSES</span>
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
