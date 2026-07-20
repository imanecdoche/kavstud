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
      payload.score = isCorrect ? 100 : 0;
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-3 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto" id="assignment-detail-page">
      {/* Back button header */}
      <div className="flex items-center gap-4 border-b border-gray-100 dark:border-slate-700/50 pb-6">
        <button
          onClick={handleBack}
          className="btn-duo-slate p-2.5 flex items-center justify-center cursor-pointer"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-slate-200" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Detail Lembar Tugas</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
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
          <div className="h-40 bg-gray-200 dark:bg-slate-600/60 rounded-3xl" />
          <div className="h-64 bg-gray-200 dark:bg-slate-600/60 rounded-3xl" />
        </div>
      ) : assignment ? (
        <div className="space-y-8 mt-8">
          {/* Assignment Information Card */}
          <div className="card-duo p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex items-center gap-3.5 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 rounded-full border border-sky-200 text-[10px] font-extrabold uppercase">
                <BookOpen className="w-3.5 h-3.5" />
                Lembar Soal
              </div>
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                Dibuat oleh: <span className="font-extrabold text-gray-800 dark:text-slate-100">{assignment.teacherName}</span>
              </span>
            </div>

            {/* Assignment Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4.5 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 border-b-4 border-gray-300 dark:border-slate-600 rounded-2xl text-xs">
              {assignment.deadline && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tenggat Waktu</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{assignment.deadline}</span>
                </div>
              )}
              {assignment.estimatedDuration && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Durasi</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{assignment.estimatedDuration} Menit</span>
                </div>
              )}
              {(assignment.totalQuestions !== undefined || questions.length > 0) && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Soal</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{assignment.totalQuestions || questions.length} Soal</span>
                </div>
              )}
              {(assignment.totalPoints !== undefined || questions.length > 0) && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Bobot</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">
                    {assignment.totalPoints || questions.reduce((sum, q) => sum + (q.points || 0), 0)} Poin
                  </span>
                </div>
              )}
              {assignment.difficulty && (
                <div className="space-y-0.5 col-span-2 md:col-span-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tingkat Kesulitan</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    assignment.difficulty === 'Mudah'
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : assignment.difficulty === 'Sedang'
                        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border border-amber-100 dark:border-amber-800/50'
                        : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {assignment.difficulty}
                  </span>
                </div>
              )}
            </div>

            {assignment.description && (
              <div className="space-y-3 bg-gray-50 dark:bg-slate-900 p-5 rounded-2xl border-2 border-gray-200 dark:border-slate-700 border-b-4 border-gray-300 dark:border-slate-600">
                <span className="text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-wider block">Petunjuk Pengerjaan:</span>
                <p className="text-xs font-semibold text-gray-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                  {assignment.description}
                </p>
              </div>
            )}

            {assignment.question && (!assignment.description || assignment.question !== assignment.description) && (
              <div className="space-y-3 bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pertanyaan / Instruksi Guru:</span>
                <p className="text-xs text-gray-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {assignment.question}
                </p>
              </div>
            )}
          </div>

          {/* Student Answer Panel / Submission Status */}
          {currentUserProfile?.role === 'student' && (
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 sm:p-8 rounded-3xl shadow-3xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-indigo-500" />
                  Lembar Jawaban Anda
                </h3>
                {existingSubmission && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    existingSubmission.status === 'graded' 
                      ? 'bg-green-50 text-green-700 border border-green-100' 
                      : existingSubmission.status === 'remedial'
                        ? 'bg-orange-50 text-orange-700 border border-orange-100'
                        : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border border-amber-100 dark:border-amber-800/50'
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
                  <div className="p-4 bg-green-50/50 border border-green-100 rounded-2xl text-xs text-green-700 flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Jawaban telah terkirim!</p>
                      <p className="text-[11px] mt-0.5 text-green-600/90 leading-relaxed">
                        Anda telah mengirimkan jawaban tugas ini. Klik tombol di bawah untuk melihat detail skor dan tanggapan guru secara real-time.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onNavigate(`/submission/${assignmentId}`)}
                      className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      style={{ minHeight: '44px' }}
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
                        className="w-full sm:w-auto px-5 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        style={{ minHeight: '44px' }}
                      >
                        <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Kirim Ulang / Perbarui Jawaban
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Form to write answer (or remedial retry form) */
                <div className="space-y-5">
                  {existingSubmission?.status === 'remedial' && (
                    <div className="p-4.5 bg-orange-50/50 border border-orange-200/50 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-orange-800">
                        <AlertCircle className="w-4.5 h-4.5" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Tugas Perlu Perbaikan (Remedial)</h4>
                      </div>
                      <p className="text-xs text-orange-700 leading-relaxed">
                        Guru meminta Anda untuk memperbaiki jawaban tugas ini. Silakan baca catatan umpan balik di bawah, lalu kirim ulang jawaban terbaik Anda.
                      </p>
                      {existingSubmission.feedback && (
                        <div className="p-3 bg-white dark:bg-slate-800/80 border border-orange-100 rounded-xl text-xs text-gray-700 dark:text-slate-200 font-medium">
                          <strong className="text-[10px] text-orange-800 uppercase block mb-1">Catatan Guru:</strong>
                          "{existingSubmission.feedback}"
                        </div>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmitAnswer} className="space-y-5">
                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600">
                      {submitError}
                    </div>
                  )}

                  {/* LMS Composite Form Rendering */}
                  {assignment.assignmentType === 'lms_composite' && questions.length > 0 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-xs">
                          <p className="font-bold text-gray-800 dark:text-slate-100">Ujian Berbasis LMS</p>
                          <p className="text-gray-400 mt-0.5">Total Pertanyaan: {questions.length} | Total Bobot: {assignment.totalPoints || questions.reduce((sum, q) => sum + q.points, 0)} Poin</p>
                        </div>
                        {assignment.estimatedDuration && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-xl text-xs font-bold text-indigo-700">
                            <Clock className="w-3.5 h-3.5" />
                            Durasi: {assignment.estimatedDuration} Menit
                          </span>
                        )}
                      </div>

                      {questions.map((q, idx) => {
                        const studentAnswer = answersMap[q.id] || '';
                        
                        return (
                          <div key={q.id} className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl space-y-4 shadow-3xs relative">
                            {/* Question Header */}
                            <div className="flex items-start justify-between gap-4 border-b border-gray-50 pb-3">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 text-xs font-bold flex items-center justify-center font-mono">
                                  {idx + 1}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                  {q.type.replace('_', ' ')}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30/50 px-2 py-0.5 rounded-md font-mono">
                                {q.points || 10} Poin
                              </span>
                            </div>

                            {/* Question Body */}
                            <p className="text-xs font-bold text-gray-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
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
                                className="block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans resize-none"
                              />
                            )}

                            {/* 2. Multiple Choice Type Input */}
                            {q.type === 'multiple_choice' && q.choices && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                {q.choices.map((choice, cIdx) => {
                                  const optLetter = String.fromCharCode(65 + cIdx); // A, B, C, D...
                                  const isSelected = studentAnswer === optLetter;

                                  return (
                                    <button
                                      key={cIdx}
                                      type="button"
                                      onClick={() => setAnswersMap({ ...answersMap, [q.id]: optLetter })}
                                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-indigo-50 dark:bg-indigo-900/30/50 border-indigo-600 ring-1 ring-indigo-600 shadow-3xs' 
                                          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600'
                                      }`}
                                    >
                                      <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-colors ${
                                        isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                                      }`}>
                                        {optLetter}
                                      </span>
                                      <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{choice}</span>
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
                                      className={`flex-1 py-3 px-4 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                        isSelected
                                          ? 'bg-indigo-50 dark:bg-indigo-900/30/50 border-indigo-600 ring-1 ring-indigo-600 text-indigo-700'
                                          : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900'
                                      }`}
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* 4. Matching Type Input */}
                            {q.type === 'matching' && q.matchingPairs && (
                              <div className="space-y-3 pt-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Pasangkan Unsur Kiri dengan Kanan:</p>
                                <div className="space-y-2.5">
                                  {q.matchingPairs.map((pair, pIdx) => {
                                    const currentAnswersList = studentAnswer ? studentAnswer.split(',') : [];
                                    const matchingMap: {[left: string]: string} = {};
                                    currentAnswersList.forEach(item => {
                                      const [l, r] = item.split('::');
                                      if (l) matchingMap[l] = r || '';
                                    });

                                    const selectedRightVal = matchingMap[pair.left] || '';

                                    return (
                                      <div key={pIdx} className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                                        <span className="text-xs font-bold text-gray-700 dark:text-slate-200 min-w-[120px]">{pair.left}</span>
                                        <div className="hidden sm:block text-gray-400 font-mono">➡</div>
                                        <CustomDropdown
                                          value={selectedRightVal}
                                          placeholder="-- Pilih Jawaban --"
                                          onChange={(val) => {
                                            matchingMap[pair.left] = val;
                                            const serialized = Object.entries(matchingMap)
                                              .map(([l, r]) => `${l}::${r}`)
                                              .join(',');
                                            setAnswersMap({ ...answersMap, [q.id]: serialized });
                                          }}
                                          options={[
                                            { value: '', label: '-- Pilih Jawaban --' },
                                            ...(q.matchingPairs?.map((itemRight) => ({
                                              value: itemRight.right,
                                              label: itemRight.right
                                            })) || [])
                                          ]}
                                          className="flex-1"
                                          size="sm"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 5. Fill Blank Input */}
                            {q.type === 'fill_blank' && (
                              <input
                                type="text"
                                value={studentAnswer}
                                onChange={(e) => setAnswersMap({ ...answersMap, [q.id]: e.target.value })}
                                placeholder="Tulis isian jawaban singkat Anda di sini..."
                                className="block w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                              />
                            )}

                            {/* 6. Listening Input */}
                            {q.type === 'listening' && (
                              <div className="space-y-3 pt-1">
                                {q.audioUrl ? (
                                  <div className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center gap-3">
                                    <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                    <audio src={q.audioUrl} controls className="w-full h-8" />
                                  </div>
                                ) : (
                                  <div className="p-3 bg-yellow-50 text-yellow-800 rounded-xl text-[11px] font-semibold border border-yellow-100">
                                    Audio soal tidak disiapkan oleh guru.
                                  </div>
                                )}
                                <textarea
                                  required={assignment.settings?.requireAll}
                                  rows={3}
                                  value={studentAnswer}
                                  onChange={(e) => setAnswersMap({ ...answersMap, [q.id]: e.target.value })}
                                  placeholder="Dengarkan audio di atas lalu tulis jawaban / rangkuman Anda di sini..."
                                  className="block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans resize-none"
                                />
                              </div>
                            )}

                            {/* 7. Speaking Input */}
                            {q.type === 'speaking' && (
                              <div className="space-y-3 pt-1">
                                {q.speakingPrompt && (
                                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-xl text-xs font-semibold text-indigo-800">
                                    "{q.speakingPrompt}"
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={studentAnswer}
                                    onChange={(e) => setAnswersMap({ ...answersMap, [q.id]: e.target.value })}
                                    placeholder="Ketikan rekaman lafal kalimat Anda di sini..."
                                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const isRecording = !!recordingStates[q.id];
                                      setRecordingStates({ ...recordingStates, [q.id]: !isRecording });
                                      if (!isRecording) {
                                        setTimeout(() => {
                                          setAnswersMap(prev => ({
                                            ...prev,
                                            [q.id]: q.speakingPrompt || "I am reading the speaking prompt clearly."
                                          }));
                                          setRecordingStates(prev => ({ ...prev, [q.id]: false }));
                                        }, 1500);
                                      }
                                    }}
                                    className={`px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border ${
                                      recordingStates[q.id]
                                        ? 'bg-red-500 text-white border-red-500 animate-pulse'
                                        : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100'
                                    }`}
                                  >
                                    <Mic className="w-4 h-4" />
                                    {recordingStates[q.id] ? 'Merekam...' : 'Bicara'}
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* 8. File Upload Input */}
                            {q.type === 'file_upload' && (
                              <div className="space-y-3 pt-1">
                                <div className="p-4 border border-dashed border-gray-200 dark:border-slate-700 hover:border-indigo-400 bg-gray-50 dark:bg-slate-900/50 rounded-2xl text-center space-y-2 cursor-pointer transition-all relative">
                                  <UploadCloud className="w-6 h-6 text-indigo-500 mx-auto" />
                                  <div className="text-xs">
                                    <p className="font-semibold text-gray-700 dark:text-slate-200">Pilih Berkas Tugas / Tarik Di Sini</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Mendukung berkas: {q.allowedFileTypes?.join(', ') || 'Semua format'}</p>
                                  </div>
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setAnswersMap({ ...answersMap, [q.id]: `Uploaded_File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` });
                                      }
                                    }}
                                  />
                                </div>
                                {studentAnswer && (
                                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 text-[11px] font-bold text-emerald-700 rounded-xl flex items-center gap-2">
                                    <Check className="w-4 h-4 shrink-0" />
                                    {studentAnswer}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Multiple Choice Options */}
                  {assignment.assignmentType === 'multiple_choice' && assignment.choices && (
                    <div className="space-y-3.5">
                      <span className="block text-xs font-bold text-gray-700 dark:text-slate-200">Pilih Jawaban Anda <span className="text-red-500">*</span></span>
                      <div className="grid grid-cols-1 gap-3">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSelectedChoice(opt)}
                            className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                              selectedChoice === opt 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30/50 border-indigo-600 ring-1 ring-indigo-600 shadow-3xs' 
                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                              selectedChoice === opt 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                            }`}>
                              {opt}
                            </span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{assignment.choices[opt]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Multi Short Answer Inputs */}
                  {assignment.assignmentType === 'multi_short_answer' && assignment.subQuestions && (
                    <div className="space-y-5">
                      <span className="block text-xs font-bold text-gray-700 dark:text-slate-200">Jawab Setiap Sub-Pertanyaan <span className="text-red-500">*</span></span>
                      {assignment.subQuestions.map((q, idx) => (
                        <div key={idx} className="space-y-2 p-4.5 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                          <label className="block text-xs font-bold text-indigo-900 dark:text-indigo-100 leading-normal">
                            Soal {idx + 1}: {q}
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={multiAnswers[idx] || ''}
                            onChange={(e) => {
                              const next = [...multiAnswers];
                              next[idx] = e.target.value;
                              setMultiAnswers(next);
                            }}
                            className="block w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans resize-none"
                            placeholder={`Tulis jawaban untuk soal nomor ${idx + 1}...`}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Single Answer field */}
                  {(!assignment.assignmentType || assignment.assignmentType === 'short_answer') && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">
                          Tulis Jawaban <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsPreviewMode(!isPreviewMode)}
                          disabled={!answer.trim()}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {isPreviewMode ? 'Kembali Edit' : 'Pratinjau Jawaban'}
                        </button>
                      </div>

                      {isPreviewMode ? (
                        /* Plain Text Preview */
                        <div className="p-4 min-h-[160px] bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                          {answer}
                        </div>
                      ) : (
                        <textarea
                          required
                          rows={8}
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
                          placeholder="Ketik seluruh jawaban esai Anda secara lengkap dan teliti di sini..."
                        />
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    {isPreviewMode && (!assignment.assignmentType || assignment.assignmentType === 'short_answer') && (
                      <button
                        type="button"
                        onClick={() => setIsPreviewMode(false)}
                        className="px-5 py-3 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 font-semibold rounded-xl text-xs hover:bg-gray-50 dark:bg-slate-900 cursor-pointer active:scale-95 transition-all"
                        style={{ minHeight: '44px' }}
                      >
                        Edit Jawaban
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        (assignment.assignmentType === 'lms_composite'
                          ? (assignment.settings?.requireAll && questions.some(q => !(answersMap[q.id] || '').trim()))
                          : assignment.assignmentType === 'multiple_choice' 
                            ? !selectedChoice 
                            : assignment.assignmentType === 'multi_short_answer'
                              ? multiAnswers.some(ans => !ans.trim())
                              : !answer.trim())
                      }
                      className="btn-duo-green px-6 py-3 text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
                      style={{ minHeight: '44px' }}
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
            <div className="card-duo p-6 sm:p-8 space-y-4">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Status Tugas Siswa
              </h3>

              {existingSubmission ? (
                <div className="p-4 bg-sky-50 border-2 border-sky-200 border-b-4 border-sky-300 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-sky-950">Siswa telah merespon tugas ini!</p>
                    <p className="text-[11px] font-semibold text-sky-800">Klik tombol di samping untuk segera memberikan penilaian dan umpan balik.</p>
                  </div>
                  <button
                    onClick={() => onNavigate(`/submission/${assignmentId}`)}
                    className="btn-duo-blue px-5 py-2.5 text-xs font-black"
                  >
                    Buka Submisi Siswa
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 border-b-4 border-gray-300 dark:border-slate-600 rounded-2xl text-xs font-semibold text-gray-600 dark:text-slate-300">
                  Siswa <span className="font-extrabold text-gray-900 dark:text-white">{assignment.studentName}</span> belum mengirimkan jawaban esai untuk tugas ini.
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
