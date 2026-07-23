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
  Loader2,
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
  HelpCircle as QuestionIcon,
  Sparkles,
  Wand2,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Circle, Assignment, Question } from '../types';
import CustomDropdown from './CustomDropdown';
import CustomDatePicker from './CustomDatePicker';
import CustomCheckbox from './CustomCheckbox';

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

interface CustomNumberStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  unit?: string;
}

function CustomNumberStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  step = 1,
  disabled = false,
  className = '',
  unit = ''
}: CustomNumberStepperProps) {
  const handleDecrement = () => {
    if (disabled) return;
    const newVal = Math.max(min, value - step);
    onChange(newVal);
  };

  const handleIncrement = () => {
    if (disabled) return;
    const newVal = Math.min(max, value + step);
    onChange(newVal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) {
      onChange(min);
    } else {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  return (
    <div className={`inline-flex items-center bg-black/40 border border-white/15 rounded-[2px] p-1 gap-1 transition-all ${disabled ? 'opacity-50' : ''} ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="w-7 h-7 rounded-[2px] bg-[#2F3138] text-white font-bold text-sm flex items-center justify-center border border-white/15 hover:border-[#66C0F4] disabled:opacity-30 cursor-pointer select-none"
        title="Kurangi"
      >
        -
      </button>
      <div className="flex-1 flex items-center justify-center px-2">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className="w-12 text-center bg-transparent text-xs font-bold text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && <span className="text-[11px] font-normal text-[#8A8A8A] ml-0.5">{unit}</span>}
      </div>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="w-7 h-7 rounded-[2px] bg-[#2F3138] text-white font-bold text-sm flex items-center justify-center border border-white/15 hover:border-[#66C0F4] disabled:opacity-30 cursor-pointer select-none"
        title="Tambah"
      >
        +
      </button>
    </div>
  );
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

  // AI Generator Modal States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiQuestionCount, setAiQuestionCount] = useState<number>(5);
  const [aiDifficulty, setAiDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit'>('Sedang');
  const [aiQuestionType, setAiQuestionType] = useState<'all' | 'multiple_choice' | 'essay' | 'true_false'>('all');
  const [aiPointsPerQuestion, setAiPointsPerQuestion] = useState<number>(10);
  const [aiCustomInstructions, setAiCustomInstructions] = useState('');
  const [aiMode, setAiMode] = useState<'append' | 'replace'>('replace');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Gemini AI Assignment Generator Handler
  const handleGenerateAiAssignment = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Silakan isi topik atau materi tugas yang ingin dibuat.');
      return;
    }

    setAiGenerating(true);
    setAiError(null);

    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || '';

    if (!apiKey) {
      setAiError('API Key Gemini belum dikonfigurasi. Silakan tambahkan VITE_GEMINI_API_KEY di file .env Anda.');
      setAiGenerating(false);
      return;
    }

    const clampedCount = Math.min(20, Math.max(1, aiQuestionCount || 5));

    const systemPrompt = `Anda adalah asisten pembuat kuis & lembar kerja tugas sekolah profesional untuk guru.
Buatlah tugas belajar lengkap dalam format JSON terstruktur yang persis mengikuti petunjuk berikut.

PERSYARATAN:
- Topik/Materi: "${aiPrompt.trim()}"
- Tingkat Kesulitan: ${aiDifficulty}
- Jumlah Soal: ${clampedCount}
- Jenis Soal yang Diinginkan: ${
      aiQuestionType === 'multiple_choice'
        ? 'Hanya Pilihan Ganda (multiple_choice)'
        : aiQuestionType === 'essay'
          ? 'Hanya Jawaban Teks / Esai (essay)'
          : aiQuestionType === 'true_false'
            ? 'Hanya Benar / Salah (true_false)'
            : aiQuestionType === 'matching'
              ? 'Hanya Matching / Menjodohkan (matching)'
              : 'Campuran antara Jawaban Teks, Pilihan Ganda, Benar/Salah, dan Matching'
    }
- Bobot Poin Standar Per Soal: ${aiPointsPerQuestion}
${aiCustomInstructions ? `- Instruksi Tambahan: "${aiCustomInstructions.trim()}"` : ''}

FORMAT OUTPUT HANYA DALAM JSON DENGAN STRUKTUR BERIKUT:
{
  "title": "Judul Tugas yang Jelas dan Menarik",
  "description": "Petunjuk pengerjaan tugas singkat untuk siswa.",
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Teks pertanyaan jelas...",
      "choices": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "correctAnswer": "0",
      "answerGuide": "Penjelasan mengapa jawaban tersebut benar",
      "points": ${aiPointsPerQuestion}
    },
    {
      "type": "essay",
      "question": "Teks pertanyaan esai / jawaban teks...",
      "choices": [],
      "correctAnswer": "",
      "answerGuide": "Kunci jawaban / panduan poin penting penilaian manual guru",
      "points": ${aiPointsPerQuestion}
    },
    {
      "type": "true_false",
      "question": "Pernyataan yang dievaluasi...",
      "choices": ["Benar", "Salah"],
      "correctAnswer": "true",
      "trueFalseCorrect": "true",
      "answerGuide": "Penjelasan fakta yang benar",
      "points": ${aiPointsPerQuestion}
    },
    {
      "type": "matching",
      "question": "Jodohkan item di sebelah kiri dengan pasangan jawaban yang sesuai di sebelah kanan.",
      "matchingPairs": [
        { "left": "Pernyataan / Item 1", "right": "Pasangan Jawaban A" },
        { "left": "Pernyataan / Item 2", "right": "Pasangan Jawaban A" },
        { "left": "Pernyataan / Item 3", "right": "Pasangan Jawaban B" }
      ],
      "points": ${aiPointsPerQuestion}
    }
  ]
}

CATATAN KHUSUS:
1. Untuk type "multiple_choice", pilihan dapat berjumlah 3 (A-C) atau 4 (A-D) dan correctAnswer adalah indeks string "0", "1", "2", atau "3".
2. Untuk type "true_false", correctAnswer harus "true" atau "false" dan trueFalseCorrect harus "true" atau "false".
3. Untuk type "essay", berikan answerGuide yang berguna bagi guru untuk menilai secara manual.
4. Untuk type "matching", berikan daftar matchingPairs (item left dan right). Jika ada jawaban kanan yang sama (contoh I pasangannya DO, You pasangannya DO), tuliskan apa adanya di matchingPairs karena sistem akan otomatis mendeduplikasi opsi kanan menjadi unik.
5. Jangan tambahkan teks lain di luar JSON valid!`;

    const modelCandidates = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3-flash-preview',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-flash-latest'
    ];

    let successData: any = null;
    let lastErrMessage = '';

    for (const model of modelCandidates) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7
            }
          })
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const rawText = data.candidates[0].content.parts[0].text;
          const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          successData = JSON.parse(cleanedText);
          break;
        } else if (data.error?.message) {
          lastErrMessage = data.error.message;
        }
      } catch (err: any) {
        lastErrMessage = err.message || 'Gagal menghubungi server Gemini AI.';
      }
    }

    if (!successData) {
      setAiError(lastErrMessage || 'Gagal membuat tugas dengan AI. Coba ubah prompt atau coba lagi.');
      setAiGenerating(false);
      return;
    }

    try {
      if (successData.title) {
        setTitle(prev => (!prev || aiMode === 'replace' ? successData.title : prev));
      }
      if (successData.description) {
        setDescription(prev => (!prev || aiMode === 'replace' ? successData.description : prev));
      }

      if (Array.isArray(successData.questions) && successData.questions.length > 0) {
        const newQuestions: LocalQuestion[] = successData.questions.map((q: any) => {
          const qType = q.type || 'multiple_choice';
          let correctAns = String(q.correctAnswer ?? '0');
          let tfCorrect: 'true' | 'false' = 'true';

          if (qType === 'true_false') {
            if (correctAns === 'false' || q.trueFalseCorrect === 'false') {
              tfCorrect = 'false';
              correctAns = 'false';
            } else {
              tfCorrect = 'true';
              correctAns = 'true';
            }
          }

          return {
            id: 'new_' + Math.random().toString(36).substring(2, 9),
            type: qType,
            question: q.question || '',
            choices: Array.isArray(q.choices) && q.choices.length > 0 ? q.choices : ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
            correctAnswer: correctAns,
            answerGuide: q.answerGuide || '',
            points: Number(q.points || aiPointsPerQuestion || 10),
            isCollapsed: false,
            trueFalseCorrect: tfCorrect,
            matchingPairs: q.matchingPairs || [],
            fillBlankAnswers: q.fillBlankAnswers || [],
            audioUrl: '',
            speakingPrompt: '',
            allowedFileTypes: ['pdf', 'doc', 'docx']
          };
        });

        if (aiMode === 'replace') {
          setQuestions(newQuestions);
        } else {
          setQuestions(prev => [...prev, ...newQuestions]);
        }
      }

      setIsAiModalOpen(false);
      setAiPrompt('');
      setAiCustomInstructions('');
    } catch (parseErr: any) {
      console.error('AI Generation parse error:', parseErr);
      setAiError('Gagal memproses hasil dari AI. Format data tidak sesuai.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Scroll lock background body when modal popups are active
  useEffect(() => {
    if (isSettingsOpen || isAiModalOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isSettingsOpen, isAiModalOpen]);

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
      <div className="min-h-screen bg-[#171A21] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#66C0F4] animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#C6D4DF] uppercase tracking-widest">Memuat Lembar Kerja Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171A21] flex flex-col font-sans text-white" id="assignment-builder">
      {/* 1. TOP HEADER SECTION */}
      <header className="sticky top-0 bg-[#171A21] border-b border-white/10 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-40 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/teacher')}
            className="bg-[#2F3138] hover:bg-white/10 text-white p-2 rounded-[2px] border border-white/15 flex items-center justify-center cursor-pointer shrink-0 transition-all"
            style={{ minWidth: '38px', minHeight: '38px' }}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider">LMS Assignment Builder</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[9px] font-bold uppercase ${
                status === 'published' 
                  ? 'bg-[#A1CD44] text-[#171A21]' 
                  : status === 'scheduled'
                    ? 'bg-[#66C0F4] text-[#171A21]'
                    : 'bg-white/10 text-[#C6D4DF]'
              }`}>
                {status === 'published' ? 'Dipublikasikan' : status === 'scheduled' ? 'Djadwalkan' : 'Draft'}
              </span>
            </div>
            <h1 className="text-md sm:text-lg font-bold text-white truncate tracking-tight mt-0.5">
              {title || 'Tugas Baru Tanpa Judul'}
            </h1>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-2">
          {/* AI Generator Button */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all rounded-[2px] text-white bg-[#66C0F4] hover:bg-[#5DADE2] shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            style={{ minHeight: '38px' }}
            title="Buat Tugas Otomatis Menggunakan AI"
          >
            <Sparkles className="w-4 h-4 text-white fill-white" />
            <span className="hidden sm:inline font-bold uppercase tracking-wider">Buat dengan AI</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`p-2 text-xs font-normal cursor-pointer transition-all rounded-[2px] border ${
              isPreviewMode 
                ? 'bg-[#66C0F4] text-[#171A21] border-[#66C0F4] font-bold' 
                : 'bg-transparent text-[#C6D4DF] border-white/20 hover:border-white/40'
            }`}
            style={{ minWidth: '38px', minHeight: '38px' }}
            title={isPreviewMode ? 'Keluar Pratinjau' : 'Pratinjau Siswa'}
            aria-label="Pratinjau Siswa"
          >
            <Eye className="w-4.5 h-4.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="bg-transparent text-[#C6D4DF] hover:text-white border border-white/20 hover:border-white/40 p-2 text-xs font-normal flex items-center justify-center cursor-pointer rounded-[2px] transition-all"
            style={{ minWidth: '38px', minHeight: '38px' }}
            title="Pengaturan Tugas"
            aria-label="Pengaturan Tugas"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saveLoading}
            className="bg-transparent text-[#C6D4DF] hover:text-white border border-white/20 hover:border-white/40 p-2 text-xs font-normal flex items-center justify-center cursor-pointer disabled:opacity-50 rounded-[2px] transition-all"
            style={{ minWidth: '38px', minHeight: '38px' }}
            title="Simpan Draft"
            aria-label="Simpan Draft"
          >
            <Save className="w-4.5 h-4.5" />
          </button>

          {/* Most Prominent Publish Button */}
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={saveLoading}
            className="bg-[#A1CD44] hover:bg-[#8FBA3B] text-[#171A21] p-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all rounded-[2px]"
            style={{ minHeight: '38px', minWidth: '48px' }}
            title="Publikasikan Tugas"
            aria-label="Publikasikan Tugas"
          >
            {saveLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
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
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800 flex items-center gap-2.5">
              <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="font-bold">Mode Pratinjau (Hanya Baca)</p>
                <p className="text-amber-700 mt-0.5">Siswa akan melihat dan menjawab lembar ujian Anda dengan format interaktif di bawah ini.</p>
              </div>
            </div>

            {/* Simulated Student Exam Header */}
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 sm:p-8 rounded-3xl shadow-3xs space-y-4">
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">{title || 'Tugas Baru Tanpa Judul'}</h2>
              {description && <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{description}</p>}
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-50 text-[11px] font-semibold text-gray-600 dark:text-slate-300">
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
                <div key={q.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">Soal #{idx + 1} ({q.type.replace('_', ' ')})</span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-slate-900 px-2 py-0.5 rounded-md">{q.points} Poin</span>
                  </div>

                  <p className="text-xs font-semibold text-gray-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">{q.question || '(Soal belum ditulis)'}</p>

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
                                ? 'bg-indigo-50 dark:bg-indigo-900/30/50 border-indigo-600 text-indigo-900 dark:text-indigo-100 ring-1 ring-indigo-600' 
                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:border-gray-300 dark:border-slate-600'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'
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
                      className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
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
                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:border-gray-300 dark:border-slate-600'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Matching layout with unique right options */}
                  {q.type === 'matching' && (
                    <div className="space-y-3 mt-2 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50">
                      <div className="space-y-2">
                        {q.matchingPairs?.map((pair, pIdx) => (
                          <div key={pIdx} className="flex items-center justify-between gap-4 text-xs">
                            <span className="font-semibold text-gray-700 dark:text-slate-200">{pair.left || 'Kiri'}</span>
                            <span className="text-gray-400">➔</span>
                            <span className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-slate-300 font-bold">{pair.right || 'Kanan'}</span>
                          </div>
                        ))}
                      </div>
                      {q.matchingPairs && q.matchingPairs.length > 0 && (
                        <div className="pt-2.5 border-t border-gray-200 dark:border-slate-700/60 text-[11px]">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">Daftar Pilihan Jawaban Kanan Unik (Dideduplikasi Sistem):</span>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.from(new Set(q.matchingPairs.map(p => p.right?.trim()).filter(Boolean))).map((opt, optIdx) => (
                              <span key={optIdx} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fill in blank mock */}
                  {q.type === 'fill_blank' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500 dark:text-slate-400">Tulis Jawaban Isian:</span>
                      <input
                        type="text"
                        value={previewAnswers[q.id] || ''}
                        onChange={(e) => setPreviewAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                        placeholder="Ketik kata/frasa kunci..."
                        className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  {/* Listening Mock */}
                  {q.type === 'listening' && (
                    <div className="space-y-3 mt-2 bg-gray-50 dark:bg-slate-900 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-slate-200">
                        <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Dengarkan Audio Soal:</span>
                      </div>
                      <audio controls src={q.audioUrl} className="w-full max-w-md h-8" />
                      <input
                        type="text"
                        value={previewAnswers[q.id] || ''}
                        onChange={(e) => setPreviewAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                        placeholder="Tulis apa yang Anda dengar..."
                        className="w-full p-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs"
                      />
                    </div>
                  )}

                  {/* Speaking Mock */}
                  {q.type === 'speaking' && (
                    <div className="space-y-3 mt-2 bg-gray-50 dark:bg-slate-900 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-slate-200">
                        <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Instruksi Berbicara:</span>
                      </div>
                      {q.speakingPrompt && <p className="text-xs italic text-gray-600 dark:text-slate-300 font-medium">"{q.speakingPrompt}"</p>}
                      <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">
                        <Mic className="w-3.5 h-3.5" /> Rekam Suara (Preview)
                      </button>
                    </div>
                  )}

                  {/* File Upload Mock */}
                  {q.type === 'file_upload' && (
                    <div className="space-y-3 mt-2 bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 text-center">
                      <Upload className="w-8 h-8 text-indigo-500 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-gray-700 dark:text-slate-200">Tarik atau Pilih Berkas Pengerjaan</p>
                        <p className="text-[10px] text-gray-400 mt-1">Berkas yang diizinkan: {q.allowedFileTypes?.join(', ') || 'Semua'}</p>
                      </div>
                      <button type="button" className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-bold rounded-xl">Pilih Berkas</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* WORKSPACE: QUESTION BUILDER LEFT SECTION */
          <div className="w-full lg:w-3/4 space-y-6">
            
            {/* Questions Builder Cards Container */}
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`bg-[#2F3138] border border-white/10 rounded-[3px] p-5 sm:p-6 space-y-4 relative shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${
                    draggedIndex === index ? 'opacity-40 border-dashed border-[#66C0F4] bg-black/40' : ''
                  }`}
                >
                  {/* Header Question Actions */}
                  <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="cursor-grab text-[#848E94] hover:text-white shrink-0" title="Tarik untuk Reorder">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="w-6 h-6 rounded-[2px] bg-[#66C0F4]/20 border border-[#66C0F4]/40 text-[#66C0F4] text-xs font-bold font-mono flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Single clean dropdown for question type */}
                        <CustomDropdown
                          variant="minimal"
                          size="sm"
                          dropdownWidth="w-48"
                          value={q.type}
                          onChange={(val) => updateQuestionField(index, 'type', val)}
                          options={[
                            { value: 'essay', label: 'Jawaban Teks (Manual Guru)' },
                            { value: 'multiple_choice', label: 'Pilihan Ganda (A-C / A-D)' },
                            { value: 'true_false', label: 'Benar / Salah (A-C / A-D)' },
                            { value: 'matching', label: 'Matching / Menjodohkan (Opsi Unik)' }
                          ]}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 text-[#8A8A8A] hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Geser ke Atas"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(index)}
                        disabled={index === questions.length - 1}
                        className="p-1.5 text-[#8A8A8A] hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Geser ke Bawah"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateQuestion(index)}
                        className="p-1.5 text-[#8A8A8A] hover:text-[#66C0F4] hover:bg-white/10 rounded-[2px] cursor-pointer"
                        title="Duplikat Soal"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteQuestion(index)}
                        className="p-1.5 text-[#8A8A8A] hover:text-[#FF4B4B] hover:bg-white/10 rounded-[2px] cursor-pointer"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuestionField(index, 'isCollapsed', !q.isCollapsed)}
                        className="p-1.5 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] font-bold text-[10px] uppercase cursor-pointer"
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
                        <label className="block text-xs font-semibold text-white">Pertanyaan Soal</label>
                        <textarea
                          rows={3}
                          value={q.question}
                          onChange={(e) => updateQuestionField(index, 'question', e.target.value)}
                          placeholder="Tulis isi pertanyaan secara lengkap, jelas, dan lugas di sini..."
                          className="block w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] resize-none font-sans"
                        />
                      </div>

                      {/* 1. Multiple Choice Specific Inputs */}
                      {q.type === 'multiple_choice' && (
                        <div className="space-y-3 pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#66C0F4] uppercase tracking-wider block">Opsi Pilihan Jawaban</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const nextChoices = q.choices.slice(0, 3);
                                  while (nextChoices.length < 3) {
                                    nextChoices.push(`Opsi ${String.fromCharCode(65 + nextChoices.length)}`);
                                  }
                                  updateQuestionField(index, 'choices', nextChoices);
                                  if (Number(q.correctAnswer) >= 3) updateQuestionField(index, 'correctAnswer', '0');
                                }}
                                className={`px-2.5 py-1 rounded-[2px] text-[10px] font-bold transition-all cursor-pointer ${
                                  q.choices.length === 3
                                    ? 'bg-[#66C0F4] text-[#171A21]'
                                    : 'bg-black/40 border border-white/15 text-[#C6D4DF]'
                                }`}
                              >
                                3 Opsi (A-C)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextChoices = q.choices.slice(0, 4);
                                  while (nextChoices.length < 4) {
                                    nextChoices.push(`Opsi ${String.fromCharCode(65 + nextChoices.length)}`);
                                  }
                                  updateQuestionField(index, 'choices', nextChoices);
                                }}
                                className={`px-2.5 py-1 rounded-[2px] text-[10px] font-bold transition-all cursor-pointer ${
                                  q.choices.length === 4
                                    ? 'bg-[#66C0F4] text-[#171A21]'
                                    : 'bg-black/40 border border-white/15 text-[#C6D4DF]'
                                }`}
                              >
                                4 Opsi (A-D)
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.choices.map((choice, choiceIdx) => {
                              const optLabel = String.fromCharCode(65 + choiceIdx);
                              return (
                                <div key={choiceIdx} className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-[#8A8A8A] w-4 shrink-0 text-center">{optLabel}</span>
                                  <input
                                    type="text"
                                    value={choice}
                                    onChange={(e) => {
                                      const nextChoices = [...q.choices];
                                      nextChoices[choiceIdx] = e.target.value;
                                      updateQuestionField(index, 'choices', nextChoices);
                                    }}
                                    placeholder={`Jawaban Opsi ${optLabel}...`}
                                    className="flex-1 px-3 py-2 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                                  />
                                </div>
                              );
                            })}
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <label className="block text-xs font-semibold text-white">Kunci Jawaban Benar</label>
                            <CustomDropdown
                              value={q.correctAnswer}
                              onChange={(val) => updateQuestionField(index, 'correctAnswer', val)}
                              options={q.choices.map((c, cIdx) => ({
                                value: String(cIdx),
                                label: `Opsi ${String.fromCharCode(65 + cIdx)}${c ? `: ${c}` : ''}`
                              }))}
                            />
                          </div>
                        </div>
                      )}

                      {/* 2. Essay Specific Inputs */}
                      {q.type === 'essay' && (
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-white">Panduan Kunci Jawaban / Kisi-kisi (Opsional)</label>
                            <textarea
                              rows={2}
                              value={q.answerGuide}
                              onChange={(e) => updateQuestionField(index, 'answerGuide', e.target.value)}
                              placeholder="Tulis indikator utama atau kata kunci yang diutamakan dari pengerjaan siswa..."
                              className="block w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none resize-none font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {/* 3. True / False Specific Inputs */}
                      {q.type === 'true_false' && (
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <label className="block text-xs font-semibold text-white">Kunci Jawaban Benar</label>
                          <div className="flex gap-3">
                            {['true', 'false'].map((tfVal) => (
                              <button
                                key={tfVal}
                                type="button"
                                onClick={() => updateQuestionField(index, 'correctAnswer', tfVal)}
                                className={`px-4 py-2 rounded-[2px] border text-xs font-bold cursor-pointer transition-all ${
                                  q.correctAnswer === tfVal 
                                    ? 'bg-[#66C0F4] border-[#66C0F4] text-[#171A21]' 
                                    : 'bg-black/40 border-white/15 text-[#C6D4DF] hover:border-white/30'
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
                        <div className="space-y-3 pt-2 border-t border-white/10">
                          <span className="text-[10px] font-bold text-[#66C0F4] uppercase tracking-wider block">Pasangan Menjodohkan</span>
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
                                className="flex-1 px-3 py-2 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white"
                              />
                              <span className="text-[#848E94]">➔</span>
                              <input
                                type="text"
                                value={pair.right}
                                onChange={(e) => {
                                  const nextPairs = [...(q.matchingPairs || [])];
                                  nextPairs[pIdx].right = e.target.value;
                                  updateQuestionField(index, 'matchingPairs', nextPairs);
                                }}
                                placeholder="Kanan (Jawaban)..."
                                className="flex-1 px-3 py-2 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const nextPairs = (q.matchingPairs || []).filter((_, i) => i !== pIdx);
                                  updateQuestionField(index, 'matchingPairs', nextPairs);
                                }}
                                className="p-1.5 text-[#8A8A8A] hover:text-[#FF4B4B] cursor-pointer"
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
                            className="text-xs text-[#66C0F4] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            + Tambah Pasangan Menjodohkan
                          </button>
                        </div>
                      )}

                      {/* 5. Fill in the Blank Specific Inputs */}
                      {q.type === 'fill_blank' && (
                        <div className="space-y-3 pt-2 border-t border-white/10">
                          <span className="text-[10px] font-bold text-[#66C0F4] uppercase tracking-wider block">Alternatif Jawaban Isian Singkat</span>
                          {q.fillBlankAnswers?.map((ans, aIdx) => (
                            <div key={aIdx} className="flex items-center gap-3">
                              <input
                                type="text"
                                value={ans}
                                onChange={(e) => {
                                  const nextAns = [...(q.fillBlankAnswers || [])];
                                  nextAns[aIdx] = e.target.value;
                                  updateQuestionField(index, 'fillBlankAnswers', nextAns);
                                }}
                                placeholder={`Alternatif ${aIdx + 1}...`}
                                className="flex-1 px-3 py-2 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const nextAns = (q.fillBlankAnswers || []).filter((_, i) => i !== aIdx);
                                  updateQuestionField(index, 'fillBlankAnswers', nextAns);
                                }}
                                className="p-1.5 text-[#8A8A8A] hover:text-[#FF4B4B] cursor-pointer"
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
                            className="text-xs text-[#66C0F4] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            + Tambah Alternatif Jawaban Benar
                          </button>
                        </div>
                      )}

                      {/* 6. Listening Specific Inputs */}
                      {q.type === 'listening' && (
                        <div className="space-y-3 pt-2 border-t border-white/10">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-white">Tautan Berkas Audio Soal (URL)</label>
                            <input
                              type="text"
                              value={q.audioUrl}
                              onChange={(e) => updateQuestionField(index, 'audioUrl', e.target.value)}
                              placeholder="Masukkan link hosting audio (mp3/wav) untuk diputar siswa..."
                              className="block w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* 7. Speaking Specific Inputs */}
                      {q.type === 'speaking' && (
                        <div className="space-y-3 pt-2 border-t border-gray-50">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Teks / Kalimat yang Harus Dibaca Siswa</label>
                            <textarea
                              rows={2}
                              value={q.speakingPrompt}
                              onChange={(e) => updateQuestionField(index, 'speakingPrompt', e.target.value)}
                              placeholder="Tulis kalimat bahasa inggris atau kalimat lainnya untuk dilatih siswa..."
                              className="block w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs resize-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* 8. File Upload Specific Inputs */}
                      {q.type === 'file_upload' && (
                        <div className="space-y-3 pt-2 border-t border-gray-50">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-200">Ekstensi Berkas yang Diizinkan (Koma-Terpisah)</label>
                            <input
                              type="text"
                              value={q.allowedFileTypes?.join(', ')}
                              onChange={(e) => updateQuestionField(index, 'allowedFileTypes', e.target.value.split(',').map(s => s.trim()))}
                              placeholder="pdf, doc, docx, png, jpg..."
                              className="block w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* General Question Parameters */}
                      <div className="pt-3 border-t border-gray-50 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">Bobot EXP Soal:</span>
                          <CustomNumberStepper
                            value={q.points}
                            onChange={(val) => updateQuestionField(index, 'points', val)}
                            min={1}
                            max={100}
                            unit="Poin"
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
          </div>
        )}

        {/* 3. RIGHT SECTION: STICKY LIVE SUMMARY PANEL */}
        <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-6 space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">Ringkasan Soal</h3>
            
            <div className="space-y-3 divide-y divide-white/5">
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#C6D4DF] font-normal">Total Pertanyaan:</span>
                <span className="font-bold text-white font-mono text-sm">{questions.length} Soal</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2.5">
                <span className="text-[#C6D4DF] font-normal">Pilihan Ganda:</span>
                <span className="font-bold text-white font-mono">{mcCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2.5">
                <span className="text-[#C6D4DF] font-normal">Jawaban Singkat (Esai):</span>
                <span className="font-bold text-white font-mono">{essayCount}</span>
              </div>
              {otherCount > 0 && (
                <div className="flex items-center justify-between text-xs pt-2.5">
                  <span className="text-[#C6D4DF] font-normal">Tipe Lainnya (Scalable):</span>
                  <span className="font-bold text-[#66C0F4] font-mono">+{otherCount}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs pt-2.5">
                <span className="text-[#C6D4DF] font-normal">Akumulasi EXP:</span>
                <span className="font-bold text-[#B9A074] font-mono text-sm">{totalPoints} EXP</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2.5">
                <span className="text-[#C6D4DF] font-normal">Estimasi Durasi:</span>
                <span className="font-bold text-white font-mono">{estimatedDuration} Menit</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2.5">
                <span className="text-[#C6D4DF] font-normal">Tingkat Kesulitan:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase bg-white/10 text-white border border-white/20">
                  {difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2.5">
                <span className="text-[#C6D4DF] font-normal">Penerima Tugas:</span>
                <span className="font-bold text-white truncate max-w-[120px]">
                  {targetType === 'INDIVIDUAL' 
                    ? (students.find(s => s.uid === selectedStudentId)?.fullName || 'Belum dipilih')
                    : (circles.find(c => c.id === selectedCircleId)?.name || 'Belum dipilih')
                  }
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="bg-[#66C0F4] hover:bg-[#5DADE2] text-white w-full py-2.5 rounded-[2px] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Ubah Pengaturan Tugas</span>
              </button>
            </div>
          </div>

          {/* COMPACT TAMBAH SOAL CARD IN SIDEBAR */}
          <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-5 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Plus className="w-4 h-4 text-[#66C0F4]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tambah Pertanyaan</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => addQuestion('multiple_choice')}
                className="p-2 bg-transparent hover:bg-[#66C0F4]/15 border border-white/20 hover:border-[#66C0F4] text-white rounded-[2px] text-[11px] font-normal flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0 text-[#66C0F4]" />
                <span>Pilihan Ganda</span>
              </button>
              
              <button
                type="button"
                onClick={() => addQuestion('essay')}
                className="p-2 bg-transparent hover:bg-[#66C0F4]/15 border border-white/20 hover:border-[#66C0F4] text-white rounded-[2px] text-[11px] font-normal flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 shrink-0 text-[#66C0F4]" />
                <span>Esai / Jawaban</span>
              </button>

              <button
                type="button"
                onClick={() => addQuestion('true_false')}
                className="p-2 bg-transparent hover:bg-[#66C0F4]/15 border border-white/20 hover:border-[#66C0F4] text-white rounded-[2px] text-[11px] font-normal flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 shrink-0 text-[#A1CD44]" />
                <span>Benar / Salah</span>
              </button>

              <button
                type="button"
                onClick={() => addQuestion('matching')}
                className="p-2 bg-transparent hover:bg-[#66C0F4]/15 border border-white/20 hover:border-[#66C0F4] text-white rounded-[2px] text-[11px] font-normal flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 shrink-0 text-[#B9A074]" />
                <span>Menjodohkan</span>
              </button>

              <button
                type="button"
                onClick={() => addQuestion('fill_blank')}
                className="col-span-2 p-2 bg-transparent hover:bg-[#66C0F4]/15 border border-white/20 hover:border-[#66C0F4] text-white rounded-[2px] text-[11px] font-normal flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <QuestionIcon className="w-3.5 h-3.5 shrink-0 text-[#66C0F4]" />
                <span>Isian Singkat</span>
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* 4. SETTINGS MODAL DIALOG */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50 overscroll-contain overflow-y-auto animate-fadeIn"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2F3138] border border-white/20 rounded-[4px] w-[880px] h-[660px] max-w-[95vw] max-h-[90vh] p-6 sm:p-8 space-y-6 relative overflow-y-auto my-auto overscroll-contain shadow-[0_6px_16px_rgba(0,0,0,0.6)] text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#66C0F4]" />
                  <h2 className="text-lg font-bold text-white">Pengaturan Lembar Tugas</h2>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] cursor-pointer"
                  style={{ minWidth: '40px', minHeight: '40px' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                {/* COLUMN 1: BASIC INFORMATION & PROMINENT TARGET SELECTION */}
                <div className="space-y-4">
                  {/* PROMINENT TARGET SELECTION FIRST */}
                  <div className="bg-black/40 border border-white/15 p-4 rounded-[2px] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4.5 h-4.5 text-[#66C0F4] shrink-0" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Target Penerima Tugas (Utama)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-[2px] text-[9px] font-bold uppercase bg-[#66C0F4]/20 border border-[#66C0F4]/40 text-[#66C0F4]">
                        Wajib
                      </span>
                    </div>

                    <div className="flex bg-[#2F3138] p-1 rounded-[2px] border border-white/15">
                      <button
                        type="button"
                        onClick={() => setTargetType('INDIVIDUAL')}
                        className={`flex-1 py-1.5 rounded-[2px] text-xs font-bold transition-all cursor-pointer ${
                          targetType === 'INDIVIDUAL' 
                            ? 'bg-[#66C0F4] text-[#171A21]' 
                            : 'text-[#C6D4DF] hover:text-white'
                        }`}
                      >
                        Siswa Individu
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetType('CIRCLE')}
                        className={`flex-1 py-1.5 rounded-[2px] text-xs font-bold transition-all cursor-pointer ${
                          targetType === 'CIRCLE' 
                            ? 'bg-[#66C0F4] text-[#171A21]' 
                            : 'text-[#C6D4DF] hover:text-white'
                        }`}
                      >
                        Kelompok Belajar (Circle)
                      </button>
                    </div>

                    {targetType === 'INDIVIDUAL' ? (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-white">Pilih Siswa Penerima <span className="text-[#FF4B4B]">*</span></label>
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
                                ? 'bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/40'
                                : 'bg-[#A1CD44] text-[#171A21]'
                            }
                          }))}
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-white">Pilih Kelompok Belajar Circle <span className="text-[#FF4B4B]">*</span></label>
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
                  </div>

                  <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block border-b border-white/10 pb-1">Informasi Dasar</span>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-white">Judul Ujian / Tugas <span className="text-[#FF4B4B]">*</span></label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: English Mid-Semester Examination..."
                      className="block w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4]"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-white">Petunjuk & Deskripsi Pengerjaan</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Contoh: Bacalah setiap soal dengan teliti. Jawablah soal esai dengan detail..."
                      className="block w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Deadline & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-white">Batas Pengumpulan (Deadline)</label>
                      <CustomDatePicker
                        value={deadline}
                        onChange={(val) => setDeadline(val)}
                        placeholder="Pilih Deadline"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-white">Durasi Pengerjaan (Menit)</label>
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={estimatedDuration}
                        onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                        className="block w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white focus:outline-none focus:border-[#66C0F4]"
                      />
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-white">Tingkat Kesulitan</label>
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
                  <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block border-b border-white/10 pb-1">Opsi Tugas & Aturan</span>

                  <div className="space-y-3 pt-1">
                    {/* Checkbox settings */}
                    <CustomCheckbox
                      checked={allowResubmission}
                      onChange={setAllowResubmission}
                      label="Izinkan Pengumpulan Ulang (Resubmission)"
                      description="Siswa dapat mengirimkan pengerjaan revisi / perbaikan."
                    />

                    <CustomCheckbox
                      checked={shuffleQuestions}
                      onChange={setShuffleQuestions}
                      label="Acak Urutan Pertanyaan (Shuffle Questions)"
                      description="Urutan pertanyaan akan diacak untuk setiap siswa secara acak."
                    />

                    <CustomCheckbox
                      checked={shuffleChoices}
                      onChange={setShuffleChoices}
                      label="Acak Opsi Pilihan Ganda (Shuffle Choices)"
                      description="Mencegah siswa menyontek dengan mengacak posisi opsi pilihan ganda A, B, C, D."
                    />

                    <CustomCheckbox
                      checked={requireAll}
                      onChange={setRequireAll}
                      label="Wajibkan Menjawab Semua Pertanyaan"
                      description="Siswa tidak dapat mengumpulkan lembar ujian jika ada soal kosong."
                    />

                    <CustomCheckbox
                      checked={showScore}
                      onChange={setShowScore}
                      label="Tampilkan Nilai Langsung Ke Siswa"
                      description="Siswa dapat langsung melihat skor autograde setelah selesai mengumpulkan."
                    />
                  </div>

                  {/* Status / Visibility Options */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Metode Publikasi</span>
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
                          className={`p-2 rounded-[2px] border text-[10px] font-bold uppercase transition-all cursor-pointer text-center ${
                            status === item.val 
                              ? 'bg-[#66C0F4] border-[#66C0F4] text-[#171A21]' 
                              : 'bg-black/40 border-white/15 text-[#C6D4DF] hover:border-[#66C0F4]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {status === 'scheduled' && (
                      <div className="space-y-1.5 pt-2 animate-fadeIn">
                        <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase">Pilih Waktu Penjadwalan</label>
                        <input
                          type="datetime-local"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="block w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-5 py-2.5 bg-[#66C0F4] hover:bg-[#5DADE2] text-white text-xs font-bold rounded-[2px] cursor-pointer transition-all shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                >
                  Terapkan Pengaturan
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* AI GENERATOR MODAL POPUP */}
        {isAiModalOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overscroll-contain overflow-y-auto animate-fadeIn"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-[#2F3138] border border-white/20 rounded-[4px] p-6 sm:p-8 max-w-2xl w-full shadow-[0_6px_16px_rgba(0,0,0,0.6)] space-y-6 relative overflow-y-auto my-8 overscroll-contain text-white"
            >
              {/* Header Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#66C0F4] rounded-t-[4px]" />
              
              <div className="flex items-start justify-between gap-4 pt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">Generator Tugas AI</h2>
                    <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider bg-[#66C0F4] text-[#171A21]">
                      GEMINI AI
                    </span>
                  </div>
                  <p className="text-xs text-[#C6D4DF] mt-1 leading-relaxed font-normal">
                    Rancang pertanyaan, kunci jawaban, dan bobot nilai secara otomatis berdasarkan materi tugas Anda.
                  </p>
                </div>

                <button 
                  onClick={() => setIsAiModalOpen(false)}
                  disabled={aiGenerating}
                  className="px-3 py-1.5 text-xs font-normal text-white bg-transparent hover:bg-white/10 border border-white/20 rounded-[2px] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Tutup
                </button>
              </div>

              {aiError && (
                <div className="p-3.5 bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 rounded-[2px] text-xs text-[#FF4B4B]">
                  <span className="font-bold uppercase tracking-wider block mb-0.5">PERHATIAN</span>
                  <p className="font-normal leading-relaxed">{aiError}</p>
                </div>
              )}

              <div className="space-y-5">
                {/* 1. Prompt / Topic Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Topik / Deskripsi Materi Tugas <span className="text-[#FF4B4B]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Tata Bahasa Inggris Present Perfect vs Past Simple untuk kelas 9 SMP, sertakan contoh kalimat nyata..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    disabled={aiGenerating}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] transition-all font-sans leading-relaxed"
                  />
                </div>

                {/* 2. Grid Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Jumlah Soal Input Stepper (- dan +) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                        Jumlah Soal
                      </label>
                      <span className="text-[10px] text-[#66C0F4] font-bold">Maks. 20 Soal</span>
                    </div>
                    <CustomNumberStepper
                      value={aiQuestionCount}
                      onChange={(val) => setAiQuestionCount(val)}
                      min={1}
                      max={20}
                      disabled={aiGenerating}
                      className="w-full"
                      unit="Soal"
                    />
                  </div>

                  {/* Jenis Soal */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                      Tipe / Jenis Soal
                    </label>
                    <CustomDropdown
                      value={aiQuestionType}
                      onChange={(val) => setAiQuestionType(val as any)}
                      disabled={aiGenerating}
                      options={[
                        { value: 'all', label: 'Campuran Semua Jenis Soal' },
                        { value: 'essay', label: 'Jawaban Teks (Manual Guru)' },
                        { value: 'multiple_choice', label: 'Pilihan Ganda (A-C / A-D)' },
                        { value: 'true_false', label: 'Benar / Salah (A-C / A-D)' },
                        { value: 'matching', label: 'Matching / Menjodohkan (Opsi Unik)' }
                      ]}
                    />
                  </div>

                  {/* Tingkat Kesulitan */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                      Tingkat Kesulitan
                    </label>
                    <CustomDropdown
                      value={aiDifficulty}
                      onChange={(val) => setAiDifficulty(val as any)}
                      disabled={aiGenerating}
                      options={[
                        { value: 'Mudah', label: 'Mudah' },
                        { value: 'Sedang', label: 'Sedang' },
                        { value: 'Sulit', label: 'Sulit / HOTS' }
                      ]}
                    />
                  </div>

                  {/* Bobot Nilai Per Soal */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                      Bobot Nilai Per Soal (Poin)
                    </label>
                    <CustomNumberStepper
                      value={aiPointsPerQuestion}
                      onChange={(val) => setAiPointsPerQuestion(val)}
                      min={1}
                      max={100}
                      disabled={aiGenerating}
                      className="w-full"
                      unit="Poin"
                    />
                  </div>
                </div>

                {/* 3. Mode Pengaplikasian */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                    Mode Pengaplikasian Lembar Kerja
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAiMode('replace')}
                      disabled={aiGenerating}
                      className={`p-3 rounded-[2px] border text-xs font-bold transition-all text-left flex items-start gap-3 cursor-pointer ${
                        aiMode === 'replace'
                          ? 'bg-[#66C0F4]/15 border-[#66C0F4] text-white'
                          : 'bg-black/40 border-white/15 text-[#C6D4DF] hover:border-white/30'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border mt-0.5 shrink-0 transition-all ${aiMode === 'replace' ? 'border-[#66C0F4] bg-[#66C0F4]' : 'border-white/30'}`} />
                      <div>
                        <p className="font-bold">Gantikan Lembar Soal Saat Ini</p>
                        <p className="text-[10px] font-normal text-[#8A8A8A] mt-0.5">Membuat draft soal baru fully dari awal.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAiMode('append')}
                      disabled={aiGenerating}
                      className={`p-3 rounded-[2px] border text-xs font-bold transition-all text-left flex items-start gap-3 cursor-pointer ${
                        aiMode === 'append'
                          ? 'bg-[#66C0F4]/15 border-[#66C0F4] text-white'
                          : 'bg-black/40 border-white/15 text-[#C6D4DF] hover:border-white/30'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border mt-0.5 shrink-0 transition-all ${aiMode === 'append' ? 'border-[#66C0F4] bg-[#66C0F4]' : 'border-white/30'}`} />
                      <div>
                        <p className="font-bold">Tambahkan ke Soal Saat Ini</p>
                        <p className="text-[10px] font-normal text-[#8A8A8A] mt-0.5">Menyelipkan hasil AI di bawah daftar soal yang ada.</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. Instruksi Khusus (Optional) */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                    Instruksi Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Berikan pembahasannya di kolom panduan kunci jawaban..."
                    value={aiCustomInstructions}
                    onChange={(e) => setAiCustomInstructions(e.target.value)}
                    disabled={aiGenerating}
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] transition-all font-sans"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  disabled={aiGenerating}
                  className="px-4 py-2 bg-transparent hover:bg-white/10 text-white border border-white/20 font-normal text-xs rounded-[2px] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleGenerateAiAssignment}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="px-5 py-2 bg-[#66C0F4] hover:bg-[#5DADE2] text-white font-bold text-xs rounded-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all disabled:opacity-40 cursor-pointer"
                >
                  {aiGenerating ? (
                    <span className="animate-pulse">Merancang Soal AI...</span>
                  ) : (
                    <span>Generasi Soal Otomatis</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
