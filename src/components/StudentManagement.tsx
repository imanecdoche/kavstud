import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { UserProfile, Assignment, Submission } from '../types';
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import CustomDropdown from './CustomDropdown';
import { motion, AnimatePresence } from 'framer-motion';

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
    if (!confirm('Apakah Anda yakin ingin menghapus/membatalkan penugasan ini untuk siswa?')) return;
    try {
      await deleteDoc(doc(db, 'assignments', assignId));
      alert('Penugasan berhasil dihapus.');
    } catch (err) {
      console.error('Error deleting assignment:', err);
      alert('Gagal menghapus penugasan.');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Manajemen Pembelajaran</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 tracking-tight mt-0.5">
            Manajemen Siswa ({students.length})
          </h1>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Class Type Filter */}
          <div className="flex bg-gray-100/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setClassFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                classFilter === 'all' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Semua ({students.length})
            </button>
            <button
              onClick={() => setClassFilter('PRIVATE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                classFilter === 'PRIVATE' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Privat
            </button>
            <button
              onClick={() => setClassFilter('CIRCLE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                classFilter === 'CIRCLE' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-gray-500 hover:text-gray-700'
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
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs"
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
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-base overflow-hidden border border-indigo-100/50 shrink-0 group-hover:scale-105 transition-transform shadow-3xs">
                      {student.photoURL ? (
                        <img 
                          src={student.photoURL} 
                          alt={student.fullName} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                      ) : (
                        student.fullName.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                        student.classType === 'CIRCLE' || circleName
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {student.classType === 'CIRCLE' || circleName ? 'Circle' : 'Privat'}
                      </span>

                      {circleName && (
                        <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                          {circleName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Student Name & Email */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {student.fullName}
                    </h3>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {student.email}
                    </p>
                  </div>

                  {/* Metrics preview */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100/80 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 font-bold bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <BookOpen className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>{stats.submittedCount}/{stats.receivedCount} Tugas</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-amber-700 font-extrabold bg-amber-50/60 px-2.5 py-1 rounded-lg border border-amber-100/50">
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
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700">Tidak ada siswa yang ditemukan</h3>
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
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header: Student Info */}
              <div className="flex items-start gap-4 pr-8 border-b border-gray-100 pb-6">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl overflow-hidden border border-indigo-100 shrink-0 shadow-xs">
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
                    <h2 className="text-lg sm:text-xl font-display font-bold text-gray-900 tracking-tight">
                      {selectedStudent.fullName}
                    </h2>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      selectedStudent.classType === 'CIRCLE' || circleName
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {selectedStudent.classType === 'CIRCLE' || circleName ? 'Kelas Circle' : 'Kelas Privat'}
                    </span>
                    {circleName && (
                      <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        {circleName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 font-medium">
                    {selectedStudent.email} {selectedStudent.phone ? `• ${selectedStudent.phone}` : ''}
                  </p>

                  {selectedStudent.bio && (
                    <p className="text-xs text-gray-600 italic pt-1">
                      "{selectedStudent.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* Four Performance Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Total Received */}
                <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Total Tugas</span>
                  <span className="text-xl font-bold font-mono text-gray-900 block">{stats.receivedCount}</span>
                  <span className="text-[10px] text-gray-500 block">Diterima</span>
                </div>

                {/* Total Submitted */}
                <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50 space-y-1">
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Dikerjakan</span>
                  <span className="text-xl font-bold font-mono text-emerald-700 block">{stats.submittedCount}</span>
                  <span className="text-[10px] text-emerald-600 block">{stats.completedCount} Sudah Dinilai</span>
                </div>

                {/* Average Score */}
                <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100 space-y-1">
                  <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-wider block">Rata-Rata</span>
                  <span className="text-xl font-bold font-mono text-indigo-700 block">{stats.averageScore}</span>
                  <span className="text-[10px] text-indigo-600 block">Skor Akhir</span>
                </div>

                {/* Monthly/Weekly Accumulation */}
                <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-100 space-y-1">
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">Akumulasi Bulanan</span>
                  <span className="text-xl font-bold font-mono text-amber-700 block">{stats.monthlyAvg}</span>
                  <span className="text-[10px] text-amber-600 block">Mingguan: {stats.weeklyAvg}</span>
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
                    <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider">Tipe Kelas</label>
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
                    <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider">Circle Belajar</label>
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
                    <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider">Status Siswa</label>
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
              <div className="flex items-center justify-between p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-emerald-900">Ingin memberikan tugas ke siswa ini?</span>
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

              {/* Assignments List for this Student */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Daftar Tugas Siswa</h4>

                {stats.studentAssigns.length > 0 ? (
                  <div className="space-y-2.5">
                    {stats.studentAssigns.map(assign => {
                      const sub = stats.studentSubs.find(s => s.assignmentId === assign.id);

                      return (
                        <div
                          key={assign.id}
                          className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between gap-4 hover:border-indigo-100 transition-colors"
                        >
                          <div className="min-w-0 space-y-1">
                            <h5 className="text-xs font-bold text-gray-900 truncate">{assign.title}</h5>
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
                                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {sub.status === 'graded' ? `Nilai: ${sub.score ?? '-'}` : 'Menunggu Review'}
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-gray-100 text-gray-500">
                                Belum Dikerjakan
                              </span>
                            )}

                            {sub && (
                              <button
                                onClick={() => {
                                  setSelectedStudent(null);
                                  onNavigate(`/submission/${assign.id}`);
                                }}
                                className="p-1.5 bg-gray-50 hover:bg-sky-50 text-gray-600 hover:text-sky-600 rounded-lg cursor-pointer transition-colors"
                                title="Lihat Lembar Jawaban"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteStudentAssignment(assign.id)}
                              className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
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
                  <div className="p-6 text-center text-xs text-gray-400 italic bg-gray-50/50 rounded-2xl border border-gray-100">
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
    </div>
  );
}
