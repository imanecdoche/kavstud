import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc,
  deleteDoc,
  query, 
  where, 
  serverTimestamp, 
  writeBatch
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Settings, 
  Eye, 
  Save, 
  Send, 
  HelpCircle, 
  X, 
  Sparkles,
  GripVertical,
  Check,
  AlertCircle,
  FileText,
  Volume2,
  Mic,
  Upload,
  Layers,
  Clock,
  Award,
  BookOpen,
  UserCheck,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assignment, AssignmentSettings, Question, UserProfile, Circle } from '../types';
import CustomDropdown from './CustomDropdown';

interface AssignmentBuilderProps {
  assignmentId?: string; // If provided, we are in Edit Mode
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

interface LocalQuestion {
  id: string; // temporary generated ID or firestore document ID
  type: string; // 'multiple_choice' | 'essay' | 'true_false' | 'matching' | 'fill_blank' | 'listening' | 'speaking' | 'file_upload'
  question: string;
  choices: string[]; // for multiple_choice options
  correctAnswer: string; // answer string/index
  answerGuide: string;
  points: number;
  isCollapsed: boolean;
  
  // Custom fields for rich question types (highly scalable)
  trueFalseCorrect?: 'true' | 'false';
  matchingPairs?: { left: string; right: string }[];
  fillBlankAnswers?: string[];
  audioUrl?: string;
  speakingPrompt?: string;
  allowedFileTypes?: string[];
}

export default function AssignmentBuilder({ assignmentId, onNavigate, onSetLoading }: AssignmentBuilderProps) {
  const isEditMode = !!assignmentId;

  // Global Lists for Selectors
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Assignment General Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetType, setTargetType] = useState<'INDIVIDUAL' | 'CIRCLE'>('INDIVIDUAL');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCircleId, setSelectedCircleId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit'>('Sedang');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [scheduledDate, setScheduledDate] = useState('');

