import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Check, 
  AlertCircle, 
  Save, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CustomDropdown from './CustomDropdown';

export default function FormShowcase() {
  // Form State
  const [title, setTitle] = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [subject, setSubject] = useState('Kimia Dasar');
  const [instructions, setInstructions] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Realtime Errors
  const [titleError, setTitleError] = useState('');
  const [scoreError, setScoreError] = useState('');
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  // Debouncing save timer
  const autosaveTimerRef = useRef<any>(null);

  // Run validation on Title
  useEffect(() => {
    if (title && title.length < 5) {
      setTitleError('Judul tugas harus minimal 5 karakter.');
    } else {
      setTitleError('');
    }
  }, [title]);

  // Run validation on score
  useEffect(() => {
    const scoreNum = Number(maxScore);
    if (!maxScore) {
      setScoreError('Poin maksimal wajib diisi.');
    } else if (isNaN(scoreNum) || scoreNum <= 0 || scoreNum > 100) {
      setScoreError('Poin harus berupa angka antara 1 s/d 100.');
    } else {
      setScoreError('');
    }
  }, [maxScore]);

  // Handle autosave debounced 500ms
  useEffect(() => {
    if (!title && !instructions) return; // ignore initial blank states

    setIsSaving(true);
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      // Save draft simulated
      localStorage.setItem('kavio_draft_title', title);
      localStorage.setItem('kavio_draft_instructions', instructions);
      setIsSaving(false);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 500);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [title, instructions]);

  // Load drafts on mount
  useEffect(() => {
    const savedTitle = localStorage.getItem('kavio_draft_title');
    const savedInst = localStorage.getItem('kavio_draft_instructions');
    if (savedTitle) setTitle(savedTitle);
    if (savedInst) setInstructions(savedInst);
  }, []);

  // Form validity flag
  const isFormValid = title.length >= 5 && maxScore && !titleError && !scoreError;

  // Handle Form Submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid) return;

    const payload = { title, maxScore, subject, instructions, timestamp: new Date().toLocaleTimeString() };
    setSubmittedData(payload);

    // Clear drafts
    localStorage.removeItem('kavio_draft_title');
    localStorage.removeItem('kavio_draft_instructions');
    setTitle('');
    setInstructions('');
  };

  // Keyboard Navigation: Enter submits, Shift+Enter in textarea creates newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      // If user is typing in textarea, don't submit on lone Enter unless we want to.
      // But rules state: "enter untuk submit, shift+enter untuk newline"
      // So if it's the textarea:
      if (target.tagName === 'TEXTAREA') {
        if (!e.shiftKey) {
          e.preventDefault();
          if (isFormValid) handleSubmit();
        }
      } else {
        // Simple input submit
        e.preventDefault();
        if (isFormValid) handleSubmit();
      }
    }
  };

  return (
    <div className="space-y-12 max-w-4xl" id="form-showcase">
      {/* Page Header */}
      <div className="border-b border-gray-100 dark:border-slate-700/50 pb-5">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white">
          Form & Real-time Validation System
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Demo input pengajar dengan debounced autosave 500ms, pendeteksi keybinding Enter, dan required states.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Form panel */}
        <form 
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="md:col-span-3 border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xs space-y-5"
        >
          {/* Header indicator */}
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" />
              Buat Tugas Baru (Teacher Form)
            </h2>
            
            {/* Realtime saving state indicator */}
            <div className="text-[10px] font-mono text-gray-400">
              {isSaving && <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin text-indigo-500" /> Saving draft...</span>}
              {draftSaved && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Check className="w-3 h-3" /> Draft Autosaved</span>}
              {!isSaving && !draftSaved && <span>Draft Idle</span>}
            </div>
          </div>

          {/* Form: Subject Selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-slate-200 block">
              Mata Pelajaran <span className="text-rose-500">*</span>
            </label>
            <CustomDropdown
              value={subject}
              onChange={(val) => setSubject(val)}
              options={[
                { value: 'Kimia Dasar', label: 'Kimia Dasar (Genap)' },
                { value: 'Kimia Lanjutan', label: 'Kimia Analisis Lanjutan' },
                { value: 'Biologi Molekuler', label: 'Biologi Sel & Genetika' },
                { value: 'Fisika Kuantum', label: 'Fisika Modern & Termodinamika' }
              ]}
            />
          </div>

          {/* Form: Title with dynamic error */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-slate-200 block">
              Judul Tugas Utama <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Persamaan Reaksi Reduksi Oksidasi"
              className={`w-full px-3 py-2.5 text-xs bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-1 transition-all ${
                titleError ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {titleError && (
              <p className="text-[10px] text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {titleError}
              </p>
            )}
            <p className="text-[9px] text-gray-400">Judul akan dilihat langsung oleh siswa di timeline mereka.</p>
          </div>

          {/* Form: Maximum point score */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-slate-200 block">
              Poin Bobot Maksimal <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              placeholder="100"
              className={`w-full px-3 py-2.5 text-xs bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-1 transition-all ${
                scoreError ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {scoreError && (
              <p className="text-[10px] text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {scoreError}
              </p>
            )}
          </div>

          {/* Form: Instructions (Enter for Submit, Shift+Enter for Newline) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-gray-700 dark:text-slate-200 block">
                Petunjuk Pengisian Soal & Deskripsi
              </label>
              <span className="text-[9px] text-gray-400 font-mono">Enter to Submit / Shift+Enter for newline</span>
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Berikan petunjuk pengerjaan di sini. Tekan Shift+Enter untuk baris baru..."
              rows={4}
              className="w-full p-3 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Buttons Layout */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setInstructions('');
                setMaxScore('100');
                localStorage.removeItem('kavio_draft_title');
                localStorage.removeItem('kavio_draft_instructions');
              }}
              className="px-3.5 py-2 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:text-black bg-white dark:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all"
            >
              Hapus Draft
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 dark:bg-slate-700 disabled:text-gray-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              Publish Tugas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Data Preview side panel */}
        <div className="md:col-span-2 space-y-4">
          <div className="border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Sinyal Live Data State
            </h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Ketik judul atau petunjuk soal untuk melihat autosave draft bekerja secara real-time. Muat ulang halaman ini dan ketikan Anda akan tetap bertahan!
            </p>

            <div className="space-y-2 pt-2 border-t border-gray-50 text-xs">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Judul Active:</span>
                <span className="font-medium text-gray-800 dark:text-slate-100">{title || <span className="text-gray-300 italic">Belum diisi</span>}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Poin Maksimal:</span>
                <span className="font-mono text-gray-800 dark:text-slate-100">{maxScore || '0'} EXP</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Petunjuk:</span>
                <span className="text-gray-600 dark:text-slate-300 line-clamp-3 whitespace-pre-line">{instructions || <span className="text-gray-300 italic">Kosong</span>}</span>
              </div>
            </div>
          </div>

          {/* Submission history feedbacks */}
          <AnimatePresence>
            {submittedData && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border border-emerald-100 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/30/15 p-5 rounded-2xl space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Tugas Berhasil Dipublish!
                </div>
                <div className="text-[11px] text-gray-600 dark:text-slate-300 space-y-1">
                  <p><strong>Subjek:</strong> {submittedData.subject}</p>
                  <p><strong>Judul:</strong> {submittedData.title}</p>
                  <p><strong>Waktu rilis:</strong> {submittedData.timestamp}</p>
                </div>
                <button
                  onClick={() => setSubmittedData(null)}
                  className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 underline block pt-1"
                >
                  Bersihkan notifikasi
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
