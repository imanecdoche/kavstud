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
  CheckCircle2,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Assignment, Submission } from '../types';
import Logo from './Logo';
import NavigationSidebar from './NavigationSidebar';
import UserSettings from './UserSettings';
import EmptyState from './EmptyState';
import { SkeletonDashboard, SkeletonList } from './Skeletons';
import CustomDropdown from './CustomDropdown';
import InteractiveOwl from './InteractiveOwl';
import ModuleLibrary from './ModuleLibrary';
import Packages from './Packages';
import Inbox from './Inbox';
import MaintenanceView from './MaintenanceView';
import DevToolsCenter from './DevToolsCenter';
import StudentSchedule from './StudentSchedule';
import { getLocalFeatureFlags } from '../utils/featureFlags';
import { calculateLevelData } from '../utils/leveling';
import LevelRoadmapModal from './LevelRoadmapModal';
import LogoutConfirmModal from './LogoutConfirmModal';

interface StudentDashboardProps {
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function StudentDashboard({ onNavigate, onSetLoading }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assignments' | 'settings' | 'modules' | 'packages' | 'inbox' | 'schedules'>('dashboard');
  const [studentProfile, setStudentProfile] = useState<UserProfile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [featureFlags, setFeatureFlags] = useState(() => getLocalFeatureFlags());

  useEffect(() => {
    const handleFlagsUpdate = () => setFeatureFlags(getLocalFeatureFlags());
    window.addEventListener('kavio_feature_flags_updated', handleFlagsUpdate);
    return () => window.removeEventListener('kavio_feature_flags_updated', handleFlagsUpdate);
  }, []);
  
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
  const [hideDone, setHideDone] = useState(false);

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

  const isPageLoading = loading.profile && loading.assignments && loading.submissions;

  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);

  // Derive stats
  const totalAssigned = assignments.length;
  const completedTasksCount = submissions.length;
  const pendingTasksCount = assignments.filter(a => !submissions.some(s => s.assignmentId === a.id)).length;
  
  // Graded EXP & Leveling stats
  const gradedSubmissions = submissions.filter(s => s.score !== null && s.score !== undefined);
  const totalExp = gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
  const averageExp = gradedSubmissions.length > 0 ? (totalExp / gradedSubmissions.length) : 0;
  const levelData = calculateLevelData(totalExp);

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

    const matchesHideDone = !hideDone || (status !== 'completed' && status !== 'submitted');

    return matchesSearch && matchesStatus && matchesHideDone;
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
    <div className="min-h-screen bg-[#171A21] text-white flex flex-col lg:flex-row font-sans" id="student-dashboard">
      <NavigationSidebar 
        role="student"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={studentProfile}
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
              {/* MAINTENANCE MODE CHECK */}
              {(() => {
                const currentFlag = featureFlags.find(f => f.id === activeTab);
                if (currentFlag && !currentFlag.enabled) {
                  return (
                    <MaintenanceView 
                      featureName={currentFlag.name} 
                      message={currentFlag.maintenanceMessage}
                      onBackToDashboard={() => setActiveTab('dashboard')} 
                    />
                  );
                }
                return null;
              })()}

