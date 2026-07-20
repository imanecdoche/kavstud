import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  updateDoc 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  FileCheck, 
  Award, 
  ChevronRight, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { UserProfile, Assignment, Submission } from '../types';

interface StudentProfileProps {
  studentId: string;
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function StudentProfile({ studentId, onNavigate, onSetLoading }: StudentProfileProps) {
  const [student, setStudent] = useState<UserProfile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  const [loading, setLoading] = useState({
    profile: true,
    assignments: true,
    submissions: true
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setError('ID Siswa tidak valid.');
      setLoading({ profile: false, assignments: false, submissions: false });
      return;
    }

    // Fetch Student Profile (Real-time listener)
    const unsubscribeProfile = onSnapshot(doc(db, 'users', studentId), (docSnap) => {
      if (docSnap.exists()) {
        setStudent({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
      } else {
        setError('Siswa tidak ditemukan.');
      }
      setLoading(prev => ({ ...prev, profile: false }));
    }, (err) => {
      console.error(err);
      setError('Gagal memuat profil siswa.');
      setLoading(prev => ({ ...prev, profile: false }));
    });

    // Listen to Student's Assignments (Real-time)
    const assignmentsQuery = query(
      collection(db, 'assignments'),
      where('studentId', '==', studentId),
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
      onSnapshot(query(collection(db, 'assignments'), where('studentId', '==', studentId)), (snap) => {
        const assigns: Assignment[] = [];
        snap.forEach((d) => {
          assigns.push({ id: d.id, ...d.data() } as Assignment);
        });
        assigns.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setAssignments(assigns);
        setLoading(prev => ({ ...prev, assignments: false }));
      });
    });

    // Listen to Student's Submissions (Real-time)
    const submissionsQuery = query(
      collection(db, 'submissions'),
      where('studentId', '==', studentId),
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
      onSnapshot(query(collection(db, 'submissions'), where('studentId', '==', studentId)), (snap) => {
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
  }, [studentId]);

  // Calculate statistics
  const totalAssigned = assignments.length;
  const totalSubmitted = submissions.length;
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');
  const averageScore = gradedSubmissions.length > 0 
    ? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length)
    : null;

  const isPageLoading = loading.profile && loading.assignments && loading.submissions;

  const handleUpdateClassType = async (type: 'PRIVATE' | 'CIRCLE') => {
    if (!student) return;
    try {
      onSetLoading(true);
      const updatePayload: any = {
        classType: type,
        updatedAt: new Date()
      };
      if (type === 'PRIVATE') {
        updatePayload.circleId = null;
      }
      await updateDoc(doc(db, 'users', studentId), updatePayload);
    } catch (err) {
      console.error(err);
      setError('Gagal memperbarui Tipe Kelas.');
    } finally {
      onSetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-8 lg:p-12 space-y-8 max-w-5xl mx-auto" id="student-profile-page">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('/teacher')}
          className="p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer transition-colors active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Kembali ke Dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-slate-200" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Profil Detail Siswa</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
            {student?.fullName || 'Loading...'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {isPageLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="h-44 bg-gray-200 dark:bg-slate-600/60 rounded-3xl" />
          <div className="h-64 bg-gray-200 dark:bg-slate-600/60 rounded-3xl" />
        </div>
      ) : student ? (
        <div className="space-y-8">
          {/* Main Info Card & Stats Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Identity Card */}
            <div className="md:col-span-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl shadow-3xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold text-lg">
                  {student.fullName?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">{student.fullName}</h2>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${
                      student.classType === 'PRIVATE'
                        ? 'bg-teal-50 text-teal-700 border border-teal-100'
                        : 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100'
                    }`}>
                      {student.classType || 'PRIVATE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase mt-0.5">Siswa Kavio Edu</p>
                </div>
              </div>

              {/* Class Type Editor Toggles */}
              <div className="space-y-2 border-t border-b border-gray-50 py-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ubah Tipe Kelas (Class Type)</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateClassType('PRIVATE')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      (student.classType || 'PRIVATE') === 'PRIVATE'
                        ? 'bg-teal-50 text-teal-700 border-teal-200'
                        : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900'
                    }`}
                  >
                    PRIVATE
                  </button>
                  <button
                    onClick={() => handleUpdateClassType('CIRCLE')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      student.classType === 'CIRCLE'
                        ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'
                        : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900'
                    }`}
                  >
                    CIRCLE
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  sessionStorage.setItem('assignToStudentId', student.uid);
                  onNavigate('/teacher');
                }}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                style={{ minHeight: '40px' }}
                id="btn-assign-new-task"
              >
                <Plus className="w-4 h-4" />
                Beri Tugas Baru
              </button>

              <div className="space-y-3.5 border-t border-gray-50 pt-4 text-xs text-gray-600 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Terdaftar {new Date(student.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Tugas</span>
                  <span className="text-2xl font-bold font-display text-gray-900 dark:text-white mt-1 block">{totalAssigned}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
                <div className="w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-4.5 h-4.5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Diselesaikan</span>
                  <span className="text-2xl font-bold font-display text-gray-900 dark:text-white mt-1 block">{totalSubmitted}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
                <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rata-Rata Nilai</span>
                  <span className="text-2xl font-bold font-display text-indigo-600 dark:text-indigo-400 mt-1 block">
                    {averageScore !== null ? `${averageScore} / 100` : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Student's Assignment / Submission History List */}
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
              Riwayat Aktivitas & Jawaban Tugas
            </h3>

            {assignments.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs border border-dashed border-gray-100 dark:border-slate-700/50 rounded-2xl">
                Belum ada tugas yang diberikan kepada siswa ini.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {assignments.map((assign) => {
                  const matchingSubmission = submissions.find(s => s.assignmentId === assign.id);
                  return (
                    <div 
                      key={assign.id}
                      onClick={() => {
                        if (matchingSubmission) {
                          onNavigate(`/submission/${matchingSubmission.id}`);
                        } else {
                          onNavigate(`/assignment/${assign.id}`);
                        }
                      }}
                      className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-gray-50 dark:bg-slate-900/50 px-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{assign.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            matchingSubmission 
                              ? matchingSubmission.status === 'graded' 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700'
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {matchingSubmission 
                              ? matchingSubmission.status === 'graded' ? 'Sudah Dinilai' : 'Menunggu Penilaian'
                              : 'Belum Dikerjakan'
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3.5">
                        {matchingSubmission?.status === 'graded' && matchingSubmission?.score !== undefined && matchingSubmission?.score !== null ? (
                          <div className="text-right">
                            <p className="text-[10px] text-gray-400">Skor</p>
                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-display">{matchingSubmission.score} / 100</p>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400">
                            {matchingSubmission ? 'Lihat Submisi' : 'Lihat Tugas'}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
