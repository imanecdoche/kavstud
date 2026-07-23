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
    <div className="min-h-screen bg-[#171A21] text-[#FFFFFF] flex flex-col lg:flex-row font-sans" id="teacher-dashboard">
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
          <div className="m-6 p-4 bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 rounded-[2px] text-xs text-[#FF4B4B] flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-[#FF4B4B] shrink-0" />
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
                  {/* Steam Featured Hero Section */}
                  <div className="relative w-full rounded-[4px] bg-gradient-to-br from-[#2F3138] to-[#171A21] p-8 sm:p-10 md:p-12 mb-8 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#66C0F4]/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Left Content */}
                    <div className="relative z-10 flex-1 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] text-[11px] font-bold uppercase tracking-wider bg-[#A1CD44] text-[#171A21]">
                          <span>PORTAL GURU</span>
                        </div>
                      </div>

                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                        Halo,{' '}
                        <span className="text-[#66C0F4]">
                          {teacherProfile?.fullName?.split(' ')[0] || 'Guru'}!
                        </span>
                      </h1>
                      
                      <p className="text-sm md:text-base font-normal text-[#C6D4DF] max-w-md">
                        Kelola tugas kelas, evaluasi jawaban siswa, dan pantau perkembangan belajar secara langsung.
                      </p>

                      <div className="pt-4">
                        <button
                          onClick={() => onNavigate('/teacher/assignments/create')}
                          className="bg-[#66C0F4] hover:bg-[#5DADE2] active:bg-[#52A4CC] text-[#FFFFFF] text-[13px] font-normal px-6 py-3 rounded-[2px] min-h-[44px] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)] w-full sm:w-auto uppercase tracking-wider font-bold"
                        >
                          <Plus className="w-5 h-5 text-white" />
                          <span>BUAT TUGAS BARU</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Content: Mascot */}
                    <div className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 shrink-0 flex items-center justify-center pointer-events-none">
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 4,
                          ease: 'easeInOut',
                          repeat: Infinity,
                        }}
                        className="w-24 h-24 rounded-full bg-[#66C0F4]/20 border border-[#66C0F4]/40 flex items-center justify-center font-bold text-[#66C0F4]"
                      >
                        KAVIO
                      </motion.div>
                    </div>
                  </div>

                  {/* Steam Tile Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Widget 1: Siswa Terdaftar */}
                    <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.5)] relative overflow-hidden">
                      <div className="space-y-1 z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-[#FFFFFF] leading-none">
                            {students.length}
                          </span>
                          <span className="text-[11px] font-bold text-[#A1CD44] uppercase tracking-wider">SISWA</span>
                        </div>
                        <p className="text-xs text-[#C6D4DF]">Siswa Terdaftar Aktif</p>
                      </div>
                      <div className="w-12 h-12 bg-[#66C0F4]/10 rounded-[2px] border border-[#66C0F4]/30 flex items-center justify-center shrink-0 z-10">
                        <Users className="w-6 h-6 text-[#66C0F4]" />
                      </div>
                    </div>

                    {/* Widget 2: Total Tugas */}
                    <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.5)] relative overflow-hidden">
                      <div className="space-y-1 z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-[#FFFFFF] leading-none">
                            {assignments.length}
                          </span>
                          <span className="text-[11px] font-bold text-[#66C0F4] uppercase tracking-wider">TUGAS</span>
                        </div>
                        <p className="text-xs text-[#C6D4DF]">Total Tugas Diberikan</p>
                      </div>
                      <div className="w-12 h-12 bg-[#66C0F4]/10 rounded-[2px] border border-[#66C0F4]/30 flex items-center justify-center shrink-0 z-10">
                        <FileText className="w-6 h-6 text-[#66C0F4]" />
                      </div>
                    </div>

                    {/* Widget 3: Total Submisi */}
                    <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.5)] relative overflow-hidden sm:col-span-2 lg:col-span-1">
                      <div className="space-y-1 z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-[#FFFFFF] leading-none">
                            {submissions.length}
                          </span>
                          <span className="text-[11px] font-bold text-[#A1CD44] uppercase tracking-wider">JAWABAN</span>
                        </div>
                        <p className="text-xs text-[#C6D4DF]">Total Submisi Masuk</p>
                      </div>
                      <div className="w-12 h-12 bg-[#A1CD44]/10 rounded-[2px] border border-[#A1CD44]/30 flex items-center justify-center shrink-0 z-10">
                        <CheckCircle2 className="w-6 h-6 text-[#A1CD44]" />
                      </div>
                    </div>
                  </div>

                  {/* Dashboard split content panels */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left & Middle columns: Recent tasks & submissions */}
                    <div className="xl:col-span-2 space-y-8">
                      
                      {/* Section: Submisi Masuk Terbaru */}
                      <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <h3 className="text-xs font-bold text-[#FFFFFF] flex items-center gap-2 uppercase tracking-wide">
                            <CheckCircle2 className="w-4 h-4 text-[#A1CD44]" />
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
                          <div className="divide-y divide-white/5 max-h-96 overflow-y-auto pr-1 space-y-1">
                            {submissions.slice(0, 5).map((sub) => (
                              <div 
                                key={sub.id}
                                onClick={() => onNavigate(`/submission/${sub.id}`)}
                                className="group relative py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-3 rounded-[2px] transition-all cursor-pointer bg-white/5 hover:bg-white/10 border border-transparent hover:border-[#66C0F4]/30"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h4 className="text-xs font-bold text-[#FFFFFF] truncate">{sub.assignmentTitle}</h4>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${
                                      sub.status === 'graded' 
                                        ? 'bg-[#A1CD44] text-[#171A21]' 
                                        : 'bg-[#FFA500]/20 border border-[#FFA500] text-[#FFA500]'
                                    }`}>
                                      {sub.status === 'graded' ? 'Sudah Dinilai' : 'Butuh Dinilai'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#C6D4DF] truncate">
                                    Oleh: <span className="font-bold text-[#FFFFFF]">{sub.studentName}</span>
                                  </p>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0">
                                  {sub.score !== null ? (
                                    <div className="text-right">
                                      <p className="text-[10px] text-[#8A8A8A]">Total EXP</p>
                                      <p className="text-xs font-bold text-[#66C0F4] font-mono">{sub.score} EXP</p>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-[#66C0F4] font-bold bg-[#66C0F4]/10 border border-[#66C0F4] px-3 py-1 rounded-[2px] uppercase tracking-wider">
                                      Beri EXP
                                    </span>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-[#848E94] group-hover:text-[#66C0F4] transition-colors" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Section: Tugas Terbaru Dibuat */}
                      <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <h3 className="text-xs font-bold text-[#FFFFFF] flex items-center gap-2 uppercase tracking-wide">
                            <FileText className="w-4 h-4 text-[#66C0F4]" />
                            Daftar Tugas Baru
                          </h3>
                        </div>     </div>

                        {assignments.length === 0 ? (
                          <EmptyState 
                            icon={NotebookText}
                            title="Belum Ada Tugas"
                            description="Anda belum membuat tugas untuk siswa."
                            actionText="Buat Tugas Pertama"
                            onActionClick={() => onNavigate('/teacher/assignments/create')}
                          />
                        ) : (
                          <div className="divide-y divide-white/5 max-h-80 overflow-y-auto pr-1 space-y-1">
                            {assignments.slice(0, 5).map((assign) => (
                              <div 
                                key={assign.id}
                                className="group relative py-3 flex items-center justify-between gap-4 px-3 rounded-[2px] transition-all cursor-pointer bg-white/5 hover:bg-white/10 border border-transparent hover:border-[#66C0F4]/30"
                                onClick={() => onNavigate(`/assignment/${assign.id}`)}
                              >
                                <div className="min-w-0 relative z-10">
                                  <h4 className="text-xs font-bold text-[#FFFFFF] truncate">{assign.title}</h4>
                                  <p className="text-[11px] text-[#C6D4DF] mt-0.5 truncate">Siswa: <span className="font-bold text-[#FFFFFF]">{assign.studentName}</span></p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 relative z-10">
                                  <span className="text-[10px] font-bold text-[#66C0F4] bg-[#66C0F4]/10 border border-[#66C0F4]/30 px-2 py-0.5 rounded-[2px] uppercase tracking-wider">
                                    {assign.createdAt ? new Date(assign.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'Baru saja'}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-[#848E94] group-hover:text-[#66C0F4] transition-colors" />
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
                      <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                        <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-white/10 pb-2">Aksi Cepat</h3>
                        <div className="grid grid-cols-1 gap-2.5">
                          <button
                            onClick={() => onNavigate('/teacher/assignments/create')}
                            className="bg-[#66C0F4] hover:bg-[#5DADE2] active:bg-[#52A4CC] text-[#FFFFFF] text-[13px] font-normal py-2.5 px-4 rounded-[2px] min-h-[38px] transition-all cursor-pointer flex items-center gap-3 justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
                          >
                            <Plus className="w-4 h-4 shrink-0" />
                            <span>Kirim Tugas Baru</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('assignments')}
                            className="bg-transparent hover:bg-[#66C0F4]/15 text-[#FFFFFF] hover:text-[#66C0F4] text-[13px] font-normal py-2.5 px-4 rounded-[2px] border border-white/20 hover:border-[#66C0F4] min-h-[38px] flex items-center gap-3 justify-center transition-all cursor-pointer"
                          >
                            <Layers className="w-4 h-4 text-[#66C0F4] shrink-0" />
                            <span>Kelola Semua Tugas</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('settings')}
                            className="bg-transparent hover:bg-[#66C0F4]/15 text-[#FFFFFF] hover:text-[#66C0F4] text-[13px] font-normal py-2.5 px-4 rounded-[2px] border border-white/20 hover:border-[#66C0F4] min-h-[38px] flex items-center gap-3 justify-center transition-all cursor-pointer"
                          >
                            <Award className="w-4 h-4 text-[#B9A074] shrink-0" />
                            <span>Pengaturan Profil</span>
                          </button>
                        </div>
                      </div>

                      {/* Student list */}
                      <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                        <h3 className="text-xs font-bold text-[#FFFFFF] flex items-center gap-2 uppercase tracking-wide border-b border-white/10 pb-2">
                          <Users className="w-4 h-4 text-[#66C0F4]" />
                          Daftar Siswa Kelas
                        </h3>

                        {students.length === 0 ? (
                          <EmptyState 
                            icon={Users}
                            title="Tidak Ada Siswa"
                            description="Belum ada siswa yang mendaftar di kelas Anda."
                          />
                        ) : (
                          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                            {students.map((stud) => (
                              <div 
                                key={stud.uid}
                                onClick={() => onNavigate(`/student/${stud.uid}`)}
                                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#66C0F4]/30 rounded-[2px] flex items-center justify-between gap-3 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 bg-[#66C0F4]/20 text-[#66C0F4] rounded-full flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-[#66C0F4]/30">
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
                                      <p className="text-xs font-bold text-[#FFFFFF] truncate leading-tight">{stud.fullName}</p>
                                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold uppercase ${
                                        stud.classType === 'PRIVATE'
                                          ? 'bg-[#A1CD44] text-[#171A21]'
                                          : 'bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/40'
                                      }`}>
                                        {stud.classType || 'PRIVATE'}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-[#8A8A8A] truncate mt-0.5">{stud.email}</p>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#848E94] shrink-0" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
              )}

              {/* TAB 2: FULL ASSIGNMENTS MANAGER */}
              {activeTab === 'assignments' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                        Daftar Penugasan Kelas
                      </h1>
                      <p className="text-xs text-[#C6D4DF] mt-1">
                        Cari, saring, dan tinjau seluruh tugas belajar yang telah didistribusikan ke siswa.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('/teacher/assignments/create')}
                      className="bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] font-bold text-xs uppercase px-5 py-2.5 rounded-[2px] min-h-[40px] flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 transition-all"
                    >
                      <Plus className="w-4 h-4 text-[#171A21]" />
                      <span>Buat Tugas Baru</span>
                    </button>
                  </div>

                  {/* Search and Filters panel */}
                  <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A] w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Cari tugas, tipe, status, atau siswa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/15 text-white placeholder-[#8A8A8A] text-xs font-bold rounded-[2px] focus:outline-none focus:border-[#66C0F4] transition-all"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                      {/* Filter by Status */}
                      <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 px-3 py-1.5 rounded-[2px] text-xs font-bold text-white shadow-xs">
                        <Filter className="w-3.5 h-3.5 text-[#66C0F4]" />
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
                      <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 px-3 py-1.5 rounded-[2px] text-xs font-bold text-white shadow-xs">
                        <Layers className="w-3.5 h-3.5 text-[#66C0F4]" />
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
                      <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 px-3 py-1.5 rounded-[2px] text-xs font-bold text-white shadow-xs">
                        <UserCheck className="w-3.5 h-3.5 text-[#66C0F4]" />
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
                        className={`px-4 py-1.5 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
                          hideDone
                            ? 'bg-[#66C0F4] text-[#171A21] border-[#66C0F4] shadow-sm'
                            : 'bg-black/40 text-[#C6D4DF] border-white/15 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <EyeOff className={`w-3.5 h-3.5 ${hideDone ? 'text-[#171A21]' : 'text-[#8A8A8A]'}`} />
                        <span>HIDE DONE</span>
                        {hideDone && (
                          <span className="w-2 h-2 rounded-full bg-[#171A21] animate-pulse ml-0.5" />
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
                            className="bg-[#2F3138] border border-white/10 hover:border-[#66C0F4]/40 rounded-[3px] p-5 flex flex-col justify-between gap-4 relative shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-1.5 flex-wrap">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${
                                    status === 'completed' 
                                      ? 'bg-[#A1CD44] text-[#171A21]' 
                                      : status === 'review' 
                                        ? 'bg-[#FFA500]/20 border border-[#FFA500] text-[#FFA500]' 
                                        : status === 'remedial'
                                          ? 'bg-orange-900/40 text-orange-300 border border-orange-500/30'
                                          : status === 'expired'
                                            ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] border border-[#FF4B4B]/30'
                                            : 'bg-white/10 text-[#C6D4DF]'
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

                                  <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-normal bg-[#66C0F4]/10 border border-[#66C0F4] text-[#66C0F4]">
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
                                    className="p-1 text-[#848E94] hover:text-[#66C0F4] hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
                                    title="Edit Tugas"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => openDeleteConfirm(assign, e)}
                                    className="p-1 text-[#848E94] hover:text-[#FF4B4B] hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
                                    title="Hapus Tugas"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <h3 className="text-sm font-bold text-[#FFFFFF] leading-tight">{assign.title}</h3>
                              <p className="text-xs text-[#C6D4DF] line-clamp-2 leading-relaxed">{assign.question}</p>
                            </div>

                            <div className="space-y-2 border-t border-white/10 pt-3 mt-1 text-[11px]">
                              <div className="flex items-center justify-between text-[#8A8A8A]">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-[#66C0F4]" />
                                  Diberikan: {assign.createdAt ? new Date(assign.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'Baru saja'}
                                </span>
                                {assign.deadline && (
                                  <span className={`flex items-center gap-1 font-bold ${status === 'expired' ? 'text-[#FF4B4B]' : 'text-[#C6D4DF]'}`}>
                                    Batas: {new Date(assign.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-[#66C0F4]/20 text-[#66C0F4] rounded-full flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                                    {assign.studentName?.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-[#FFFFFF] truncate max-w-[120px]">{assign.studentName}</span>
                                </div>
                                
                                <span className="text-[10px] font-bold text-[#66C0F4] hover:underline inline-flex items-center gap-0.5">
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

              {/* TAB: DEV TOOLS CENTER */}
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
                <div className="-mx-4 sm:-mx-8 lg:-mx-10 -mt-4 sm:-mt-8 lg:-mt-10">
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#2F3138] border border-white/20 rounded-[4px] shadow-[0_6px_16px_rgba(0,0,0,0.6)] w-[460px] h-[250px] max-w-[95vw] max-h-[90vh] p-6 space-y-5 relative flex flex-col justify-between text-white">
            <h3 className="text-xs font-bold text-[#FF4B4B] uppercase tracking-wider border-b border-white/10 pb-2">Hapus Tugas Penugasan</h3>
            <p className="text-xs text-[#C6D4DF] leading-relaxed">
              Apakah Anda yakin ingin menghapus tugas <strong className="text-white">"{deletingAssignmentTitle}"</strong>? Tindakan ini permanen dan akan menghapus semua riwayat pengerjaan serta nilai siswa terkait tugas ini.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="bg-transparent hover:bg-white/10 text-white text-[13px] font-normal flex-1 py-2.5 rounded-[2px] border border-white/20 min-h-[38px] transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAssignment}
                className="bg-[#FF4B4B] hover:bg-[#E03E3E] text-white text-[13px] font-normal flex-1 py-2.5 rounded-[2px] min-h-[38px] transition-all cursor-pointer"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div 
            className="bg-[#2F3138] border border-white/20 rounded-[4px] shadow-[0_6px_16px_rgba(0,0,0,0.6)] w-[540px] max-w-[95vw] max-h-[90vh] p-6 sm:p-8 space-y-5 relative overflow-y-auto my-auto text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {isEditMode ? 'Sunting Tugas Kelas' : 'Buat Tugas Baru'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#848E94] hover:text-white hover:bg-white/10 rounded-[2px] cursor-pointer"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 rounded-[2px] text-xs text-[#FF4B4B]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveAssignment} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-[12px] text-[#C6D4DF]">
                  Judul Tugas <span className="text-[#FF4B4B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-black/40 border border-white/15 text-white placeholder-[#8A8A8A] text-[13px] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#66C0F4] transition-all w-full"
                  placeholder="Contoh: Esai Refleksi Sejarah Indonesia"
                />
              </div>

              {/* Target Selection (Individual vs. Circle) */}
              {!isEditMode && (
                <div className="space-y-1.5">
                  <label className="block text-[12px] text-[#C6D4DF]">
                    Target Penerima Tugas <span className="text-[#FF4B4B]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAssignmentTarget('INDIVIDUAL');
                        setSelectedCircleId('');
                      }}
                      className={`flex-1 py-2 px-3 rounded-[2px] text-xs font-normal border transition-all cursor-pointer ${
                        assignmentTarget === 'INDIVIDUAL'
                          ? 'bg-[#66C0F4] text-[#171A21] font-bold border-[#66C0F4]'
                          : 'bg-transparent text-[#C6D4DF] border-white/20 hover:border-[#66C0F4]'
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
                      className={`flex-1 py-2 px-3 rounded-[2px] text-xs font-normal border transition-all cursor-pointer ${
                        assignmentTarget === 'CIRCLE'
                          ? 'bg-[#66C0F4] text-[#171A21] font-bold border-[#66C0F4]'
                          : 'bg-transparent text-[#C6D4DF] border-white/20 hover:border-[#66C0F4]'
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
                  <label className="block text-[12px] text-[#C6D4DF]">
                    Pilih Siswa <span className="text-[#FF4B4B]">*</span>
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
                          ? 'bg-[#66C0F4]/20 text-[#66C0F4] border-0'
                          : 'bg-[#A1CD44] text-[#171A21] border-0'
                      }
                    }))}
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-[12px] text-[#C6D4DF]">
                    Pilih Kelompok Belajar (Circle) <span className="text-[#FF4B4B]">*</span>
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
                <label className="block text-[12px] text-[#C6D4DF]">
                  Jenis Tugas <span className="text-[#FF4B4B]">*</span>
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
                <div className="space-y-3 border-l-2 border-[#66C0F4] pl-4 py-2 bg-black/30 p-3 rounded-[2px]">
                  <span className="block text-xs font-bold text-white">Opsi Jawaban & Kunci Jawaban</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <div key={opt} className="space-y-1">
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase">Pilihan {opt} <span className="text-[#FF4B4B]">*</span></span>
                        <input
                          type="text"
                          required
                          value={choices[opt as 'A' | 'B' | 'C' | 'D']}
                          onChange={(e) => setChoices({ ...choices, [opt]: e.target.value })}
                          className="bg-black/40 border border-white/15 text-white placeholder-[#8A8A8A] text-xs px-3 py-1.5 rounded-[2px] focus:outline-none focus:border-[#66C0F4] w-full"
                          placeholder={`Jawaban opsi ${opt}...`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-bold text-[#8A8A8A] uppercase">Pilihan Kunci Jawaban Benar</span>
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
                <div className="space-y-3.5 border-l-2 border-[#66C0F4] pl-4 py-2 bg-black/30 p-3 rounded-[2px]">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-bold text-white">Sub-Pertanyaan ({subQuestions.length})</span>
                    <button
                      type="button"
                      onClick={() => setSubQuestions([...subQuestions, ''])}
                      className="text-[11px] bg-[#66C0F4]/10 hover:bg-[#66C0F4]/20 border border-[#66C0F4] text-[#66C0F4] font-bold px-2.5 py-1 rounded-[2px] transition-colors"
                    >
                      + Tambah Soal
                    </button>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {subQuestions.map((q, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="text-[10px] font-mono font-bold text-[#848E94] w-5">#{idx + 1}</span>
                        <input
                          type="text"
                          required
                          value={q}
                          onChange={(e) => {
                            const next = [...subQuestions];
                            next[idx] = e.target.value;
                            setSubQuestions(next);
                          }}
                          className="flex-1 bg-black/40 border border-white/15 text-white placeholder-[#8A8A8A] text-xs px-3 py-1.5 rounded-[2px] focus:outline-none focus:border-[#66C0F4]"
                          placeholder={`Pertanyaan sub-soal #${idx + 1}...`}
                        />
                        {subQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setSubQuestions(subQuestions.filter((_, i) => i !== idx))}
                            className="p-1.5 text-[#FF4B4B] hover:bg-[#FF4B4B]/20 rounded-[2px] cursor-pointer"
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
                <label className="block text-[12px] text-[#C6D4DF]">
                  {assignmentType === 'multiple_choice' 
                    ? 'Pertanyaan Soal / Instruksi Penyelenggaraan' 
                    : 'Pertanyaan Utama / Detail Instruksi Tugas'} <span className="text-[#FF4B4B]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="bg-black/40 border border-white/15 text-white placeholder-[#8A8A8A] text-xs px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#66C0F4] w-full resize-none"
                  placeholder="Tuliskan detail pertanyaan atau instruksi tugas secara rinci di sini..."
                />
              </div>

              {/* Deadline Date Input */}
              <div className="space-y-1.5">
                <label className="block text-[12px] text-[#C6D4DF]">
                  Batas Waktu Pengumpulan (Deadline) <span className="text-[#8A8A8A]">(Opsional)</span>
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
                  className="bg-transparent hover:bg-white/10 text-white text-[13px] font-normal flex-1 py-2.5 rounded-[2px] border border-white/20 min-h-[38px] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#66C0F4] hover:bg-[#5DADE2] active:bg-[#52A4CC] text-white text-[13px] font-normal flex-1 py-2.5 rounded-[2px] min-h-[38px] transition-all cursor-pointer font-bold shadow-[0_2px_6px_rgba(0,0,0,0.3)] disabled:bg-[#BDBDBD]"
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
