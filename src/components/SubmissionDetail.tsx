import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  CheckCircle, 
  User, 
  MessageSquare, 
  Award, 
  AlertCircle,
  Clock,
  Sparkles,
  Volume2,
  Mic,
  UploadCloud
} from 'lucide-react';
import { Submission, UserProfile, Assignment, Question } from '../types';
import CustomDropdown from './CustomDropdown';

interface SubmissionDetailProps {
  submissionId: string;
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function SubmissionDetail({ submissionId, onNavigate, onSetLoading }: SubmissionDetailProps) {
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions to safely extract answers for each question type
  const getStudentAnswerForQuestion = (qId: string) => {
    if (!submission || !submission.answersMap) return '';
    const val = submission.answersMap[qId];
    if (!val) return '';
    if (typeof val === 'object') {
      return (val as any).answer || '';
    }
    return String(val);
  };

  const getMatchingAnswers = (studentAnswer: string) => {
    const currentAnswersList = studentAnswer ? studentAnswer.split(',') : [];
    const matchingMap: {[left: string]: string} = {};
    currentAnswersList.forEach(item => {
      const [l, r] = item.split('::');
      if (l) matchingMap[l] = r || '';
    });
    return matchingMap;
  };

  // Teacher Grading Form State
  const [score, setScore] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'correct' | 'incorrect' | 'remedial'>('correct');
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

    // Listen to assignment details in real-time
    let unsubscribeQuestions: (() => void) | null = null;
    const unsubscribeAssign = onSnapshot(doc(db, 'assignments', submissionId), (docSnap) => {
      if (docSnap.exists()) {
        const assignData = { id: docSnap.id, ...docSnap.data() } as Assignment;
        setAssignment(assignData);

        if (assignData.assignmentType === 'lms_composite') {
          let masterId = submissionId;
          const parts = submissionId.split('_');
          
          if (assignData.masterId) {
            masterId = assignData.masterId;
          } else if (parts.length >= 3) {
            masterId = `${parts[0]}_${parts[1]}`;
          } else if (parts.length === 2) {
            if (parts[0] === 'lms') {
              masterId = submissionId;
            } else {
              masterId = parts[0];
            }
          }

          if (unsubscribeQuestions) {
            unsubscribeQuestions();
          }

          unsubscribeQuestions = onSnapshot(
            query(collection(db, 'questions'), where('assignmentId', '==', masterId)),
            (qSnap) => {
              const loadedQuestions: Question[] = [];
              qSnap.forEach((doc) => {
                loadedQuestions.push({ id: doc.id, ...doc.data() } as Question);
              });
              loadedQuestions.sort((a, b) => (a.order || 0) - (b.order || 0));
              setQuestions(loadedQuestions);
            }, (err) => {
              console.error("Error listening to questions:", err);
            }
          );
        }
      }
    }, (err) => {
      console.error("Error listening to assignment:", err);
    });

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
        if (subData.status === 'remedial') {
          setReviewStatus('remedial');
        } else if (subData.reviewStatus) {
          setReviewStatus(subData.reviewStatus);
        } else {
          setReviewStatus('correct');
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

    return () => {
      unsubscribeAssign();
      if (unsubscribeQuestions) {
        unsubscribeQuestions();
      }
      unsubscribeSub();
    };
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
      const nextStatus = reviewStatus === 'remedial' ? 'remedial' : 'graded';

      // Update submission with grade, feedback, reviewStatus, and timestamp in Firestore
      await updateDoc(doc(db, 'submissions', submissionId), {
        status: nextStatus,
        reviewStatus: reviewStatus,
        score: Number(score),
        feedback: feedback.trim(),
        gradedAt: serverTimestamp()
      });
      
      // Update the assignment status accordingly
      await updateDoc(doc(db, 'assignments', submissionId), {
        status: nextStatus === 'remedial' ? 'remedial' : 'completed'
      });

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
                    ? submission.reviewStatus === 'correct'
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-orange-50 text-orange-700 border border-orange-100'
                    : submission.status === 'remedial'
                      ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  {submission.status === 'graded' 
                    ? submission.reviewStatus === 'correct' 
                      ? 'Selesai (Tepat)' 
                      : 'Selesai (Kurang Tepat)' 
                    : submission.status === 'remedial'
                      ? 'Remedial / Perlu Perbaikan'
                      : 'Menunggu Penilaian'}
                </span>
                
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {submission.submittedAt ? new Date(submission.submittedAt.seconds * 1000).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}) : 'Baru saja'}
                </span>
              </div>
            </div>

