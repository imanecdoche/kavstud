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
  limit
} from 'firebase/firestore';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Plus, 
  LogOut, 
  User as UserIcon, 
  ChevronRight, 
  Menu, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { UserProfile, Assignment, Submission } from '../types';
import Logo from './Logo';

interface TeacherDashboardProps {
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function TeacherDashboard({ onNavigate, onSetLoading }: TeacherDashboardProps) {
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

  // Create Assignment Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      limit(20)
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

    return () => {
      unsubscribeProfile();
      unsubscribeStudents();
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

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuestion.trim() || !selectedStudentId) {
      setFormError('Semua kolom formulir wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const targetStudent = students.find(s => s.uid === selectedStudentId);
    if (!targetStudent) {
      setFormError('Siswa terpilih tidak valid.');
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'assignments'), {
        title: newTitle.trim(),
        question: newQuestion.trim(),
        studentId: selectedStudentId,
        studentName: targetStudent.fullName,
        teacherId: auth.currentUser?.uid || '',
        teacherName: teacherProfile?.fullName || 'Guru Kavio',
        createdAt: serverTimestamp()
      });

      // Reset form & close modal
      setNewTitle('');
      setNewQuestion('');
      setSelectedStudentId('');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Gagal mengirim tugas ke siswa. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPageLoading = loading.profile && loading.students && loading.assignments;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans" id="teacher-dashboard">
      {/* Mobile Header / Navbar */}
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

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col justify-between p-6 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Logo & Close button on Mobile */}
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

          {/* Teacher Profile Info Section */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm">
                {teacherProfile?.fullName?.charAt(0).toUpperCase() || 'G'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {teacherProfile?.fullName || 'Loading...'}
                </p>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 text-[9px] font-bold text-indigo-700 rounded-md border border-indigo-100 uppercase mt-0.5">
                  Pengajar
                </span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 truncate">{teacherProfile?.email}</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Menu Utama
            </div>
            <button
              onClick={() => { onNavigate('/teacher'); setIsSidebarOpen(false); }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50/50 flex items-center gap-2.5 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Dashboard Utama
            </button>
          </nav>
        </div>

        {/* Logout at bottom */}
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 border border-gray-100 hover:border-red-200 hover:bg-red-50/30 text-gray-500 hover:text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          style={{ minHeight: '44px' }}
        >
          <LogOut className="w-4 h-4" />
          Keluar Sistem
        </button>
      </aside>

      {/* Sidebar Backdrop on Mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Container Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
        {/* Top Navbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 tracking-tight">
              Dashboard Guru
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Pantau kemajuan belajar siswa Anda secara real-time dan berikan penilaian langsung.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            style={{ minHeight: '44px' }}
          >
            <Plus className="w-4.5 h-4.5" />
            Buat Tugas Baru
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {isPageLoading ? (
          /* Skeleton Loader */
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200/60 rounded-2xl" />
              <div className="h-32 bg-gray-200/60 rounded-2xl" />
              <div className="h-32 bg-gray-200/60 rounded-2xl" />
            </div>
            <div className="h-64 bg-gray-200/60 rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Siswa Terdaftar</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-display text-gray-900">{students.length}</span>
                  <span className="text-[11px] text-gray-400 font-semibold">Siswa</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tugas yang Dibuat</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-display text-gray-900">{assignments.length}</span>
                  <span className="text-[11px] text-gray-400 font-semibold">Tugas</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs space-y-2 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Submisi Masuk</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-display text-gray-900">{submissions.length}</span>
                  <span className="text-[11px] text-gray-400 font-semibold">Submisi</span>
                </div>
              </div>
            </div>

            {/* Main Content Split Panels */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column: Student list & Assignments */}
              <div className="xl:col-span-2 space-y-8">
                {/* Recent Assignments created */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      Daftar Tugas Baru
                    </h3>
                  </div>

                  {assignments.length === 0 ? (
                    <div className="py-12 text-center space-y-2 border border-dashed border-gray-100 rounded-2xl">
                      <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="text-xs text-gray-500 font-medium">Belum ada tugas yang dibuat.</p>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="text-[11px] text-indigo-600 hover:underline font-semibold"
                      >
                        Buat tugas pertamamu sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto pr-1">
                      {assignments.map((assign) => (
                        <div 
                          key={assign.id}
                          className="py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/50 px-2 rounded-xl transition-colors cursor-pointer"
                          onClick={() => onNavigate(`/assignment/${assign.id}`)}
                        >
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{assign.title}</h4>
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate">Siswa: {assign.studentName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 shrink-0">
                              {assign.createdAt ? new Date(assign.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'Baru saja'}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Submissions received (Real-time updates) */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                      Submisi Masuk Terbaru
                    </h3>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="py-12 text-center space-y-2 border border-dashed border-gray-100 rounded-2xl">
                      <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="text-xs text-gray-500 font-medium">Belum ada jawaban yang dikirimkan oleh siswa.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {submissions.map((sub) => (
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

                          <div className="flex items-center justify-between sm:justify-end gap-3.5">
                            {sub.score !== null ? (
                              <div className="text-right">
                                <p className="text-[10px] text-gray-400">Skor</p>
                                <p className="text-xs font-bold text-indigo-600 font-display">{sub.score} / 100</p>
                              </div>
                            ) : (
                              <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded-lg">
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
              </div>

              {/* Right Column: Student List */}
              <div className="space-y-8">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Users className="w-4 h-4 text-indigo-500" />
                    Daftar Siswa Kelas
                  </h3>

                  {students.length === 0 ? (
                    <div className="py-12 text-center space-y-2 border border-dashed border-gray-100 rounded-2xl">
                      <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="text-xs text-gray-500 font-medium">Belum ada siswa terdaftar.</p>
                    </div>
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
                              <p className="text-xs font-bold text-gray-900 truncate">{stud.fullName}</p>
                              <p className="text-[10px] text-gray-400 truncate">{stud.email}</p>
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
          </div>
        )}
      </main>

      {/* Create Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-3xl border border-gray-100 w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-lg relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-50">
              <h2 className="text-lg font-display font-bold text-gray-900">
                Buat Tugas Baru
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

            <form onSubmit={handleCreateAssignment} className="space-y-4">
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

              {/* Target Student */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Pilih Siswa <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">-- Pilih Siswa Penerima --</option>
                  {students.map(s => (
                    <option key={s.uid} value={s.uid}>
                      {s.fullName} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Text Area */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Pertanyaan Tugas (Plain Text) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  placeholder="Tuliskan detail pertanyaan atau instruksi tugas secara rinci di sini..."
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
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                  style={{ minHeight: '44px' }}
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