              {/* TAB 1: MAIN DASHBOARD */}
              {activeTab === 'dashboard' && (featureFlags.find(f => f.id === 'dashboard')?.enabled !== false) && (
                <>
                  {/* Steam Design System Hero Section */}
                  <div className="relative w-full rounded-[3px] bg-[#2F3138] p-6 sm:p-8 md:p-10 mb-8 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-center justify-between gap-8 stagger-item text-white overflow-hidden">
                    
                    {/* Left Content */}
                    <div className="relative z-10 flex-1 space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-wider bg-[#66C0F4]/10 text-[#66C0F4] border border-[#66C0F4]/30">
                          <span>{studentProfile?.classType === 'CIRCLE' ? 'KELAS CIRCLE' : 'KELAS PRIVAT'}</span>
                        </div>
                      </div>

                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Halo,{' '}
                        <span className="text-[#66C0F4] font-bold">
                          {studentProfile?.fullName?.split(' ')[0] || 'Siswa'}!
                        </span>
                      </h1>
                      
                      <p className="text-xs sm:text-sm font-medium text-[#C6D4DF] max-w-md leading-relaxed">
                        Selesaikan tugas harianmu dan tingkatkan streak belajar hari ini. Bersiaplah untuk menaklukkan materi baru.
                      </p>

                      {/* Interactive Leveling & Rank Container */}
                      <div
                        onClick={() => setIsRoadmapModalOpen(true)}
                        className="relative cursor-pointer bg-black/40 border border-white/15 p-4 rounded-[2px] shadow-sm hover:border-[#66C0F4] transition-all flex items-center justify-between gap-4 max-w-lg my-3 text-white"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                            <img 
                              src={levelData.rankTier.badgePath} 
                              alt={levelData.rankTier.name} 
                              className="w-full h-full object-contain filter drop-shadow-sm" 
                            />
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase bg-[#66C0F4]/20 text-[#66C0F4] font-mono">
                                Lvl. {levelData.level}
                              </span>
                              <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase bg-[#A1CD44]/20 text-[#A1CD44] font-mono">
                                {levelData.rankTier.name}
                              </span>
                            </div>

                            {/* EXP Progress Bar & Info */}
                            <div className="w-40 sm:w-52 space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-[#8A8A8A]">EXP:</span>
                                <span className="text-[#66C0F4] font-mono">{totalExp.toLocaleString('id-ID')} / {levelData.nextLevelMinExp.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="w-full h-2 bg-black/60 border border-white/10 rounded-[2px] overflow-hidden">
                                <div 
                                  className="h-full bg-[#A1CD44] rounded-[2px] transition-all duration-500"
                                  style={{ width: `${levelData.progressPercent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-[#66C0F4] shrink-0">
                          <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider">Roadmap</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleDoFirstTask}
                          className="h-[44px] px-8 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all w-full sm:w-auto"
                        >
                          <Zap className="w-4 h-4 text-[#171A21]" />
                          <span>MULAI BELAJAR SEKARANG</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Content: Eye-Tracking 3D Owl Mascot - Large & Cropped at bottom */}
                    <div className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] shrink-0 flex items-end justify-center -mb-28 sm:-mb-32 md:-mb-40 -mr-6 sm:-mr-8 md:-mr-12 pointer-events-auto">
                      <InteractiveOwl className="w-full h-full" />
                    </div>
                  </div>

                  {/* Gamified Widgets Grid (Streak + Daily Goal Cards) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    {/* Widget 1: Streak Card */}
                    <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.5)] relative overflow-hidden text-white stagger-item">
                      <div className="space-y-1 z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-bold text-white leading-none font-mono">
                            {completedTasksCount > 0 ? completedTasksCount * 3 + 1 : 1}
                          </span>
                          <span className="text-xs font-bold text-[#A1CD44] uppercase tracking-wider">HARI</span>
                        </div>
                        <p className="text-xs font-bold text-[#C6D4DF]">Streak Belajar Aktif</p>
                      </div>
                      <div className="w-12 h-12 bg-black/40 rounded-[2px] flex items-center justify-center shrink-0 z-10 border border-white/10">
                        <Award className="w-6 h-6 text-[#A1CD44]" />
                      </div>
                    </div>

                    {/* Widget 2: Daily Goal Progress Card */}
                    <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-5 md:col-span-2 flex flex-col justify-between space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white stagger-item">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-4.5 h-4.5 text-[#66C0F4]" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Target Harian (Daily Goal)</h3>
                        </div>
                        <span className="text-xs font-bold font-mono text-[#66C0F4] bg-black/40 px-2.5 py-1 rounded-[2px] border border-white/10">
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
                              className={`p-2 rounded-[2px] text-center flex flex-col items-center gap-1 transition-all ${
                                isActive 
                                  ? 'bg-[#A1CD44] text-[#171A21] font-bold shadow-xs' 
                                  : 'bg-black/40 border border-white/10 text-[#8A8A8A] font-bold'
                              }`}
                            >
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-[#171A21]' : 'text-[#8A8A8A]'}`} />
                              <span className="text-[10px] font-bold">{day}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Stats Block Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#2F3138] border border-white/10 p-5 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex items-center gap-4 text-white stagger-item">
                      <div className="w-10 h-10 rounded-[2px] bg-black/40 border border-white/10 flex items-center justify-center text-[#66C0F4] shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Total Tugas</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-mono text-white">{totalAssigned}</span>
                          <span className="text-[10px] text-[#8A8A8A] font-semibold">Tugas</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#2F3138] border border-white/10 p-5 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex items-center gap-4 text-white stagger-item">
                      <div className="w-10 h-10 rounded-[2px] bg-black/40 border border-white/10 flex items-center justify-center text-[#A1CD44] shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Diselesaikan</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-mono text-white">{completedTasksCount}</span>
                          <span className="text-[10px] text-[#8A8A8A] font-semibold">Selesai</span>
                        </div>
                      </div>
                    </div>

                    {/* Total EXP Stat Card */}
                    <div className="bg-[#2F3138] border border-white/10 p-5 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex items-center gap-4 text-white stagger-item">
                      <div className="w-10 h-10 rounded-[2px] bg-black/40 border border-white/10 flex items-center justify-center text-[#66C0F4] shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Total EXP</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-mono text-white">{totalExp.toLocaleString('id-ID')}</span>
                          <span className="text-[10px] text-[#66C0F4] font-bold uppercase font-mono">EXP</span>
                        </div>
                      </div>
                    </div>

                    {/* Average EXP Stat Card */}
                    <div className="bg-[#2F3138] border border-white/10 p-5 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex items-center gap-4 text-white stagger-item">
                      <div className="w-10 h-10 rounded-[2px] bg-black/40 border border-white/10 flex items-center justify-center text-[#A1CD44] shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Rata-Rata EXP</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-mono text-white">{averageExp.toFixed(1)}</span>
                          <span className="text-[10px] text-[#A1CD44] font-bold uppercase font-mono">EXP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard split content panels */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left & Middle columns: Assigned tasks & submission status */}
                    <div className="xl:col-span-2 space-y-8">
                      
                      {/* Section: Tugas yang Harus Dikerjakan */}
                      <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white stagger-item">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                          <Clock className="w-4.5 h-4.5 text-[#66C0F4]" />
                          <span>Tugas yang Harus Dikerjakan</span>
                        </h3>

                        {assignments.filter(a => !submissions.some(s => s.assignmentId === a.id)).length === 0 ? (
                          <EmptyState 
                            icon={FileCheck}
                            title="Semua Tugas Selesai!"
                            description="Selamat! Tidak ada tugas luar biasa yang perlu Anda kerjakan saat ini."
                          />
                        ) : (
                          <div className="divide-y divide-white/10 max-h-80 overflow-y-auto pr-1">
                            {assignments
                              .filter(a => !submissions.some(s => s.assignmentId === a.id))
                              .slice(0, 5)
                              .map((assign) => (
                                <div 
                                  key={assign.id}
                                  onClick={() => onNavigate(`/assignment/${assign.id}`)}
                                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/5 px-2 rounded-[2px] transition-colors cursor-pointer"
                                >
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-white truncate">{assign.title}</h4>
                                    <p className="text-[10px] text-[#C6D4DF] mt-0.5 truncate">Guru: {assign.teacherName}</p>
                                  </div>
                                  <div className="flex items-center gap-2.5 shrink-0">
                                    <button
                                      type="button"
                                      className="px-3.5 py-1.5 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-[11px] font-bold uppercase rounded-[2px] cursor-pointer"
                                    >
                                      Kerjakan
                                    </button>
                                    <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Section: Tugas yang Telah Dikirim */}
                      <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                          <FileCheck className="w-4.5 h-4.5 text-[#A1CD44]" />
                          <span>Tugas yang Telah Dikirim</span>
                        </h3>

                        {submissions.length === 0 ? (
                          <EmptyState 
                            icon={HelpCircle}
                            title="Belum Mengirim Tugas"
                            description="Anda belum mengunggah submisi atau jawaban tugas belajar apapun."
                          />
                        ) : (
                          <div className="divide-y divide-white/10 max-h-80 overflow-y-auto pr-1">
                            {submissions.slice(0, 5).map((sub) => (
                              <div 
                                key={sub.id}
                                onClick={() => onNavigate(`/submission/${sub.id}`)}
                                className="py-4 flex items-center justify-between gap-4 hover:bg-white/5 px-2 rounded-[2px] transition-colors cursor-pointer"
                              >
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-white truncate">{sub.assignmentTitle}</h4>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[9px] font-bold ${
                                      sub.status === 'graded' 
                                        ? 'bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/30' 
                                        : 'bg-[#B9A074]/20 text-[#B9A074] border border-[#B9A074]/30'
                                    }`}>
                                      {sub.status === 'graded' ? 'Sudah Dinilai' : 'Menunggu Penilaian'}
                                    </span>
                                    <span className="text-[10px] text-[#C6D4DF]">
                                      dikirim {sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'baru saja'}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  {sub.status === 'graded' && sub.score !== null && (
                                    <div className="text-right">
                                      <p className="text-[10px] text-[#8A8A8A]">EXP</p>
                                      <p className="text-xs font-bold text-[#B9A074] font-mono">{sub.score} EXP</p>
                                    </div>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
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
                      <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Aksi Cepat</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <button
                            onClick={handleDoFirstTask}
                            className="w-full py-3 px-4 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold uppercase rounded-[2px] flex items-center gap-3 transition-all cursor-pointer shadow-md"
                          >
                            <BookOpen className="w-4 h-4 shrink-0" />
                            <span>Mulai Tugas Baru</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('assignments')}
                            className="w-full py-3 px-4 bg-[#171A21] hover:bg-black/40 text-white rounded-[2px] font-bold text-xs border border-white/10 flex items-center gap-3 transition-all cursor-pointer"
                          >
                            <Layers className="w-4 h-4 text-[#66C0F4] shrink-0" />
                            <span>Buka Semua Tugas Saya</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('settings')}
                            className="w-full py-3 px-4 bg-[#171A21] hover:bg-black/40 text-white rounded-[2px] font-bold text-xs border border-white/10 flex items-center gap-3 transition-all cursor-pointer"
                          >
                            <Star className="w-4 h-4 text-[#B9A074] shrink-0" />
                            <span>Sunting Profil Akun</span>
                          </button>
                        </div>
                      </div>

                      {/* Kavio Circle Saya */}
                      {studentProfile?.classType === 'CIRCLE' && myCircle && (
                        <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.5)] space-y-4 text-white">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                              <Users className="w-4 h-4 text-[#A1CD44]" />
                              <span>Kavio Circle Saya</span>
                            </h3>
                            <span className="text-[10px] bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/30 px-2.5 py-0.5 rounded-[2px] font-bold">
                              {myCircleMembers.length} / {myCircle.capacity || 6} Anggota
                            </span>
                          </div>

                          <div className="space-y-1 bg-black/40 p-3 rounded-[2px] border border-white/10">
                            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Nama Kelompok</span>
                            <span className="text-xs font-bold text-white block">{myCircle.name}</span>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Teman Belajar (Anggota)</span>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {myCircleMembers.map((member) => {
                                const isMe = member.uid === studentProfile.uid;
                                return (
                                  <div key={member.uid} className="flex items-center gap-2 px-2.5 py-1.5 rounded-[2px] hover:bg-white/5 transition-colors">
                                    <div className="w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                                      <img 
                                        src={member.photoURL || '/aset/default-avatar.svg'} 
                                        alt={member.fullName} 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = '/aset/default-avatar.svg';
                                        }}
                                      />
                                    </div>
                                    <span className={`text-xs font-semibold truncate flex-1 ${isMe ? 'text-[#66C0F4] font-bold' : 'text-white'}`}>
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
                      <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.5)] space-y-4 text-white">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                          <Star className="w-4 h-4 text-[#66C0F4]" />
                          <span>Catatan Penilaian Guru</span>
                        </h3>

                        {latestFeedbacks.length === 0 ? (
                          <EmptyState 
                            icon={MessageSquare}
                            title="Belum Ada Catatan"
                            description="Evaluasi nilai dan catatan umpan balik guru akan ditampilkan di sini."
                          />
                        ) : (
                          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                            {latestFeedbacks.slice(0, 4).map((sub) => (
                              <div 
                                key={sub.id}
                                onClick={() => onNavigate(`/submission/${sub.id}`)}
                                className="p-4 bg-black/40 border border-white/10 rounded-[2px] space-y-2 cursor-pointer hover:border-[#66C0F4] transition-colors"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-xs font-bold text-white truncate">{sub.assignmentTitle}</h4>
                                  <span className="text-xs font-bold font-mono text-[#A1CD44] shrink-0">{sub.score} EXP</span>
                                </div>
                                <p className="text-[11px] text-[#C6D4DF] line-clamp-3 bg-black/60 p-2.5 rounded-[2px] border border-white/10 italic">
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                        Penugasan Belajar Saya
                      </h1>
                      <p className="text-xs text-[#C6D4DF] mt-1">
                        Daftar lengkap tugas kelas yang diberikan oleh guru pengajar Anda.
                      </p>
                    </div>
                  </div>

                  {/* Search and status filters panel */}
                  <div className="bg-[#2F3138] p-4 sm:p-5 border border-white/10 rounded-[3px] flex flex-col sm:flex-row gap-4 items-center justify-between text-white">
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A] w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Cari judul tugas, tipe, status, atau guru..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs font-medium text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] transition-all"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                      <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 px-3 py-1.5 rounded-[2px] text-xs font-medium text-white w-full sm:w-auto">
                        <Filter className="w-3.5 h-3.5 text-[#8A8A8A]" />
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

                      <button
                        type="button"
                        onClick={() => setHideDone(!hideDone)}
                        className={`px-4 py-2.5 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 cursor-pointer ${
                          hideDone
                            ? 'bg-[#66C0F4] text-[#171A21] border-[#66C0F4]'
                            : 'bg-black/40 text-[#C6D4DF] border-white/15 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <EyeOff className={`w-3.5 h-3.5 ${hideDone ? 'text-[#171A21]' : 'text-[#8A8A8A]'}`} />
                        <span>HIDE DONE</span>
                      </button>
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
                            className="bg-[#2F3138] border border-white/10 hover:border-[#66C0F4] shadow-[0_2px_8px_rgba(0,0,0,0.5)] p-6 rounded-[3px] flex flex-col justify-between gap-5 transition-all duration-200 cursor-pointer relative overflow-hidden text-white"
                          >
                            <div className="relative z-10 space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-2 flex-wrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-[9px] font-bold uppercase tracking-wider border ${
                                    status === 'completed' 
                                      ? 'bg-[#A1CD44]/20 text-[#A1CD44] border-[#A1CD44]/40' 
                                      : status === 'submitted' 
                                        ? 'bg-[#66C0F4]/20 text-[#66C0F4] border-[#66C0F4]/40' 
                                        : status === 'remedial'
                                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                          : status === 'expired'
                                            ? 'bg-white/10 text-[#8A8A8A] border-white/10'
                                            : 'bg-[#66C0F4]/20 text-[#66C0F4] border-[#66C0F4]/40'
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

                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-[9px] font-bold uppercase tracking-wider bg-black/40 text-[#C6D4DF] border border-white/10">
                                    {type === 'short_answer' 
                                      ? 'Jawaban Singkat' 
                                      : type === 'multiple_choice' 
                                        ? 'Pilihan Ganda' 
                                        : 'Multi Jawaban Singkat'}
                                  </span>
                                </div>

                                {sub?.score !== null && sub?.score !== undefined && (
                                  <span className="text-xs font-bold text-[#A1CD44] font-mono">
                                    Nilai: {sub.score} EXP
                                  </span>
                                )}
                              </div>

                              <h3 className="text-sm font-bold text-white uppercase leading-tight">{assign.title}</h3>
                              <p className="text-xs text-[#C6D4DF] line-clamp-2 leading-relaxed">{assign.question}</p>
                            </div>

                            <div className="space-y-2 border-t border-white/10 pt-3 mt-1 text-[11px]">
                              <div className="flex items-center justify-between text-[#8A8A8A] font-mono">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Diberikan: {assign.createdAt ? new Date(assign.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'Baru saja'}
                                </span>
                                {assign.deadline && (
                                  <span className={`flex items-center gap-1 font-bold ${status === 'expired' ? 'text-red-400' : 'text-[#C6D4DF]'}`}>
                                    Batas: {new Date(assign.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 bg-black/40 text-[#66C0F4] rounded-[2px] flex items-center justify-center text-[9px] font-bold uppercase shrink-0 border border-white/10">
                                    {assign.teacherName?.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-[#C6D4DF] truncate max-w-[120px]">{assign.teacherName}</span>
                                </div>
                                
                                <span className="text-[10px] font-bold text-[#66C0F4] hover:underline inline-flex items-center gap-0.5">
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

              {/* TAB 4: PACKAGES */}
              {activeTab === 'packages' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <Packages />
                </div>
              )}

              {/* TAB 5: INBOX */}
              {activeTab === 'inbox' && (
                <Inbox 
                  onNavigate={onNavigate} 
                  onSelectTab={setActiveTab} 
                  userProfile={studentProfile} 
                />
              )}

              {/* TAB: SCHEDULES */}
              {activeTab === 'schedules' && (
                <StudentSchedule userProfile={studentProfile} />
              )}

              {/* TAB: DEV TOOLS CENTER (SPOTIFY DESIGN SYSTEM POWERED) */}
              {activeTab === 'devtools' && (
                <DevToolsCenter 
                  userProfile={studentProfile}
                  onNavigate={onNavigate}
                  onSetLoading={onSetLoading}
                />
              )}

              {/* TAB 5: SETTINGS INLINE */}
              {activeTab === 'settings' && (
                <div className="-mx-4 sm:-mx-8 lg:-mx-10 -mt-4 sm:-mt-8 lg:-mt-10">
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

      {/* Level & Rank Roadmap Modal */}
      <LevelRoadmapModal 
        isOpen={isRoadmapModalOpen} 
        onClose={() => setIsRoadmapModalOpen(false)} 
        totalExp={totalExp} 
      />

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
