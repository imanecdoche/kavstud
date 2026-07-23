import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  query, 
  collection, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  CircleDot, 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FolderOpen,
  Calendar,
  X,
  User,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Circle, UserProfile, Assignment, Submission } from '../types';
import EmptyState from './EmptyState';
import { Dialog } from '@capacitor/dialog';

interface CircleProfileProps {
  circleId: string;
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function CircleProfile({ circleId, onNavigate, onSetLoading }: CircleProfileProps) {
  const [circle, setCircle] = useState<Circle | null>(null);
  const [teacher, setTeacher] = useState<UserProfile | null>(null);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onSetLoading(true);

    // 1. Real-time Circle Details
    const unsubscribeCircle = onSnapshot(doc(db, 'circles', circleId), async (docSnap) => {
      if (docSnap.exists()) {
        const circleData = { id: docSnap.id, ...docSnap.data() } as Circle;
        setCircle(circleData);

        // Load Teacher profile
        try {
          const tDoc = await getDoc(doc(db, 'users', circleData.teacherId));
          if (tDoc.exists()) {
            setTeacher(tDoc.data() as UserProfile);
          }
        } catch (err) {
          console.error('Error fetching teacher:', err);
        }
      } else {
        setError('Circle tidak ditemukan atau telah dihapus.');
        setLoading(false);
      }
    }, (err) => {
      console.error(err);
      setError('Gagal memuat detail Circle.');
      setLoading(false);
    });

    // 2. Real-time Members of this Circle
    const membersQuery = query(collection(db, 'users'), where('circleId', '==', circleId));
    const unsubscribeMembers = onSnapshot(membersQuery, (snapshot) => {
      const mems: UserProfile[] = [];
      snapshot.forEach((doc) => {
        mems.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setMembers(mems);
      setLoading(false);
    });

    // 3. Real-time Circle Assignments
    const assignsQuery = query(
      collection(db, 'assignments'), 
      where('assignmentTarget', '==', 'CIRCLE'),
      where('targetId', '==', circleId)
    );
    const unsubscribeAssigns = onSnapshot(assignsQuery, (snapshot) => {
      const assigns: Assignment[] = [];
      snapshot.forEach((doc) => {
        assigns.push({ id: doc.id, ...doc.data() } as Assignment);
      });
      setAssignments(assigns);
    });

    // 4. Real-time Submissions
    const unsubscribeSubmissions = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      const subs: Submission[] = [];
      snapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() } as Submission);
      });
      setSubmissions(subs);
    });

    return () => {
      unsubscribeCircle();
      unsubscribeMembers();
      unsubscribeAssigns();
      unsubscribeSubmissions();
    };
  }, [circleId]);

  useEffect(() => {
    if (!loading) {
      onSetLoading(false);
    }
  }, [loading]);

  // Remove a student from this Circle
  const handleRemoveMember = async (studentId: string, studentName: string) => {
    const { value } = await Dialog.confirm({
      title: 'Keluarkan Siswa',
      message: `Keluarkan ${studentName} dari Circle ${circle?.name}?`,
      okButtonTitle: 'Keluarkan',
      cancelButtonTitle: 'Batal'
    });
    if (!value) return;

    try {
      onSetLoading(true);
      await updateDoc(doc(db, 'users', studentId), {
        circleId: null
      });
    } catch (err) {
      console.error(err);
      await Dialog.alert({
        title: 'Error',
        message: 'Gagal mengeluarkan siswa dari Circle.'
      });
    } finally {
      onSetLoading(false);
    }
  };

  // CALCULATE STATISTICS
  const totalMembers = members.length;
  const totalAssignments = assignments.length;

  let totalCompletedSubmissions = 0;
  let totalPendingSubmissions = 0;
  let totalRemedialSubmissions = 0;
  let totalScoresSum = 0;
  let gradedScoresCount = 0;

  members.forEach(member => {
    assignments.forEach(assign => {
      const sub = submissions.find(s => s.assignmentId === assign.id && s.studentId === member.uid);
      if (sub) {
        if (sub.status === 'graded') {
          totalCompletedSubmissions++;
          if (sub.score !== null) {
            totalScoresSum += sub.score;
            gradedScoresCount++;
          }
        } else if (sub.status === 'remedial') {
          totalRemedialSubmissions++;
        } else {
          totalCompletedSubmissions++; // treats submitted (even if review) as completed for progress
        }
      } else {
        totalPendingSubmissions++;
      }
    });
  });

  const averageScore = gradedScoresCount > 0 ? Math.round(totalScoresSum / gradedScoresCount) : null;

  return (
    <div className="min-h-screen bg-[#171A21] text-white p-4 sm:p-8 lg:p-12 space-y-8 w-full font-sans" id="circle-profile-page">
      {/* Back button and title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('/teacher')}
          className="p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer transition-all active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-slate-200" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Profil Detil Kelompok Belajar</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight mt-0.5 flex items-center gap-2">
            <CircleDot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {circle?.name || 'Loading Circle...'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="h-40 bg-gray-200 dark:bg-slate-600/60 rounded-3xl" />
          <div className="h-64 bg-gray-200 dark:bg-slate-600/60 rounded-3xl" />
        </div>
      ) : circle ? (
        <div className="space-y-8">
          {/* Section 1: Circle Info & Statistics Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metadata Card */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl shadow-3xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                  <CircleDot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">{circle.name}</h2>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">ID: {circle.id}</p>
                </div>

                {circle.description && (
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed bg-gray-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    {circle.description}
                  </p>
                )}
              </div>

              <div className="space-y-3.5 border-t border-gray-50 pt-4 text-xs text-gray-600 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Guru: <strong className="text-gray-800 dark:text-slate-100">{teacher?.fullName || 'Memuat...'}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Dibuat: {circle.createdAt ? new Date(circle.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  <span>Kapasitas: <strong className="text-gray-800 dark:text-slate-100">{members.length} / {circle.capacity} Siswa</strong></span>
                </div>
              </div>
            </div>

            {/* Statistics Dashboard widgets */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Stat 1: Total Members */}
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Anggota</span>
                  <span className="text-2xl font-bold font-display text-gray-900 dark:text-white mt-1 block">{totalMembers} / {circle.capacity}</span>
                </div>
              </div>

              {/* Stat 2: Total Circle Assignments */}
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tugas Kelompok</span>
                  <span className="text-2xl font-bold font-display text-gray-900 dark:text-white mt-1 block">{totalAssignments}</span>
                </div>
              </div>

              {/* Stat 3: Average Score */}
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl shadow-3xs flex flex-col justify-between">
                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rata-Rata EXP</span>
                  <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1 block">
                    {averageScore !== null ? `${averageScore.toFixed(1)} EXP` : '-'}
                  </span>
                </div>
              </div>

              {/* Stat 4: Progress Detailed panel */}
              <div className="sm:col-span-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-5 rounded-3xl shadow-3xs space-y-4">
                <h3 className="text-xs font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  Rincian Progres Pengerjaan Kolektif
                </h3>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-3 bg-green-50/50 border border-green-100/20 rounded-2xl">
                    <span className="text-[10px] text-green-700 font-bold uppercase block">Sudah Selesai</span>
                    <span className="text-lg font-bold text-green-700 block mt-1 font-mono">{totalCompletedSubmissions}</span>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/30/50 border border-amber-100 dark:border-amber-800/50/20 rounded-2xl">
                    <span className="text-[10px] text-amber-700 font-bold uppercase block">Menunggu (Pending)</span>
                    <span className="text-lg font-bold text-amber-700 block mt-1 font-mono">{totalPendingSubmissions}</span>
                  </div>
                  <div className="p-3 bg-red-50/50 border border-red-100/20 rounded-2xl">
                    <span className="text-[10px] text-red-700 font-bold uppercase block">Remedial</span>
                    <span className="text-lg font-bold text-red-700 block mt-1 font-mono">{totalRemedialSubmissions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Members Grid & Circle Assignments Grid Split */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Members directory (2/5 size) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl shadow-3xs space-y-5">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Anggota Circle ({members.length})
                </h3>
              </div>

              {members.length === 0 ? (
                <div className="py-12 text-center text-gray-400 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-100 dark:border-slate-700/50">
                  <Users className="w-8 h-8 mx-auto text-gray-300" />
                  <p className="text-xs font-bold uppercase tracking-wider mt-2.5">Belum Ada Anggota</p>
                  <p className="text-[10px] text-gray-400 mt-1">Gunakan tab Manajemen Anggota di Dashboard Circle untuk memasukkan siswa.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {members.map(memb => (
                    <div 
                      key={memb.uid}
                      className="p-3.5 bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700/50 rounded-2xl flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                          {memb.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight">{memb.fullName}</h4>
                            <span className="inline-flex px-1.5 py-0.5 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100 rounded text-[7px] font-bold uppercase">
                              {memb.classType || 'CIRCLE'}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 truncate mt-0.5 font-medium">{memb.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onNavigate(`/student/${memb.uid}`)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:bg-indigo-900/30 rounded-lg shrink-0 transition-colors cursor-pointer"
                          title="Buka Profil Siswa"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveMember(memb.uid, memb.fullName)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0 transition-colors cursor-pointer"
                          title="Keluarkan dari Circle"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assignments given to Circle (3/5 size) */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl shadow-3xs space-y-5">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Daftar Tugas Circle ({assignments.length})
                </h3>
              </div>

              {assignments.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Belum Ada Tugas Circle"
                  description="Belum ada tugas yang dikirimkan secara kolektif ke Circle belajar ini."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments.map(assign => {
                    // Calculate submission summary specifically for this assignment inside the Circle
                    let assignCompleted = 0;
                    members.forEach(member => {
                      const sub = submissions.find(s => s.assignmentId === assign.id && s.studentId === member.uid);
                      if (sub && (sub.status === 'graded' || sub.status === 'submitted')) {
                        assignCompleted++;
                      }
                    });

                    return (
                      <div
                        key={assign.id}
                        onClick={() => onNavigate(`/assignment/${assign.id}`)}
                        className="bg-gray-50 dark:bg-slate-900/30 hover:bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700/50/70 p-4.5 rounded-2xl cursor-pointer transition-all hover:shadow-4xs flex flex-col justify-between space-y-3.5 group"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono font-bold text-gray-400 uppercase tracking-wide">
                              {assign.assignmentType === 'multiple_choice' ? 'Pilihan Ganda' : 'Esai'}
                            </span>
                            <span className="text-[8px] font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              Detail Progress
                              <ChevronRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:text-indigo-400 transition-colors line-clamp-1">
                            {assign.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                            {assign.question}
                          </p>
                        </div>

                        <div className="border-t border-gray-100 dark:border-slate-700/50 pt-2.5 flex items-center justify-between text-[10px] text-gray-500 dark:text-slate-400">
                          <span className="font-mono">
                            Dibuat: {assign.createdAt ? new Date(assign.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : '-'}
                          </span>
                          
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full font-mono">
                            Progres: {assignCompleted} / {members.length} Selesai
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400">
          Circle tidak ditemukan.
        </div>
      )}
    </div>
  );
}
