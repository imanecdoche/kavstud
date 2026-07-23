import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Send, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Play,
  Volume2,
  Mic,
  UploadCloud,
  Check,
  X,
  Plus
} from 'lucide-react';
import { Assignment, Question, UserProfile, Submission } from '../types';
import CustomDropdown from './CustomDropdown';

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
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | 'C' | 'D' | ''>('');
  const [multiAnswers, setMultiAnswers] = useState<string[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // LMS Composite specific states
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answersMap, setAnswersMap] = useState<{[questionId: string]: string}>({});
  const [recordingStates, setRecordingStates] = useState<{[questionId: string]: boolean}>({});
  const [isEditingResubmit, setIsEditingResubmit] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      onNavigate('/login');
      return;
    }

    // Load User Profile (one-time)
    getDoc(doc(db, 'users', user.uid)).then((userDoc) => {
      if (userDoc.exists()) {
        setCurrentUserProfile(userDoc.data() as UserProfile);
      }
    }).catch(err => console.error("Error loading user profile:", err));

    let unsubscribeQuestions: (() => void) | null = null;

    // Listen to assignment details in real-time
    const unsubscribeAssign = onSnapshot(doc(db, 'assignments', assignmentId), (docSnap) => {
      if (docSnap.exists()) {
        const assignData = { id: docSnap.id, ...docSnap.data() } as Assignment;
        setAssignment(assignData);
        if (assignData.subQuestions) {
          setMultiAnswers(prev => prev.length === assignData.subQuestions!.length ? prev : new Array(assignData.subQuestions!.length).fill(''));
        }

        if (assignData.assignmentType === 'lms_composite') {
          let masterId = assignmentId;
          const parts = assignmentId.split('_');
          
          if (assignData.masterId) {
            masterId = assignData.masterId;
          } else if (parts.length >= 3) {
            masterId = `${parts[0]}_${parts[1]}`;
          } else if (parts.length === 2) {
            if (parts[0] === 'lms') {
              masterId = assignmentId;
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
              
              // Initialize/merge answersMap
              setAnswersMap(prev => {
                const updated = { ...prev };
                loadedQuestions.forEach(q => {
                  if (updated[q.id] === undefined) {
                    updated[q.id] = '';
                  }
                });
                return updated;
              });
              setLoading(false);
            }, (err) => {
              console.error("Error listening to questions:", err);
              setError('Gagal memuat pertanyaan.');
              setLoading(false);
            }
          );
        } else {
          setLoading(false);
        }
      } else {
        setError('Tugas tidak ditemukan.');
        setLoading(false);
      }
    }, (err) => {
      console.error("Error listening to assignment:", err);
      setError('Gagal memuat detail tugas.');
      setLoading(false);
    });

    // Listen to submission status in real-time
    const unsubscribeSub = onSnapshot(doc(db, 'submissions', assignmentId), (docSnap) => {
      if (docSnap.exists()) {
        setExistingSubmission({ id: docSnap.id, ...docSnap.data() } as Submission);
      } else {
        setExistingSubmission(null);
      }
    });

    return () => {
      unsubscribeAssign();
      if (unsubscribeQuestions) {
        unsubscribeQuestions();
      }
      unsubscribeSub();
    };
  }, [assignmentId, onNavigate]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let answerText = '';
    let payload: any = {
      assignmentId: assignmentId,
      assignmentTitle: assignment?.title || '',
      studentId: currentUserProfile?.uid || '',
      studentName: currentUserProfile?.fullName || '',
      status: 'submitted',
      score: null,
      feedback: null,
      submittedAt: serverTimestamp(),
      gradedAt: null
    };

    if (assignment?.assignmentType === 'lms_composite') {
      const finalAnswersMap: any = {};
      let unansweredCount = 0;
      let autoScoreEarned = 0;

      questions.forEach(q => {
        const studentAns = (answersMap[q.id] || '').trim();
        if (!studentAns) {
          unansweredCount++;
        }

        let pointsEarned = 0;
        let status: 'correct' | 'incorrect' | 'pending' = 'pending';
        let feedback = '';

        // Auto-gradable types: 'multiple_choice' | 'true_false' | 'matching' | 'fill_blank'
        if (q.type === 'multiple_choice') {
          if (q.correctAnswer && studentAns) {
            const correctLetter = String.fromCharCode(65 + Number(q.correctAnswer));
            if (studentAns.toUpperCase() === correctLetter.toUpperCase()) {
              status = 'correct';
              pointsEarned = q.points || 0;
            } else {
              status = 'incorrect';
              pointsEarned = 0;
            }
          } else {
            status = 'incorrect';
            pointsEarned = 0;
          }
        } else if (q.type === 'true_false') {
          const correctTF = q.correctAnswer || q.trueFalseCorrect;
          if (correctTF && studentAns) {
            if (studentAns.toLowerCase() === correctTF.toLowerCase()) {
              status = 'correct';
              pointsEarned = q.points || 0;
            } else {
              status = 'incorrect';
              pointsEarned = 0;
            }
          } else {
            status = 'incorrect';
            pointsEarned = 0;
          }
        } else if (q.type === 'matching') {
          if (q.matchingPairs && q.matchingPairs.length > 0 && studentAns) {
            const currentAnswersList = studentAns.split(',');
            const studentMatchingMap: {[left: string]: string} = {};
            currentAnswersList.forEach(item => {
              const [l, r] = item.split('::');
              if (l) studentMatchingMap[l.trim()] = (r || '').trim();
            });

            const isAllCorrect = q.matchingPairs.every(pair => {
              const studentRight = studentMatchingMap[pair.left.trim()];
              return studentRight && studentRight.toLowerCase() === pair.right.trim().toLowerCase();
            });

            if (isAllCorrect) {
              status = 'correct';
              pointsEarned = q.points || 0;
            } else {
              status = 'incorrect';
              pointsEarned = 0;
            }
          } else {
            status = 'incorrect';
            pointsEarned = 0;
          }
        } else if (q.type === 'fill_blank') {
          if (q.fillBlankAnswers && q.fillBlankAnswers.length > 0 && studentAns) {
            const isMatched = q.fillBlankAnswers.some(ans => ans.trim().toLowerCase() === studentAns.toLowerCase());
            if (isMatched) {
              status = 'correct';
              pointsEarned = q.points || 0;
            } else {
              status = 'incorrect';
              pointsEarned = 0;
            }
          } else {
            status = 'incorrect';
            pointsEarned = 0;
          }
        } else {
          // Subjective/manual graded: 'essay', 'listening', 'speaking', 'file_upload'
          status = 'pending';
          pointsEarned = 0;
        }

        if (status === 'correct' || status === 'incorrect') {
          autoScoreEarned += pointsEarned;
        }

        finalAnswersMap[q.id] = {
          answer: studentAns,
          pointsEarned: pointsEarned,
          status: status,
          feedback: feedback
        };
      });

      if (assignment?.settings?.requireAll && unansweredCount > 0) {
        setSubmitError(`Harap jawab seluruh ${unansweredCount} pertanyaan yang masih kosong.`);
        return;
      }

      payload.answersMap = finalAnswersMap;
      payload.totalPossiblePoints = assignment.totalPoints || questions.reduce((sum, q) => sum + (q.points || 0), 0);
      payload.totalPointsEarned = autoScoreEarned;
      answerText = `Kuis LMS Composite: ${questions.length} Soal dikirimkan.`;
    } else if (assignment?.assignmentType === 'multiple_choice') {
      if (!selectedChoice) {
        setSubmitError('Pilih salah satu jawaban.');
        return;
      }
      answerText = `Pilihan Terpilih: ${selectedChoice}. ${assignment.choices?.[selectedChoice]}`;
      payload.selectedChoice = selectedChoice;
      
      // Auto-grade standard multiple choice
      const isCorrect = selectedChoice === assignment.correctChoice;
      const maxExp = assignment.totalPoints || 100;
      payload.score = isCorrect ? maxExp : 0;
      payload.reviewStatus = isCorrect ? 'correct' : 'incorrect';
      payload.feedback = isCorrect ? 'Sistem: Jawaban Benar (Otomatis)' : 'Sistem: Jawaban Salah (Otomatis)';
    } else if (assignment?.assignmentType === 'multi_short_answer') {
      if (multiAnswers.some(ans => !ans.trim())) {
        setSubmitError('Semua bagian pertanyaan wajib dijawab.');
        return;
      }
      answerText = multiAnswers.map((ans, idx) => `Jawaban #${idx + 1}:\n${ans}`).join('\n\n');
      payload.answers = multiAnswers;
    } else {
      if (!answer.trim()) {
        setSubmitError('Jawaban tidak boleh kosong.');
        return;
      }
      answerText = answer.trim();
    }

    payload.answer = answerText;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create or set the submission in Firestore
      // Document ID matches the assignment ID for direct correlation
      await setDoc(doc(db, 'submissions', assignmentId), payload);

      // Update assignment status to 'review' as requested
      await setDoc(doc(db, 'assignments', assignmentId), {
        status: 'review'
      }, { merge: true });

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
    <div className="min-h-screen bg-[#171A21] text-white p-4 sm:p-6 lg:p-8 w-full" id="assignment-detail-page">
      {/* Back button header */}
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
          <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Detail Lembar Tugas</span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            {assignment?.title || 'Loading...'}
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
          <div className="h-40 bg-[#2F3138] border border-white/10 rounded-[3px]" />
          <div className="h-64 bg-[#2F3138] border border-white/10 rounded-[3px]" />
        </div>
      ) : assignment ? (
        <div className="space-y-8 mt-8">
          {/* Assignment Information Card */}
          <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 lg:p-8 space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
            <div className="flex items-center gap-3.5 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#66C0F4]/15 border border-[#66C0F4]/40 text-[#66C0F4] rounded-[2px] text-[10px] font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                Lembar Soal
              </div>
              <span className="text-xs text-[#C6D4DF] font-medium">
                Dibuat oleh: <span className="font-bold text-white">{assignment.teacherName}</span>
              </span>
            </div>

            {/* Assignment Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-black/40 border border-white/10 rounded-[2px] text-xs text-white">
              {assignment.deadline && (
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Tenggat Waktu</span>
                  <span className="font-bold text-white">{assignment.deadline}</span>
                </div>
              )}
              {assignment.estimatedDuration && (
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Durasi</span>
                  <span className="font-bold text-white">{assignment.estimatedDuration} Menit</span>
                </div>
              )}
              {(assignment.totalQuestions !== undefined || questions.length > 0) && (
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Total Soal</span>
                  <span className="font-bold text-white">{assignment.totalQuestions || questions.length} Soal</span>
                </div>
              )}
              {(assignment.totalPoints !== undefined || questions.length > 0) && (
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Total Bobot</span>
                  <span className="font-bold text-white">
                    {assignment.totalPoints || questions.reduce((sum, q) => sum + (q.points || 0), 0)} Poin
                  </span>
                </div>
              )}
              {assignment.difficulty && (
                <div className="space-y-0.5 col-span-2 md:col-span-1">
                  <span className="text-[9px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Tingkat Kesulitan</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/40">
                    {assignment.difficulty}
                  </span>
                </div>
              )}
            </div>

            {assignment.description && (
              <div className="space-y-2 bg-black/40 p-5 rounded-[2px] border border-white/10 text-white">
                <span className="text-[10px] font-bold text-[#66C0F4] uppercase tracking-wider block">Petunjuk Pengerjaan:</span>
                <p className="text-xs font-normal text-[#C6D4DF] leading-relaxed whitespace-pre-wrap">
                  {assignment.description}
                </p>
              </div>
            )}

            {assignment.question && (!assignment.description || assignment.question !== assignment.description) && (
              <div className="space-y-2 bg-black/40 p-5 rounded-[2px] border border-white/10 text-white">
                <span className="text-[10px] font-bold text-[#66C0F4] uppercase tracking-wider block">Pertanyaan / Instruksi Guru:</span>
                <p className="text-xs font-normal text-[#C6D4DF] leading-relaxed whitespace-pre-wrap">
                  {assignment.question}
                </p>
              </div>
            )}
          </div>

          {/* Student Answer Panel / Submission Status */}
          {currentUserProfile?.role === 'student' && (
            <div className="bg-[#2F3138] border border-white/10 p-6 sm:p-8 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.5)] space-y-6 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#66C0F4]" />
                  Lembar Jawaban Anda
                </h3>
                {existingSubmission && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border ${
                    existingSubmission.status === 'graded' 
                      ? 'bg-[#A1CD44]/20 text-[#A1CD44] border-[#A1CD44]/40' 
                      : existingSubmission.status === 'remedial'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                        : 'bg-[#66C0F4]/20 text-[#66C0F4] border-[#66C0F4]/40'
                  }`}>
                    {existingSubmission.status === 'graded' 
                      ? 'Sudah Dinilai' 
                      : existingSubmission.status === 'remedial'
                        ? 'Harus Remedial'
                        : 'Sudah Terkirim'}
                  </span>
                )}
              </div>

              {existingSubmission && existingSubmission.status !== 'remedial' && !isEditingResubmit ? (
                /* Already Submitted View */
                <div className="space-y-4">
                  <div className="p-4 bg-black/40 border border-[#A1CD44]/40 rounded-[2px] text-xs text-white flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-[#A1CD44] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#A1CD44]">Jawaban telah terkirim!</p>
                      <p className="text-[11px] mt-0.5 text-[#C6D4DF] leading-relaxed">
                        Anda telah mengirimkan jawaban tugas ini. Klik tombol di bawah untuk melihat detail skor dan tanggapan guru secara real-time.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onNavigate(`/submission/${assignmentId}`)}
                      className="w-full sm:w-auto h-[40px] px-5 bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] rounded-[2px] text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      Buka Detail Submisi & Nilai
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>

                    {assignment?.settings?.allowResubmission && (
                      <button
                        type="button"
                        onClick={() => {
                          if (existingSubmission) {
                            if (existingSubmission.answersMap) {
                              const newMap: {[key: string]: string} = {};
                              Object.entries(existingSubmission.answersMap).forEach(([qId, val]: [string, any]) => {
                                newMap[qId] = typeof val === 'object' ? (val.answer || '') : val;
                              });
                              setAnswersMap(prev => ({ ...prev, ...newMap }));
                            }
                            if (existingSubmission.answer) {
                              setAnswer(existingSubmission.answer);
                            }
                            if (existingSubmission.selectedChoice) {
                              setSelectedChoice(existingSubmission.selectedChoice as any);
                            }
                            if (existingSubmission.answers) {
                              setMultiAnswers(existingSubmission.answers);
                            }
                          }
                          setIsEditingResubmit(true);
                        }}
                        className="w-full sm:w-auto h-[40px] px-5 bg-black/40 hover:bg-white/10 text-white border border-white/20 rounded-[2px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Plus className="w-4 h-4 text-[#66C0F4]" />
                        Kirim Ulang / Perbarui Jawaban
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Form to write answer */
                <div className="space-y-5">
                  {existingSubmission?.status === 'remedial' && (
                    <div className="p-4.5 bg-black/40 border border-orange-500/40 rounded-[2px] space-y-2 text-white">
                      <div className="flex items-center gap-2 text-orange-400">
                        <AlertCircle className="w-4.5 h-4.5" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Tugas Perlu Perbaikan (Remedial)</h4>
                      </div>
                      <p className="text-xs text-[#C6D4DF] leading-relaxed">
                        Guru meminta Anda untuk memperbaiki jawaban tugas ini. Silakan baca catatan umpan balik di bawah, lalu kirim ulang jawaban terbaik Anda.
                      </p>
                      {existingSubmission.feedback && (
                        <div className="p-3 bg-black/60 border border-orange-500/30 rounded-[2px] text-xs text-[#C6D4DF] font-medium">
                          <strong className="text-[10px] text-orange-400 uppercase block mb-1">Catatan Guru:</strong>
                          "{existingSubmission.feedback}"
                        </div>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmitAnswer} className="space-y-5">
                  {submitError && (
                    <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-[2px] text-xs text-red-200">
                      {submitError}
                    </div>
                  )}

                  {/* LMS Composite Form Rendering */}
                  {assignment.assignmentType === 'lms_composite' && questions.length > 0 && (
                    <div className="space-y-6">
                      <div className="bg-black/40 border border-white/10 p-4 rounded-[2px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-white">
                        <div className="text-xs">
                          <p className="font-bold text-white">Ujian Berbasis LMS</p>
                          <p className="text-[#8A8A8A] mt-0.5">Total Pertanyaan: {questions.length} | Total Bobot: {assignment.totalPoints || questions.reduce((sum, q) => sum + q.points, 0)} Poin</p>
                        </div>
                        {assignment.estimatedDuration && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#66C0F4]/15 border border-[#66C0F4]/30 rounded-[2px] text-xs font-bold text-[#66C0F4]">
                            <Clock className="w-3.5 h-3.5" />
                            Durasi: {assignment.estimatedDuration} Menit
                          </span>
                        )}
                      </div>

                      {questions.map((q, idx) => {
                        const studentAnswer = answersMap[q.id] || '';
                        
                        return (
                          <div key={q.id} className="p-6 bg-black/40 border border-white/10 rounded-[3px] space-y-4 text-white relative">
                            {/* Question Header */}
                            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-[2px] bg-[#66C0F4]/20 text-[#66C0F4] text-xs font-bold flex items-center justify-center font-mono">
                                  {idx + 1}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-[#8A8A8A] tracking-wider">
                                  {q.type.replace('_', ' ')}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-[#66C0F4] bg-[#66C0F4]/15 px-2 py-0.5 rounded-[2px] font-mono border border-[#66C0F4]/30">
                                {q.points || 10} Poin
                              </span>
                            </div>

                            {/* Question Body */}
                            <p className="text-xs font-bold text-white leading-relaxed whitespace-pre-wrap">
                              {q.question}
                            </p>

                            {/* 1. Essay Type Input */}
                            {q.type === 'essay' && (
                              <textarea
                                required={assignment.settings?.requireAll}
                                rows={4}
                                value={studentAnswer}
                                onChange={(e) => setAnswersMap({ ...answersMap, [q.id]: e.target.value })}
                                placeholder="Ketik jawaban esai Anda di sini..."
                                className="block w-full px-4 py-3 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] font-sans resize-none"
                              />
                            )}

                            {/* 2. Multiple Choice Type Input */}
                            {q.type === 'multiple_choice' && q.choices && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                {q.choices.map((choice, cIdx) => {
                                  const optLetter = String.fromCharCode(65 + cIdx);
                                  const isSelected = studentAnswer === optLetter;

                                  return (
                                    <button
                                      key={cIdx}
                                      type="button"
                                      onClick={() => setAnswersMap({ ...answersMap, [q.id]: optLetter })}
                                      className={`p-3.5 rounded-[2px] border text-left flex items-center gap-3 transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-[#66C0F4]/20 border-[#66C0F4] text-white' 
                                          : 'bg-black/40 border-white/15 text-[#C6D4DF] hover:bg-white/5'
                                      }`}
                                    >
                                      <span className={`w-5.5 h-5.5 rounded-[2px] flex items-center justify-center text-[10px] font-bold font-mono ${
                                        isSelected ? 'bg-[#66C0F4] text-[#171A21]' : 'bg-black/60 text-[#8A8A8A]'
                                      }`}>
                                        {optLetter}
                                      </span>
                                      <span className="text-xs font-semibold text-white">{choice}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* 3. True or False Type Input */}
                            {q.type === 'true_false' && (
                              <div className="flex gap-3 pt-1">
                                {[
                                  { val: 'true', label: 'BENAR / TRUE' },
                                  { val: 'false', label: 'SALAH / FALSE' }
                                ].map((option) => {
                                  const isSelected = studentAnswer === option.val;
                                  return (
                                    <button
                                      key={option.val}
                                      type="button"
                                      onClick={() => setAnswersMap({ ...answersMap, [q.id]: option.val })}
                                      className={`flex-1 py-3 px-4 rounded-[2px] border text-center text-xs font-bold transition-all cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#66C0F4]/20 border-[#66C0F4] text-[#66C0F4]'
                                          : 'bg-black/40 text-[#C6D4DF] border-white/15 hover:bg-white/5'
                                      }`}
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* 4. Fill Blank Input */}
                            {q.type === 'fill_blank' && (
                              <input
                                type="text"
                                value={studentAnswer}
                                onChange={(e) => setAnswersMap({ ...answersMap, [q.id]: e.target.value })}
                                placeholder="Tulis isian jawaban singkat Anda di sini..."
                                className="block w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Single Answer field */}
                  {(!assignment.assignmentType || assignment.assignmentType === 'short_answer') && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-white">
                          Tulis Jawaban <span className="text-red-400">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsPreviewMode(!isPreviewMode)}
                          disabled={!answer.trim()}
                          className="text-[11px] text-[#66C0F4] hover:underline font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {isPreviewMode ? 'Kembali Edit' : 'Pratinjau Jawaban'}
                        </button>
                      </div>

                      {isPreviewMode ? (
                        <div className="p-4 min-h-[160px] bg-black/40 border border-dashed border-white/20 rounded-[2px] text-xs text-white leading-relaxed whitespace-pre-wrap font-sans">
                          {answer}
                        </div>
                      ) : (
                        <textarea
                          required
                          rows={8}
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="block w-full px-4 py-3 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] resize-none font-sans"
                          placeholder="Ketik seluruh jawaban esai Anda secara lengkap dan teliti di sini..."
                        />
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-[40px] px-6 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold uppercase tracking-wider rounded-[2px] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Mengirim Jawaban...' : 'Kirim Jawaban Tugas'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
            </div>
          )}

          {/* Teacher View Details Info */}
          {currentUserProfile?.role === 'teacher' && (
            <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 lg:p-8 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-white">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Status Tugas Siswa
              </h3>

              {existingSubmission ? (
                <div className="p-4 bg-black/40 border border-[#66C0F4]/40 rounded-[2px] flex items-center justify-between gap-4 flex-wrap text-white">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#66C0F4]">Siswa telah merespon tugas ini!</p>
                    <p className="text-[11px] font-normal text-[#C6D4DF]">Klik tombol di samping untuk segera memberikan penilaian dan umpan balik.</p>
                  </div>
                  <button
                    onClick={() => onNavigate(`/submission/${assignmentId}`)}
                    className="h-[36px] px-5 bg-[#66C0F4] hover:bg-[#5DADE2] text-[#171A21] font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-md cursor-pointer transition-all"
                  >
                    Buka Submisi Siswa
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-black/40 border border-white/10 rounded-[2px] text-xs font-normal text-[#C6D4DF]">
                  Siswa <span className="font-bold text-white">{assignment.studentName}</span> belum mengirimkan jawaban esai untuk tugas ini.
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
