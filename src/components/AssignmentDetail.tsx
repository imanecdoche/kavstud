import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Send, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { Assignment, Submission, UserProfile } from '../types';

interface AssignmentDetailProps {
  assignmentId: string;
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function AssignmentDetail({ assignmentId, onNavigate, onSetLoading }: AssignmentDetailProps) {
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Student Answering Form State
  const [answer, setAnswer] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      onNavigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        // Load User Profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUserProfile(userDoc.data() as UserProfile);
        }

        // Load Assignment details
        const assignDoc = await getDoc(doc(db, 'assignments', assignmentId));
        if (assignDoc.exists()) {
          setAssignment({ id: assignDoc.id, ...assignDoc.data() } as Assignment);
        } else {
          setError('Tugas tidak ditemukan.');
        }
      } catch (err) {
        console.error(err);
        setError('Gagal memuat detail tugas.');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen to submission status in real-time
    const unsubscribeSub = onSnapshot(doc(db, 'submissions', assignmentId), (docSnap) => {
      if (docSnap.exists()) {
        setExistingSubmission({ id: docSnap.id, ...docSnap.data() } as Submission);
      }
    });

    return () => unsubscribeSub();
  }, [assignmentId, onNavigate]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      setSubmitError('Jawaban tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create or set the submission in Firestore
      // Document ID matches the assignment ID for direct correlation
      await setDoc(doc(db, 'submissions', assignmentId), {
        assignmentId: assignmentId,
        assignmentTitle: assignment?.title || '',
        studentId: currentUserProfile?.uid || '',
        studentName: currentUserProfile?.fullName || '',
        answer: answer.trim(),
        status: 'submitted',
        score: null,
        feedback: null,
        submittedAt: serverTimestamp(),
        gradedAt: null
      });

      // Redirect immediately to Submission Detail
      onNavigate(`/submission/${assignmentId}`);
    } catch (err) {
      console.error(err);
      setSubmitError('Gagal mengirimkan jawaban. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentUserProfile?.role === 'teacher') {
      onNavigate('/teacher');
    } else {
      onNavigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 max-w-4xl mx-auto" id="assignment-detail-page">
      {/* Back button header */}
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
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Detail Lembar Tugas</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 tracking-tight mt-0.5">
            {assignment?.title || 'Loading...'}
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
          <div className="h-40 bg-gray-200/60 rounded-3xl" />
          <div className="h-64 bg-gray-200/60 rounded-3xl" />
        </div>
      ) : assignment ? (
        <div className="space-y-8 mt-8">
          {/* Assignment Information Card */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-3xs space-y-6">
            <div className="flex items-center gap-3.5 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 text-[10px] font-bold uppercase">
                <BookOpen className="w-3.5 h-3.5" />
                Lembar Soal
              </div>
              <span className="text-xs text-gray-400 font-medium">
                Dibuat oleh: <span className="font-bold text-gray-600">{assignment.teacherName}</span>
              </span>
            </div>

            <div className="space-y-3 bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pertanyaan / Instruksi Guru:</span>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                {assignment.question}
              </p>
            </div>
          </div>

          {/* Student Answer Panel / Submission Status */}
          {currentUserProfile?.role === 'student' && (
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-3xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-indigo-500" />
                  Lembar Jawaban Anda
                </h3>
                {existingSubmission && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    existingSubmission.status === 'graded' 
                      ? 'bg-green-50 text-green-700 border border-green-100' 
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {existingSubmission.status === 'graded' ? 'Sudah Dinilai' : 'Sudah Terkirim'}
                  </span>
                )}
              </div>

              {existingSubmission ? (
                /* Already Submitted View */
                <div className="space-y-4">
                  <div className="p-4 bg-green-50/50 border border-green-100 rounded-2xl text-xs text-green-700 flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Jawaban telah terkirim!</p>
                      <p className="text-[11px] mt-0.5 text-green-600/90 leading-relaxed">
                        Anda telah mengirimkan jawaban tugas ini. Klik tombol di bawah untuk melihat detail skor dan tanggapan guru secara real-time.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(`/submission/${assignmentId}`)}
                    className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{ minHeight: '44px' }}
                  >
                    Buka Detail Submisi & Nilai
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              ) : (
                /* Form to write answer */
                <form onSubmit={handleSubmitAnswer} className="space-y-5">
                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600">
                      {submitError}
                    </div>
                  )}

                  {/* Single Answer field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-gray-700">
                        Tulis Jawaban <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        disabled={!answer.trim()}
                        className="text-[11px] text-indigo-600 hover:text-indigo-700 hover:underline font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {isPreviewMode ? 'Kembali Edit' : 'Pratinjau Jawaban'}
                      </button>
                    </div>

                    {isPreviewMode ? (
                      /* Plain Text Preview */
                      <div className="p-4 min-h-[160px] bg-gray-50 border border-dashed border-gray-200 rounded-xl text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                        {answer}
                      </div>
                    ) : (
                      <textarea
                        required
                        rows={8}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
                        placeholder="Ketik seluruh jawaban esai Anda secara lengkap dan teliti di sini..."
                      />
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    {isPreviewMode && (
                      <button
                        type="button"
                        onClick={() => setIsPreviewMode(false)}
                        className="px-5 py-3 border border-gray-200 text-gray-500 font-semibold rounded-xl text-xs hover:bg-gray-50 cursor-pointer active:scale-95 transition-all"
                        style={{ minHeight: '44px' }}
                      >
                        Edit Jawaban
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting || !answer.trim()}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                      style={{ minHeight: '44px' }}
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? 'Mengirim Jawaban...' : 'Kirim Jawaban Tugas'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Teacher View Details Info */}
          {currentUserProfile?.role === 'teacher' && (
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-3xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Status Tugas Siswa
              </h3>

              {existingSubmission ? (
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-indigo-900">Siswa telah merespon tugas ini!</p>
                    <p className="text-[11px] text-indigo-700">Klik tombol di samping untuk segera memberikan penilaian dan umpan balik.</p>
                  </div>
                  <button
                    onClick={() => onNavigate(`/submission/${assignmentId}`)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Buka Submisi Siswa
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-500">
                  Siswa <span className="font-bold text-gray-700">{assignment.studentName}</span> belum mengirimkan jawaban esai untuk tugas ini.
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
