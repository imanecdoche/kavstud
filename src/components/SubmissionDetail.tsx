import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  CheckCircle, 
  User, 
  MessageSquare, 
  Award, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Submission, UserProfile } from '../types';

interface SubmissionDetailProps {
  submissionId: string;
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function SubmissionDetail({ submissionId, onNavigate, onSetLoading }: SubmissionDetailProps) {
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Teacher Grading Form State
  const [score, setScore] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [isGrading, setIsGrading] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      onNavigate('/login');
      return;
    }

    // Load user role profile
    const loadProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUserProfile(userDoc.data() as UserProfile);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };
    loadProfile();

    // Setup Real-time listener for this specific submission
    const unsubscribeSub = onSnapshot(doc(db, 'submissions', submissionId), (docSnap) => {
      if (docSnap.exists()) {
        const subData = { id: docSnap.id, ...docSnap.data() } as Submission;
        setSubmission(subData);
        if (subData.score !== null) {
          setScore(subData.score);
        }
        if (subData.feedback !== null) {
          setFeedback(subData.feedback);
        }
      } else {
        setError('Submisi atau lembar jawaban tidak ditemukan.');
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError('Gagal memuat detail jawaban secara real-time.');
      setLoading(false);
    });

    return () => unsubscribeSub();
  }, [submissionId, onNavigate]);

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score === '' || score < 0 || score > 100) {
      setGradeError('Skor penilaian harus berupa angka antara 0 hingga 100.');
      return;
    }
    if (!feedback.trim()) {
      setGradeError('Umpan balik atau catatan dari pengajar wajib diisi.');
      return;
    }

    setIsGrading(true);
    setGradeError(null);

    try {
      // Update submission with grade, feedback, and timestamp in Firestore
      await updateDoc(doc(db, 'submissions', submissionId), {
        status: 'graded',
        score: Number(score),
        feedback: feedback.trim(),
        gradedAt: serverTimestamp()
      });
      
      // Success modal or auto status change
    } catch (err) {
      console.error(err);
      setGradeError('Gagal menyimpan nilai. Silakan coba lagi.');
    } finally {
      setIsGrading(false);
    }
  };

  const handleBack = () => {
    if (currentUserProfile?.role === 'teacher') {
      onNavigate('/teacher');
    } else {
      onNavigate('/student');
    }
  };

  const isTeacher = currentUserProfile?.role === 'teacher';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 max-w-4xl mx-auto" id="submission-detail-page">
      {/* Back Header */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <button
          onClick={handleBack}
          className="p-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer transition-colors active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Detail Lembar Jawaban & Penilaian</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 tracking-tight mt-0.5">
            {submission?.assignmentTitle || 'Memuat...'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600 flex items-center gap-2 mt-6">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-6 animate-pulse mt-8">
          <div className="h-44 bg-gray-200/60 rounded-3xl" />
          <div className="h-64 bg-gray-200/60 rounded-3xl" />
        </div>
      ) : submission ? (
        <div className="space-y-8 mt-8">
          {/* Submission and Student Information */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-3xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
                  {submission.studentName?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">{submission.studentName}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Dikirimkan oleh siswa</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  submission.status === 'graded' 
                    ? 'bg-green-50 text-green-700 border border-green-100' 
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  {submission.status === 'graded' ? 'Telah Dinilai' : 'Menunggu Penilaian'}
                </span>
                
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {submission.submittedAt ? new Date(submission.submittedAt.seconds * 1000).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}) : 'Baru saja'}
                </span>
              </div>
            </div>

            {/* Answer Content Display */}
            <div className="space-y-3 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Jawaban Esai Siswa:</span>
              <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                {submission.answer}
              </p>
            </div>
          </div>

          {/* Grading Details or Input Panel */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-3xs space-y-6">
            {submission.status === 'graded' && !isTeacher ? (
              /* Student View: Graded Details */
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Evaluasi & Hasil Penilaian
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Score */}
                  <div className="md:col-span-1 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                      <Award className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Skor Tugas</span>
                      <span className="text-3xl font-bold font-display text-indigo-700 mt-1 block">
                        {submission.score} <span className="text-xs text-indigo-400 font-sans font-medium">/ 100</span>
                      </span>
                    </div>
                  </div>

                  {/* Feedback comment */}
                  <div className="md:col-span-2 bg-gray-50/50 border border-gray-100 rounded-2xl p-5 space-y-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      Umpan Balik Guru
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                      "{submission.feedback}"
                    </p>
                  </div>
                </div>
              </div>
            ) : isTeacher ? (
              /* Teacher View: Live Grading Form / Edit Grade */
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                  <Award className="w-4.5 h-4.5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {submission.status === 'graded' ? 'Ubah Hasil Penilaian' : 'Berikan Penilaian & Masukan'}
                  </h3>
                </div>

                {gradeError && (
                  <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600">
                    {gradeError}
                  </div>
                )}

                <form onSubmit={handleGradeSubmission} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Score field */}
                    <div className="sm:col-span-1 space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Skor Penilaian (0 - 100) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        required
                        value={score}
                        onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                        className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="Nilai esai"
                      />
                    </div>

                    {/* Feedback comment field */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Catatan & Umpan Balik <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                        placeholder="Tuliskan apresiasi, koreksi, atau panduan evaluasi di sini..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t border-gray-50">
                    <button
                      type="submit"
                      disabled={isGrading}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      style={{ minHeight: '44px' }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isGrading ? 'Menyimpan Penilaian...' : submission.status === 'graded' ? 'Ubah Nilai & Feedback' : 'Kirim Penilaian'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Student View: Unfinished Grading */
              <div className="p-6 text-center space-y-3 bg-amber-50/30 border border-amber-100/50 rounded-2xl">
                <Clock className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-amber-800">Menunggu Penilaian Pengajar</p>
                <p className="text-[11px] text-amber-600/90 leading-relaxed max-w-sm mx-auto">
                  Jawaban Anda telah diterima dengan aman di sistem. Gurumu akan segera memeriksa esai ini dan memberikan skor beserta umpan balik secara real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