            {/* Answer Content Display */}
            <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Jawaban & Lembar Kerja Siswa:
              </span>

              {/* 1. LMS Composite Question rendering */}
              {assignment?.assignmentType === 'lms_composite' && (
                <div className="space-y-5">
                  <div className="p-3 bg-indigo-50 border border-indigo-100/50 rounded-xl text-xs text-indigo-800">
                    <p className="font-bold">Ujian Berbasis LMS Composite</p>
                    <p className="text-[11px] text-indigo-700/95 mt-0.5">
                      Menampilkan lembar pengerjaan interaktif yang dikirimkan oleh siswa di bawah ini.
                    </p>
                  </div>

                  {questions.length > 0 ? (
                    <div className="space-y-6">
                      {questions.map((q, idx) => {
                        const studentAns = getStudentAnswerForQuestion(q.id);
                        
                        return (
                          <div key={q.id} className="p-5 bg-white border border-gray-200 rounded-2xl space-y-4 shadow-3xs">
                            {/* Question Header */}
                            <div className="flex items-start justify-between gap-4 border-b border-gray-50 pb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-5.5 h-5.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center font-mono">
                                  {idx + 1}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                  {q.type?.replace('_', ' ') || 'Pertanyaan'}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md font-mono">
                                {q.points || 10} Poin
                              </span>
                            </div>

                            {/* Question prompt */}
                            <p className="text-xs font-bold text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {q.question}
                            </p>

                            {/* Detailed Answers depending on question type */}
                            {q.type === 'multiple_choice' && q.choices && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Opsi Pilihan:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {q.choices.map((choice: string, cIdx: number) => {
                                    const optLetter = String.fromCharCode(65 + cIdx);
                                    const isStudentChoice = studentAns === optLetter;
                                    const isCorrect = q.correctAnswer === optLetter;

                                    return (
                                      <div
                                        key={cIdx}
                                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                                          isCorrect
                                            ? 'bg-green-50/60 border-green-200 text-green-900'
                                            : isStudentChoice
                                              ? 'bg-indigo-50/40 border-indigo-200 text-indigo-900'
                                              : 'bg-white border-gray-100'
                                        }`}
                                      >
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                                          isCorrect
                                            ? 'bg-green-600 text-white'
                                            : isStudentChoice
                                              ? 'bg-indigo-600 text-white'
                                              : 'bg-gray-100 text-gray-500'
                                        }`}>
                                          {optLetter}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold truncate">{choice}</p>
                                          {isCorrect && (
                                            <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide block mt-0.5">Jawaban Benar</span>
                                          )}
                                          {isStudentChoice && !isCorrect && (
                                            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wide block mt-0.5">Pilihan Siswa</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {q.type === 'true_false' && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Jawaban:</span>
                                <div className="flex gap-3">
                                  {[
                                    { val: 'true', label: 'BENAR / TRUE' },
                                    { val: 'false', label: 'SALAH / FALSE' }
                                  ].map((option) => {
                                    const isStudentChoice = studentAns === option.val;
                                    const isCorrect = q.trueFalseCorrect === option.val;

                                    return (
                                      <div
                                        key={option.val}
                                        className={`flex-1 py-3 px-4 rounded-xl border text-center text-xs font-bold ${
                                          isCorrect
                                            ? 'bg-green-50/60 border-green-200 text-green-700'
                                            : isStudentChoice
                                              ? 'bg-indigo-50/40 border-indigo-200 text-indigo-700'
                                              : 'bg-white border-gray-100 text-gray-400'
                                        }`}
                                      >
                                        <p>{option.label}</p>
                                        {isCorrect && (
                                          <span className="text-[8px] font-bold text-green-600 uppercase tracking-wide block mt-1">Benar</span>
                                        )}
                                        {isStudentChoice && !isCorrect && (
                                          <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-wide block mt-1">Pilihan Siswa</span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {q.type === 'matching' && q.matchingPairs && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pasangan Jawaban Siswa:</span>
                                <div className="space-y-2">
                                  {q.matchingPairs.map((pair: any, pIdx: number) => {
                                    const matchingMap = getMatchingAnswers(studentAns);
                                    const studentMatch = matchingMap[pair.left] || '(Kosong)';
                                    const isCorrect = studentMatch === pair.right;

                                    return (
                                      <div key={pIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-gray-50/30 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-gray-700">{pair.left}</span>
                                          <span className="text-gray-400 font-mono text-xs">➡</span>
                                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                                            isCorrect 
                                              ? 'bg-green-50 text-green-700 border border-green-100' 
                                              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                          }`}>{studentMatch}</span>
                                        </div>
                                        {!isCorrect && (
                                          <div className="text-[10px] text-green-600 font-semibold bg-green-50/30 px-2 py-1 rounded-lg border border-green-100">
                                            Kunci: {pair.right}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {q.type === 'fill_blank' && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Jawaban Siswa:</span>
                                  <div className="p-3 bg-gray-50/30 border border-gray-100 rounded-xl text-xs font-semibold text-gray-800">
                                    {studentAns || '(Kosong)'}
                                  </div>
                                </div>
                                {q.fillBlankAnswers && q.fillBlankAnswers.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block">Kunci Jawaban Benar (Isian):</span>
                                    <div className="p-3 bg-green-50/40 border border-green-100 text-green-800 rounded-xl text-xs font-semibold">
                                      {q.fillBlankAnswers.join(' / ')}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {(q.type === 'essay' || q.type === 'listening' || q.type === 'speaking') && (
                              <div className="space-y-3">
                                {q.type === 'listening' && q.audioUrl && (
                                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audio Soal:</span>
                                    <audio src={q.audioUrl} controls className="h-6 flex-1" />
                                  </div>
                                )}
                                {q.type === 'speaking' && q.speakingPrompt && (
                                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-800">
                                    Kalimat: "{q.speakingPrompt}"
                                  </div>
                                )}

                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Jawaban Siswa:</span>
                                  <div className="p-4.5 bg-gray-50/30 border border-gray-100 rounded-xl text-xs text-gray-800 font-medium whitespace-pre-wrap leading-relaxed">
                                    {studentAns || '(Siswa tidak mengisi jawaban)'}
                                  </div>
                                </div>
                              </div>
                            )}

                            {q.type === 'file_upload' && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Lampiran Berkas Siswa:</span>
                                {studentAns ? (
                                  <div className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-700 truncate">{studentAns}</p>
                                        <p className="text-[10px] text-gray-400">Berkas unggahan tugas</p>
                                      </div>
                                    </div>
                                    <a
                                      href={studentAns}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      referrerPolicy="no-referrer"
                                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shrink-0"
                                    >
                                      Unduh / Buka Berkas
                                    </a>
                                  </div>
                                ) : (
                                  <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-400 text-center italic">
                                    Tidak ada file yang diunggah.
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Answer Rubric / Guide for Teacher grading */}
                            {q.answerGuide && q.answerGuide.trim() !== '' && isTeacher && (
                              <div className="p-3.5 bg-amber-50/40 border border-amber-100 rounded-xl text-xs text-amber-800 space-y-1">
                                <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wide block">Panduan Koreksi / Rubrik Guru:</span>
                                <p className="italic font-medium leading-relaxed">"{q.answerGuide}"</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-gray-400 italic">
                      Memuat daftar pertanyaan kuis...
                    </div>
                  )}
                </div>
              )}

              {/* 2. Standard Multiple Choice Question rendering */}
              {assignment?.assignmentType === 'multiple_choice' && (
                <div className="space-y-4">
                  {assignment.question && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Pertanyaan Soal:</span>
                      <p className="text-xs font-bold text-gray-800 leading-relaxed">{assignment.question}</p>
                    </div>
                  )}

                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Opsi Pilihan Ganda & Jawaban Siswa:</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                      const choiceText = assignment.choices?.[opt] || '';
                      const isStudentChoice = submission.selectedChoice === opt || submission.answer?.startsWith(`Pilihan Terpilih: ${opt}`);
                      const isCorrect = assignment.correctChoice === opt;

                      return (
                        <div
                          key={opt}
                          className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                            isCorrect
                              ? 'bg-green-50/60 border-green-200 text-green-950 font-semibold'
                              : isStudentChoice
                                ? 'bg-indigo-50/40 border-indigo-200 text-indigo-950'
                                : 'bg-white border-gray-100 text-gray-700'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                            isCorrect
                              ? 'bg-green-600 text-white'
                              : isStudentChoice
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-500'
                          }`}>
                            {opt}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{choiceText}</p>
                            {isCorrect && (
                              <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide block mt-0.5">Jawaban Benar</span>
                            )}
                            {isStudentChoice && !isCorrect && (
                              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wide block mt-0.5">Pilihan Siswa</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Standard Multi Short Answer Question rendering */}
              {assignment?.assignmentType === 'multi_short_answer' && (
                <div className="space-y-4">
                  {assignment.subQuestions?.map((qText: string, idx: number) => {
                    const studentAns = submission.answers?.[idx] || '';

                    return (
                      <div key={idx} className="p-4 bg-white border border-gray-100 rounded-xl space-y-2.5">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md font-mono">
                          Soal {idx + 1}
                        </span>
                        <p className="text-xs font-bold text-gray-800 leading-normal">{qText}</p>
                        <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Jawaban Siswa:</span>
                          <p className="text-xs text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">{studentAns || '(Kosong)'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 4. Default: Standard Single Short Answer / Essay or other general type */}
              {(!assignment?.assignmentType || (assignment?.assignmentType !== 'lms_composite' && assignment?.assignmentType !== 'multiple_choice' && assignment?.assignmentType !== 'multi_short_answer')) && (
                <div className="space-y-4">
                  {assignment?.question && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100/70">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Soal / Pertanyaan:</span>
                      <p className="text-xs font-bold text-gray-800 leading-relaxed whitespace-pre-wrap">{assignment.question}</p>
                    </div>
                  )}
                  <div className="p-4 bg-white border border-gray-100 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Jawaban Siswa:</span>
                    <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                      {submission.answer || '(Kosong)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grading Details or Input Panel */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-3xs space-y-6">
            {(submission.status === 'graded' || submission.status === 'remedial') && !isTeacher ? (
              /* Student View: Graded / Remedial Details */
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Evaluasi & Hasil Penilaian
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Score */}
                  <div className={`md:col-span-1 rounded-2xl p-5 flex flex-col justify-between space-y-4 border ${
                    submission.status === 'remedial'
                      ? 'bg-orange-50/30 border-orange-100/50 text-orange-700'
                      : submission.reviewStatus === 'correct'
                        ? 'bg-green-50/30 border-green-100/50 text-green-700'
                        : 'bg-indigo-50/30 border-indigo-100/50 text-indigo-700'
                  }`}>
                    <div className="w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center shadow-3xs">
                      <Award className="w-4.5 h-4.5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-gray-400">Skor Tugas</span>
                      <span className="text-3xl font-bold font-display mt-1 block">
                        {submission.score !== null ? submission.score : '-'} <span className="text-xs font-sans font-medium text-gray-400">/ 100</span>
                      </span>
                    </div>
                  </div>

                  {/* Feedback comment */}
                  <div className="md:col-span-2 bg-gray-50/50 border border-gray-100 rounded-2xl p-5 space-y-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      Umpan Balik Guru {submission.status === 'remedial' && '(Petunjuk Perbaikan)'}
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                      "{submission.feedback || 'Belum ada umpan balik tertulis.'}"
                    </p>
                  </div>
                </div>

                {submission.status === 'remedial' && (
                  <div className="p-4 bg-orange-50 border border-orange-200/40 rounded-2xl text-xs text-orange-800 space-y-2">
                    <p className="font-bold">⚠️ Anda Mendapat Remedial Untuk Tugas Ini</p>
                    <p className="text-[11px] text-orange-700 leading-relaxed">
                      Silakan baca catatan atau koreksi guru di atas, kemudian buka kembali lembar tugas ini untuk mengirimkan pengerjaan revisi Anda yang baru.
                    </p>
                    <button
                      onClick={() => onNavigate(`/assignment/${submission.assignmentId}`)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-[10px] uppercase cursor-pointer"
                    >
                      Perbaiki Jawaban Sekarang
                    </button>
                  </div>
                )}
              </div>
            ) : isTeacher ? (
              /* Teacher View: Live Grading Form / Edit Grade */
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                  <Award className="w-4.5 h-4.5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {submission.status === 'graded' || submission.status === 'remedial' ? 'Ubah Hasil Penilaian' : 'Berikan Penilaian & Masukan'}
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

                    {/* Status Review selection */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Hasil Review Tugas <span className="text-red-500">*</span>
                      </label>
                      <CustomDropdown
                        value={reviewStatus}
                        onChange={(val) => setReviewStatus(val as any)}
                        options={[
                          { value: 'correct', label: 'Selesai (Benar / Tepat)' },
                          { value: 'incorrect', label: 'Selesai (Kurang Tepat)' },
                          { value: 'remedial', label: 'Harus Perbaikan (Remedial)' }
                        ]}
                      />
                    </div>

                    {/* Feedback comment field */}
                    <div className="sm:col-span-3 space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Catatan & Umpan Balik Guru <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                        placeholder="Tuliskan apresiasi, koreksi, atau panduan perbaikan remedial di sini..."
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
                      {isGrading ? 'Menyimpan Penilaian...' : (submission.status === 'graded' || submission.status === 'remedial') ? 'Ubah Nilai & Feedback' : 'Kirim Penilaian'}
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
