import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { 
  BookOpen, 
  FileCheck, 
  Clock, 
  Star, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { UserProfile, Assignment, Submission } from '../types';
import Logo from './Logo';

interface StudentDashboardProps {
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function StudentDashboard({ onNavigate, onSetLoading }: StudentDashboardProps) {
  const [studentProfile, setStudentProfile] = useState<UserProfile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  const [loading, setLoading] = useState({
    profile: true,
    assignments: true,
    submissions: true
  });
  const [error, setError] = useState<string | null>(null);

  // Mobile Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleLogout = async () => {
    onSetLoading(true);
    await auth.signOut();
    onNavigate('/login');
    onSetLoading(false);
  };

  // Grouping assignments by submission state:
  // "Assigned Tasks" = Assignments which have NOT been submitted yet.
  // "Completed Tasks" = Submissions.
  const submittedAssignmentIds = new Set(submissions.map(s => s.assignmentId));
  const assignedTasks = assignments.filter(a => !submittedAssignmentIds.has(a.id));
  const gradedTasks = submissions.filter(s => s.status === 'graded');

  const isPageLoading = loading.profile && loading.assignments && loading.submissions;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans" id="student-dashboard">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="inline-flex items-center gap-1.5">
          <Logo className="h-6 w-auto text-indigo-600" />
        </div>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl cursor-pointer"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col justify-between p-6 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <Logo className="h-7 w-auto text-indigo-600" />
            </div>
            
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Profile */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm">
                {studentProfile?.fullName?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {studentProfile?.fullName || 'Loading...'}
                </p>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 text-[9px] font-bold text-indigo-700 rounded-md border border-indigo-100 uppercase mt-0.5">
                  Siswa
                </span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 truncate">{studentProfile?.email}</p>
          </div>

          <nav className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Menu Utama
            </div>
            <button
              onClick={() => { onNavigate('/student'); setIsSidebarOpen(false); }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50/50 flex items-center gap-2.5 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Tugas & Aktivitas
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 border border-gray-100 hover:border-red-200 hover:bg-red-50/30 text-gray-500 hover:text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          style={{ minHeight: '44px' }}
        >
          <LogOut className="w-4 h-4" />
          Keluar Sistem
        </button>
      </aside>

      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Container Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 tracking-tight">
            Ruang Belajar Siswa
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Selesaikan tugas yang diberikan secara instan, lihat skor penilaian, dan baca tanggapan dari guru.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {isPageLoading ? (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 bg-gray-200/60 rounded-2xl" />
              <div className="h-40 bg-gray-200/60 rounded-2xl" />
            </div>
            <div className="h-64 bg-gray-200/60 rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column: Tasks Section */}
              <div className="xl:col-span-2 space-y-8">
                {/* Assigned Tasks / Pending Answer */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    Tugas yang Harus Dikerjakan
                  </h3>

                  {assignedTasks.length === 0 ? (
                    <div className="py-12 text-center space-y-2 border border-dashed border-gray-100 rounded-2xl">
                      <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="text-xs text-gray-500 font-semibold">Bagus sekali! Semua tugas telah diselesaikan.</p>
                      <p className="text-[10px] text-gray-400">Tunggu tugas baru yang akan diberikan oleh gurumu.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assignedTasks.map((assign) => (
                        <div 
                          key={assign.id}
                          onClick={() => onNavigate(`/assignment/${assign.id}`)}
                          className="p-4 bg-indigo-50/20 hover:bg-indigo-50/50 border border-indigo-100/30 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-colors"
                        >
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{assign.title}</h4>
                            <p className="text-[10px] text-gray-400 mt-1">Diberikan oleh: <span className="font-semibold text-gray-600">{assign.teacherName}</span></p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
                              Kerjakan
                            </span>
                            <ChevronRight className="w-4 h-4 text-indigo-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Completed Tasks / All Submissions */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <FileCheck className="w-4 h-4 text-indigo-500" />
                    Tugas yang Telah Dikirim
                  </h3>

                  {submissions.length === 0 ? (
                    <div className="py-12 text-center space-y-2 border border-dashed border-gray-100 rounded-2xl">
                      <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="text-xs text-gray-500 font-medium">Belum ada tugas yang kamu kirimkan.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {submissions.map((sub) => (
                        <div 
                          key={sub.id}
                          onClick={() => onNavigate(`/submission/${sub.id}`)}
                          className="py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 px-2 rounded-xl transition-colors cursor-pointer"
                        >
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{sub.assignmentTitle}</h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                sub.status === 'graded' 
                                  ? 'bg-green-50 text-green-700 border border-green-100' 
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {sub.status === 'graded' ? 'Sudah Dinilai' : 'Menunggu Penilaian'}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                dikirim {sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'baru saja'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {sub.score !== null && (
                              <div className="text-right">
                                <p className="text-[10px] text-gray-400">Nilai</p>
                                <p className="text-xs font-bold text-indigo-600 font-display">{sub.score} / 100</p>
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

              {/* Right Column: Feedback & Profile Info */}
              <div className="space-y-8">
                {/* Latest Scores & Feedbacks card list */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Star className="w-4 h-4 text-indigo-500" />
                    Catatan Penilaian Guru
                  </h3>

                  {gradedTasks.length === 0 ? (
                    <div className="py-8 text-center space-y-1.5 border border-dashed border-gray-100 rounded-2xl">
                      <MessageSquare className="w-6 h-6 text-gray-300 mx-auto" />
                      <p className="text-xs text-gray-500 font-medium">Belum ada evaluasi nilai.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                      {gradedTasks.map((sub) => (
                        <div 
                          key={sub.id}
                          onClick={() => onNavigate(`/submission/${sub.id}`)}
                          className="p-4 bg-indigo-50/10 border border-indigo-100/20 rounded-2xl space-y-2 cursor-pointer hover:bg-indigo-50/20 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{sub.assignmentTitle}</h4>
                            <span className="text-xs font-bold font-display text-indigo-600">{sub.score} / 100</span>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-3 bg-white p-2.5 rounded-lg border border-gray-50 italic">
                            "{sub.feedback}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
