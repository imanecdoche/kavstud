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
  Trash2,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Assignment, Circle, Submission } from '../types';
import Logo from './Logo';
import NavigationSidebar from './NavigationSidebar';
import UserSettings from './UserSettings';
import CircleManagement from './CircleManagement';
import StudentManagement from './StudentManagement';
import EmptyState from './EmptyState';
import { SkeletonDashboard, SkeletonList } from './Skeletons';
import CustomDropdown from './CustomDropdown';
import CustomDatePicker from './CustomDatePicker';
import ModuleManager from './ModuleManager';
import Packages from './Packages';
import Inbox from './Inbox';
import PackageRegistrationsDev from './PackageRegistrationsDev';
import DevToolsMaintenance from './DevToolsMaintenance';
import DevToolsCenter from './DevToolsCenter';
import MaintenanceView from './MaintenanceView';
import TeacherSchedule from './TeacherSchedule';
import { getLocalFeatureFlags } from '../utils/featureFlags';
import LogoutConfirmModal from './LogoutConfirmModal';

interface TeacherDashboardProps {
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function TeacherDashboard({ onNavigate, onSetLoading }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assignments' | 'settings' | 'circles' | 'students' | 'modules' | 'packages' | 'inbox' | 'registrations' | 'devtools' | 'schedules'>('dashboard');
  const [featureFlags, setFeatureFlags] = useState(() => getLocalFeatureFlags());

  useEffect(() => {
    const handleFlagsUpdate = () => setFeatureFlags(getLocalFeatureFlags());
    window.addEventListener('kavio_feature_flags_updated', handleFlagsUpdate);
    return () => window.removeEventListener('kavio_feature_flags_updated', handleFlagsUpdate);
  }, []);
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
  const [hideDone, setHideDone] = useState(false);

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

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const executeLogout = async () => {
    setIsLoggingOut(true);
    onSetLoading(true);
    try {
      await auth.signOut();
      onNavigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
      onSetLoading(false);
    }
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
    const matchesHideDone = !hideDone || status !== 'completed';

    return matchesSearch && matchesStatus && matchesType && matchesStudent && matchesHideDone;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col lg:flex-row font-sans" id="teacher-dashboard">
      <NavigationSidebar 
        role="teacher"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={teacherProfile}
        onLogout={handleLogout}
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
        onNavigate={onNavigate}
      />

      {/* Main Container Content */}
      <main className="flex-1 min-w-0 relative">
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
                  {/* 3D Animated Hero Section */}
                  <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-800/80 dark:via-emerald-900/40 dark:to-slate-800/80 p-8 sm:p-10 md:p-12 mb-8 overflow-hidden shadow-sm border border-white dark:border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-8 stagger-item">
                    
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Left Content */}
                    <div className="relative z-10 flex-1 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative group cursor-default inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border overflow-hidden backdrop-blur-md shadow-sm transition-all bg-emerald-100/80 text-emerald-900 border-emerald-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] dark:bg-emerald-900/40 dark:text-emerald-100 dark:border-emerald-700"
                        >
                          {/* Shine effect on hover */}
                          <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent transition-transform duration-1000 ease-in-out" />
                          <span className="relative z-10">PORTAL GURU</span>
                          <motion.span
                            className="relative z-10 text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
                            animate={{ scale: [1, 1.2, 1], rotateZ: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ display: 'inline-block', transformOrigin: 'center' }}
                          >
                            👨‍🏫
                          </motion.span>
                        </motion.div>
                      </div>

                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 dark:text-white tracking-[-0.03em] text-balance leading-[1.1]">
                        Halo,{' '}
                        {/* Animated Name Effect */}
                        <motion.span
                          className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
                          style={{ backgroundSize: '200% auto' }}
                          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                          transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
                        >
                          {teacherProfile?.fullName?.split(' ')[0] || 'Guru'}!
                        </motion.span>
                      </h1>
                      
                      <p className="text-sm md:text-base font-semibold text-gray-600 dark:text-slate-300 max-w-md">
                        Kelola tugas kelas, evaluasi jawaban siswa, dan pantau perkembangan belajar secara langsung.
                      </p>

                      <div className="pt-4">
                        <button
                          onClick={() => onNavigate('/teacher/assignments/create')}
                          className="btn-duo-green px-8 py-4 text-sm font-black flex items-center justify-center gap-2.5 shrink-0 text-white w-full sm:w-auto"
                        >
                          <Plus className="w-5 h-5 text-white animate-pulse" />
                          <span>BUAT TUGAS BARU</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Content: 3D Waving Mascot (Apple) */}
                    <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 shrink-0 flex items-center justify-center pointer-events-none text-[8rem] sm:text-[10rem] md:text-[12rem] filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]">
                      <motion.div
                        animate={{
                          y: [0, -15, 0], // Floating effect
                          rotateZ: [0, -5, 10, -5, 0], // Waving effect
                        }}
                        transition={{
                          duration: 4,
                          ease: 'easeInOut',
                          repeat: Infinity,
                        }}
                      >
                        🍎
                      </motion.div>
                    </div>
                  </div>

                  {/* Stats Block Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Widget 1: Siswa Terdaftar */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 border-b-[6px] border-purple-400 dark:border-b-purple-600 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden stagger-item">
                      <div className="space-y-1 z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-display font-black text-gray-900 dark:text-white leading-none">
                            {students.length}
                          </span>
                          <span className="text-xs font-black text-purple-900 dark:text-purple-300 uppercase tracking-wider">SISWA</span>
                        </div>
                        <p className="text-xs font-bold text-purple-800/80 dark:text-purple-400/80">Siswa Terdaftar Aktif</p>
                      </div>
                      <div className="relative w-14 h-14 bg-purple-400/30 rounded-2xl flex items-center justify-center shrink-0 z-10 overflow-hidden shadow-inner border border-purple-300/50">
                        <div className="absolute w-12 h-12 bg-purple-500/40 rounded-full blur-md animate-pulse" />
                        <motion.span 
                          className="relative z-10 text-3xl drop-shadow-md filter"
                          animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ display: 'inline-block' }}
                        >
                          👥
                        </motion.span>
                      </div>
                    </div>

                    {/* Widget 2: Total Tugas */}
                    <div className="bg-sky-50 dark:bg-sky-900/20 border-2 border-sky-200 dark:border-sky-800 border-b-[6px] border-sky-400 dark:border-b-sky-600 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden stagger-item">
                      <div className="space-y-1 z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-display font-black text-gray-900 dark:text-white leading-none">
                            {assignments.length}
                          </span>
                          <span className="text-xs font-black text-sky-900 dark:text-sky-300 uppercase tracking-wider">TUGAS</span>
                        </div>
                        <p className="text-xs font-bold text-sky-800/80 dark:text-sky-400/80">Total Tugas Diberikan</p>
                      </div>
                      <div className="relative w-14 h-14 bg-sky-400/30 rounded-2xl flex items-center justify-center shrink-0 z-10 overflow-hidden shadow-inner border border-sky-300/50">
                        <div className="absolute w-12 h-12 bg-sky-500/40 rounded-full blur-md animate-pulse" />
                        <motion.span 
                          className="relative z-10 text-3xl drop-shadow-md filter"
                          animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
                          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ display: 'inline-block' }}
                        >
                          📋
                        </motion.span>
                      </div>
                    </div>

                    {/* Widget 3: Total Submisi */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 border-b-[6px] border-emerald-400 dark:border-b-emerald-600 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden stagger-item sm:col-span-2 lg:col-span-1">
                      <div className="space-y-1 z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-display font-black text-gray-900 dark:text-white leading-none">
                            {submissions.length}
                          </span>
                          <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">JAWABAN</span>
                        </div>
                        <p className="text-xs font-bold text-emerald-800/80 dark:text-emerald-400/80">Total Submisi Masuk</p>
                      </div>
                      <div className="relative w-14 h-14 bg-emerald-400/30 rounded-2xl flex items-center justify-center shrink-0 z-10 overflow-hidden shadow-inner border border-emerald-300/50">
                        <div className="absolute w-12 h-12 bg-emerald-500/40 rounded-full blur-md animate-pulse" />
                        <motion.span 
                          className="relative z-10 text-3xl drop-shadow-md filter"
                          animate={{ y: [0, -5, 0], scale: [1, 1.1, 1], rotateZ: [0, 5, -5, 0] }}
                          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ display: 'inline-block' }}
                        >
                          ✅
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard split content panels */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left & Middle columns: Recent tasks & submissions */}
                    <div className="xl:col-span-2 space-y-8">
                      
                      {/* Section: Submisi Masuk Terbaru */}
                      <div className="card-duo p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
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
                          <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto pr-1 space-y-1">
                            {submissions.slice(0, 5).map((sub) => (
                              <div 
                                key={sub.id}
                                onClick={() => onNavigate(`/submission/${sub.id}`)}
                                className="group relative py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 -mx-2 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-md bg-white dark:bg-transparent"
                              >
                                {/* Animated Mesh Background on Hover */}
                                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                  <motion.div 
                                    className="absolute -inset-[100%] w-[300%] h-[300%] bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.06)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.06)_0%,transparent_50%),radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.06)_0%,transparent_50%)]"
                                    animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                  />
                                </div>

                                <div className="min-w-0 relative z-10">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{sub.assignmentTitle}</h4>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-xl text-[9px] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm transition-all ${
                                      sub.status === 'graded' 
                                        ? 'bg-green-100/80 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300' 
                                        : 'bg-amber-100/80 text-amber-800 border-amber-300 animate-pulse dark:bg-amber-900/40 dark:text-amber-300'
                                    }`}>
                                      {sub.status === 'graded' ? 'Sudah Dinilai' : 'Butuh Dinilai'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                                    Oleh: <span className="font-bold text-gray-700 dark:text-slate-200">{sub.studentName}</span>
                                  </p>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0 relative z-10">
                                  {sub.score !== null ? (
                                    <div className="text-right">
                                      <p className="text-[10px] text-gray-400">Total EXP</p>
                                      <p className="text-xs font-bold text-amber-500 font-mono">{sub.score} EXP</p>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50/80 backdrop-blur-sm border border-indigo-200 shadow-sm dark:bg-indigo-900/40 dark:border-indigo-800 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                                      Beri EXP Sekarang
                                    </span>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Section: Tugas Terbaru Dibuat */}
                      <div className="card-duo p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
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
                          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto pr-1 space-y-1">
                            {assignments.slice(0, 5).map((assign) => (
                              <div 
                                key={assign.id}
                                className="group relative py-3.5 flex items-center justify-between gap-4 px-4 -mx-2 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-transparent hover:border-sky-200 dark:hover:border-sky-500/30 hover:shadow-md bg-white dark:bg-transparent"
                                onClick={() => onNavigate(`/assignment/${assign.id}`)}
                              >
                                {/* Animated Mesh Background on Hover */}
                                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                  <motion.div 
                                    className="absolute -inset-[100%] w-[300%] h-[300%] bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.06)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.06)_0%,transparent_50%),radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.06)_0%,transparent_50%)]"
                                    animate={{ rotate: [360, 270, 180, 90, 0], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                  />
                                </div>

                                <div className="min-w-0 relative z-10">
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{assign.title}</h4>
                                  <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1 truncate">Siswa: <span className="font-bold text-gray-700 dark:text-slate-200">{assign.studentName}</span></p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 relative z-10">
                                  <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50/80 backdrop-blur-sm border border-sky-200 shadow-sm dark:bg-sky-900/40 dark:border-sky-800 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                                    {assign.createdAt ? new Date(assign.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'Baru saja'}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-sky-500 transition-colors" />
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
                      <div className="card-duo p-6 space-y-4">
                        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Aksi Cepat</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <button
                            onClick={() => onNavigate('/teacher/assignments/create')}
                            className="btn-duo-blue w-full py-3 px-4 text-xs font-black flex items-center gap-3"
                          >
                            <Plus className="w-4 h-4 shrink-0" />
                            <span>Kirim Tugas Baru</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('assignments')}
                            className="w-full py-3 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:bg-slate-600 rounded-2xl font-black text-xs border-b-4 border-gray-300 dark:border-slate-600 flex items-center gap-3 transition-all cursor-pointer active:translate-y-[2px] active:border-b-2"
                          >
                            <Layers className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0" />
                            <span>Kelola Semua Tugas</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('settings')}
                            className="w-full py-3 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:bg-slate-600 rounded-2xl font-black text-xs border-b-4 border-gray-300 dark:border-slate-600 flex items-center gap-3 transition-all cursor-pointer active:translate-y-[2px] active:border-b-2"
                          >
                            <Award className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0" />
                            <span>Pengaturan Profil</span>
                          </button>
                        </div>
                      </div>

                      {/* Student list */}
                      <div className="card-duo p-6 space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
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
                                className="p-3 bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700/50 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-indigo-100 dark:border-indigo-800/50">
                                    <img 
                                      src={stud.photoURL || '/aset/default-avatar.svg'} 
                                      alt={stud.fullName} 
                                      className="w-full h-full object-cover" 
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/aset/default-avatar.svg';
                                      }}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight">{stud.fullName}</p>
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-slate-700/50 pb-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                        Daftar Penugasan Kelas
                      </h1>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Cari, saring, dan tinjau seluruh tugas belajar yang telah didistribusikan ke siswa.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('/teacher/assignments/create')}
                      className="btn-duo-blue px-5 py-3 text-xs font-black flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
                      style={{ minHeight: '44px' }}
                    >
                      <Plus className="w-4.5 h-4.5" />
                      <span>Buat Tugas Baru</span>
                    </button>
                  </div>

                  {/* Search and Filters panel */}
                  <div className="card-duo p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Cari tugas, tipe, status, atau siswa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 border-b-4 border-gray-300 dark:border-slate-600 rounded-2xl text-xs font-bold placeholder-gray-400 focus:outline-none focus:bg-white dark:bg-slate-800 focus:border-sky-400 focus:border-b-sky-500 transition-all"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                      {/* Filter by Status */}
                      <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-300">
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
                      <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-300">
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
                      <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-300">
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

                      {/* HIDE DONE Button */}
                      <button
                        type="button"
                        onClick={() => setHideDone(!hideDone)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 cursor-pointer shadow-xs ${
                          hideDone
                            ? 'bg-sky-600 text-white border-sky-600 dark:bg-sky-500 dark:border-sky-500 shadow-sky-500/20 ring-2 ring-sky-500/30'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'
                        }`}
                      >
                        <EyeOff className={`w-3.5 h-3.5 ${hideDone ? 'text-white' : 'text-gray-500 dark:text-slate-400'}`} />
                        <span>HIDE DONE</span>
                        {hideDone && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                        )}
                      </button>
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
                            className="card-duo-interactive p-5 flex flex-col justify-between gap-4 relative"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-1.5 flex-wrap">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    status === 'completed' 
                                      ? 'bg-green-50 text-green-700' 
                                      : status === 'review' 
                                        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 animate-pulse' 
                                        : status === 'remedial'
                                          ? 'bg-orange-50 text-orange-700'
                                          : status === 'expired'
                                            ? 'bg-red-50 text-red-700'
                                            : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
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

                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700">
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
                                    className="p-1 text-gray-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:bg-indigo-900/30 rounded-md transition-colors cursor-pointer"
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

                              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{assign.title}</h3>
                              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{assign.question}</p>
                            </div>

                            <div className="space-y-2 border-t border-gray-50 pt-3 mt-1 text-[11px]">
                              <div className="flex items-center justify-between text-gray-400 font-mono">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Diberikan: {assign.createdAt ? new Date(assign.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'Baru saja'}
                                </span>
                                {assign.deadline && (
                                  <span className={`flex items-center gap-1 font-bold ${status === 'expired' ? 'text-red-500' : 'text-gray-500 dark:text-slate-400'}`}>
                                    Batas: {new Date(assign.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                                    {assign.studentName?.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-gray-600 dark:text-slate-300 truncate max-w-[120px]">{assign.studentName}</span>
                                </div>
                                
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5">
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

              {/* TAB: STUDENT MANAGEMENT */}
              {activeTab === 'students' && (
                <div className="max-w-7xl mx-auto">
                  <StudentManagement
                    students={students}
                    assignments={assignments}
                    submissions={submissions}
                    circles={circles}
                    onNavigate={onNavigate}
                    onSendAssignmentToStudent={(studentId) => {
                      setSelectedStudentId(studentId);
                      setAssignmentTarget('INDIVIDUAL');
                      setIsEditMode(false);
                      setNewTitle('');
                      setNewQuestion('');
                      setDeadline('');
                      setFormError(null);
                      setIsModalOpen(true);
                    }}
                  />
                </div>
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

              {/* TAB: MODULE MANAGEMENT */}
              {activeTab === 'modules' && (
                <ModuleManager 
                  onSetLoading={onSetLoading}
                />
              )}

              {/* TAB: PACKAGES */}
              {activeTab === 'packages' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <Packages />
                </div>
              )}

              {/* TAB: INBOX */}
              {activeTab === 'inbox' && (
                <Inbox 
                  onNavigate={onNavigate} 
                  onSelectTab={setActiveTab} 
                  userProfile={teacherProfile} 
                />
              )}

              {/* TAB: REGISTRATIONS (DEV / ADMIN) */}
              {activeTab === 'registrations' && (
                <PackageRegistrationsDev />
              )}

              {/* TAB: DEV TOOLS CENTER (SPOTIFY DESIGN SYSTEM POWERED) */}
              {activeTab === 'devtools' && (
                <DevToolsCenter 
                  userProfile={teacherProfile}
                  onNavigate={onNavigate}
                  onSetLoading={onSetLoading}
                />
              )}

              {/* TAB: SCHEDULES */}
              {activeTab === 'schedules' && (
                <TeacherSchedule />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="modal-duo w-[460px] h-[250px] max-w-[95vw] max-h-[90vh] p-6 space-y-5 relative animate-scaleUp flex flex-col justify-between">
            <h3 className="text-xs font-black text-red-600 uppercase tracking-wider">Hapus Tugas Penugasan</h3>
            <p className="text-xs text-gray-600 dark:text-slate-300 font-medium leading-relaxed">
              Apakah Anda yakin ingin menghapus tugas <strong className="text-gray-900 dark:text-white font-extrabold">"{deletingAssignmentTitle}"</strong>? Tindakan ini permanen dan akan menghapus semua riwayat pengerjaan serta nilai siswa terkait tugas ini.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn-duo-slate flex-1 py-3 text-xs font-black"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAssignment}
                className="btn-duo-red flex-1 py-3 text-xs font-black"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div 
            className="modal-duo w-[540px] h-[640px] max-w-[95vw] max-h-[90vh] p-6 sm:p-8 space-y-5 relative animate-scaleUp overflow-y-auto my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-50">
              <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Sunting Tugas Kelas' : 'Buat Tugas Baru'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:bg-slate-900 rounded-lg cursor-pointer"
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
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">
                  Judul Tugas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Contoh: Esai Refleksi Sejarah Indonesia"
                />
              </div>

              {/* Target Selection (Individual vs. Circle) */}
              {!isEditMode && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">
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
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 border-indigo-200'
                          : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900'
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
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 border-indigo-200'
                          : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900'
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
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">
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
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">
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
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">
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
                <div className="space-y-3 border-l-2 border-indigo-100 dark:border-indigo-800/50 pl-4 py-1.5 bg-gray-50 dark:bg-slate-900/30 p-3 rounded-xl">
                  <span className="block text-xs font-bold text-gray-700 dark:text-slate-200">Opsi Jawaban & Kunci Jawaban</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <div key={opt} className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Pilihan {opt} <span className="text-red-500">*</span></span>
                        <input
                          type="text"
                          required
                          value={choices[opt as 'A' | 'B' | 'C' | 'D']}
                          onChange={(e) => setChoices({ ...choices, [opt]: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                          placeholder={`Jawaban opsi ${opt}...`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-slate-700/50">
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
                <div className="space-y-3.5 border-l-2 border-indigo-100 dark:border-indigo-800/50 pl-4 py-1.5 bg-gray-50 dark:bg-slate-900/30 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-bold text-gray-700 dark:text-slate-200">Sub-Pertanyaan ({subQuestions.length})</span>
                    <button
                      type="button"
                      onClick={() => setSubQuestions([...subQuestions, ''])}
                      className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-lg transition-colors"
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
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
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
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">
                  {assignmentType === 'multiple_choice' 
                    ? 'Pertanyaan Soal / Instruksi Penyelenggaraan' 
                    : 'Pertanyaan Utama / Detail Instruksi Tugas'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  placeholder="Tuliskan detail pertanyaan atau instruksi tugas secara rinci di sini..."
                />
              </div>

              {/* Deadline Date Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">
                  Batas Waktu Pengumpulan (Deadline) <span className="text-gray-400">(Opsional)</span>
                </label>
                <CustomDatePicker
                  value={deadline}
                  onChange={(val) => setDeadline(val)}
                  placeholder="Pilih Tanggal Tenggat Waktu"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-duo-slate flex-1 py-3 text-xs font-black"
                  style={{ minHeight: '44px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-duo-blue flex-1 py-3 text-xs font-black"
                  style={{ minHeight: '44px' }}
                >
                  {isSubmitting ? 'Memproses...' : isEditMode ? 'Simpan Perubahan' : 'Kirim Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={executeLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
