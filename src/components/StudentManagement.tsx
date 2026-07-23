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
import { db, firebaseConfig } from '../firebase';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, deleteDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import CustomDropdown from './CustomDropdown';
import CustomCheckbox from './CustomCheckbox';
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

  // New Student Account Creation Modal States
  const [isCreateStudentModalOpen, setIsCreateStudentModalOpen] = useState(false);
  const [newStudentFullName, setNewStudentFullName] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentClassType, setNewStudentClassType] = useState<'PRIVATE' | 'CIRCLE'>('PRIVATE');
  const [newStudentCircleId, setNewStudentCircleId] = useState<string>('');
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const [createStudentError, setCreateStudentError] = useState<string | null>(null);
  const [createStudentSuccess, setCreateStudentSuccess] = useState<string | null>(null);

  const handleCreateStudentAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = newStudentUsername.trim().toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '');
    if (!newStudentFullName.trim() || !cleanUsername || !newStudentPassword) {
      setCreateStudentError('Semua kolom wajib diisi.');
      return;
    }
    if (newStudentPassword.length < 6) {
      setCreateStudentError('Password minimal 6 karakter.');
      return;
    }

    const fullEmail = `${cleanUsername}@kavio.stud.edu`;
    setIsCreatingStudent(true);
    setCreateStudentError(null);
    setCreateStudentSuccess(null);

    try {
      // Use secondary firebase auth app so teacher's active session is NOT interrupted
      const secondaryApp = getApps().find(a => a.name === 'Secondary') || initializeApp(firebaseConfig, 'Secondary');
      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, fullEmail, newStudentPassword);
      const newUid = userCredential.user.uid;

      await setDoc(doc(db, 'users', newUid), {
        uid: newUid,
        fullName: newStudentFullName.trim(),
        email: fullEmail,
        role: 'student',
        classType: newStudentClassType,
        circleId: newStudentClassType === 'CIRCLE' ? newStudentCircleId || null : null,
        createdAt: new Date().toISOString()
      });

      await signOut(secondaryAuth);

      setCreateStudentSuccess(`Akun siswa "${newStudentFullName}" (${fullEmail}) berhasil dibuat!`);
      setNewStudentFullName('');
      setNewStudentUsername('');
      setNewStudentPassword('');
      setTimeout(() => {
        setIsCreateStudentModalOpen(false);
        setCreateStudentSuccess(null);
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Error creating student account:', err);
      if (err.code === 'auth/email-already-in-use') {
        setCreateStudentError(`Email ${fullEmail} sudah digunakan siswa lain.`);
      } else {
        setCreateStudentError(err.message || 'Gagal membuat akun siswa.');
      }
    } finally {
      setIsCreatingStudent(false);
    }
  };

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
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto text-white" id="student-management-page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Manajemen Pembelajaran</span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            Manajemen Siswa ({students.length})
          </h1>
        </div>

        {/* Filter Controls & Create Student Action */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setIsCreateStudentModalOpen(true)}
            className="bg-[#66C0F4] hover:bg-[#5DADE2] active:bg-[#52A4CC] text-[#FFFFFF] text-[13px] font-normal px-4 py-2 rounded-[2px] min-h-[38px] transition-all cursor-pointer flex items-center gap-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)] font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Akun Siswa Baru</span>
          </button>

          {/* Class Type Filter */}
          <div className="flex bg-[#2F3138] p-1 rounded-[2px] border border-white/10 text-xs font-normal">
            <button
              onClick={() => setClassFilter('all')}
              className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer ${
                classFilter === 'all' ? 'bg-[#66C0F4] text-[#171A21] font-bold' : 'text-[#C6D4DF] hover:text-white'
              }`}
            >
              Semua ({students.length})
            </button>
            <button
              onClick={() => setClassFilter('PRIVATE')}
              className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer ${
                classFilter === 'PRIVATE' ? 'bg-[#66C0F4] text-[#171A21] font-bold' : 'text-[#C6D4DF] hover:text-white'
              }`}
            >
              Privat
            </button>
            <button
              onClick={() => setClassFilter('CIRCLE')}
              className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer ${
                classFilter === 'CIRCLE' ? 'bg-[#66C0F4] text-[#171A21] font-bold' : 'text-[#C6D4DF] hover:text-white'
              }`}
            >
              Circle
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#848E94] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari siswa berdasarkan nama, email, atau nama Circle..."
          className="bg-black/40 border border-white/15 text-white placeholder-[#8A8A8A] text-xs pl-11 pr-4 py-2.5 rounded-[2px] focus:outline-none focus:border-[#66C0F4] transition-all w-full"
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
                className="bg-[#2F3138] border border-white/10 hover:border-[#66C0F4]/40 rounded-[3px] p-5 flex flex-col justify-between space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Card Top Header: Avatar & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 bg-[#66C0F4]/20 text-[#66C0F4] rounded-full flex items-center justify-center font-bold text-base overflow-hidden border border-[#66C0F4]/30 shrink-0">
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase ${
                        student.classType === 'CIRCLE' || circleName
                          ? 'bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/40'
                          : 'bg-[#A1CD44] text-[#171A21]'
                      }`}>
                        {student.classType === 'CIRCLE' || circleName ? 'Circle' : 'Privat'}
                      </span>

                      {circleName && (
                        <span className="text-[9px] font-normal text-[#C6D4DF] bg-white/10 px-2 py-0.5 rounded-[2px] truncate max-w-[120px]">
                          {circleName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Student Name & Email */}
                  <div>
                    <h3 className="text-sm font-bold text-[#FFFFFF] group-hover:text-[#66C0F4] transition-colors truncate">
                      {student.fullName}
                    </h3>
                    <p className="text-[11px] text-[#C6D4DF] truncate mt-0.5">
                      {student.email}
                    </p>
                  </div>

                  {/* Metrics preview */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-1.5 text-[#C6D4DF] font-normal bg-black/30 px-2.5 py-1 rounded-[2px] border border-white/10">
                      <BookOpen className="w-3.5 h-3.5 text-[#66C0F4] shrink-0" />
                      <span>{stats.submittedCount}/{stats.receivedCount} Tugas</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#A1CD44] font-bold bg-[#A1CD44]/10 px-2.5 py-1 rounded-[2px] border border-[#A1CD44]/30">
                      <Award className="w-3.5 h-3.5 text-[#A1CD44] shrink-0" />
                      <span>Skor {stats.averageScore}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action button */}
                <button
                  type="button"
                  title="Buka Detail Siswa"
                  className="bg-[#66C0F4] hover:bg-[#5DADE2] text-white w-full py-2 text-xs font-normal rounded-[2px] flex items-center justify-center cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.3)] min-h-[36px]"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-[#848E94] mx-auto" />
          <h3 className="text-sm font-bold text-[#FFFFFF]">Tidak ada siswa yang ditemukan</h3>
          <p className="text-xs text-[#C6D4DF] max-w-sm mx-auto">
            Coba ganti kata kunci pencarian atau pilih filter kelas yang berbeda.
          </p>
        </div>
      )}

      {/* Detail Modal Popup Window */}
      {selectedStudent && (() => {
        const circleName = getCircleName(selectedStudent.circleId);
        const stats = getStudentStats(selectedStudent.uid, selectedStudent.circleId);

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-[#2F3138] border border-white/20 rounded-[4px] w-[800px] max-h-[85vh] max-w-[95vw] overflow-hidden relative flex flex-col p-0 shadow-[0_6px_16px_rgba(0,0,0,0.6)] text-white">
              <div className="w-full h-full overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-6 right-6 p-2 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header: Student Info */}
              <div className="flex items-start gap-4 pr-8 border-b border-white/10 pb-6">
                <div className="w-16 h-16 bg-black/40 text-[#66C0F4] rounded-full flex items-center justify-center font-bold text-xl overflow-hidden border border-white/20 shrink-0 shadow-xs">
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
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {selectedStudent.fullName}
                    </h2>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[9px] font-bold uppercase tracking-wider border ${
                      selectedStudent.classType === 'CIRCLE' || circleName
                        ? 'bg-[#66C0F4]/20 text-[#66C0F4] border-[#66C0F4]/40'
                        : 'bg-[#A1CD44]/20 text-[#A1CD44] border-[#A1CD44]/40'
                    }`}>
                      {selectedStudent.classType === 'CIRCLE' || circleName ? 'KELAS CIRCLE' : 'KELAS PRIVAT'}
                    </span>
                    {circleName && (
                      <span className="text-[9px] font-bold text-[#B9A074] bg-[#B9A074]/20 border border-[#B9A074]/40 px-2 py-0.5 rounded-[2px] uppercase">
                        {circleName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#C6D4DF] font-mono mt-0.5">
                    {selectedStudent.email} {selectedStudent.phone ? `• ${selectedStudent.phone}` : ''}
                  </p>

                  {selectedStudent.bio && (
                    <p className="text-xs text-[#C6D4DF] italic pt-1">
                      "{selectedStudent.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* Four Performance Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Total Received */}
                <div className="bg-black/40 p-4 rounded-[2px] border border-white/10 space-y-1 text-white">
                  <span className="text-[9px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Total Tugas</span>
                  <span className="text-xl font-bold font-mono text-white block">{stats.receivedCount}</span>
                  <span className="text-[10px] text-[#C6D4DF] block">Diterima</span>
                </div>

                {/* Total Submitted */}
                <div className="bg-black/40 p-4 rounded-[2px] border border-white/10 space-y-1 text-white">
                  <span className="text-[9px] font-bold text-[#A1CD44] uppercase tracking-wider block">Dikerjakan</span>
                  <span className="text-xl font-bold font-mono text-[#A1CD44] block">{stats.submittedCount}</span>
                  <span className="text-[10px] text-[#C6D4DF] block">{stats.completedCount} Sudah Dinilai</span>
                </div>

                {/* Average Score */}
                <div className="bg-black/40 p-4 rounded-[2px] border border-white/10 space-y-1 text-white">
                  <span className="text-[9px] font-bold text-[#66C0F4] uppercase tracking-wider block">Rata-Rata</span>
                  <span className="text-xl font-bold font-mono text-[#66C0F4] block">{stats.averageScore}</span>
                  <span className="text-[10px] text-[#C6D4DF] block">Skor Akhir</span>
                </div>

                {/* Monthly/Weekly Accumulation */}
                <div className="bg-black/40 p-4 rounded-[2px] border border-white/10 space-y-1 text-white">
                  <span className="text-[9px] font-bold text-[#B9A074] uppercase tracking-wider block">Akumulasi Bulanan</span>
                  <span className="text-xl font-bold font-mono text-[#B9A074] block">{stats.monthlyAvg}</span>
                  <span className="text-[10px] text-[#C6D4DF] block">Mingguan: {stats.weeklyAvg}</span>
                </div>
              </div>

              {/* Teacher Control Panel (Edit ClassType, Circle, Status) */}
              <div className="bg-[#171A21] border border-white/10 rounded-[3px] p-5 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4.5 h-4.5 text-[#66C0F4]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      EDIT DATA SISWA
                    </h3>
                  </div>
                  {controlErrorMsg && (
                    <span className="text-[10px] font-bold text-[#FF4B4B] bg-[#FF4B4B]/20 px-2.5 py-1 rounded-[2px] border border-[#FF4B4B]/30 flex items-center gap-1">
                      ⚠️ {controlErrorMsg}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Class Type Selector */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">Tipe Kelas</label>
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
                    <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">Circle Belajar</label>
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
                    <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">Status Siswa</label>
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
                    className="h-[36px] px-4 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold flex items-center justify-center cursor-pointer rounded-[2px] transition-all"
                  >
                    {isSavingControl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Direct Action Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-4 bg-[#2F3138] border border-white/10 rounded-[3px] text-white">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#A1CD44]" />
                    <span className="text-xs font-bold text-white">Kirim Tugas</span>
                  </div>
                  <button
                    onClick={() => {
                      const sId = selectedStudent.uid;
                      setSelectedStudent(null);
                      onSendAssignmentToStudent(sId);
                    }}
                    className="h-[36px] px-5 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-[2px] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>TUGAS</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#2F3138] border border-white/10 rounded-[3px] text-white">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#B9A074]" />
                    <span className="text-xs font-bold text-white">Akses Modul Belajar</span>
                  </div>
                  <button
                    onClick={handleOpenModuleAccessModal}
                    className="h-[36px] px-5 bg-[#B9A074] hover:bg-[#A38A5D] text-[#171A21] text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-[2px] transition-all"
                  >
                    <Key className="w-4 h-4" />
                    <span>AKSES MODUL</span>
                  </button>
                </div>
              </div>

              {/* Assignments List for this Student */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Daftar Tugas Siswa</h4>

                {stats.studentAssigns.length > 0 ? (
                  <div className="space-y-2.5">
                    {stats.studentAssigns.map(assign => {
                      const sub = stats.studentSubs.find(s => s.assignmentId === assign.id);

                      return (
                        <div
                          key={assign.id}
                          className="p-4 bg-[#171A21] border border-white/10 rounded-[3px] flex items-center justify-between gap-4 text-white"
                        >
                          <div className="min-w-0 space-y-1">
                            <h5 className="text-xs font-bold text-white truncate">{assign.title}</h5>
                            <div className="flex items-center gap-3 text-[10px] text-[#8A8A8A]">
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
      {/* Floating control success toast */}
      <AnimatePresence>
        {controlSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-[9999] bg-[#2F3138] text-[#A1CD44] border border-[#A1CD44] px-5 py-3.5 rounded-[2px] shadow-2xl flex items-center gap-3 text-xs font-bold"
          >
            <CheckCircle className="w-5 h-5 text-[#A1CD44] shrink-0" />
            <span>{controlSuccessMsg}</span>
            <button
              type="button"
              onClick={() => setControlSuccessMsg(null)}
              className="ml-2 p-1 hover:bg-white/10 rounded-[2px] cursor-pointer transition-colors"
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
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fadeIn">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-[760px] max-h-[85vh] max-w-[95vw] p-6 space-y-4 bg-[#2F3138] border border-white/20 rounded-[4px] shadow-[0_6px_16px_rgba(0,0,0,0.6)] text-white relative flex flex-col"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsAccessModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header Title */}
                <div className="border-b border-white/10 pb-3 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">KONTROL AKSES MODUL SISWA</h3>
                    <p className="text-[10px] text-[#C6D4DF] mt-0.5">Pilih modul materi pembelajaran yang berhak diakses oleh {selectedStudent.fullName}.</p>
                  </div>

                  {/* Sorting Action button */}
                  <button
                    type="button"
                    onClick={() => setAccessSortOrder(prev => prev === 'title-asc' ? 'title-desc' : 'title-asc')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/15 rounded-[2px] text-[10px] font-bold text-[#C6D4DF] hover:text-white hover:bg-white/10 transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#66C0F4]" />
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
                        <div key={level} className="space-y-3 bg-black/40 border border-white/10 rounded-[3px] p-4 text-white">
                          {/* Parent (Level Header) */}
                          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                              <CustomCheckbox
                                checked={allChecked}
                                indeterminate={someChecked}
                                onChange={handleToggleLevelParent}
                              />
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border ${
                                level === 'elementary' ? 'bg-[#B9A074]/20 text-[#B9A074] border-[#B9A074]/40' :
                                level === 'junior' ? 'bg-[#66C0F4]/20 text-[#66C0F4] border-[#66C0F4]/40' :
                                'bg-[#A1CD44]/20 text-[#A1CD44] border-[#A1CD44]/40'
                              }`}>
                                {level}
                              </span>
                            </label>
                            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-widest">
                              {checkedCount} / {sortedLevelModules.length} Modul Terpilih
                            </span>
                          </div>

                          {/* Children Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
                            {sortedLevelModules.map((m) => {
                              const hasAccess = studentAccessModuleIds.includes(m.id);
                              return (
                                <label key={m.id} className={`flex items-center gap-3 p-3 bg-[#171A21] border rounded-[2px] cursor-pointer hover:border-[#66C0F4]/50 transition-colors select-none ${
                                  hasAccess ? 'border-[#66C0F4] shadow-xs' : 'border-white/10'
                                }`}>
                                  <CustomCheckbox
                                    checked={hasAccess}
                                    onChange={() => {
                                      if (hasAccess) {
                                        setStudentAccessModuleIds(prev => prev.filter(id => id !== m.id));
                                      } else {
                                        setStudentAccessModuleIds(prev => [...prev, m.id]);
                                      }
                                    }}
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate leading-snug">{m.title}</p>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-[#8A8A8A] italic text-center py-6">Belum ada modul yang tersedia di database.</p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 pt-3 border-t border-white/10 shrink-0 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsAccessModalOpen(false)}
                    className="h-[36px] px-4 bg-transparent hover:bg-white/10 text-white border border-white/20 font-bold text-xs uppercase rounded-[2px] cursor-pointer transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModuleAccess}
                    disabled={isSavingAccess}
                    className="h-[36px] px-5 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] font-bold text-xs uppercase rounded-[2px] flex items-center gap-1.5 shadow-md disabled:opacity-40 cursor-pointer transition-all"
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

      {/* CREATE NEW STUDENT ACCOUNT MODAL */}
      <AnimatePresence>
        {isCreateStudentModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-[#2F3138] border border-white/20 rounded-[4px] p-6 sm:p-8 max-w-lg w-full shadow-[0_6px_16px_rgba(0,0,0,0.6)] space-y-6 text-white relative"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                    Buat Akun Siswa Baru
                  </h2>
                  <p className="text-xs text-[#C6D4DF] mt-0.5">
                    Buat kredensial login siswa baru secara resmi oleh Guru/Admin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateStudentModalOpen(false)}
                  disabled={isCreatingStudent}
                  className="p-1.5 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {createStudentError && (
                <div className="p-4 bg-[#FF4B4B]/20 border border-[#FF4B4B]/40 rounded-[2px] text-xs text-[#FF4B4B] font-bold">
                  {createStudentError}
                </div>
              )}

              {createStudentSuccess && (
                <div className="p-4 bg-[#A1CD44]/20 border border-[#A1CD44]/40 rounded-[2px] text-xs text-[#A1CD44] font-bold">
                  {createStudentSuccess}
                </div>
              )}

              <form onSubmit={handleCreateStudentAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">
                    Nama Lengkap Siswa <span className="text-[#FF4B4B]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentFullName}
                    onChange={(e) => setNewStudentFullName(e.target.value)}
                    placeholder="Contoh: Ahmad Rizky"
                    disabled={isCreatingStudent}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">
                    Username Email Siswa <span className="text-[#FF4B4B]">*</span>
                  </label>
                  <div className="flex items-center border border-white/15 rounded-[2px] overflow-hidden bg-black/40 focus-within:border-[#66C0F4]">
                    <input
                      type="text"
                      required
                      value={newStudentUsername}
                      onChange={(e) => setNewStudentUsername(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
                      placeholder="rizky"
                      disabled={isCreatingStudent}
                      className="flex-1 px-3.5 py-2.5 bg-transparent text-xs font-bold font-mono text-white placeholder-[#8A8A8A] focus:outline-none"
                    />
                    <span className="px-3.5 py-2.5 bg-black/60 text-xs font-bold font-mono text-[#66C0F4] border-l border-white/15">
                      @kavio.stud.edu
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8A8A8A]">
                    Email login: <span className="font-mono font-bold text-[#66C0F4]">{newStudentUsername.trim() ? `${newStudentUsername.trim().toLowerCase()}@kavio.stud.edu` : 'username@kavio.stud.edu'}</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">
                    Kata Sandi (Password) <span className="text-[#FF4B4B]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    disabled={isCreatingStudent}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs font-bold text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">
                    Tipe Kelas Pembelajaran
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewStudentClassType('PRIVATE')}
                      className={`p-3 rounded-[2px] border text-xs font-bold transition-all cursor-pointer ${
                        newStudentClassType === 'PRIVATE'
                          ? 'bg-[#66C0F4] text-[#171A21] border-[#66C0F4]'
                          : 'bg-black/40 border-white/15 text-[#C6D4DF] hover:bg-white/5'
                      }`}
                    >
                      Private
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewStudentClassType('CIRCLE')}
                      className={`p-3 rounded-[2px] border text-xs font-bold transition-all cursor-pointer ${
                        newStudentClassType === 'CIRCLE'
                          ? 'bg-[#66C0F4] text-[#171A21] border-[#66C0F4]'
                          : 'bg-black/40 border-white/15 text-[#C6D4DF] hover:bg-white/5'
                      }`}
                    >
                      Circle (Kelompok)
                    </button>
                  </div>
                </div>

                {newStudentClassType === 'CIRCLE' && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="block text-xs font-bold text-[#C6D4DF] uppercase tracking-wider">
                      Pilih Kelompok Circle
                    </label>
                    <CustomDropdown
                      value={newStudentCircleId}
                      onChange={(val) => setNewStudentCircleId(val)}
                      options={circles.map(c => ({ value: c.id, label: c.name }))}
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateStudentModalOpen(false)}
                    disabled={isCreatingStudent}
                    className="h-[40px] px-5 bg-transparent hover:bg-white/10 text-white border border-white/20 font-bold text-xs uppercase rounded-[2px] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingStudent}
                    className="h-[40px] px-6 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] font-bold text-xs uppercase rounded-[2px] shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {isCreatingStudent && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isCreatingStudent ? 'Membuat Akun...' : 'Buat Akun Siswa'}</span>
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
