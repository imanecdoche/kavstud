import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  Users, 
  FileText, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Award,
  NotebookText,
  Search,
  Filter,
  UserCheck,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  X,
  Pencil,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Assignment, Submission } from '../types';
import Logo from './Logo';
import NavigationSidebar from './NavigationSidebar';
import UserSettings from './UserSettings';
import CircleManagement from './CircleManagement';
import EmptyState from './EmptyState';
import { SkeletonDashboard, SkeletonList } from './Skeletons';
import CustomDropdown from './CustomDropdown';

interface TeacherDashboardProps {
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function TeacherDashboard({ onNavigate, onSetLoading }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assignments' | 'settings' | 'circles'>('dashboard');
  const [teacherProfile, setTeacherProfile] = useState<UserProfile | null>(null);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState({
    profile: true,
    students: true,
    assignments: true,
    submissions: true
  });
  const [error, setError] = useState<string | null>(null);

  // Responsive Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search/Filter states inside assignments tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'review' | 'completed' | 'remedial' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'short_answer' | 'multiple_choice' | 'multi_short_answer'>('all');
  const [studentFilter, setStudentFilter] = useState<string>('all');

  // Create & Edit Assignment Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [assignmentTarget, setAssignmentTarget] = useState<'INDIVIDUAL' | 'CIRCLE'>('INDIVIDUAL');
  const [selectedCircleId, setSelectedCircleId] = useState('');
  const [circles, setCircles] = useState<any[]>([]);
  const [assignmentType, setAssignmentType] = useState<'short_answer' | 'multiple_choice' | 'multi_short_answer'>('short_answer');
  const [deadline, setDeadline] = useState('');
  const [choices, setChoices] = useState({ A: '', B: '', C: '', D: '' });
  const [correctChoice, setCorrectChoice] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [subQuestions, setSubQuestions] = useState<string[]>(['']);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<string | null>(null);
  const [deletingAssignmentTitle, setDeletingAssignmentTitle] = useState('');

  // Load teacher profile and setup real-time listeners
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      onNavigate('/login');
      return;
    }

