import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
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
  AlertCircle 
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

    // Fetch Student Profile
    const fetchStudentProfile = async () => {
      try {
        const docRef = doc(db, 'users', studentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudent({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
        } else {
          setError('Siswa tidak ditemukan.');
        }
      } catch (err) {
        console.error(err);
        setError('Gagal memuat profil siswa.');
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };

    fetchStudentProfile();

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 space-y-8 max-w-5xl mx-auto" id="student-profile-page">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('/teacher')}
          className="p-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer transition-colors active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Kembali ke Dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Profil Detail Siswa</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 tracking-tight mt-0.5">
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
          <div className="h-44 bg-gray-200/60 rounded-3xl" />
          <div className="h-64 bg-gray-200/60 rounded-3xl" />
        </div>
      ) : student ? (
        <div className="space-y-8">
          {/* Main Info Card & Stats Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Identity Card */}
            <div className="md:col-span-1 bg-white border border-gray-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                  {student.fullName?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{student.fullName}</h2>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase mt-0.5">Siswa Kavio Edu</p>
                </div>
              </div>

              <div className="space-y-3.5 border-t border-gray-50 pt-4 text-xs text-gray-600 font-medium">
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
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Tugas</span>
                  <span className="text-2xl font-bold font-display text-gray-900 mt-1 block">{totalAssigned}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
                <div className="w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-4.5 h-4.5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Diselesaikan</span>
                  <span className="text-2xl font-bold font-display text-gray-900 mt-1 block">{totalSubmitted}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
                <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rata-Rata Nilai</span>
                  <span className="text-2xl font-bold font-display text-indigo-600 mt-1 block">
                    {averageScore !== null ? `${averageScore} / 100` : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Student's Assignment / Submission History List */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Riwayat Aktivitas & Jawaban Tugas
            </h3>

            {assignments.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs border border-dashed border-gray-100 rounded-2xl">
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
                      className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-gray-50/50 px-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{assign.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            matchingSubmission 
                              ? matchingSubmission.status === 'graded' 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-amber-50 text-amber-700'
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
                        {matchingSubmission?.score !== undefined && matchingSubmission?.score !== null ? (
                          <div className="text-right">
                            <p className="text-[10px] text-gray-400">Skor</p>
                            <p className="text-xs font-bold text-indigo-600 font-display">{matchingSubmission.score} / 100</p>
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
