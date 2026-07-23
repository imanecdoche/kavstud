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
  ClipboardCheck,
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

  const [manualScores, setManualScores] = useState<{[questionId: string]: number}>({});
  const [questionFeedbacks, setQuestionFeedbacks] = useState<{[questionId: string]: string}>({});
  const [studentPhotoURL, setStudentPhotoURL] = useState<string | null>(null);

  // Compute Auto Score (sum of points for correct auto-gradable questions)
  const autoScore = questions.reduce((sum, q) => {
    const isAutoGradable = ['multiple_choice', 'true_false', 'matching', 'fill_blank'].includes(q.type);
    if (!isAutoGradable) return sum;
    
    // Get score from submission.answersMap
    const qAns = submission?.answersMap?.[q.id];
    return sum + (qAns?.pointsEarned || 0);
  }, 0);

  // Compute Manual Score (sum of manual question scores entered by teacher)
  const manualScore = questions.reduce((sum, q) => {
    const isAutoGradable = ['multiple_choice', 'true_false', 'matching', 'fill_blank'].includes(q.type);
    if (isAutoGradable) return sum;
    
    const scoreVal = manualScores[q.id] !== undefined ? manualScores[q.id] : 0;
    return sum + scoreVal;
  }, 0);

  // Total possible points for the whole assignment
  const totalPossiblePoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  // Total points of auto-graded questions
  const totalAutoPoints = questions.reduce((sum, q) => {
    const isAutoGradable = ['multiple_choice', 'true_false', 'matching', 'fill_blank'].includes(q.type);
    return isAutoGradable ? sum + (q.points || 0) : sum;
  }, 0);

  // Total points of manual-graded questions
  const totalManualPoints = questions.reduce((sum, q) => {
    const isAutoGradable = ['multiple_choice', 'true_false', 'matching', 'fill_blank'].includes(q.type);
    return !isAutoGradable ? sum + (q.points || 0) : sum;
  }, 0);

  // Compute final score as direct total EXP
  const calculatedTotalExp = autoScore + manualScore;

  // Synchronize score with calculatedTotalExp for lms_composite assignments
  useEffect(() => {
    if (assignment?.assignmentType === 'lms_composite') {
      setScore(calculatedTotalExp);
    }
  }, [calculatedTotalExp, assignment?.assignmentType]);

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
        if (subData.studentId) {
          getDoc(doc(db, 'users', subData.studentId)).then(uSnap => {
            if (uSnap.exists()) {
              setStudentPhotoURL(uSnap.data().photoURL || null);
            }
          }).catch(console.error);
        }
        if (subData.score !== null) {
          setScore(subData.score);
        }
        if (subData.answersMap) {
          setManualScores(prev => {
            if (Object.keys(prev).length === 0) {
              const loadedManualScores: {[questionId: string]: number} = {};
              Object.entries(subData.answersMap).forEach(([qId, val]: [string, any]) => {
                loadedManualScores[qId] = val.pointsEarned || 0;
              });
              return loadedManualScores;
            }
            return prev;
          });
          setQuestionFeedbacks(prev => {
            if (Object.keys(prev).length === 0) {
              const loadedFeedbacks: {[questionId: string]: string} = {};
              Object.entries(subData.answersMap).forEach(([qId, val]: [string, any]) => {
                loadedFeedbacks[qId] = val.feedback || '';
              });
              return loadedFeedbacks;
            }
            return prev;
          });
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
    if (score === '' || score < 0) {
      setGradeError('Skor EXP penilaian harus berupa angka 0 atau lebih.');
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
      const updatePayload: any = {
        status: nextStatus,
        reviewStatus: reviewStatus,
        score: Number(score),
        feedback: feedback.trim(),
        gradedAt: serverTimestamp()
      };

      if (assignment?.assignmentType === 'lms_composite' && submission?.answersMap) {
        const updatedAnswersMap = { ...submission.answersMap };
        questions.forEach(q => {
          const isAutoGradable = ['multiple_choice', 'true_false', 'matching', 'fill_blank'].includes(q.type);
          if (!isAutoGradable) {
            const earned = manualScores[q.id] !== undefined ? manualScores[q.id] : 0;
            updatedAnswersMap[q.id] = {
              ...(updatedAnswersMap[q.id] || {}),
              answer: submission.answersMap?.[q.id]?.answer || '',
              pointsEarned: earned,
              status: earned === q.points ? 'correct' : earned === 0 ? 'incorrect' : 'correct',
              feedback: questionFeedbacks[q.id] || ''
            };
          } else {
            updatedAnswersMap[q.id] = {
              ...(updatedAnswersMap[q.id] || {}),
              feedback: questionFeedbacks[q.id] || ''
            };
          }
        });
        updatePayload.answersMap = updatedAnswersMap;
        updatePayload.totalPointsEarned = autoScore + manualScore;
      }

      // Update submission with grade, feedback, reviewStatus, and timestamp in Firestore
      await updateDoc(doc(db, 'submissions', submissionId), updatePayload);
      
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
    <div className="min-h-screen bg-[#171A21] text-white p-4 sm:p-6 lg:p-8 w-full font-sans" id="submission-detail-page">
      {/* Back Header */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <button
          onClick={handleBack}
          className="h-[36px] px-3 bg-black/40 hover:bg-white/10 text-white border border-white/20 text-xs font-bold uppercase rounded-[2px] flex items-center justify-center cursor-pointer transition-all"
          style={{ minWidth: '36px' }}
          aria-label="Kembali"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Detail Lembar Jawaban & Penilaian</span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            {submission?.assignmentTitle || 'Memuat...'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-[2px] text-xs text-red-200 flex items-center gap-2 mt-6">
          <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-6 animate-pulse mt-8">
          <div className="h-44 bg-[#2F3138] border border-white/10 rounded-[3px]" />
          <div className="h-64 bg-[#2F3138] border border-white/10 rounded-[3px]" />
        </div>
      ) : submission ? (
        <div className="space-y-8 mt-8">
          {/* Submission and Student Information */}
          <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 lg:p-8 space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 border border-white/20">
                  <img 
                    src={studentPhotoURL || '/aset/default-avatar.svg'} 
                    alt={submission.studentName} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/aset/default-avatar.svg';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{submission.studentName}</h3>
                  <p className="text-[10px] text-[#8A8A8A] mt-0.5">Dikirimkan oleh siswa</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border ${
                  submission.status === 'graded' 
                    ? submission.reviewStatus === 'correct'
                      ? 'bg-[#A1CD44]/20 text-[#A1CD44] border-[#A1CD44]/40'
                      : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                    : submission.status === 'remedial'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-[#66C0F4]/20 text-[#66C0F4] border-[#66C0F4]/40'
                }`}>
                  {submission.status === 'graded' 
                    ? submission.reviewStatus === 'correct' 
                      ? 'SELESAI (TEPAT)' 
                      : 'SELESAI (KURANG TEPAT)' 
                    : submission.status === 'remedial'
                      ? 'REMEDIAL / PERLU PERBAIKAN'
                      : 'MENUNGGU PENILAIAN'}
                </span>
                
                <span className="text-[10px] text-[#8A8A8A] flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {submission.submittedAt ? new Date(submission.submittedAt.seconds * 1000).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}) : 'Baru saja'}
                </span>
              </div>
            </div>

            {/* Answer Content Display */}
            <div className="space-y-4 bg-black/40 p-6 rounded-[2px] border border-white/10 text-white">
              <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">
                Jawaban & Lembar Kerja Siswa:
              </span>

              {/* 1. LMS Composite Question rendering */}
              {assignment?.assignmentType === 'lms_composite' && (
                <div className="space-y-5">
                  <div className="p-4 bg-black/40 border border-[#66C0F4]/30 rounded-[2px] text-xs text-white space-y-1">
                    <p className="font-bold text-[#66C0F4]">Ujian Berbasis LMS Composite</p>
                    <p className="text-[11px] text-[#C6D4DF]">
                      Menampilkan lembar pengerjaan interaktif yang dikirimkan oleh siswa di bawah ini.
                    </p>
                  </div>

                  {questions.length > 0 ? (
                    <div className="space-y-6">
                      {questions.map((q, idx) => {
                        const studentAns = getStudentAnswerForQuestion(q.id);
                        
                        return (
                          <div key={q.id} className="p-5 bg-[#2F3138] border border-white/10 rounded-[3px] space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
                            {/* Question Header */}
                            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-5.5 h-5.5 rounded-[2px] bg-[#66C0F4]/20 text-[#66C0F4] text-xs font-bold flex items-center justify-center font-mono">
                                  {idx + 1}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
                                  {q.type?.replace('_', ' ') || 'Pertanyaan'}
                                </span>
                              </div>
                              {isTeacher && (
                                <span className="text-[10px] font-bold text-[#66C0F4] bg-[#66C0F4]/15 px-2 py-0.5 rounded-[2px] font-mono border border-[#66C0F4]/30">
                                  {q.points || 10} Poin
                                </span>
                              )}
                            </div>

                            {/* Question prompt */}
                            <p className="text-xs font-bold text-white leading-relaxed whitespace-pre-wrap">
                              {q.question}
                            </p>

                            {/* Detailed Answers depending on question type */}
                            {q.type === 'multiple_choice' && q.choices && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Opsi Pilihan:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {q.choices.map((choice: string, cIdx: number) => {
                                    const optLetter = String.fromCharCode(65 + cIdx);
                                    const isStudentChoice = studentAns === optLetter;
                                    const isCorrect = q.correctAnswer === optLetter;

                                    return (
                                      <div
                                        key={cIdx}
                                        className={`p-3 rounded-[2px] border flex items-center gap-3 transition-all ${
                                          (isTeacher && isCorrect)
                                            ? 'bg-[#A1CD44]/20 border-[#A1CD44] text-white'
                                            : isStudentChoice
                                              ? 'bg-[#66C0F4]/20 border-[#66C0F4] text-white'
                                              : 'bg-black/40 border-white/10 text-[#C6D4DF]'
                                        }`}
                                      >
                                        <span className={`w-5 h-5 rounded-[2px] flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                                          (isTeacher && isCorrect)
                                            ? 'bg-[#A1CD44] text-[#171A21]'
                                            : isStudentChoice
                                              ? 'bg-[#66C0F4] text-[#171A21]'
                                              : 'bg-black/60 text-[#8A8A8A]'
                                        }`}>
                                          {optLetter}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold truncate text-white">{choice}</p>
                                          {isTeacher && isCorrect && (
                                            <span className="text-[9px] font-bold text-[#A1CD44] uppercase tracking-wide block mt-0.5">Jawaban Benar</span>
                                          )}
                                          {isStudentChoice && (!isTeacher || !isCorrect) && (
                                            <span className="text-[9px] font-bold text-[#66C0F4] uppercase tracking-wide block mt-0.5">Pilihan Siswa</span>
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
                                <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Jawaban:</span>
                                <div className="flex gap-3">
                                  {[
                                    { val: 'true', label: 'BENAR / TRUE' },
                                    { val: 'false', label: 'SALAH / FALSE' }
                                  ].map((option) => {
                                    const isStudentChoice = studentAns === option.val;
                                    const isCorrect = (q.correctAnswer || q.trueFalseCorrect) === option.val;

                                    return (
                                      <div
                                        key={option.val}
                                        className={`flex-1 py-3 px-4 rounded-[2px] border text-center text-xs font-bold ${
                                          (isTeacher && isCorrect)
                                            ? 'bg-[#A1CD44]/20 border-[#A1CD44] text-[#A1CD44]'
                                            : isStudentChoice
                                              ? 'bg-[#66C0F4]/20 border-[#66C0F4] text-[#66C0F4]'
                                              : 'bg-black/40 border-white/10 text-[#8A8A8A]'
                                        }`}
                                      >
                                        <p>{option.label}</p>
                                        {isTeacher && isCorrect && (
                                          <span className="text-[8px] font-bold text-[#A1CD44] uppercase tracking-wide block mt-1">Benar</span>
                                        )}
                                        {isStudentChoice && (!isTeacher || !isCorrect) && (
                                          <span className="text-[8px] font-bold text-[#66C0F4] uppercase tracking-wide block mt-1">Pilihan Siswa</span>
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
                                  <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Jawaban Siswa:</span>
                                  <div className="p-3 bg-black/40 border border-white/10 rounded-[2px] text-xs font-bold text-white">
                                    {studentAns || '(Kosong)'}
                                  </div>
                                </div>
                                {isTeacher && q.fillBlankAnswers && q.fillBlankAnswers.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-[#A1CD44] uppercase tracking-wider block">Kunci Jawaban Benar (Isian):</span>
                                    <div className="p-3 bg-[#A1CD44]/15 border border-[#A1CD44]/30 text-[#A1CD44] rounded-[2px] text-xs font-bold">
                                      {q.fillBlankAnswers.join(' / ')}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {(q.type === 'essay' || q.type === 'listening' || q.type === 'speaking') && (
                              <div className="space-y-3">
                                {q.type === 'listening' && q.audioUrl && (
                                  <div className="p-3 bg-black/40 border border-white/10 rounded-[2px] flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider">Audio Soal:</span>
                                    <audio src={q.audioUrl} controls className="h-6 flex-1" />
                                  </div>
                                )}
                                {q.type === 'speaking' && q.speakingPrompt && (
                                  <div className="p-3 bg-black/40 border border-white/10 rounded-[2px] text-xs font-semibold text-[#66C0F4]">
                                    Kalimat: "{q.speakingPrompt}"
                                  </div>
                                )}

                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Jawaban Siswa:</span>
                                  <div className="p-4.5 bg-black/40 border border-white/10 rounded-[2px] text-xs text-white font-normal whitespace-pre-wrap leading-relaxed">
                                    {studentAns || '(Siswa tidak mengisi jawaban)'}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Answer Rubric / Guide for Teacher grading */}
                            {q.answerGuide && q.answerGuide.trim() !== '' && isTeacher && (
                              <div className="p-3.5 bg-black/40 border border-[#A1CD44]/40 rounded-[2px] text-xs text-white space-y-1">
                                <span className="text-[9px] font-bold text-[#A1CD44] uppercase tracking-wider block">Panduan Koreksi / Rubrik Guru:</span>
                                <p className="italic font-normal leading-relaxed text-[#C6D4DF]">"{q.answerGuide}"</p>
                              </div>
                            )}

                            {/* Individual Question Scoring/Feedback */}
                            {isTeacher && (
                              <div className="pt-3.5 border-t border-white/10 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/40 p-3 rounded-[2px]">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    ['multiple_choice', 'true_false', 'matching', 'fill_blank'].includes(q.type)
                                      ? 'bg-[#A1CD44]'
                                      : 'bg-[#66C0F4]'
                                  }`} />
                                  <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider">
                                    {['multiple_choice', 'true_false', 'matching', 'fill_blank'].includes(q.type)
                                      ? 'Penilaian Otomatis (Objektif)'
                                      : 'Penilaian Manual (Subjektif)'
                                    }
                                  </span>
                                </div>

                                <div className="flex items-center gap-2.5">
                                  <span className="text-xs font-bold text-white">Skor Soal:</span>
                                  {['multiple_choice', 'true_false', 'matching', 'fill_blank'].includes(q.type) ? (
                                    <div className="px-3 py-1.5 bg-black/60 border border-white/15 rounded-[2px] text-xs font-bold text-[#66C0F4] font-mono">
                                      {(submission?.answersMap?.[q.id]?.pointsEarned || 0)} / {q.points || 0} Poin
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="number"
                                        min={0}
                                        max={q.points || 0}
                                        value={manualScores[q.id] !== undefined ? manualScores[q.id] : 0}
                                        onChange={(e) => {
                                          const val = e.target.value === '' ? 0 : Math.min(q.points || 0, Math.max(0, Number(e.target.value)));
                                          setManualScores(prev => ({
                                            ...prev,
                                            [q.id]: val
                                          }));
                                        }}
                                        className="w-16 px-2.5 py-1.5 bg-black/60 border border-white/20 rounded-[2px] text-xs font-bold text-[#66C0F4] font-mono text-center focus:outline-none focus:border-[#66C0F4]"
                                      />
                                      <span className="text-xs text-[#8A8A8A] font-medium font-sans">/ {q.points || 0} Poin</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Per-question feedback textarea (teacher only) */}
                            {isTeacher && (
                              <div className="border-t border-white/10 mt-1 pt-3 space-y-1.5">
                                <label className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">
                                  Komentar / Feedback Soal:
                                </label>
                                <textarea
                                  rows={2}
                                  value={questionFeedbacks[q.id] || ''}
                                  onChange={(e) => setQuestionFeedbacks(prev => ({ ...prev, [q.id]: e.target.value }))}
                                  className="block w-full px-3 py-2 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] resize-none"
                                  placeholder="Tulis komentar atau feedback untuk soal ini..."
                                />
                              </div>
                            )}

                            {/* Student Per-Question Feedback View */}
                            {!isTeacher && (submission.status === 'graded' || submission.status === 'remedial') && submission?.answersMap?.[q.id]?.feedback && (
                              <div className="pt-3.5 border-t border-white/10 mt-2 bg-black/40 p-3 rounded-[2px] space-y-1 text-white">
                                <span className="text-[10px] font-bold text-[#66C0F4] uppercase tracking-wider flex items-center gap-1.5">
                                  <MessageSquare className="w-3 h-3 text-[#66C0F4]" />
                                  Feedback Guru untuk Soal Ini
                                </span>
                                <p className="text-xs text-[#C6D4DF] leading-relaxed italic">
                                  "{submission.answersMap[q.id].feedback}"
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-[#8A8A8A] italic">
                      Memuat daftar pertanyaan kuis...
                    </div>
                  )}
                </div>
              )}

              {/* 2. Standard Multiple Choice Question rendering */}
              {assignment?.assignmentType === 'multiple_choice' && (
                <div className="space-y-4">
                  {assignment.question && (
                    <div className="p-4 bg-black/40 rounded-[2px] border border-white/10 text-white">
                      <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block mb-1">Pertanyaan Soal:</span>
                      <p className="text-xs font-bold text-white leading-relaxed">{assignment.question}</p>
                    </div>
                  )}

                  <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Opsi Pilihan Ganda & Jawaban Siswa:</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                      const choiceText = assignment.choices?.[opt] || '';
                      const isStudentChoice = submission.selectedChoice === opt || submission.answer?.startsWith(`Pilihan Terpilih: ${opt}`);
                      const isCorrect = assignment.correctChoice === opt;

                      return (
                        <div
                          key={opt}
                          className={`p-3.5 rounded-[2px] border flex items-center gap-3 ${
                            (isTeacher && isCorrect)
                              ? 'bg-[#A1CD44]/20 border-[#A1CD44] text-white font-semibold'
                              : isStudentChoice
                                ? 'bg-[#66C0F4]/20 border-[#66C0F4] text-white'
                                : 'bg-black/40 border-white/10 text-[#C6D4DF]'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-[2px] flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                            (isTeacher && isCorrect)
                              ? 'bg-[#A1CD44] text-[#171A21]'
                              : isStudentChoice
                                ? 'bg-[#66C0F4] text-[#171A21]'
                                : 'bg-black/60 text-[#8A8A8A]'
                          }`}>
                            {opt}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate text-white">{choiceText}</p>
                            {isTeacher && isCorrect && (
                              <span className="text-[9px] font-bold text-[#A1CD44] uppercase tracking-wide block mt-0.5">Jawaban Benar</span>
                            )}
                            {isStudentChoice && (!isTeacher || !isCorrect) && (
                              <span className="text-[9px] font-bold text-[#66C0F4] uppercase tracking-wide block mt-0.5">Pilihan Siswa</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Default: Standard Single Short Answer / Essay */}
              {(!assignment?.assignmentType || (assignment?.assignmentType !== 'lms_composite' && assignment?.assignmentType !== 'multiple_choice')) && (
                <div className="space-y-4">
                  {assignment?.question && (
                    <div className="p-4 bg-black/40 rounded-[2px] border border-white/10 text-white">
                      <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block mb-1">Soal / Pertanyaan:</span>
                      <p className="text-xs font-bold text-white leading-relaxed whitespace-pre-wrap">{assignment.question}</p>
                    </div>
                  )}
                  <div className="p-4 bg-black/40 border border-white/10 rounded-[2px] text-white">
                    <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block mb-1">Jawaban Siswa:</span>
                    <p className="text-xs text-white leading-relaxed whitespace-pre-wrap font-sans">
                      {submission.answer || '(Kosong)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grading Details or Input Panel */}
          <div className="bg-[#2F3138] border border-white/10 p-6 lg:p-8 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.5)] space-y-6 text-white">
            {(submission.status === 'graded' || submission.status === 'remedial') && !isTeacher ? (
              /* Student View: Graded / Remedial Details */
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <ClipboardCheck className="w-4 h-4 text-[#66C0F4]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Evaluasi & Hasil Penilaian
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Score */}
                  <div className="md:col-span-1 rounded-[2px] p-5 flex flex-col justify-between space-y-4 bg-black/40 border border-white/10 text-white">
                    <div className="w-8 h-8 bg-[#66C0F4]/15 rounded-[2px] flex items-center justify-center border border-[#66C0F4]/30">
                      <Award className="w-4 h-4 text-[#66C0F4]" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider block text-[#8A8A8A]">Total EXP Diperoleh</span>
                      <span className="text-3xl font-bold mt-1 block text-[#A1CD44] font-mono">
                        {submission.score !== null ? submission.score : '-'} <span className="text-xs font-sans font-bold uppercase text-white">EXP</span>
                      </span>
                    </div>
                  </div>

                  {/* Feedback comment */}
                  <div className="md:col-span-2 bg-black/40 border border-white/10 rounded-[2px] p-5 space-y-3 text-white">
                    <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#8A8A8A]" />
                      Umpan Balik Guru {submission.status === 'remedial' && '(Petunjuk Perbaikan)'}
                    </span>
                    <p className="text-xs text-[#C6D4DF] leading-relaxed italic whitespace-pre-wrap">
                      "{submission.feedback || 'Belum ada umpan balik tertulis.'}"
                    </p>
                  </div>
                </div>

                {submission.status === 'remedial' && (
                  <div className="p-4 bg-black/40 border border-orange-500/40 rounded-[2px] text-xs text-white space-y-2">
                    <p className="font-bold text-orange-400">⚠️ Anda Mendapat Remedial Untuk Tugas Ini</p>
                    <p className="text-[11px] text-[#C6D4DF] leading-relaxed">
                      Silakan baca catatan atau koreksi guru di atas, kemudian buka kembali lembar tugas ini untuk mengirimkan pengerjaan revisi Anda yang baru.
                    </p>
                    <button
                      onClick={() => onNavigate(`/assignment/${submission.assignmentId}`)}
                      className="h-[36px] px-4 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] font-bold rounded-[2px] text-xs uppercase cursor-pointer transition-all"
                    >
                      Perbaiki Jawaban Sekarang
                    </button>
                  </div>
                )}
              </div>
            ) : isTeacher ? (
              /* Teacher View: Live Grading Form / Edit Grade */
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Award className="w-4 h-4 text-[#66C0F4]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {submission.status === 'graded' || submission.status === 'remedial' ? 'Ubah Hasil Penilaian' : 'Berikan Penilaian & Masukan'}
                  </h3>
                </div>

                {gradeError && (
                  <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-[2px] text-xs text-red-200">
                    {gradeError}
                  </div>
                )}

                {/* Score Summary Panel */}
                {assignment?.assignmentType === 'lms_composite' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-black/40 border border-white/10 rounded-[2px] text-white">
                    <div className="bg-[#2F3138] p-3.5 rounded-[2px] border border-white/10 flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-[#8A8A8A] uppercase tracking-wider">Auto EXP (Objektif)</span>
                      <span className="text-xl font-bold text-[#66C0F4] font-mono mt-1">
                        {autoScore} <span className="text-xs text-[#8A8A8A] font-sans font-medium">/ {totalAutoPoints} EXP</span>
                      </span>
                    </div>
                    <div className="bg-[#2F3138] p-3.5 rounded-[2px] border border-white/10 flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-[#8A8A8A] uppercase tracking-wider">Manual EXP (Subjektif)</span>
                      <span className="text-xl font-bold text-[#66C0F4] font-mono mt-1">
                        {manualScore} <span className="text-xs text-[#8A8A8A] font-sans font-medium">/ {totalManualPoints} EXP</span>
                      </span>
                    </div>
                    <div className="bg-black/60 p-3.5 rounded-[2px] border border-[#A1CD44]/40 text-white flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-[#A1CD44] uppercase tracking-wider">Total Akumulasi EXP</span>
                      <span className="text-2xl font-bold font-mono mt-1 text-[#A1CD44]">
                        {calculatedTotalExp} <span className="text-xs text-[#C6D4DF] font-sans font-medium">/ {totalPossiblePoints} EXP</span>
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleGradeSubmission} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Score field */}
                    <div className="sm:col-span-1 space-y-1.5">
                      <label className="block text-xs font-bold text-white">
                        Skor EXP Siswa <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        disabled={assignment?.assignmentType === 'lms_composite'}
                        value={score}
                        onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                        className="block w-full px-4 py-3 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] font-mono font-bold"
                        placeholder="Masukkan total EXP"
                      />
                      {assignment?.assignmentType === 'lms_composite' && (
                        <p className="text-[10px] text-[#66C0F4] font-medium">
                          Dihitung otomatis berdasarkan akumulasi EXP di atas.
                        </p>
                      )}
                    </div>

                    {/* Status Review selection */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-white">
                        Hasil Review Tugas <span className="text-red-400">*</span>
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
                      <label className="block text-xs font-bold text-white">
                        Catatan & Umpan Balik Guru <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="block w-full px-4 py-3 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] resize-none"
                        placeholder="Tuliskan apresiasi, koreksi, atau panduan perbaikan remedial di sini..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                    <button
                      type="submit"
                      disabled={isGrading}
                      className="h-[40px] px-6 bg-[#A1CD44] hover:bg-[#86AE33] disabled:opacity-50 text-[#171A21] font-bold rounded-[2px] text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <CheckCircle className="w-4 h-4 text-[#171A21]" />
                      {isGrading ? 'Menyimpan Penilaian...' : (submission.status === 'graded' || submission.status === 'remedial') ? 'Ubah Nilai & Feedback' : 'Kirim Penilaian'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Student View: Unfinished Grading */
              <div className="p-6 text-center space-y-3 bg-black/40 border border-white/10 rounded-[2px]">
                <Clock className="w-8 h-8 text-[#66C0F4] mx-auto animate-pulse" />
                <p className="text-xs font-bold text-white uppercase">Menunggu Penilaian Pengajar</p>
                <p className="text-[11px] text-[#C6D4DF] leading-relaxed max-w-sm mx-auto">
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