  // Options & Settings
  const [allowResubmission, setAllowResubmission] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleChoices, setShuffleChoices] = useState(false);
  const [requireAll, setRequireAll] = useState(true);
  const [showScore, setShowScore] = useState(true);
  const [autoGradeMC, setAutoGradeMC] = useState(true);
  const [manualReviewEssay, setManualReviewEssay] = useState(true);

  // Question Builder States
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [initialQuestionIds, setInitialQuestionIds] = useState<string[]>([]); // for tracking deletions
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Student-like Preview Answers state (read-only mockup)
  const [previewAnswers, setPreviewAnswers] = useState<{ [qId: string]: string }>({});

  // Parse direct studentId from URL query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramStudentId = params.get('studentId');
    if (paramStudentId) {
      setSelectedStudentId(paramStudentId);
    }
  }, []);

  // Create default question structure
  const createDefaultQuestion = (type: string, orderVal: number): LocalQuestion => {
    const tempId = 'new_' + Math.random().toString(36).substring(2, 9);
    return {
      id: tempId,
      type,
      question: '',
      choices: type === 'multiple_choice' ? ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'] : [],
      correctAnswer: type === 'multiple_choice' ? '0' : type === 'true_false' ? 'true' : '',
      answerGuide: '',
      points: 10,
      isCollapsed: false,
      trueFalseCorrect: 'true',
      matchingPairs: type === 'matching' ? [{ left: 'Pertanyaan A', right: 'Jawaban A' }] : [],
      fillBlankAnswers: type === 'fill_blank' ? [''] : [],
      audioUrl: '',
      speakingPrompt: '',
      allowedFileTypes: ['pdf', 'doc', 'docx']
    };
  };

  // Load Students, Circles and Assignment Data (if editing)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      onNavigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Fetch Students
        const studsSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
        const studs: UserProfile[] = [];
        studsSnap.forEach((doc) => {
          studs.push({ uid: doc.id, ...doc.data() } as UserProfile);
        });
        setStudents(studs);

        // 2. Fetch Circles for this teacher
        const circlesSnap = await getDocs(query(collection(db, 'circles'), where('teacherId', '==', user.uid)));
        const circs: Circle[] = [];
        circlesSnap.forEach((doc) => {
          circs.push({ id: doc.id, ...doc.data() } as Circle);
        });
        setCircles(circs);

        // 3. Load assignment if editing
        if (isEditMode && assignmentId) {
          const assignDoc = await getDoc(doc(db, 'assignments', assignmentId));
          if (assignDoc.exists()) {
            const assign = assignDoc.data() as Assignment;
            setTitle(assign.title || '');
            setDescription(assign.description || '');
            setTargetType(assign.targetType || (assign.assignmentTarget === 'CIRCLE' ? 'CIRCLE' : 'INDIVIDUAL'));
            
            if (assign.assignmentTarget === 'CIRCLE' || assign.targetType === 'CIRCLE') {
              setSelectedCircleId(assign.targetId || '');
            } else {
              setSelectedStudentId(assign.targetId || assign.studentId || '');
            }

            setDeadline(assign.deadline || '');
            setEstimatedDuration(assign.estimatedDuration || 30);
            setDifficulty(assign.difficulty || 'Sedang');
            setStatus(assign.status as any || 'draft');

            // Load Settings
            if (assign.settings) {
              setAllowResubmission(assign.settings.allowResubmission ?? true);
              setShuffleQuestions(assign.settings.shuffleQuestions ?? false);
              setShuffleChoices(assign.settings.shuffleChoices ?? false);
              setRequireAll(assign.settings.requireAll ?? true);
              setShowScore(assign.settings.showScore ?? true);
              setAutoGradeMC(assign.settings.autoGradeMC ?? true);
              setManualReviewEssay(assign.settings.manualReviewEssay ?? true);
            }

            // Load Questions from 'questions' collection where assignmentId matches
            const parts = assignmentId.split('_');
            const qMasterId = parts.length >= 3 ? `${parts[0]}_${parts[1]}` : assignmentId;
            const questionsSnap = await getDocs(
              query(collection(db, 'questions'), where('assignmentId', '==', qMasterId))
            );
            const loadedQuestions: LocalQuestion[] = [];
            const loadedIds: string[] = [];
            
            questionsSnap.forEach((qDoc) => {
              const qData = qDoc.data();
              loadedIds.push(qDoc.id);
              loadedQuestions.push({
                id: qDoc.id,
                type: qData.type || 'essay',
                question: qData.question || '',
                choices: qData.choices || [],
                correctAnswer: qData.correctAnswer || '',
                answerGuide: qData.answerGuide || '',
                points: Number(qData.points ?? 10),
                isCollapsed: true, // collapse by default on edit for clean view
                trueFalseCorrect: qData.trueFalseCorrect || 'true',
                matchingPairs: qData.matchingPairs || [],
                fillBlankAnswers: qData.fillBlankAnswers || [],
                audioUrl: qData.audioUrl || '',
                speakingPrompt: qData.speakingPrompt || '',
                allowedFileTypes: qData.allowedFileTypes || []
              });
            });

            // Sort questions by their order field
            loadedQuestions.sort((a, b) => {
              const qA = questionsSnap.docs.find(d => d.id === a.id)?.data();
              const qB = questionsSnap.docs.find(d => d.id === b.id)?.data();
              return (qA?.order || 0) - (qB?.order || 0);
            });

            setQuestions(loadedQuestions);
            setInitialQuestionIds(loadedIds);
          } else {
            setErrorMessage('Lembar tugas tidak ditemukan.');
          }
        } else {
          // Initialize with 1 default question
          setQuestions([createDefaultQuestion('multiple_choice', 1)]);
        }
      } catch (err) {
        console.error('Error fetching builder data:', err);
        setErrorMessage('Gagal memuat data pengaturan tugas.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [assignmentId, isEditMode]);

  // Handle Questions modifications
  const addQuestion = (type: string) => {
    setQuestions(prev => [...prev, createDefaultQuestion(type, prev.length + 1)]);
  };

  const duplicateQuestion = (index: number) => {
    const source = questions[index];
    const duplicated: LocalQuestion = {
      ...source,
      id: 'dup_' + Math.random().toString(36).substring(2, 9),
      isCollapsed: false
    };
    setQuestions(prev => {
      const next = [...prev];
      next.splice(index + 1, 0, duplicated);
      return next;
    });
  };

  const deleteQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuestionField = (index: number, key: keyof LocalQuestion, value: any) => {
    setQuestions(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setQuestions(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === questions.length - 1) return;
    setQuestions(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
  };

  // Drag and Drop Questions Reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    setQuestions(prev => {
      const next = [...prev];
      const [draggedItem] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, draggedItem);
      return next;
    });
    setDraggedIndex(null);
  };

  // Save Assignment to Firestore
  const handleSave = async (forcedStatus?: 'draft' | 'published') => {
    if (!title.trim()) {
      setErrorMessage('Judul lembar tugas wajib diisi.');
      setIsSettingsOpen(true);
      return;
    }

    if (targetType === 'INDIVIDUAL' && !selectedStudentId) {
      setErrorMessage('Pilih siswa penerima tugas.');
      setIsSettingsOpen(true);
      return;
    }

    if (targetType === 'CIRCLE' && !selectedCircleId) {
      setErrorMessage('Pilih Circle penerima tugas.');
      setIsSettingsOpen(true);
      return;
    }

    if (questions.length === 0) {
      setErrorMessage('Buat setidaknya satu pertanyaan dalam daftar soal.');
      return;
    }

    // Validate questions fields
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setErrorMessage(`Teks soal nomor ${i + 1} tidak boleh kosong.`);
        return;
      }
      if (q.type === 'multiple_choice') {
        if (q.choices.some(choice => !choice.trim())) {
          setErrorMessage(`Semua opsi pilihan ganda di soal nomor ${i + 1} wajib diisi.`);
          return;
        }
      }
    }

    setSaveLoading(true);
    setErrorMessage(null);

    const user = auth.currentUser;
    const teacherProfileSnap = await getDoc(doc(db, 'users', user?.uid || ''));
    const teacherName = teacherProfileSnap.exists() ? (teacherProfileSnap.data() as UserProfile).fullName : 'Guru';

    const totalPoints = questions.reduce((sum, q) => sum + Number(q.points || 0), 0);
    const finalStatus = forcedStatus || status;

    try {
      const batch = writeBatch(db);
      
      // Determine targets
      let targetStudentIds: string[] = [];
      if (targetType === 'INDIVIDUAL') {
        targetStudentIds = [selectedStudentId];
      } else {
        // Circle targets
        const circleStudentsSnap = await getDocs(
          query(collection(db, 'users'), where('circleId', '==', selectedCircleId), where('classType', '==', 'CIRCLE'))
        );
        circleStudentsSnap.forEach(doc => {
          targetStudentIds.push(doc.id);
        });
        
        if (targetStudentIds.length === 0) {
          throw new Error('Circle penerima yang Anda pilih belum memiliki anggota siswa.');
        }
      }

      // If Edit Mode, we update the existing assignment. If Circle in edit mode, wait, let's keep it simple.
      // We will save/update an assignment document for each student so the legacy listing works natively!
      // This is beautiful because students list query is completely unchanged, but the builder handles it instantly.
      
      const assignmentIdToUse = isEditMode && assignmentId ? assignmentId : 'assign_' + Math.random().toString(36).substring(2, 9);

      // Create main metadata object
      const firstStudentId = targetStudentIds[0] || '';
      const firstStudent = students.find(s => s.uid === firstStudentId);

      const assignmentPayload: any = {
        title: title.trim(),
        description: description.trim(),
        question: questions[0]?.question || 'Lihat lampiran lembar soal.', // fallback for old student view
        teacherId: user?.uid || '',
        teacherName: teacherName,
        assignmentType: 'lms_composite',
        assignmentTarget: targetType,
        targetType: targetType,
        targetId: targetType === 'INDIVIDUAL' ? selectedStudentId : selectedCircleId,
        deadline: deadline || '',
        status: finalStatus,
        totalQuestions: questions.length,
        totalPoints: totalPoints,
        estimatedDuration: Number(estimatedDuration || 30),
        difficulty: difficulty,
        settings: {
          allowResubmission,
          shuffleQuestions,
          shuffleChoices,
          requireAll,
          showScore,
          autoGradeMC,
          manualReviewEssay
        },
        updatedAt: serverTimestamp()
      };

      if (!isEditMode) {
        assignmentPayload.createdAt = serverTimestamp();
      }

      // If target is circle and is not edit mode, we can create multiple assignments (one per student)
      // or we can create a single master assignment metadata doc. Let's create one per student to be 100% backwards compatible.
      // Wait, let's look at the document IDs. If we create one per student:
      // - They all share the same master list of questions. The master assignment ID can be used to link questions.
      // - So question documents will have assignmentId = assignmentMasterId.
      // - The assignment metadata document for student S will have id = `${assignmentMasterId}_${studentId}`.
      // This is an absolute masterpiece of database architecture! Each student gets their own custom metadata doc, but they all share the exact same questions under the same parent ID!
      
      let masterId = 'lms_' + Math.random().toString(36).substring(2, 9);
      if (isEditMode && assignmentId) {
        const parts = assignmentId.split('_');
        masterId = parts.length >= 3 ? `${parts[0]}_${parts[1]}` : assignmentId;
      }

      for (const studentId of targetStudentIds) {
        const studentInfo = students.find(s => s.uid === studentId);
        const specificDocId = targetType === 'INDIVIDUAL' ? masterId : `${masterId}_${studentId}`;
        
        const individualPayload = {
          ...assignmentPayload,
          masterId: masterId,
          studentId: studentId,
          studentName: studentInfo?.fullName || 'Siswa'
        };

        const assignmentDocRef = doc(db, 'assignments', specificDocId);
        batch.set(assignmentDocRef, individualPayload, { merge: true });
      }

      // Write/Sync Questions using the masterId as assignmentId!
      // This ensures all students in a circle answer the exact same questions.
      
      // 1. Delete removed questions in Batch
      const currentQuestionIds = questions.filter(q => !q.id.startsWith('new_') && !q.id.startsWith('dup_')).map(q => q.id);
      const deletedIds = initialQuestionIds.filter(id => !currentQuestionIds.includes(id));
      
      deletedIds.forEach(delId => {
        const delDocRef = doc(db, 'questions', delId);
        batch.delete(delDocRef);
      });

      // 2. Save / Update current questions
      questions.forEach((q, idx) => {
        // If it was a newly created question, generate a real Firestore document ID
        const qIdToUse = q.id.startsWith('new_') || q.id.startsWith('dup_') 
          ? doc(collection(db, 'questions')).id 
          : q.id;

        const questionPayload = {
          assignmentId: masterId, // link to master assignment
          order: idx + 1,
          type: q.type,
          question: q.question.trim(),
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          answerGuide: q.answerGuide.trim(),
          points: Number(q.points || 10),
          
          // dynamic fields
          trueFalseCorrect: q.trueFalseCorrect || 'true',
          matchingPairs: q.matchingPairs || [],
          fillBlankAnswers: q.fillBlankAnswers || [],
          audioUrl: q.audioUrl || '',
          speakingPrompt: q.speakingPrompt || '',
          allowedFileTypes: q.allowedFileTypes || []
        };

        const questionDocRef = doc(db, 'questions', qIdToUse);
        batch.set(questionDocRef, questionPayload, { merge: true });
      });

      // Commit the batch writes
      await batch.commit();

      // Clear draft states and navigate back
      onNavigate('/teacher');
    } catch (err: any) {
      console.error('Error saving assignment:', err);
      setErrorMessage(err.message || 'Gagal menyimpan lembar tugas. Pastikan koneksi aman.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Counting dynamic stats
  const totalPoints = questions.reduce((sum, q) => sum + Number(q.points || 0), 0);
  const mcCount = questions.filter(q => q.type === 'multiple_choice').length;
  const essayCount = questions.filter(q => q.type === 'essay').length;
  const otherCount = questions.length - mcCount - essayCount;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Memuat Lembar Kerja Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans" id="assignment-builder">
      {/* 1. TOP HEADER SECTION */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/teacher')}
            className="p-2 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer transition-colors active:scale-95 shrink-0"
            style={{ minWidth: '40px', minHeight: '40px' }}
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">LMS Assignment Builder</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                status === 'published' 
                  ? 'bg-green-50 text-green-700 border border-green-100' 
                  : status === 'scheduled'
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                {status === 'published' ? 'Dipublikasikan' : status === 'scheduled' ? 'Djadwalkan' : 'Draft'}
              </span>
            </div>
            <h1 className="text-md sm:text-lg font-display font-bold text-gray-900 truncate tracking-tight mt-0.5">
              {title || 'Tugas Baru Tanpa Judul'}
            </h1>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isPreviewMode 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
            style={{ minHeight: '40px' }}
          >
            <Eye className="w-4 h-4" />
            {isPreviewMode ? 'Keluar Pratinjau' : 'Pratinjau Siswa'}
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            style={{ minHeight: '40px' }}
          >
            <Settings className="w-4 h-4 text-gray-400" />
            Pengaturan
          </button>

          <button
            onClick={() => handleSave('draft')}
            disabled={saveLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            style={{ minHeight: '40px' }}
          >
            <Save className="w-4 h-4 text-gray-400" />
            Simpan Draft
          </button>

          <button
            onClick={() => handleSave('published')}
            disabled={saveLoading}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
            style={{ minHeight: '40px' }}
          >
            {saveLoading ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Publikasikan
          </button>
        </div>
      </header>

      {errorMessage && (
        <div className="m-4 sm:m-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="font-semibold">{errorMessage}</p>
          <button onClick={() => setErrorMessage(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative items-start">
        
        {/* PREVIEW MODE SCREEN OVERLAY */}
        {isPreviewMode ? (
          <div className="w-full lg:w-3/4 space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800 flex items-center gap-2.5">
              <Eye className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">Mode Pratinjau (Hanya Baca)</p>
                <p className="text-amber-700 mt-0.5">Siswa akan melihat dan menjawab lembar ujian Anda dengan format interaktif di bawah ini.</p>
              </div>
            </div>

            {/* Simulated Student Exam Header */}
            <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-3xs space-y-4">
              <h2 className="text-xl font-display font-bold text-gray-900">{title || 'Tugas Baru Tanpa Judul'}</h2>
              {description && <p className="text-xs text-gray-500 leading-relaxed">{description}</p>}
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-50 text-[11px] font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>Durasi: {estimatedDuration} Menit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" />
                  <span>Total Poin: {totalPoints} Poin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>Kesulitan: {difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>Jumlah: {questions.length} Soal</span>
                </div>
              </div>
            </div>

            {/* Questions list preview */}
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white border border-gray-100 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <span className="text-[11px] font-bold text-indigo-600 font-mono uppercase tracking-wider">Soal #{idx + 1} ({q.type.replace('_', ' ')})</span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{q.points} Poin</span>
                  </div>

                  <p className="text-xs font-semibold text-gray-800 leading-relaxed whitespace-pre-wrap">{q.question || '(Soal belum ditulis)'}</p>

                  {/* MCQ Choices */}
                  {q.type === 'multiple_choice' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {q.choices.map((choice, cIdx) => {
                        const label = String.fromCharCode(65 + cIdx); // A, B, C, D
                        const isSelected = previewAnswers[q.id] === String(cIdx);
                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => setPreviewAnswers(p => ({ ...p, [q.id]: String(cIdx) }))}
                            className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-indigo-50/50 border-indigo-600 text-indigo-900 ring-1 ring-indigo-600' 
                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                            }`}>{label}</span>
                            <span>{choice || `Pilihan ${label}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Essay input */}
                  {q.type === 'essay' && (
                    <textarea
                      rows={4}
                      value={previewAnswers[q.id] || ''}
                      onChange={(e) => setPreviewAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                      placeholder="Ketik jawaban esai Anda di sini..."
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                  )}

                  {/* True / False */}
                  {q.type === 'true_false' && (
                    <div className="flex gap-4">
                      {['Benar', 'Salah'].map((val, tfIdx) => {
                        const tfVal = tfIdx === 0 ? 'true' : 'false';
                        const isSelected = previewAnswers[q.id] === tfVal;
                        return (
                          <button
                            key={tfVal}
                            type="button"
                            onClick={() => setPreviewAnswers(p => ({ ...p, [q.id]: tfVal }))}
                            className={`px-6 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Matching mock layout */}
                  {q.type === 'matching' && (
                    <div className="space-y-2 mt-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      {q.matchingPairs?.map((pair, pIdx) => (
                        <div key={pIdx} className="flex items-center justify-between gap-4 text-xs">
                          <span className="font-semibold text-gray-700">{pair.left || 'Kiri'}</span>
                          <span className="text-gray-400">➔</span>
                          <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold">{pair.right || 'Kanan'}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fill in blank mock */}
                  {q.type === 'fill_blank' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Tulis Jawaban Isian:</span>
                      <input
                        type="text"
                        value={previewAnswers[q.id] || ''}
                        onChange={(e) => setPreviewAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                        placeholder="Ketik kata/frasa kunci..."
                        className="p-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  {/* Listening Mock */}
                  {q.type === 'listening' && (
                    <div className="space-y-3 mt-2 bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <Volume2 className="w-4 h-4 text-indigo-600" />
                        <span>Dengarkan Audio Soal:</span>
                      </div>
                      <audio controls src={q.audioUrl} className="w-full max-w-md h-8" />
                      <input
                        type="text"
                        value={previewAnswers[q.id] || ''}
                        onChange={(e) => setPreviewAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                        placeholder="Tulis apa yang Anda dengar..."
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  )}

                  {/* Speaking Mock */}
                  {q.type === 'speaking' && (
                    <div className="space-y-3 mt-2 bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <Mic className="w-4 h-4 text-indigo-600" />
                        <span>Instruksi Berbicara:</span>
                      </div>
                      {q.speakingPrompt && <p className="text-xs italic text-gray-600 font-medium">"{q.speakingPrompt}"</p>}
                      <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">
                        <Mic className="w-3.5 h-3.5" /> Rekam Suara (Preview)
                      </button>
                    </div>
                  )}

                  {/* File Upload Mock */}
                  {q.type === 'file_upload' && (
                    <div className="space-y-3 mt-2 bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200 text-center">
                      <Upload className="w-8 h-8 text-indigo-500 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-gray-700">Tarik atau Pilih Berkas Pengerjaan</p>
                        <p className="text-[10px] text-gray-400 mt-1">Berkas yang diizinkan: {q.allowedFileTypes?.join(', ') || 'Semua'}</p>
                      </div>
                      <button type="button" className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold rounded-xl">Pilih Berkas</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* WORKSPACE: QUESTION BUILDER LEFT SECTION */
          <div className="w-full lg:w-3/4 space-y-6">
            
            {/* Quick Title Card */}
            <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-3xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Workspace Soal Aktif</h2>
                  <p className="text-[10px] text-gray-400 mt-0.5">Tarik dan susun urutan soal secara fleksibel. Klik setiap kartu untuk detail input.</p>
                </div>
              </div>

              {/* Add Question Shortcut Dropdown */}
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200/50">
                <button
                  type="button"
                  onClick={() => addQuestion('multiple_choice')}
                  className="px-3 py-1.5 bg-white text-indigo-600 rounded-lg border border-indigo-100/40 text-[10px] font-bold shadow-3xs hover:bg-indigo-50/30 cursor-pointer"
                >
                  + Pilihan Ganda
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('essay')}
                  className="px-3 py-1.5 bg-white text-indigo-600 rounded-lg border border-indigo-100/40 text-[10px] font-bold shadow-3xs hover:bg-indigo-50/30 cursor-pointer"
                >
                  + Esai / Jawaban Singkat
                </button>
              </div>
            </div>

            {/* Questions Builder Cards Container */}
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`bg-white border transition-all rounded-2xl p-5 sm:p-6 shadow-3xs space-y-4 relative ${
                    draggedIndex === index ? 'opacity-40 border-dashed border-indigo-500 bg-indigo-50/20' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {/* Header Question Actions */}
                  <div className="flex items-center justify-between gap-4 pb-3 border-b border-gray-50">
                    <div className="flex items-center gap-2.5">
                      <div className="cursor-grab text-gray-300 hover:text-gray-500 shrink-0" title="Tarik untuk Reorder">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold font-mono flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          {q.type === 'multiple_choice' ? 'Pilihan Ganda' : q.type === 'essay' ? 'Jawaban Singkat (Esai)' : q.type.replace('_', ' ')}
                        </span>
                        
                        {/* Change type dynamically for future expansion support */}
                        <CustomDropdown
                          variant="minimal"
                          size="sm"
                          dropdownWidth="w-44"
                          value={q.type}
                          onChange={(val) => updateQuestionField(index, 'type', val)}
                          options={[
                            { value: 'multiple_choice', label: 'Pilihan Ganda (A-D)' },
                            { value: 'essay', label: 'Esai / Jawaban Singkat' },
                            { value: 'true_false', label: 'Benar / Salah' },
                            { value: 'matching', label: 'Menjodohkan (Matching)' },
                            { value: 'fill_blank', label: 'Isian Singkat (Fill Blank)' },
                            { value: 'listening', label: 'Mendengarkan (Listening)' },
                            { value: 'speaking', label: 'Berbicara (Speaking)' },
                            { value: 'file_upload', label: 'Unggah Berkas (Upload)' }
                          ]}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
                        title="Geser ke Atas"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(index)}
                        disabled={index === questions.length - 1}
                        className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
                        title="Geser ke Bawah"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateQuestion(index)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                        title="Duplikat Soal"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteQuestion(index)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuestionField(index, 'isCollapsed', !q.isCollapsed)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                      >
                        {q.isCollapsed ? 'Expand' : 'Collapse'}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Card Body */}
                  {!q.isCollapsed && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      {/* Question Prompt Field */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700">Pertanyaan Soal</label>
                        <textarea
                          rows={3}
                          value={q.question}
                          onChange={(e) => updateQuestionField(index, 'question', e.target.value)}
                          placeholder="Tulis isi pertanyaan secara lengkap, jelas, dan lugas di sini..."
                          className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                        />
                      </div>

                      {/* 1. Multiple Choice Specific Inputs */}
                      {q.type === 'multiple_choice' && (
                        <div className="space-y-3 pt-2 border-t border-gray-50">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Opsi Pilihan Jawaban</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.choices.map((choice, choiceIdx) => {
                              const optLabel = String.fromCharCode(65 + choiceIdx); // A, B, C, D
                              return (
                                <div key={choiceIdx} className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-gray-400">{optLabel}</span>
                                  <input
                                    type="text"
                                    value={choice}
                                    onChange={(e) => {
                                      const nextChoices = [...q.choices];
                                      nextChoices[choiceIdx] = e.target.value;
                                      updateQuestionField(index, 'choices', nextChoices);
                                    }}
                                    placeholder={`Jawaban Pilihan ${optLabel}...`}
                                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-indigo-500"
                                  />
                                </div>
                              );
                            })}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1.5">
                              <label className="block text-xs font-semibold text-gray-700">Kunci Jawaban Benar</label>
                              <CustomDropdown
                                value={q.correctAnswer}
                                onChange={(val) => updateQuestionField(index, 'correctAnswer', val)}
                                options={[
                                  { value: '0', label: 'Opsi A (Pilihan Pertama)' },
                                  { value: '1', label: 'Opsi B (Pilihan Kedua)' },
                                  { value: '2', label: 'Opsi C (Pilihan Ketiga)' },
                                  { value: '3', label: 'Opsi D (Pilihan Keempat)' }
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. Essay Specific Inputs */}
                      {q.type === 'essay' && (
                        <div className="space-y-2 pt-2 border-t border-gray-50">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700">Panduan Kunci Jawaban / Kisi-kisi (Opsional)</label>
                            <textarea
                              rows={2}
                              value={q.answerGuide}
                              onChange={(e) => updateQuestionField(index, 'answerGuide', e.target.value)}
                              placeholder="Tulis indikator utama atau kata kunci yang diutamakan dari pengerjaan siswa..."
                              className="block w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none resize-none font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {/* 3. True / False Specific Inputs */}
                      {q.type === 'true_false' && (
                        <div className="space-y-2 pt-2 border-t border-gray-50">
                          <label className="block text-xs font-semibold text-gray-700">Kunci Jawaban Benar</label>
                          <div className="flex gap-3">
                            {['true', 'false'].map((tfVal) => (
                              <button
                                key={tfVal}
                                type="button"
                                onClick={() => updateQuestionField(index, 'correctAnswer', tfVal)}
                                className={`px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                                  q.correctAnswer === tfVal 
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                {tfVal === 'true' ? 'Benar (True)' : 'Salah (False)'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. Matching Specific Inputs */}
                      {q.type === 'matching' && (
                        <div className="space-y-3 pt-2 border-t border-gray-50">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Pasangan Menjodohkan</span>
                          {q.matchingPairs?.map((pair, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-3">
                              <input
                                type="text"
                                value={pair.left}
                                onChange={(e) => {
                                  const nextPairs = [...(q.matchingPairs || [])];
                                  nextPairs[pIdx].left = e.target.value;
                                  updateQuestionField(index, 'matchingPairs', nextPairs);
                                }}
                                placeholder="Kiri (Pertanyaan)..."
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900"
                              />
                              <span className="text-gray-400">➔</span>
                              <input
                                type="text"
                                value={pair.right}
                                onChange={(e) => {
                                  const nextPairs = [...(q.matchingPairs || [])];
                                  nextPairs[pIdx].right = e.target.value;
                                  updateQuestionField(index, 'matchingPairs', nextPairs);
                                }}
                                placeholder="Kanan (Jawaban)..."
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const nextPairs = (q.matchingPairs || []).filter((_, i) => i !== pIdx);
                                  updateQuestionField(index, 'matchingPairs', nextPairs);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const nextPairs = [...(q.matchingPairs || []), { left: '', right: '' }];
                              updateQuestionField(index, 'matchingPairs', nextPairs);
                            }}
                            className="text-xs text-indigo-600 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            + Tambah Pasangan Menjodohkan
                          </button>
                        </div>
                      )}

                      {/* 5. Fill in the Blank Specific Inputs */}
                      {q.type === 'fill_blank' && (
                        <div className="space-y-3 pt-2 border-t border-gray-50">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Kunci Jawaban Singkat</span>
                          <p className="text-[9px] text-gray-400">Masukkan satu atau beberapa alternatif jawaban benar yang dapat diterima oleh sistem.</p>
                          {q.fillBlankAnswers?.map((ans, aIdx) => (
                            <div key={aIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ans}
                                onChange={(e) => {
                                  const nextAns = [...(q.fillBlankAnswers || [])];
                                  nextAns[aIdx] = e.target.value;
                                  updateQuestionField(index, 'fillBlankAnswers', nextAns);
                                }}
                                placeholder={`Alternatif Jawaban #${aIdx + 1}...`}
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const nextAns = (q.fillBlankAnswers || []).filter((_, i) => i !== aIdx);
                                  updateQuestionField(index, 'fillBlankAnswers', nextAns);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const nextAns = [...(q.fillBlankAnswers || []), ''];
                              updateQuestionField(index, 'fillBlankAnswers', nextAns);
                            }}
                            className="text-xs text-indigo-600 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            + Tambah Alternatif Jawaban Benar
                          </button>
                        </div>
                      )}

                      {/* 6. Listening Specific Inputs */}
                      {q.type === 'listening' && (
                        <div className="space-y-3 pt-2 border-t border-gray-50">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700">Tautan Berkas Audio Soal (URL)</label>
                            <input
                              type="text"
                              value={q.audioUrl}
                              onChange={(e) => updateQuestionField(index, 'audioUrl', e.target.value)}
                              placeholder="Masukkan link hosting audio (mp3/wav) untuk diputar siswa..."
                              className="block w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* 7. Speaking Specific Inputs */}
                      {q.type === 'speaking' && (
                        <div className="space-y-3 pt-2 border-t border-gray-50">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700">Teks / Kalimat yang Harus Dibaca Siswa</label>
                            <textarea
                              rows={2}
                              value={q.speakingPrompt}
                              onChange={(e) => updateQuestionField(index, 'speakingPrompt', e.target.value)}
                              placeholder="Tulis kalimat bahasa inggris atau kalimat lainnya untuk dilatih siswa..."
                              className="block w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs resize-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* 8. File Upload Specific Inputs */}
                      {q.type === 'file_upload' && (
                        <div className="space-y-3 pt-2 border-t border-gray-50">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700">Ekstensi Berkas yang Diizinkan (Koma-Terpisah)</label>
                            <input
                              type="text"
                              value={q.allowedFileTypes?.join(', ')}
                              onChange={(e) => updateQuestionField(index, 'allowedFileTypes', e.target.value.split(',').map(s => s.trim()))}
                              placeholder="pdf, doc, docx, png, jpg..."
                              className="block w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* General Question Parameters */}
                      <div className="pt-3 border-t border-gray-50 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-600">Bobot Nilai (Poin):</span>
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={q.points}
                            onChange={(e) => updateQuestionField(index, 'points', Number(e.target.value))}
                            className="w-16 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-center text-indigo-700 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Collapsed view text snippet */}
                  {q.isCollapsed && (
                    <p className="text-[11px] text-gray-400 truncate pr-8">
                      {q.question || '(Teks soal belum ditulis)'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Add Question Callout */}
            <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-800">Tambah Pertanyaan Soal</h3>
                <p className="text-xs text-gray-400">Pilih jenis pertanyaan yang ingin Anda rancang ke dalam lembar kerja.</p>
              </div>

              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => addQuestion('multiple_choice')}
                  className="px-4 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100/75 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  + Pilihan Ganda
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('essay')}
                  className="px-4 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100/75 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  + Esai (Jawaban Singkat)
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('true_false')}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  + Benar / Salah
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('matching')}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  + Menjodohkan
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('fill_blank')}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <QuestionIcon className="w-4 h-4 shrink-0" />
                  + Isian Singkat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. RIGHT SECTION: STICKY LIVE SUMMARY PANEL */}
        <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-3xs space-y-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ringkasan Soal</h3>
            
            <div className="space-y-3.5 divide-y divide-gray-50">
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-500 font-medium">Total Pertanyaan:</span>
                <span className="font-bold text-gray-800 font-mono text-sm">{questions.length} Soal</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-3">
                <span className="text-gray-500 font-medium">Pilihan Ganda:</span>
                <span className="font-bold text-gray-800 font-mono">{mcCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-3">
                <span className="text-gray-500 font-medium">Jawaban Singkat (Esai):</span>
                <span className="font-bold text-gray-800 font-mono">{essayCount}</span>
              </div>
              {otherCount > 0 && (
                <div className="flex items-center justify-between text-xs pt-3">
                  <span className="text-gray-500 font-medium">Tipe Lainnya (Scalable):</span>
                  <span className="font-bold text-indigo-600 font-mono">+{otherCount}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs pt-3">
                <span className="text-gray-500 font-medium">Akumulasi Nilai:</span>
                <span className="font-extrabold text-indigo-600 font-mono text-sm">{totalPoints} Poin</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-3">
                <span className="text-gray-500 font-medium">Estimasi Durasi:</span>
                <span className="font-bold text-gray-800 font-mono">{estimatedDuration} Menit</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-3">
                <span className="text-gray-500 font-medium">Tingkat Kesulitan:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-600">
                  {difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-3">
                <span className="text-gray-500 font-medium">Penerima Tugas:</span>
                <span className="font-bold text-gray-800 truncate max-w-[120px]">
                  {targetType === 'INDIVIDUAL' 
                    ? (students.find(s => s.uid === selectedStudentId)?.fullName || 'Belum dipilih')
                    : (circles.find(c => c.id === selectedCircleId)?.name || 'Belum dipilih')
                  }
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-50">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Ubah Pengaturan Tugas
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* 4. SETTINGS MODAL DIALOG */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-gray-100 w-full max-w-4xl p-6 sm:p-8 space-y-6 shadow-xl relative my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-display font-bold text-gray-900">Pengaturan Lembar Tugas</h2>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
                  style={{ minWidth: '40px', minHeight: '40px' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-1">
                {/* COLUMN 1: BASIC INFORMATION */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-50 pb-1">Informasi Dasar</span>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Judul Ujian / Tugas <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: English Mid-Semester Examination..."
                      className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Petunjuk & Deskripsi Pengerjaan</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Contoh: Bacalah setiap soal dengan teliti. Jawablah soal esai dengan detail..."
                      className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Target selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Target Penerima Tugas</label>
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200/50">
                      <button
                        type="button"
                        onClick={() => setTargetType('INDIVIDUAL')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          targetType === 'INDIVIDUAL' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        Siswa Individu
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetType('CIRCLE')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          targetType === 'CIRCLE' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        Kelompok Belajar (Circle)
                      </button>
                    </div>
                  </div>

                  {/* Dynamic selector student / circle */}
                  {targetType === 'INDIVIDUAL' ? (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">Pilih Siswa Penerima <span className="text-red-500">*</span></label>
                      <CustomDropdown
                        value={selectedStudentId}
                        placeholder="-- Pilih Siswa Penerima --"
                        onChange={(val) => setSelectedStudentId(val)}
                        options={students.map(s => ({
                          value: s.uid,
                          label: s.fullName,
                          badge: {
                            text: s.classType || 'PRIVATE',
                            className: s.classType === 'CIRCLE'
                              ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100'
                              : 'bg-teal-50 text-teal-700 border border-teal-100'
                          }
                        }))}
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">Pilih Kelompok Belajar Circle <span className="text-red-500">*</span></label>
                      <CustomDropdown
                        value={selectedCircleId}
                        placeholder="-- Pilih Circle Penerima --"
                        onChange={(val) => setSelectedCircleId(val)}
                        options={circles.map(c => {
                          const memberCount = students.filter(s => s.circleId === c.id && s.classType === 'CIRCLE').length;
                          return {
                            value: c.id,
                            label: c.name,
                            sublabel: `${memberCount} Siswa Terdaftar`
                          };
                        })}
                      />
                    </div>
                  )}

                  {/* Deadline & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">Batas Pengumpulan (Deadline)</label>
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">Durasi Pengerjaan (Menit)</label>
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={estimatedDuration}
                        onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                        className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Tingkat Kesulitan</label>
                    <CustomDropdown
                      value={difficulty}
                      onChange={(val) => setDifficulty(val as any)}
                      options={[
                        { value: 'Mudah', label: 'Mudah' },
                        { value: 'Sedang', label: 'Sedang' },
                        { value: 'Sulit', label: 'Sulit' }
                      ]}
                    />
                  </div>
                </div>

                {/* COLUMN 2: OPTIONS & VISIBILITY */}
                <div className="space-y-5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-50 pb-1">Opsi Tugas & Aturan</span>

                  <div className="space-y-3 pt-1">
                    {/* Checkbox settings */}
                    <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowResubmission}
                        onChange={(e) => setAllowResubmission(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mt-0.5"
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-gray-800">Izinkan Pengumpulan Ulang (Resubmission)</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Siswa dapat mengirimkan pengerjaan revisi / perbaikan.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shuffleQuestions}
                        onChange={(e) => setShuffleQuestions(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mt-0.5"
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-gray-800">Acak Urutan Pertanyaan (Shuffle Questions)</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Urutan pertanyaan akan diacak untuk setiap siswa secara acak.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shuffleChoices}
                        onChange={(e) => setShuffleChoices(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mt-0.5"
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-gray-800">Acak Opsi Pilihan Ganda (Shuffle Choices)</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Mencegah siswa menyontek dengan mengacak posisi opsi pilihan ganda A, B, C, D.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireAll}
                        onChange={(e) => setRequireAll(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mt-0.5"
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-gray-800">Wajibkan Menjawab Semua Pertanyaan</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Siswa tidak dapat mengumpulkan lembar ujian jika ada soal kosong.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showScore}
                        onChange={(e) => setShowScore(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mt-0.5"
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-gray-800">Tampilkan Nilai Langsung Ke Siswa</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Siswa dapat langsung melihat skor autograde setelah selesai mengumpulkan.</p>
                      </div>
                    </label>
                  </div>

                  {/* Status / Visibility Options */}
                  <div className="space-y-2 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Metode Publikasi</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 'draft', label: 'Draft / Simpan' },
                        { val: 'published', label: 'Publis Langsung' },
                        { val: 'scheduled', label: 'Jadwalkan Nanti' }
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setStatus(item.val as any)}
                          className={`p-2.5 rounded-xl border text-[10px] font-bold uppercase transition-all cursor-pointer text-center ${
                            status === item.val 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {status === 'scheduled' && (
                      <div className="space-y-1.5 pt-2 animate-fadeIn">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Pilih Waktu Penjadwalan</label>
                        <input
                          type="datetime-local"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Terapkan Pengaturan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
