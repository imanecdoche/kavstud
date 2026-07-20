import { useState } from 'react';
import { 
  BookOpen, 
  User, 
  UserCheck, 
  CheckCircle, 
  Clock, 
  HelpCircle,
  Award,
  MessageSquare,
  ChevronRight,
  Send,
  UserX,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MockSubmission {
  studentName: string;
  answer: string;
  submittedAt: string;
  status: 'submitted' | 'graded';
  score?: number;
  feedback?: string;
}

export default function AssignmentWorkspace() {
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher'>('student');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [studentStatus, setStudentStatus] = useState<'waiting' | 'submitted' | 'graded'>('waiting');
  
  // Teacher active submission review list
  const [submissions, setSubmissions] = useState<MockSubmission[]>([
    { studentName: 'Ahmad Rafli', answer: 'Ikatan kovalen polar terjadi jika pasangan elektron ikatan (PEI) tertarik lebih kuat ke salah satu atom karena perbedaan keelektronegatifan, contohnya HCl dan H2O. Sedangkan non-polar ditarik sama kuat karena keelektronegatifannya sama atau simetris, contohnya O2 dan CH4.', submittedAt: '10:42 AM', status: 'submitted' },
    { studentName: 'Citra Kirana', answer: 'Polar artinya elektron menumpuk di satu sisi molekul karena salah satu unsur sangat egois menarik elektron (keelektronegatifan tinggi). Non polar itu adil dan merata pembagian elektronnya.', submittedAt: 'Yesterday', status: 'graded', score: 92, feedback: 'Jawaban yang sangat kreatif dan analoginya sangat mudah dipahami! Pertahankan kerja kerasmu.' }
  ]);

  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);
  const [gradeInput, setGradeInput] = useState('95');
  const [feedbackInput, setFeedbackInput] = useState('Analisis perbedaan polaritas molekul dijelaskan secara komparatif dengan contoh real yang sangat akurat. Bagus sekali!');

  // Student Actions
  const handleStudentSubmit = () => {
    if (!studentAnswer.trim()) return;
    setStudentStatus('submitted');
    // Prepend student's new answer to teacher's submissions list
    const newSub: MockSubmission = {
      studentName: 'Jane Doe (You)',
      answer: studentAnswer,
      submittedAt: 'Just Now',
      status: 'submitted'
    };
    setSubmissions(prev => [newSub, ...prev]);
  };

  // Teacher grading action
  const handleTeacherSubmitGrading = () => {
    const scoreVal = Number(gradeInput);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) return;

    setSubmissions(prev => {
      const updated = [...prev];
      updated[activeReviewIndex] = {
        ...updated[activeReviewIndex],
        status: 'graded',
        score: scoreVal,
        feedback: feedbackInput
      };
      return updated;
    });

    // If the teacher graded the student's own submission:
    if (submissions[activeReviewIndex].studentName.includes('(You)')) {
      setStudentStatus('graded');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl" id="assignment-workspace">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900">
            Kavio Assignment Workspace
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Grup komponen pengerjaan tugas & evaluasi nilai dengan navigasi role terintegrasi.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/50 self-start md:self-center">
          <button
            onClick={() => setCurrentRole('student')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRole === 'student' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Student View
          </button>
          <button
            onClick={() => setCurrentRole('teacher')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRole === 'teacher' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Teacher Grading View
          </button>
        </div>
      </div>

      {/* RENDER VIEW ACCORDING TO ROLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE ASSIGNMENT CARD & INSTRUCTIONS */}
        <div className="md:col-span-1 space-y-4">
          <div className="border border-gray-100 bg-white p-5 rounded-2xl shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                Kimia Dasar
              </span>
              <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> 5 Days Left
              </span>
            </div>

            <h3 className="text-xs font-semibold text-gray-900">
              Evaluasi Polarisasi & Ikatan Kimia Kovalen
            </h3>
            
            <p className="text-[11px] text-gray-500 leading-relaxed pt-2 border-t border-gray-50">
              <strong>Petunjuk:</strong> Tulis jawaban yang ringkas dan padat. Sertakan contoh molekul real yang ada di lingkungan sekitar Anda untuk memperkuat analisis perbedaan kovalen polar dan non-polar.
            </p>

            <div className="pt-3 flex items-center justify-between text-xs font-medium text-gray-700 bg-gray-50 p-2.5 rounded-lg">
              <span>Poin Maksimal:</span>
              <span className="font-mono text-indigo-600 font-bold">100 Poin</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED INTERACTIVE VIEWS */}
        <div className="md:col-span-2">
          
          {/* STUDENT perspective VIEW */}
          {currentRole === 'student' && (
            <div className="border border-gray-100 bg-white p-6 rounded-2xl shadow-2xs space-y-6">
              
              {/* Question card */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                <span className="text-[9px] font-mono font-bold text-indigo-600 block uppercase tracking-wider mb-1">Pertanyaan 1 (Soal Esai)</span>
                <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                  Jelaskan perbedaan fundamental antara ikatan kovalen polar dengan kovalen non-polar, dan sebutkan masing-masing 2 contoh senyawanya!
                </p>
              </div>

              {/* Status Badge indicator according to student status */}
              <div className="flex items-center justify-between py-2 border-b border-gray-50 text-xs">
                <span className="text-gray-500 font-medium">Status Tugas Anda:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  studentStatus === 'waiting' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  studentStatus === 'submitted' ? 'bg-indigo-50 text-indigo-700 border-indigo-100 animate-pulse' :
                  'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  {studentStatus === 'waiting' && 'MENUNGGU JAWABAN'}
                  {studentStatus === 'submitted' && 'TELAH DIKUMPULKAN'}
                  {studentStatus === 'graded' && 'TELAH DINILAI (GRADED)'}
                </span>
              </div>

              {/* Conditional Display based on submission state */}
              {studentStatus === 'waiting' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Tulis Jawaban Esai Anda</label>
                    <textarea
                      value={studentAnswer}
                      onChange={(e) => setStudentAnswer(e.target.value)}
                      placeholder="Ketik jawaban analitis Anda secara komparatif di sini..."
                      rows={6}
                      className="w-full p-3.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={handleStudentSubmit}
                    disabled={!studentAnswer.trim()}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kumpulkan Tugas Sekarang
                  </button>
                </div>
              )}

              {/* State: Submitted waiting grading */}
              {studentStatus === 'submitted' && (
                <div className="space-y-4 text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900">Menunggu Penilaian Pengajar</h4>
                    <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto leading-normal">
                      Tugas Anda telah dikirimkan ke sistem antrean kelas. Anda akan mendapatkan notifikasi setelah guru memberikan nilai.
                    </p>
                  </div>
                  <div className="text-left bg-gray-50/50 p-3.5 rounded-xl border border-gray-100/50 text-xs text-gray-600 leading-normal font-sans italic">
                    "{studentAnswer}"
                  </div>
                  <button
                    onClick={() => setStudentStatus('waiting')}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 underline block mx-auto cursor-pointer"
                  >
                    Tarik Tugas & Revisi Jawaban
                  </button>
                </div>
              )}

              {/* State: Graded Score Card & Feedback Card */}
              {studentStatus === 'graded' && (
                <div className="space-y-6">
                  {/* Scoreboard and feed */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Score Card */}
                    <div className="border border-emerald-100 bg-emerald-50/10 p-5 rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-mono block">Nilai Diperoleh</span>
                        <span className="font-mono text-xl font-bold text-emerald-700">95 <span className="text-xs text-gray-400">/ 100</span></span>
                      </div>
                    </div>

                    {/* Feedback Card */}
                    <div className="border border-indigo-100 bg-indigo-50/10 p-5 rounded-xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-mono block">Feedback Pengajar</span>
                        <span className="text-[10px] text-indigo-800 font-semibold block leading-none mt-1">Jane Doe (Dosen Wali)</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Message */}
                  <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl text-xs space-y-2">
                    <p className="font-semibold text-gray-900">Catatan Evaluasi Guru:</p>
                    <p className="text-gray-600 leading-relaxed font-sans italic">
                      "Analisis perbedaan polaritas molekul dijelaskan secara komparatif dengan contoh real yang sangat akurat. Bagus sekali!"
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setStudentStatus('waiting');
                      setStudentAnswer('');
                    }}
                    className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Kerjakan Tugas Baru (Ulang)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TEACHER perspective VIEW */}
          {currentRole === 'teacher' && (
            <div className="border border-gray-100 bg-white p-6 rounded-2xl shadow-2xs space-y-6">
              
              {/* Submission selector list */}
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2">Pilih Tugas Masuk Siswa</span>
                <div className="flex gap-2">
                  {submissions.map((sub, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveReviewIndex(i);
                        setGradeInput(sub.score ? sub.score.toString() : '95');
                        setFeedbackInput(sub.feedback ? sub.feedback : '');
                      }}
                      className={`px-4 py-2 border rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                        activeReviewIndex === i 
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' 
                          : 'border-gray-100 text-gray-500 hover:text-black hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      {sub.studentName}
                      <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'graded' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Submission Content Review Block */}
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Jawaban Siswa ({submissions[activeReviewIndex].studentName}):</span>
                  <span className="text-gray-400 font-mono text-[10px]">Kirim: {submissions[activeReviewIndex].submittedAt}</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-700 leading-relaxed font-sans border border-gray-100 italic">
                  "{submissions[activeReviewIndex].answer}"
                </div>
              </div>

              {/* Grading input action fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                <div className="sm:col-span-1 space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Input Skor (0-100)</label>
                  <input
                    type="text"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Ulasan / Masukan Guru</label>
                  <input
                    type="text"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Grade */}
              <button
                onClick={handleTeacherSubmitGrading}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Submit Nilai Evaluasi & Kirim Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
