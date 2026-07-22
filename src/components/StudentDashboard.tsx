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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col lg:flex-row font-sans" id="student-dashboard">
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
                  {/* 3D Animated Hero Section */}
                  <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-indigo-50 via-purple-50 to-sky-50 dark:from-slate-800/80 dark:via-indigo-900/40 dark:to-slate-800/80 p-8 sm:p-10 md:p-12 mb-8 overflow-hidden shadow-sm border border-white dark:border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-8 stagger-item">
                    
                    {/* Abstract Background Shapes */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Left Content */}
                    <div className="relative z-10 flex-1 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative group cursor-pointer inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border overflow-hidden backdrop-blur-md shadow-sm transition-all ${
                            studentProfile?.classType === 'CIRCLE'
                              ? 'bg-purple-100/80 text-purple-900 border-purple-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] dark:bg-purple-900/40 dark:text-purple-100 dark:border-purple-700'
                              : 'bg-sky-100/80 text-sky-900 border-sky-300 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] dark:bg-sky-900/40 dark:text-sky-100 dark:border-sky-700'
                          }`}
                        >
                          {/* Shine effect on hover */}
                          <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent transition-transform duration-1000 ease-in-out" />
                          
                          <span className="relative z-10">{studentProfile?.classType === 'CIRCLE' ? 'KELAS CIRCLE' : 'KELAS PRIVAT'}</span>
                          
                          <motion.span
                            className="relative z-10 text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
                            animate={
                              studentProfile?.classType === 'CIRCLE'
                                ? { scale: [1, 1.2, 1], rotateZ: [0, 15, -15, 0] }
                                : { y: [0, -4, 0], scale: [1, 1.1, 1] }
                            }
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ display: 'inline-block', transformOrigin: 'center' }}
                          >
                            {studentProfile?.classType === 'CIRCLE' ? '⚡' : '🎯'}
                          </motion.span>
                        </motion.div>
                      </div>

                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 dark:text-white tracking-[-0.03em] text-balance leading-[1.1]">
                        Halo,{' '}
                        {/* Animated Name Effect */}
                        <motion.span
                          className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500"
                          style={{ backgroundSize: '200% auto' }}
                          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                          transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
                        >
                          {studentProfile?.fullName?.split(' ')[0] || 'Siswa'}!
                        </motion.span>
                      </h1>
                      
                      <p className="text-sm md:text-base font-semibold text-gray-600 dark:text-slate-300 max-w-md">
                        Selesaikan tugas harianmu dan tingkatkan streak belajar hari ini! Bersiaplah untuk menaklukkan materi baru.
                      </p>

                      {/* Interactive Leveling & Rank Container */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsRoadmapModalOpen(true)}
                        className="relative cursor-pointer group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-indigo-100 dark:border-indigo-800/40 p-4 rounded-2xl shadow-3xs hover:shadow-md transition-all flex items-center justify-between gap-4 max-w-lg my-3"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                            {levelData.rankTier.isTop3 && (
                              <div 
                                className="absolute inset-0 rounded-full blur-sm opacity-75 animate-pulse pointer-events-none"
                                style={{ backgroundColor: levelData.rankTier.glowColor }}
                              />
                            )}
                            <img 
                              src={levelData.rankTier.badgePath} 
                              alt={levelData.rankTier.name} 
                              className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform" 
                            />
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                                Lvl. {levelData.level}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-gradient-to-r ${levelData.rankTier.color} text-white shadow-2xs`}>
                                {levelData.rankTier.name}
                              </span>
                            </div>

                            {/* EXP Progress Bar & Info */}
                            <div className="w-40 sm:w-52 space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-gray-600 dark:text-slate-300">EXP:</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-mono">{totalExp.toLocaleString('id-ID')} / {levelData.nextLevelMinExp.toLocaleString('id-ID')}</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${levelData.progressPercent}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform shrink-0">
                          <span className="hidden sm:inline text-[10px] uppercase font-black tracking-wider">Leveling Roadmap</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </motion.div>

                      <div className="pt-4">
                        <button
                          onClick={handleDoFirstTask}
                          className="btn-duo-green px-8 py-4 text-sm font-black flex items-center justify-center gap-2.5 shrink-0 text-white w-full sm:w-auto"
                        >
                          <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                          <span>MULAI BELAJAR SEKARANG</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Content: Interactive Eye-Tracking 3D Owl Mascot (Matches Reference Image) */}
                    <div className="relative z-10 w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 shrink-0 flex items-center justify-center -mr-2 sm:-mr-4 -mb-2">
                      <InteractiveOwl className="w-full h-full" />
                    </div>
                  </div>

                  {/* Duolingo Gamified Widgets Grid (Streak + Daily Goal Cards) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Widget 1: 3D Yellow Streak Card (Duolingo Style) */}
                    <div className="card-duo-yellow p-5 flex items-center justify-between shadow-sm relative overflow-hidden stagger-item">
                      <div className="space-y-1 z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-display font-black text-gray-900 dark:text-white leading-none">
                            {completedTasksCount > 0 ? completedTasksCount * 3 + 1 : 1}
                          </span>
                          <span className="text-xs font-black text-amber-900 dark:text-amber-100 uppercase tracking-wider">HARI</span>
                        </div>
                        <p className="text-xs font-bold text-amber-900 dark:text-amber-100/80">Streak Belajar Aktif</p>
                      </div>
                      <div className="relative w-14 h-14 bg-amber-400/30 rounded-2xl flex items-center justify-center shrink-0 z-10 overflow-hidden shadow-inner border border-amber-300/50">
                        {/* Base glow */}
                        <div className="absolute w-12 h-12 bg-orange-500/40 rounded-full blur-md animate-pulse" />
                        
                        {/* Fire Container */}
                        <div className="relative w-8 h-8 flex items-end justify-center translate-y-1">
                          {/* Main flame (Red/Orange) */}
                          <motion.div 
                            className="absolute bottom-0 w-7 h-7 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                            style={{ borderRadius: '50% 0 50% 50%', rotate: '-45deg', transformOrigin: 'center' }}
                            animate={{ 
                              scale: [1, 1.1, 0.95, 1],
                              rotate: ['-45deg', '-40deg', '-50deg', '-45deg']
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          />
                          
                          {/* Inner flame (Yellow/White) */}
                          <motion.div 
                            className="absolute bottom-1 w-4 h-4 bg-gradient-to-br from-white via-yellow-200 to-yellow-500 shadow-[0_0_10px_rgba(253,224,71,0.8)]"
                            style={{ borderRadius: '50% 0 50% 50%', rotate: '-45deg', transformOrigin: 'center' }}
                            animate={{ 
                              scale: [1, 1.2, 0.85, 1],
                              rotate: ['-45deg', '-35deg', '-55deg', '-45deg']
                            }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                          />
                          
                          {/* Floating sparks */}
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={`spark-${i}`}
                              className="absolute bottom-2 w-1.5 h-1.5 bg-yellow-300 rounded-full blur-[0.5px]"
                              initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                              animate={{ 
                                y: -20 - (i * 6), 
                                x: (i % 2 === 0 ? 1 : -1) * (4 + i * 1.5),
                                opacity: [1, 1, 0],
                                scale: [1, 0.5, 0]
                              }}
                              transition={{ 
                                duration: 0.8 + (i * 0.2), 
                                repeat: Infinity, 
                                ease: 'easeOut',
                                delay: i * 0.25
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Widget 2: Daily Goal Progress Card (Duolingo Style) */}
                    <div className="card-duo p-5 md:col-span-2 flex flex-col justify-between space-y-4 stagger-item">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-5 rounded-2xl shadow-3xs flex items-center gap-4 stagger-item">
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

                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-5 rounded-2xl shadow-3xs flex items-center gap-4 stagger-item">
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

                    {/* Total EXP Stat Card */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-5 rounded-2xl shadow-3xs flex items-center gap-4 stagger-item">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                        <Zap className="w-5 h-5 fill-amber-400" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total EXP</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-display text-gray-900 dark:text-white font-mono">{totalExp.toLocaleString('id-ID')}</span>
                          <span className="text-[10px] text-amber-600 font-extrabold uppercase">EXP</span>
                        </div>
                      </div>
                    </div>

                    {/* Average EXP Stat Card (Decimal Precision e.g. 53.2) */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-5 rounded-2xl shadow-3xs flex items-center gap-4 stagger-item">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rata-Rata EXP</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold font-display text-gray-900 dark:text-white font-mono">{averageExp.toFixed(1)}</span>
                          <span className="text-[10px] text-purple-600 font-extrabold uppercase">EXP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard split content panels */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left & Middle columns: Assigned tasks & submission status */}
                    <div className="xl:col-span-2 space-y-8">
                      
                      {/* Section: Tugas yang Harus Dikerjakan */}
                      <div className="card-duo p-6 space-y-4 stagger-item">
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
                                      <p className="text-[10px] text-gray-400">EXP</p>
                                      <p className="text-xs font-bold text-amber-500 font-mono">{sub.score} EXP</p>
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
                                    <div className="w-6 h-6 rounded-lg font-bold text-[10px] flex items-center justify-center overflow-hidden shrink-0">
                                      <img 
                                        src={member.photoURL || '/aset/default-avatar.svg'} 
                                        alt={member.fullName} 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = '/aset/default-avatar.svg';
                                        }}
                                      />
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
                                  <span className="text-xs font-bold font-mono text-amber-500 shrink-0">{sub.score} EXP</span>
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

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
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

                      <button
                        type="button"
                        onClick={() => setHideDone(!hideDone)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 cursor-pointer shadow-xs ${
                          hideDone
                            ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500 shadow-indigo-500/20 ring-2 ring-indigo-500/30'
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
                            className="group bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 p-6 rounded-3xl flex flex-col justify-between gap-5 transition-all duration-300 cursor-pointer relative overflow-hidden"
                          >
                            {/* Animated Mesh Gradient Background (Hover only) */}
                            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                              <motion.div 
                                className="absolute -inset-[100%] w-[300%] h-[300%] bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.08)_0%,transparent_50%),radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.08)_0%,transparent_50%)]"
                                animate={{ 
                                  rotate: [0, 90, 180, 270, 360],
                                  scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                              />
                            </div>

                            <div className="relative z-10 space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-2 flex-wrap">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm transition-all ${
                                    status === 'completed' 
                                      ? 'bg-green-100/80 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300' 
                                      : status === 'submitted' 
                                        ? 'bg-amber-100/80 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300' 
                                        : status === 'remedial'
                                          ? 'bg-red-100/80 text-red-800 border-red-300 animate-pulse dark:bg-red-900/40 dark:text-red-300'
                                          : status === 'expired'
                                            ? 'bg-gray-100/80 text-gray-500 border-gray-300 dark:bg-slate-800/80 dark:text-slate-400'
                                            : 'bg-indigo-100/80 text-indigo-800 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300'
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

                                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100/80 text-slate-700 border border-slate-200 backdrop-blur-md shadow-sm dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
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

              {/* TAB 5: SETTINGS INLINE */}
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
