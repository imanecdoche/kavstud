import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  doc 
} from 'firebase/firestore';
import { 
  BookOpen, 
  FileCheck, 
  Clock, 
  Star, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Award,
  NotebookText,
  Search,
  Filter,
  Calendar,
  Layers,
  GraduationCap,
  ArrowRight,
  Users,
  Flame,
  Zap,
  Target,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Assignment, Submission } from '../types';
import Logo from './Logo';
import NavigationSidebar from './NavigationSidebar';
import UserSettings from './UserSettings';
import EmptyState from './EmptyState';
import { SkeletonDashboard, SkeletonList } from './Skeletons';
import CustomDropdown from './CustomDropdown';
import ModuleLibrary from './ModuleLibrary';

interface StudentDashboardProps {
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function StudentDashboard({ onNavigate, onSetLoading }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assignments' | 'settings' | 'modules'>('dashboard');
  const [studentProfile, setStudentProfile] = useState<UserProfile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  // My Circle Group Info
  const [myCircle, setMyCircle] = useState<any>(null);
  const [myCircleMembers, setMyCircleMembers] = useState<UserProfile[]>([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState({
    profile: true,
    assignments: true,
    submissions: true
  });
  const [error, setError] = useState<string | null>(null);

  // Responsive Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Assignments search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'graded' | 'pending'>('all');

  // Load profile & real-time assignments/submissions
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      onNavigate('/login');
      return;
    }

    // Get Student Profile
    const profileRef = query(collection(db, 'users'), where('uid', '==', user.uid));
    const unsubscribeProfile = onSnapshot(profileRef, (snapshot) => {
      if (!snapshot.empty) {
        setStudentProfile({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any);
      }
      setLoading(prev => ({ ...prev, profile: false }));
    }, (err) => {
      console.error(err);
      setError('Gagal memuat profil siswa.');
    });

    // Real-time Assignments sent to this student
    const assignmentsQuery = query(
      collection(db, 'assignments'),
      where('studentId', '==', user.uid),
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
      // Fallback
      onSnapshot(query(collection(db, 'assignments'), where('studentId', '==', user.uid)), (snap) => {
        const assigns: Assignment[] = [];
        snap.forEach((d) => {
          assigns.push({ id: d.id, ...d.data() } as Assignment);
        });
        assigns.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setAssignments(assigns);
        setLoading(prev => ({ ...prev, assignments: false }));
      });
    });

    // Real-time Submissions made by this student
    const submissionsQuery = query(
      collection(db, 'submissions'),
      where('studentId', '==', user.uid),
      orderBy('submittedAt', 'desc')
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
      // Fallback
      onSnapshot(query(collection(db, 'submissions'), where('studentId', '==', user.uid)), (snap) => {
        const subs: Submission[] = [];
        snap.forEach((d) => {
          subs.push({ id: d.id, ...d.data() } as Submission);
        });
        subs.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
        setSubmissions(subs);
        setLoading(prev => ({ ...prev, submissions: false }));
      });
    });

    return () => {
      unsubscribeProfile();
      unsubscribeAssignments();
      unsubscribeSubmissions();
    };
  }, [onNavigate]);

  // Load My Circle Group Info
  useEffect(() => {
    if (studentProfile?.classType === 'CIRCLE' && studentProfile?.circleId) {
      const unsubscribeCircle = onSnapshot(doc(db, 'circles', studentProfile.circleId), (docSnap) => {
        if (docSnap.exists()) {
          setMyCircle({ id: docSnap.id, ...docSnap.data() });
        }
      }, (err) => {
        console.error('Error listening to circle:', err);
      });

      const membersQuery = query(
        collection(db, 'users'),
        where('circleId', '==', studentProfile.circleId),
        where('classType', '==', 'CIRCLE')
      );
      const unsubscribeMembers = onSnapshot(membersQuery, (snapshot) => {
        const mems: UserProfile[] = [];
        snapshot.forEach((doc) => {
          mems.push({ uid: doc.id, ...doc.data() } as UserProfile);
        });
        setMyCircleMembers(mems);
      }, (err) => {
        console.error('Error listening to circle members:', err);
      });

      return () => {
        unsubscribeCircle();
        unsubscribeMembers();
      };
    } else {
      setMyCircle(null);
      setMyCircleMembers([]);
    }
  }, [studentProfile?.circleId, studentProfile?.classType]);

  const handleLogout = async () => {
    onSetLoading(true);
    await auth.signOut();
    onNavigate('/login');
    onSetLoading(false);
  };

  const isPageLoading = loading.profile && loading.assignments && loading.submissions;

  // Derive stats
  const totalAssigned = assignments.length;
  const completedTasksCount = submissions.length;
  const pendingTasksCount = assignments.filter(a => !submissions.some(s => s.assignmentId === a.id)).length;
  
  // Graded and feedbacks
  const gradedTasks = submissions.filter(s => s.status === 'graded');
  const latestFeedbacks = gradedTasks.filter(s => s.feedback && s.feedback.trim() !== '');

  const getAssignmentStatus = (assign: Assignment) => {
    const submission = submissions.find(s => s.assignmentId === assign.id);
    if (submission) {
      if (submission.status === 'graded') return 'completed';
      if (submission.status === 'remedial') return 'remedial';
      return 'submitted';
    }
    
    if (assign.deadline) {
      const deadlineDate = new Date(assign.deadline + 'T23:59:59');
      if (deadlineDate < new Date()) {
        return 'expired';
      }
    }
    
    return 'pending';
  };

  // Filtered assignments for search & select in assignments tab
  const filteredAssignments = assignments.filter(assign => {
    const status = getAssignmentStatus(assign);
    const type = assign.assignmentType || 'short_answer';

    const matchesSearch = assign.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          assign.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          type.replace('_', ' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          status.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'pending' && status === 'pending') ||
                          (statusFilter === 'completed' && status === 'completed') ||
                          (statusFilter === 'remedial' && status === 'remedial') ||
                          (statusFilter === 'expired' && status === 'expired') ||
                          (statusFilter === 'submitted' && status === 'submitted');

    return matchesSearch && matchesStatus;
  });

  // Action: Find first incomplete assignment to do
  const handleDoFirstTask = () => {
    const incomplete = assignments.find(a => !submissions.some(s => s.assignmentId === a.id));
    if (incomplete) {
      onNavigate(`/assignment/${incomplete.id}`);
    } else {
      setActiveTab('assignments');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col lg:flex-row font-sans" id="student-dashboard">
      <NavigationSidebar 
        role="student"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={studentProfile}
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
                  {/* Duolingo Style Top Welcome & Action Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 dark:border-slate-700/50 pb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
                          Halo, {studentProfile?.fullName?.split(' ')[0] || 'Siswa'}! 🦉
                        </h1>
                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase border shadow-3xs ${
                          studentProfile?.classType === 'CIRCLE'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : 'bg-sky-100 text-sky-800 border-sky-200'
                        }`}>
                          {studentProfile?.classType === 'CIRCLE' ? 'Kelas Circle ⚡' : 'Kelas Privat 🎯'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                        Selesaikan tugas harianmu dan tingkatkan streak belajar hari ini!
                      </p>
                    </div>

                    {/* Premium 3D Duolingo Button */}
                    <button
                      onClick={handleDoFirstTask}
                      className="btn-duo-green px-6 py-3.5 text-xs font-black flex items-center justify-center gap-2.5 shadow-md shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all text-white uppercase tracking-wider"
                      style={{ minHeight: '48px' }}
                    >
                      <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                      <span>Kerjakan Tugas SEKARANG</span>
                    </button>
                  </div>

                  {/* Duolingo Gamified Widgets Grid (Streak + Daily Goal Cards) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Widget 1: 3D Yellow Streak Card (Duolingo Style) */}
                    <div className="card-duo-yellow p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
                      <div className="space-y-1 z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-display font-black text-gray-900 dark:text-white leading-none">
                            {completedTasksCount > 0 ? completedTasksCount * 3 + 1 : 1}
                          </span>
                          <span className="text-xs font-black text-amber-900 dark:text-amber-100 uppercase tracking-wider">HARI</span>
                        </div>
                        <p className="text-xs font-bold text-amber-900 dark:text-amber-100/80">Streak Belajar Aktif 🔥</p>
                      </div>
                      <div className="w-14 h-14 bg-amber-400/40 rounded-2xl flex items-center justify-center text-orange-600 shrink-0 z-10">
                        <Flame className="w-9 h-9 fill-orange-500 text-orange-600 animate-bounce" />
                      </div>
                    </div>

                    {/* Widget 2: Daily Goal Progress Card (Duolingo Style) */}
                    <div className="card-duo p-5 md:col-span-2 flex flex-col justify-between space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-sky-500" />
                          <h3 className="text-xs font-extrabold text-gray-800 dark:text-slate-100 uppercase tracking-wider">Target Harian (Daily Goal)</h3>
                        </div>
                        <span className="text-xs font-black font-mono text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                          {completedTasksCount} / {totalAssigned || 1} Selesai
                        </span>
                      </div>

                      {/* Days of Week Streak Tracker */}
                      <div className="grid grid-cols-7 gap-1.5 pt-1">
                        {['Sab', 'Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum'].map((day, i) => {
                          const isActive = i <= (completedTasksCount % 7);
                          return (
                            <div 
                              key={day}
                              className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
                                isActive 
                                  ? 'bg-emerald-500 text-white shadow-xs border-b-2 border-emerald-700' 
                                  : 'bg-gray-100 dark:bg-slate-700 text-gray-400 border-b-2 border-gray-200 dark:border-slate-700'
                              }`}
                            >
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-white fill-emerald-600' : 'text-gray-300'}`} />
                              <span className="text-[10px] font-extrabold">{day}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Stats Block Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Tugas</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-display text-gray-900 dark:text-white">{totalAssigned}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">Tugas</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Diselesaikan</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-display text-gray-900 dark:text-white">{completedTasksCount}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">Selesai</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-5 rounded-2xl shadow-3xs flex items-center gap-4 sm:col-span-2 lg:col-span-1">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                        <Clock className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Belum Selesai</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-display text-gray-900 dark:text-white">{pendingTasksCount}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">Tugas</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard split content panels */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left & Middle columns: Assigned tasks & submission status */}
                    <div className="xl:col-span-2 space-y-8">
                      
                      {/* Section: Tugas yang Harus Dikerjakan */}
                      <div className="card-duo p-6 space-y-4">
                        <h3 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                          <Clock className="w-4.5 h-4.5 text-sky-500" />
                          <span>Tugas yang Harus Dikerjakan</span>
                        </h3>

                        {assignments.filter(a => !submissions.some(s => s.assignmentId === a.id)).length === 0 ? (
                          <EmptyState 
                            icon={FileCheck}
                            title="Semua Tugas Selesai!"
                            description="Selamat! Tidak ada tugas luar biasa yang perlu Anda kerjakan saat ini."
                          />
                        ) : (
                          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto pr-1">
                            {assignments
                              .filter(a => !submissions.some(s => s.assignmentId === a.id))
                              .slice(0, 5)
                              .map((assign) => (
                                <div 
                                  key={assign.id}
                                  onClick={() => onNavigate(`/assignment/${assign.id}`)}
                                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 dark:bg-slate-900/50 px-2 rounded-xl transition-colors cursor-pointer"
                                >
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{assign.title}</h4>
                                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">Guru: {assign.teacherName}</p>
                                  </div>
                                  <div className="flex items-center gap-2.5 shrink-0">
                                    <button
                                      type="button"
                                      className="btn-duo-green px-3.5 py-1.5 text-[11px] font-black cursor-pointer shadow-xs"
                                    >
                                      Kerjakan
                                    </button>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Section: Tugas yang Telah Dikirim */}
                      <div className="card-duo p-6 space-y-4">
                        <h3 className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                          <FileCheck className="w-4.5 h-4.5 text-emerald-500" />
                          <span>Tugas yang Telah Dikirim</span>
                        </h3>

                        {submissions.length === 0 ? (
                          <EmptyState 
                            icon={HelpCircle}
                            title="Belum Mengirim Tugas"
                            description="Anda belum mengunggah submisi atau jawaban tugas belajar apapun."
                          />
                        ) : (
                          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto pr-1">
                            {submissions.slice(0, 5).map((sub) => (
                              <div 
                                key={sub.id}
                                onClick={() => onNavigate(`/submission/${sub.id}`)}
                                className="py-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:bg-slate-900/50 px-2 rounded-xl transition-colors cursor-pointer"
                              >
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{sub.assignmentTitle}</h4>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                      sub.status === 'graded' 
                                        ? 'bg-green-50 text-green-700 border border-green-100' 
                                        : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border border-amber-100 dark:border-amber-800/50'
                                    }`}>
                                      {sub.status === 'graded' ? 'Sudah Dinilai' : 'Menunggu Penilaian'}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                      dikirim {sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'baru saja'}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  {sub.status === 'graded' && sub.score !== null && (
                                    <div className="text-right">
                                      <p className="text-[10px] text-gray-400">Nilai</p>
                                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-display">{sub.score} / 100</p>
                                    </div>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-gray-300" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Right column: Quick Actions & Evaluation feedback notes */}
                    <div className="space-y-8">
                      {/* Quick Actions Panel */}
                      <div className="card-duo p-6 space-y-4">
                        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Aksi Cepat</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <button
                            onClick={handleDoFirstTask}
                            className="btn-duo-green w-full py-3 px-4 text-xs font-black flex items-center gap-3"
                          >
                            <BookOpen className="w-4 h-4 shrink-0" />
                            <span>Mulai Tugas Baru</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('assignments')}
                            className="w-full py-3 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:bg-slate-600 rounded-2xl font-black text-xs border-b-4 border-gray-300 dark:border-slate-600 flex items-center gap-3 transition-all cursor-pointer active:translate-y-[2px] active:border-b-2"
                          >
                            <Layers className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0" />
                            <span>Buka Semua Tugas Saya</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('settings')}
                            className="w-full py-3 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:bg-slate-600 rounded-2xl font-black text-xs border-b-4 border-gray-300 dark:border-slate-600 flex items-center gap-3 transition-all cursor-pointer active:translate-y-[2px] active:border-b-2"
                          >
                            <Star className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0" />
                            <span>Sunting Profil Akun</span>
                          </button>
                        </div>
                      </div>

                      {/* Kavio Circle Saya */}
                      {studentProfile?.classType === 'CIRCLE' && myCircle && (
                        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6 shadow-3xs space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                              <Users className="w-4.5 h-4.5 text-fuchsia-500" />
                              Kavio Circle Saya
                            </h3>
                            <span className="text-[10px] bg-fuchsia-50 text-fuchsia-700 px-2.5 py-0.5 rounded-full font-bold">
                              {myCircleMembers.length} / {myCircle.capacity || 6} Anggota
                            </span>
                          </div>

                          <div className="space-y-1 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nama Kelompok</span>
                            <span className="text-sm font-bold text-gray-950 block">{myCircle.name}</span>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Teman Belajar (Anggota)</span>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {myCircleMembers.map((member) => {
                                const isMe = member.uid === studentProfile.uid;
                                return (
                                  <div key={member.uid} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors">
                                    <div className={`w-6 h-6 rounded-lg font-bold text-[10px] flex items-center justify-center ${isMe ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}>
                                      {member.fullName?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`text-xs font-semibold truncate flex-1 ${isMe ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-700 dark:text-slate-200'}`}>
                                      {member.fullName} {isMe && '(Saya)'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Evaluasi Catatan Guru */}
                      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6 shadow-3xs space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                          <Star className="w-4.5 h-4.5 text-indigo-500" />
                          Catatan Penilaian Guru
                        </h3>

                        {latestFeedbacks.length === 0 ? (
                          <EmptyState 
                            icon={MessageSquare}
                            title="Belum Ada Catatan"
                            description="Evaluasi nilai dan catatan umpan balik guru akan ditampilkan di sini."
                          />
                        ) : (
                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                            {latestFeedbacks.slice(0, 4).map((sub) => (
                              <div 
                                key={sub.id}
                                onClick={() => onNavigate(`/submission/${sub.id}`)}
                                className="p-4 bg-indigo-50 dark:bg-indigo-900/30/10 border border-indigo-100 dark:border-indigo-800/50/20 rounded-2xl space-y-2 cursor-pointer hover:bg-indigo-50 dark:bg-indigo-900/30/20 transition-colors"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{sub.assignmentTitle}</h4>
                                  <span className="text-xs font-bold font-display text-indigo-600 dark:text-indigo-400 shrink-0">{sub.score} / 100</span>
                                </div>
                                <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-3 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-gray-50 italic">
                                  "{sub.feedback}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: DETAILED ASSIGNMENTS */}
              {activeTab === 'assignments' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-slate-700/50 pb-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                        Penugasan Belajar Saya
                      </h1>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Daftar lengkap tugas kelas yang diberikan oleh guru pengajar Anda.
                      </p>
                    </div>
                  </div>

                  {/* Search and status filters panel */}
                  <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 border border-gray-100 dark:border-slate-700/50 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Cari judul tugas, tipe, status, atau guru..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:bg-white dark:bg-slate-800 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-300 w-full sm:w-auto">
                      <Filter className="w-3.5 h-3.5 text-gray-400" />
                      <CustomDropdown
                        variant="minimal"
                        size="sm"
                        dropdownWidth="w-48"
                        className="w-full sm:w-auto"
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val as any)}
                        options={[
                          { value: 'all', label: 'Semua Status' },
                          { value: 'pending', label: 'Belum Dikerjakan' },
                          { value: 'submitted', label: 'Menunggu Penilaian' },
                          { value: 'completed', label: 'Selesai / Dinilai' },
                          { value: 'remedial', label: 'Harus Remedial' },
                          { value: 'expired', label: 'Kedaluwarsa' }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Task grid */}
                  {filteredAssignments.length === 0 ? (
                    <EmptyState 
                      icon={HelpCircle}
                      title="Tugas Tidak Ditemukan"
                      description="Tidak ada data tugas kelas yang cocok dengan pencarian atau filter Anda saat ini."
                      actionText="Reset Pencarian"
                      onActionClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
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
                            onClick={() => {
                              onNavigate(`/assignment/${assign.id}`);
                            }}
                            className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 hover:border-gray-200 dark:border-slate-700 hover:shadow-xs p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all cursor-pointer relative"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-1.5 flex-wrap">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                    status === 'completed' 
                                      ? 'bg-green-50 text-green-700' 
                                      : status === 'submitted' 
                                        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700' 
                                        : status === 'remedial'
                                          ? 'bg-red-50 text-red-700 animate-pulse'
                                          : status === 'expired'
                                            ? 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                                            : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700'
                                  }`}>
                                    {status === 'completed' 
                                      ? 'Selesai' 
                                      : status === 'submitted' 
                                        ? 'Menunggu Nilai' 
                                        : status === 'remedial'
                                          ? 'Remedial'
                                          : status === 'expired'
                                            ? 'Kedaluwarsa'
                                            : 'Siap Dikerjakan'}
                                  </span>

                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700">
                                    {type === 'short_answer' 
                                      ? 'Jawaban Singkat' 
                                      : type === 'multiple_choice' 
                                        ? 'Pilihan Ganda' 
                                        : 'Multi Jawaban Singkat'}
                                  </span>
                                </div>

                                {sub?.score !== null && sub?.score !== undefined && (
                                  <span className="text-xs font-bold font-display text-indigo-600 dark:text-indigo-400 font-mono">
                                    Nilai: {sub.score}
                                  </span>
                                )}
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
                                  <div className="w-5 h-5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md flex items-center justify-center text-[9px] font-bold uppercase shrink-0">
                                    {assign.teacherName?.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-gray-600 dark:text-slate-300 truncate max-w-[120px]">{assign.teacherName}</span>
                                </div>
                                
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5">
                                  {status === 'completed' || status === 'submitted' ? 'Lihat Jawaban & Evaluasi' : status === 'remedial' ? 'Kerjakan Remedial' : 'Kerjakan Tugas'}
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

              {/* TAB 3: MODULE LIBRARY */}
              {activeTab === 'modules' && (
                <ModuleLibrary 
                  userProfile={studentProfile}
                  onSetLoading={onSetLoading}
                />
              )}

              {/* TAB 4: SETTINGS INLINE */}
              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <UserSettings 
                    onNavigate={(p) => {
                      if (p === '/student') {
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
    </div>
  );
}