    // Get Teacher Profile
    const profileRef = query(collection(db, 'users'), where('uid', '==', user.uid));
    const unsubscribeProfile = onSnapshot(profileRef, (snapshot) => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        setTeacherProfile({ id: snapshot.docs[0].id, ...docData } as any);
      }
      setLoading(prev => ({ ...prev, profile: false }));
    }, (err) => {
      console.error(err);
      setError('Gagal memuat profil guru.');
    });

    // Real-time Students List
    const studentsQuery = query(collection(db, 'users'), where('role', '==', 'student'));
    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
      const studs: UserProfile[] = [];
      snapshot.forEach((doc) => {
        studs.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setStudents(studs);
      setLoading(prev => ({ ...prev, students: false }));
    }, (err) => {
      console.error(err);
      setError('Gagal memuat daftar siswa.');
    });

    // Real-time Assignments List created by this teacher
    const assignmentsQuery = query(
      collection(db, 'assignments'), 
      where('teacherId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
      const assigns: Assignment[] = [];
      snapshot.forEach((doc) => {
        assigns.push({ id: doc.id, ...doc.data() } as Assignment);
      });
      setAssignments(assigns);
      setLoading(prev => ({ ...prev, assignments: false }));
    }, (err) => {
      console.error(err);
      // Fallback if index hasn't built yet
      const simpleQuery = query(collection(db, 'assignments'), where('teacherId', '==', user.uid));
      onSnapshot(simpleQuery, (snap) => {
        const assigns: Assignment[] = [];
        snap.forEach((d) => {
          assigns.push({ id: d.id, ...d.data() } as Assignment);
        });
        assigns.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setAssignments(assigns);
        setLoading(prev => ({ ...prev, assignments: false }));
      });
    });

    // Real-time Submissions List for teacher's assignments
    const submissionsQuery = query(
      collection(db, 'submissions'),
      orderBy('submittedAt', 'desc'),
      limit(50)
    );
    const unsubscribeSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
      const subs: Submission[] = [];
      snapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() } as Submission);
      });
      setSubmissions(subs);
      setLoading(prev => ({ ...prev, submissions: false }));
    }, (err) => {
      console.error(err);
      // Fallback simple query
      onSnapshot(collection(db, 'submissions'), (snap) => {
        const subs: Submission[] = [];
        snap.forEach((d) => {
          subs.push({ id: d.id, ...d.data() } as Submission);
        });
        subs.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
        setSubmissions(subs);
        setLoading(prev => ({ ...prev, submissions: false }));
      });
    });

    // Real-time Circles List for this teacher
    const circlesQuery = query(
      collection(db, 'circles'),
      where('teacherId', '==', user.uid)
    );
    const unsubscribeCircles = onSnapshot(circlesQuery, (snapshot) => {
      const circs: any[] = [];
      snapshot.forEach((doc) => {
        circs.push({ id: doc.id, ...doc.data() });
      });
      setCircles(circs);
    }, (err) => {
      console.error('Error fetching circles:', err);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeStudents();
      unsubscribeAssignments();
      unsubscribeSubmissions();
      unsubscribeCircles();
    };
  }, [onNavigate]);

  // Handle student profile shortcut to assign task
  useEffect(() => {
    const assignToStudentId = sessionStorage.getItem('assignToStudentId');
    if (assignToStudentId && students.length > 0) {
      sessionStorage.removeItem('assignToStudentId');
      onNavigate(`/teacher/assignments/create?studentId=${assignToStudentId}`);
    }
  }, [students, activeTab, onNavigate]);

  const handleLogout = async () => {
    onSetLoading(true);
    await auth.signOut();
    onNavigate('/login');
    onSetLoading(false);
  };

  // Helper to determine active status of an assignment
  const getAssignmentStatus = (assign: Assignment) => {
    if (assign.status === 'completed') return 'completed';
    if (assign.status === 'remedial') return 'remedial';
    
    // Check if submission exists
    const sub = submissions.find(s => s.assignmentId === assign.id);
    if (sub) {
      if (sub.status === 'graded') return 'completed';
      if (sub.status === 'remedial') return 'remedial';
      return 'review';
    }
    
    // Check deadline
    if (assign.deadline) {
      const deadlineDate = new Date(assign.deadline + 'T23:59:59');
      if (deadlineDate < new Date()) {
        return 'expired';
      }
    }
    
    return assign.status || 'sent';
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingAssignmentId(null);
    setNewTitle('');
    setNewQuestion('');
    setSelectedStudentId('');
    setSelectedCircleId('');
    setAssignmentTarget('INDIVIDUAL');
    setAssignmentType('short_answer');
    setDeadline('');
    setChoices({ A: '', B: '', C: '', D: '' });
    setCorrectChoice('A');
    setSubQuestions(['']);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (assign: Assignment, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click navigation
    setIsEditMode(true);
    setEditingAssignmentId(assign.id);
    setNewTitle(assign.title);
    setNewQuestion(assign.question);
    setSelectedStudentId(assign.studentId);
    setAssignmentTarget(assign.assignmentTarget || 'INDIVIDUAL');
    setSelectedCircleId(assign.assignmentTarget === 'CIRCLE' ? assign.targetId || '' : '');
    setAssignmentType(assign.assignmentType || 'short_answer');
    setDeadline(assign.deadline || '');
    setChoices(assign.choices || { A: '', B: '', C: '', D: '' });
    setCorrectChoice(assign.correctChoice || 'A');
    setSubQuestions(assign.subQuestions || ['']);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (assign: Assignment, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    setDeletingAssignmentId(assign.id);
    setDeletingAssignmentTitle(assign.title);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteAssignment = async () => {
    if (!deletingAssignmentId) return;
    try {
      await deleteDoc(doc(db, 'assignments', deletingAssignmentId));
      await deleteDoc(doc(db, 'submissions', deletingAssignmentId));
      setIsDeleteConfirmOpen(false);
      setDeletingAssignmentId(null);
      setDeletingAssignmentTitle('');
    } catch (err) {
      console.error(err);
      setError('Gagal menghapus tugas.');
    }
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuestion.trim()) {
      setFormError('Semua kolom formulir wajib diisi.');
      return;
    }

    if (assignmentTarget === 'INDIVIDUAL' && !selectedStudentId) {
      setFormError('Silakan pilih siswa penerima tugas.');
      return;
    }

    if (assignmentTarget === 'CIRCLE' && !selectedCircleId) {
      setFormError('Silakan pilih kelompok belajar Circle penerima tugas.');
      return;
    }

    if (assignmentType === 'multiple_choice') {
      if (!choices.A.trim() || !choices.B.trim() || !choices.C.trim() || !choices.D.trim()) {
        setFormError('Semua opsi pilihan ganda (A, B, C, D) wajib diisi.');
        return;
      }
    } else if (assignmentType === 'multi_short_answer') {
      if (subQuestions.some(q => !q.trim())) {
        setFormError('Semua sub-pertanyaan wajib diisi.');
        return;
      }
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const assignmentPayload: any = {
        title: newTitle.trim(),
        question: newQuestion.trim(),
        teacherId: auth.currentUser?.uid || '',
        teacherName: teacherProfile?.fullName || 'Guru Kavio',
        assignmentType,
        assignmentTarget,
        targetId: assignmentTarget === 'INDIVIDUAL' ? selectedStudentId : selectedCircleId,
        deadline: deadline || '',
        status: isEditMode ? (assignments.find(a => a.id === editingAssignmentId)?.status || 'sent') : 'sent',
      };

      if (assignmentType === 'multiple_choice') {
        assignmentPayload.choices = choices;
        assignmentPayload.correctChoice = correctChoice;
      } else if (assignmentType === 'multi_short_answer') {
        assignmentPayload.subQuestions = subQuestions;
      }

      if (isEditMode && editingAssignmentId) {
        const original = assignments.find(a => a.id === editingAssignmentId);
        assignmentPayload.studentId = original?.studentId;
        assignmentPayload.studentName = original?.studentName;
        await updateDoc(doc(db, 'assignments', editingAssignmentId), assignmentPayload);
      } else {
        assignmentPayload.createdAt = serverTimestamp();

        if (assignmentTarget === 'INDIVIDUAL') {
          const targetStudent = students.find(s => s.uid === selectedStudentId);
          if (!targetStudent) {
            setFormError('Siswa terpilih tidak ditemukan.');
            setIsSubmitting(false);
            return;
          }
          assignmentPayload.studentId = selectedStudentId;
          assignmentPayload.studentName = targetStudent.fullName;
          await addDoc(collection(db, 'assignments'), assignmentPayload);
        } else {
          // Circle Target: find active members in the circle
          const targetCircleMembers = students.filter(
            s => s.circleId === selectedCircleId && s.classType === 'CIRCLE'
          );

          if (targetCircleMembers.length === 0) {
            setFormError('Kelompok belajar Circle yang Anda pilih saat ini tidak memiliki anggota siswa.');
            setIsSubmitting(false);
            return;
          }

          // Create an assignment document for each member
          for (const member of targetCircleMembers) {
            const memberPayload = {
              ...assignmentPayload,
              studentId: member.uid,
              studentName: member.fullName
            };
            await addDoc(collection(db, 'assignments'), memberPayload);
          }
        }
      }

      // Reset form & close modal
      setNewTitle('');
      setNewQuestion('');
      setSelectedStudentId('');
      setSelectedCircleId('');
      setAssignmentTarget('INDIVIDUAL');
      setAssignmentType('short_answer');
      setDeadline('');
      setChoices({ A: '', B: '', C: '', D: '' });
      setCorrectChoice('A');
      setSubQuestions(['']);
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingAssignmentId(null);
    } catch (err) {
      console.error(err);
      setFormError(isEditMode ? 'Gagal memperbarui tugas.' : 'Gagal mengirim tugas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPageLoading = loading.profile && loading.students && loading.assignments;

  // Filter assignments for search & select in assignments tab
  const filteredAssignments = assignments.filter(assign => {
    const status = getAssignmentStatus(assign);
    const type = assign.assignmentType || 'short_answer';

    const matchesSearch = assign.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          assign.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          type.replace('_', ' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          status.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const matchesType = typeFilter === 'all' || type === typeFilter;
    const matchesStudent = studentFilter === 'all' || assign.studentId === studentFilter;

    return matchesSearch && matchesStatus && matchesType && matchesStudent;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans" id="teacher-dashboard">
      <NavigationSidebar 
        role="teacher"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={teacherProfile}
        onLogout={handleLogout}
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
      />

      {/* Main Container Content */}
      <main className="flex-1 min-w-0 overflow-y-auto h-screen relative">
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isPageLoading ? (
            <div className="p-4 sm:p-8 lg:p-10">
              <SkeletonDashboard />
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="p-4 sm:p-8 lg:p-10 space-y-8"
            >
              {/* TAB 1: MAIN DASHBOARD */}
              {activeTab === 'dashboard' && (
                <>
                  {/* Top Welcome Panel */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <span>Halo, {teacherProfile?.fullName?.split(' ')[0] || 'Guru'}!</span>
                      </h1>
                      <p className="text-xs text-gray-500 mt-1">
                        Kelola tugas kelas, evaluasi jawaban siswa, dan pantau perkembangan belajar secara langsung.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('/teacher/assignments/create')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      style={{ minHeight: '44px' }}
                    >
                      <Plus className="w-4.5 h-4.5" />
                      Tugas Baru
                    </button>
                  </div>

                  {/* Stats Block Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Siswa Terdaftar</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-display text-gray-900">{students.length}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">Siswa</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        <NotebookText className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Tugas</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-display text-gray-900">{assignments.length}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">Tugas</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs flex items-center gap-4 sm:col-span-2 lg:col-span-1">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Submisi</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-display text-gray-900">{submissions.length}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">Jawaban</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard split content panels */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left & Middle columns: Recent tasks & submissions */}
                    <div className="xl:col-span-2 space-y-8">
                      
                      {/* Section: Submisi Masuk Terbaru */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                            Submisi Masuk Terbaru
                          </h3>
                        </div>

                        {submissions.length === 0 ? (
                          <EmptyState 
                            icon={CheckCircle2}
                            title="Belum Ada Submisi"
                            description="Siswa belum mengirimkan jawaban untuk tugas yang diberikan."
                          />
                        ) : (
                          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto pr-1">
                            {submissions.slice(0, 5).map((sub) => (
                              <div 
                                key={sub.id}
                                onClick={() => onNavigate(`/submission/${sub.id}`)}
                                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-gray-50/50 px-2 rounded-xl transition-colors cursor-pointer"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-xs font-bold text-gray-900 truncate">{sub.assignmentTitle}</h4>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                      sub.status === 'graded' 
                                        ? 'bg-green-50 text-green-700 border border-green-100' 
                                        : 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                                    }`}>
                                      {sub.status === 'graded' ? 'Sudah Dinilai' : 'Butuh Dinilai'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 mt-1 truncate">
                                    Oleh: <span className="font-semibold text-gray-600">{sub.studentName}</span>
                                  </p>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0">
                                  {sub.score !== null ? (
                                    <div className="text-right">
                                      <p className="text-[10px] text-gray-400">Skor</p>
                                      <p className="text-xs font-bold text-indigo-600 font-display">{sub.score} / 100</p>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-lg">
                                      Nilai Sekarang
                                    </span>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-gray-300" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Section: Tugas Terbaru Dibuat */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                            <FileText className="w-4.5 h-4.5 text-indigo-500" />
                            Daftar Tugas Baru
                          </h3>
                        </div>

                        {assignments.length === 0 ? (
                          <EmptyState 
                            icon={NotebookText}
                            title="Belum Ada Tugas"
                            description="Anda belum membuat tugas untuk siswa."
                            actionText="Buat Tugas Pertama"
                            onActionClick={() => onNavigate('/teacher/assignments/create')}
                          />
                        ) : (
                          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto pr-1">
                            {assignments.slice(0, 5).map((assign) => (
                              <div 
                                key={assign.id}
                                className="py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/50 px-2 rounded-xl transition-colors cursor-pointer"
                                onClick={() => onNavigate(`/assignment/${assign.id}`)}
                              >
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-gray-900 truncate">{assign.title}</h4>
                                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">Siswa: {assign.studentName}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] text-gray-400">
                                    {assign.createdAt ? new Date(assign.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'Baru saja'}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-gray-300" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Right column: Quick Actions & Student list */}
                    <div className="space-y-8">
                      {/* Quick Actions Panel */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Aksi Cepat</h3>
                        <div className="grid grid-cols-1 gap-2.5">
                          <button
                            onClick={() => onNavigate('/teacher/assignments/create')}
                            className="w-full p-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/30 rounded-xl flex items-center gap-3 transition-colors text-left text-xs font-bold text-indigo-700 cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-indigo-500 shrink-0" />
                            Kirim Tugas Baru
                          </button>
                          <button
                            onClick={() => setActiveTab('assignments')}
                            className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl flex items-center gap-3 transition-colors text-left text-xs font-semibold text-gray-700 cursor-pointer"
                          >
                            <Layers className="w-4 h-4 text-gray-400 shrink-0" />
                            Kelola Semua Tugas
                          </button>
                          <button
                            onClick={() => setActiveTab('settings')}
                            className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl flex items-center gap-3 transition-colors text-left text-xs font-semibold text-gray-700 cursor-pointer"
                          >
                            <Award className="w-4 h-4 text-gray-400 shrink-0" />
                            Pengaturan Profil
                          </button>
                        </div>
                      </div>

                      {/* Student list */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                          <Users className="w-4 h-4 text-indigo-500" />
                          Daftar Siswa Kelas
                        </h3>

                        {students.length === 0 ? (
                          <EmptyState 
                            icon={Users}
                            title="Tidak Ada Siswa"
                            description="Belum ada siswa yang mendaftar di kelas Anda."
                          />
                        ) : (
                          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                            {students.map((stud) => (
                              <div 
                                key={stud.uid}
                                onClick={() => onNavigate(`/student/${stud.uid}`)}
                                className="p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-100/50 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                                    {stud.fullName?.charAt(0).toUpperCase() || 'S'}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <p className="text-xs font-bold text-gray-900 truncate leading-tight">{stud.fullName}</p>
                                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                        stud.classType === 'PRIVATE'
                                          ? 'bg-teal-50 text-teal-700 border border-teal-100'
                                          : 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100'
                                      }`}>
                                        {stud.classType || 'PRIVATE'}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{stud.email}</p>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: FULL ASSIGNMENTS MANAGER */}
              {activeTab === 'assignments' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 tracking-tight">
                        Daftar Penugasan Kelas
                      </h1>
                      <p className="text-xs text-gray-500 mt-1">
                        Cari, saring, dan tinjau seluruh tugas belajar yang telah didistribusikan ke siswa.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('/teacher/assignments/create')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      style={{ minHeight: '44px' }}
                    >
                      <Plus className="w-4.5 h-4.5" />
                      Buat Tugas
                    </button>
                  </div>

                  {/* Search and Filters panel */}
                  <div className="bg-white p-4 sm:p-5 border border-gray-100 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Cari tugas, tipe, status, atau siswa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                      {/* Filter by Status */}
                      <div className="flex items-center gap-1.5 bg-gray-50/50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600">
                        <Filter className="w-3.5 h-3.5 text-gray-400" />
                        <CustomDropdown
                          variant="minimal"
                          size="sm"
                          dropdownWidth="w-40"
                          value={statusFilter}
                          onChange={(val) => setStatusFilter(val as any)}
                          options={[
                            { value: 'all', label: 'Semua Status' },
                            { value: 'sent', label: 'Dikirim' },
                            { value: 'review', label: 'Perlu Ditinjau' },
                            { value: 'completed', label: 'Selesai' },
                            { value: 'remedial', label: 'Remedial' },
                            { value: 'expired', label: 'Kedaluwarsa' }
                          ]}
                        />
                      </div>

                      {/* Filter by Type */}
                      <div className="flex items-center gap-1.5 bg-gray-50/50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600">
                        <Layers className="w-3.5 h-3.5 text-gray-400" />
                        <CustomDropdown
                          variant="minimal"
                          size="sm"
                          dropdownWidth="w-48"
                          value={typeFilter}
                          onChange={(val) => setTypeFilter(val as any)}
                          options={[
                            { value: 'all', label: 'Semua Tipe' },
                            { value: 'short_answer', label: 'Jawaban Singkat' },
                            { value: 'multiple_choice', label: 'Pilihan Ganda' },
                            { value: 'multi_short_answer', label: 'Multi Jawaban Singkat' }
                          ]}
                        />
                      </div>

                      {/* Filter by Student */}
                      <div className="flex items-center gap-1.5 bg-gray-50/50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600">
                        <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                        <CustomDropdown
                          variant="minimal"
                          size="sm"
                          dropdownWidth="w-56"
                          value={studentFilter}
                          onChange={(val) => setStudentFilter(val)}
                          options={[
                            { value: 'all', label: 'Semua Siswa' },
                            ...students.map(s => ({ value: s.uid, label: s.fullName }))
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Assignments List Grid */}
                  {filteredAssignments.length === 0 ? (
                    <EmptyState 
                      icon={HelpCircle}
                      title="Tugas Tidak Ditemukan"
                      description="Tidak ada data tugas yang cocok dengan pencarian atau filter Anda."
                      actionText="Reset Pencarian"
                      onActionClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setTypeFilter('all');
                        setStudentFilter('all');
                      }}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                      {filteredAssignments.map((assign) => {
                        const status = getAssignmentStatus(assign);
                        const type = assign.assignmentType || 'short_answer';
                        const sub = submissions.find(s => s.assignmentId === assign.id);

                        return (
                          <div 
                            key={assign.id}
                            onClick={() => onNavigate(`/assignment/${assign.id}`)}
                            className="bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xs p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all cursor-pointer relative"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-1.5 flex-wrap">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    status === 'completed' 
                                      ? 'bg-green-50 text-green-700' 
                                      : status === 'review' 
                                        ? 'bg-amber-50 text-amber-700 animate-pulse' 
                                        : status === 'remedial'
                                          ? 'bg-orange-50 text-orange-700'
                                          : status === 'expired'
                                            ? 'bg-red-50 text-red-700'
                                            : 'bg-gray-100 text-gray-500'
                                  }`}>
                                    {status === 'completed' 
                                      ? 'Selesai' 
                                      : status === 'review' 
                                        ? 'Perlu Ditinjau' 
                                        : status === 'remedial'
                                          ? 'Remedial'
                                          : status === 'expired'
                                            ? 'Kedaluwarsa'
                                            : 'Dikirim'}
                                  </span>

                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700">
                                    {type === 'short_answer' 
                                      ? 'Jawaban Singkat' 
                                      : type === 'multiple_choice' 
                                        ? 'Pilihan Ganda' 
                                        : 'Multi Jawaban Singkat'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onNavigate(`/teacher/assignments/${assign.id}/edit`); }}
                                    className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                                    title="Edit Tugas"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => openDeleteConfirm(assign, e)}
                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                    title="Hapus Tugas"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <h3 className="text-sm font-bold text-gray-900 leading-tight">{assign.title}</h3>
                              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{assign.question}</p>
                            </div>

                            <div className="space-y-2 border-t border-gray-50 pt-3 mt-1 text-[11px]">
                              <div className="flex items-center justify-between text-gray-400 font-mono">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Diberikan: {assign.createdAt ? new Date(assign.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'Baru saja'}
                                </span>
                                {assign.deadline && (
                                  <span className={`flex items-center gap-1 font-bold ${status === 'expired' ? 'text-red-500' : 'text-gray-500'}`}>
                                    Batas: {new Date(assign.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                                    {assign.studentName?.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-gray-600 truncate max-w-[120px]">{assign.studentName}</span>
                                </div>
                                
                                <span className="text-[10px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-0.5">
                                  Detail Tugas
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* TAB: CIRCLE MANAGEMENT */}
              {activeTab === 'circles' && (
                <div className="max-w-6xl mx-auto">
                  <CircleManagement
                    students={students}
                    teacherProfile={teacherProfile}
                    onNavigate={onNavigate}
                    onSetLoading={onSetLoading}
                  />
                </div>
              )}

              {/* TAB 3: SETTINGS INLINE */}
              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <UserSettings 
                    onNavigate={(p) => {
                      if (p === '/teacher') {
                        setActiveTab('dashboard');
                      } else {
                        onNavigate(p);
                      }
                    }}
                    onSetLoading={onSetLoading}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-gray-100 w-full max-w-md p-6 space-y-5 shadow-lg relative animate-scaleUp">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Hapus Tugas Penugasan</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus tugas <strong className="text-gray-900">"{deletingAssignmentTitle}"</strong>? Tindakan ini permanen dan akan menghapus semua riwayat pengerjaan serta nilai siswa terkait tugas ini.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-500 font-semibold rounded-xl text-xs hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAssignment}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div 
            className="bg-white rounded-3xl border border-gray-100 w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-lg relative animate-scaleUp my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-50">
              <h2 className="text-lg font-display font-bold text-gray-900">
                {isEditMode ? 'Sunting Tugas Kelas' : 'Buat Tugas Baru'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveAssignment} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Judul Tugas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Contoh: Esai Refleksi Sejarah Indonesia"
                />
              </div>

              {/* Target Selection (Individual vs. Circle) */}
              {!isEditMode && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Target Penerima Tugas <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAssignmentTarget('INDIVIDUAL');
                        setSelectedCircleId('');
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        assignmentTarget === 'INDIVIDUAL'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Individu Siswa
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAssignmentTarget('CIRCLE');
                        setSelectedStudentId('');
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        assignmentTarget === 'CIRCLE'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Kavio Circle
                    </button>
                  </div>
                </div>
              )}

              {/* Conditional Recipient Field */}
              {assignmentTarget === 'INDIVIDUAL' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Pilih Siswa <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    disabled={isEditMode}
                    value={selectedStudentId}
                    placeholder="-- Pilih Siswa Penerima --"
                    onChange={(val) => setSelectedStudentId(val)}
                    options={students.map(s => ({
                      value: s.uid,
                      label: s.fullName,
                      badge: {
                        text: s.classType || 'PRIVATE',
                        className: s.classType === 'CIRCLE'
                          ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100'
                          : 'bg-teal-50 text-teal-700 border border-teal-100'
                      }
                    }))}
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Pilih Kelompok Belajar (Circle) <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    disabled={isEditMode}
                    value={selectedCircleId}
                    placeholder="-- Pilih Circle Penerima --"
                    onChange={(val) => setSelectedCircleId(val)}
                    options={circles.map(c => {
                      const memberCount = students.filter(s => s.circleId === c.id && s.classType === 'CIRCLE').length;
                      return {
                        value: c.id,
                        label: c.name,
                        sublabel: `${memberCount} Siswa`
                      };
                    })}
                  />
                </div>
              )}

              {/* Assignment Type Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Jenis Tugas <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  value={assignmentType}
                  onChange={(val) => setAssignmentType(val as any)}
                  options={[
                    { value: 'short_answer', label: 'Jawaban Singkat (Esai)' },
                    { value: 'multiple_choice', label: 'Pilihan Ganda (A-D)' },
                    { value: 'multi_short_answer', label: 'Multi Jawaban Singkat' }
                  ]}
                />
              </div>

              {/* Conditional Fields: Multiple Choice */}
              {assignmentType === 'multiple_choice' && (
                <div className="space-y-3 border-l-2 border-indigo-100 pl-4 py-1.5 bg-gray-50/30 p-3 rounded-xl">
                  <span className="block text-xs font-bold text-gray-700">Opsi Jawaban & Kunci Jawaban</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <div key={opt} className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Pilihan {opt} <span className="text-red-500">*</span></span>
                        <input
                          type="text"
                          required
                          value={choices[opt as 'A' | 'B' | 'C' | 'D']}
                          onChange={(e) => setChoices({ ...choices, [opt]: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                          placeholder={`Jawaban opsi ${opt}...`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Pilihan Kunci Jawaban Benar</span>
                    <CustomDropdown
                      value={correctChoice}
                      onChange={(val) => setCorrectChoice(val as any)}
                      options={[
                        { value: 'A', label: 'Opsi A' },
                        { value: 'B', label: 'Opsi B' },
                        { value: 'C', label: 'Opsi C' },
                        { value: 'D', label: 'Opsi D' }
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Conditional Fields: Multi Short Answer */}
              {assignmentType === 'multi_short_answer' && (
                <div className="space-y-3.5 border-l-2 border-indigo-100 pl-4 py-1.5 bg-gray-50/30 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-bold text-gray-700">Sub-Pertanyaan ({subQuestions.length})</span>
                    <button
                      type="button"
                      onClick={() => setSubQuestions([...subQuestions, ''])}
                      className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-lg transition-colors"
                    >
                      + Tambah Soal
                    </button>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {subQuestions.map((q, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="text-[10px] font-mono font-bold text-gray-400 w-5">#{idx + 1}</span>
                        <input
                          type="text"
                          required
                          value={q}
                          onChange={(e) => {
                            const next = [...subQuestions];
                            next[idx] = e.target.value;
                            setSubQuestions(next);
                          }}
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                          placeholder={`Pertanyaan sub-soal #${idx + 1}...`}
                        />
                        {subQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setSubQuestions(subQuestions.filter((_, i) => i !== idx))}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Text Area / Main Instructions */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  {assignmentType === 'multiple_choice' 
                    ? 'Pertanyaan Soal / Instruksi Penyelenggaraan' 
                    : 'Pertanyaan Utama / Detail Instruksi Tugas'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  placeholder="Tuliskan detail pertanyaan atau instruksi tugas secara rinci di sini..."
                />
              </div>

              {/* Deadline Date Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Batas Waktu Pengumpulan (Deadline) <span className="text-gray-400">(Opsional)</span>
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 font-semibold rounded-xl text-xs hover:bg-gray-50 cursor-pointer active:scale-98 transition-colors"
                  style={{ minHeight: '44px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs shadow-xs flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 transition-all"
                  style={{ minHeight: '44px' }}
                >
                  {isSubmitting ? 'Memproses...' : isEditMode ? 'Simpan Perubahan' : 'Kirim Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
