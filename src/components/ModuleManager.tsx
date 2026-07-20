import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Key, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  Calendar,
  Layers,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  List,
  Pilcrow,
  Check,
  Sparkles,
  X,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import defaultModules from '../assets/default_modules.json';
import CustomDropdown from './CustomDropdown';
import CustomDatePicker from './CustomDatePicker';
import { Dialog } from '@capacitor/dialog';

// Simple Custom Markdown Renderer (for Preview mode)
function MarkdownRenderer({ content }: { content: string }) {
  const formatText = (text: string): React.ReactNode => {
    const boldParts = text.split('**');
    return boldParts.map((boldPart, bIdx) => {
      const isBold = bIdx % 2 === 1;
      const italicParts = boldPart.split('*');
      const renderedItalics = italicParts.map((italicPart, iIdx) => {
        const isItalic = iIdx % 2 === 1;
        if (isItalic) {
          return <em key={iIdx} className="italic text-gray-800 dark:text-slate-100 font-bold">{italicPart}</em>;
        }
        return italicPart;
      });

      if (isBold) {
        return <strong key={bIdx} className="font-extrabold text-gray-950">{renderedItalics}</strong>;
      }
      return <React.Fragment key={bIdx}>{renderedItalics}</React.Fragment>;
    });
  };

  const parseLines = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    let inAside = false;
    let asideContent: string[] = [];

    let inTable = false;
    let tableRows: string[] = [];

    let inChat = false;
    let chatLines: { speaker: string; text: string }[] = [];

    const flushChat = (idx: number) => {
      if (chatLines.length === 0) return;
      const uniqueSpeakers = Array.from(new Set(chatLines.map(c => c.speaker)));
      elements.push(
        <div key={`chat-${idx}`} className="my-5 p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-150 rounded-3xl space-y-3.5 shrink-0 max-w-lg mx-auto w-full">
          {chatLines.map((line, lIdx) => {
            const speakerIndex = uniqueSpeakers.indexOf(line.speaker);
            const isRight = speakerIndex === 1;
            return (
              <div key={lIdx} className={`flex flex-col ${isRight ? 'items-end' : 'items-start'} space-y-1`}>
                <span className="text-[9px] font-black text-gray-400 uppercase px-1 tracking-wider">
                  {line.speaker}
                </span>
                <div className={`max-w-[85%] px-3.5 py-2.5 shadow-3xs text-xs font-semibold ${
                  isRight 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-950 border border-emerald-100 dark:border-emerald-800/50/80 rounded-2xl rounded-tr-none' 
                    : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-950 border border-indigo-100 dark:border-indigo-800/50/80 rounded-2xl rounded-tl-none'
                }`}>
                  {formatText(line.text)}
                </div>
              </div>
            );
          })}
        </div>
      );
      chatLines = [];
    };

    const flushTable = (idx: number) => {
      if (tableRows.length === 0) return;
      const cleanRows = tableRows.map(r => r.trim()).filter(r => r.startsWith('|'));
      if (cleanRows.length === 0) return;

      const headers = cleanRows[0]
        .split('|')
        .map(h => h.trim())
        .filter((_, i, arr) => i > 0 && i < arr.length - 1);

      const dataRows = cleanRows.slice(1)
        .filter(r => !/^[|\s-:]+$/.test(r)) // skip header lines like |---|---|
        .map(r => 
          r.split('|')
            .map(c => c.trim())
            .filter((_, i, arr) => i > 0 && i < arr.length - 1)
        );

      elements.push(
        <div key={`table-${idx}`} className="my-5 overflow-x-auto border border-gray-150 rounded-2xl shadow-3xs bg-white dark:bg-slate-800 shrink-0">
          <table className="min-w-full divide-y divide-gray-150 text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-slate-900/70">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-wider">{formatText(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 bg-white dark:bg-slate-800">
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-gray-50 dark:bg-slate-900/50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 text-xs text-gray-700 dark:text-slate-200 font-medium">
                      {formatText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    };

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const trimmed = line.trim();

      // Check if chat line
      const chatMatch = trimmed.match(/^([A-Z][A-Za-z0-9\s]{1,15}):\s*(.+)$/);
      if (chatMatch && !inAside) {
        if (inTable) {
          inTable = false;
          flushTable(idx);
        }
        if (!inChat) {
          inChat = true;
          chatLines = [];
        }
        chatLines.push({ speaker: chatMatch[1].trim(), text: chatMatch[2].trim() });
        continue;
      } else {
        if (inChat) {
          inChat = false;
          flushChat(idx);
        }
      }

      // Check if table row
      if (trimmed.startsWith('|') && !inAside) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        tableRows.push(line);
        continue;
      } else {
        if (inTable) {
          inTable = false;
          flushTable(idx);
        }
      }

      if (trimmed === '<aside>') {
        inAside = true;
        asideContent = [];
        continue;
      }

      if (trimmed === '</aside>') {
        inAside = false;
        
        // Process aside content
        const nonExpired = asideContent.map(l => l.trim()).filter(l => l !== '');
        const icon = nonExpired[0] || '🌟';
        const bodyText = nonExpired.slice(1).join(' ');

        elements.push(
          <div key={`aside-${idx}`} className="my-5 p-4 bg-amber-50 dark:bg-amber-900/30/70 border-2 border-amber-200 border-b-4 border-amber-300 rounded-2xl flex items-start gap-3.5 shadow-3xs animate-fadeIn">
            <span className="text-xl shrink-0 select-none">{icon}</span>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">Tip Belajar</span>
              <p className="text-xs font-bold text-amber-950 leading-relaxed">
                {formatText(bodyText)}
              </p>
            </div>
          </div>
        );
        continue;
      }

      if (inAside) {
        asideContent.push(line);
        continue;
      }

      // Headers
      if (trimmed.startsWith('# ')) {
        elements.push(<h1 key={idx} className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white border-b-2 border-gray-100 dark:border-slate-700/50 pb-2 mt-6 mb-3 uppercase font-display">{formatText(trimmed.substring(2))}</h1>);
        continue;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(<h2 key={idx} className="text-base sm:text-lg font-black text-indigo-700 mt-5 mb-2.5 uppercase">{formatText(trimmed.substring(3))}</h2>);
        continue;
      }
      if (trimmed.startsWith('### ')) {
        elements.push(<h3 key={idx} className="text-xs sm:text-sm font-bold text-gray-800 dark:text-slate-100 mt-4 mb-2">{formatText(trimmed.substring(4))}</h3>);
        continue;
      }
      if (trimmed.startsWith('#### ')) {
        elements.push(<h4 key={idx} className="text-xs font-bold text-gray-700 dark:text-slate-200 mt-3 mb-1.5">{formatText(trimmed.substring(5))}</h4>);
        continue;
      }
      
      // Blockquotes / Callouts
      if (trimmed.startsWith('> ')) {
        const textOnly = trimmed.replace('> ', '');
        const isCallout = textOnly.includes('**') || textOnly.length > 50;
        elements.push(
          <blockquote key={idx} className={`my-4 pl-4 py-3.5 border-l-4 border-indigo-500 rounded-r-2xl text-xs leading-relaxed italic ${
            isCallout ? 'bg-indigo-50 dark:bg-indigo-900/30/50 text-indigo-950 font-medium' : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-300'
          }`}>
            {formatText(textOnly)}
          </blockquote>
        );
        continue;
      }
      
      // Bullet lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <ul key={idx} className="list-disc list-inside pl-4 my-1.5 text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
            <li>{formatText(trimmed.substring(2))}</li>
          </ul>
        );
        continue;
      }
      
      // Number lists
      if (/^\d+\.\s/.test(trimmed)) {
        elements.push(
          <motion.ol key={idx} className="list-decimal list-inside pl-4 my-1.5 text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
            <li>{formatText(trimmed.replace(/^\d+\.\s/, ''))}</li>
          </motion.ol>
        );
        continue;
      }

      // Horizontal rule
      if (trimmed === '---') {
        elements.push(<hr key={idx} className="my-6 border-t-2 border-dashed border-gray-200 dark:border-slate-700" />);
        continue;
      }
      
      // Empty line
      if (!trimmed) {
        elements.push(<div key={idx} className="h-2" />);
        continue;
      }

      // Default paragraph
      elements.push(
        <p key={idx} className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed my-2">
          {formatText(trimmed)}
        </p>
      );
    }

    if (inTable) {
      flushTable(lines.length);
    }

    if (inChat) {
      flushChat(lines.length);
    }

    return elements;
  };

  return <div className="space-y-1 select-text selection:bg-indigo-100">{parseLines(content)}</div>;
}

interface Module {
  id: string;
  title: string;
  level: 'elementary' | 'junior' | 'senior';
  content: string;
  isPublished: boolean;
}

interface AccessKey {
  id: string;
  key: string;
  moduleIds: string[];
  expiryDate: string | null;
  usageLimit: number | null;
  usageCount: number;
}

interface ModuleManagerProps {
  onSetLoading: (loading: boolean) => void;
}

export default function ModuleManager({ onSetLoading }: ModuleManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'keys'>('modules');
  const [modules, setModules] = useState<Module[]>([]);
  const [accessKeys, setAccessKeys] = useState<AccessKey[]>([]);
  const [loading, setLoading] = useState({ modules: true, keys: true });

  // Notifications
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Search & Filter
  const [moduleSearch, setModuleSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'elementary' | 'junior' | 'senior'>('all');
  const [keySearch, setKeySearch] = useState('');

  // Module Editor Form Modal States
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleLevel, setModuleLevel] = useState<'elementary' | 'junior' | 'senior'>('elementary');
  const [moduleContent, setModuleContent] = useState('');
  const [isModulePublished, setIsModulePublished] = useState(true);
  const [moduleFormLoading, setModuleFormLoading] = useState(false);
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [moduleSortOrder, setModuleSortOrder] = useState<'title-asc' | 'title-desc'>('title-asc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  
  // Access Key Form Modal States
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyString, setNewKeyString] = useState('');
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [keyExpiry, setKeyExpiry] = useState('');
  const [keyUsageLimit, setKeyUsageLimit] = useState<string>(''); // empty for unlimited
  const [keyFormLoading, setKeyFormLoading] = useState(false);

  // Textarea Ref for Editor helpers
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load modules
  const fetchModules = async () => {
    try {
      setLoading(prev => ({ ...prev, modules: true }));
      const q = query(collection(db, 'modules'), orderBy('title', 'asc'));
      const snap = await getDocs(q);
      const fetched: Module[] = [];
      snap.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Module);
      });
      setModules(fetched);
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Gagal memuat modul.');
    } finally {
      setLoading(prev => ({ ...prev, modules: false }));
    }
  };

  // Load access keys
  const fetchAccessKeys = async () => {
    try {
      setLoading(prev => ({ ...prev, keys: true }));
      const q = query(collection(db, 'module_access_keys'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const fetched: AccessKey[] = [];
      snap.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as AccessKey);
      });
      setAccessKeys(fetched);
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Gagal memuat kunci akses.');
    } finally {
      setLoading(prev => ({ ...prev, keys: false }));
    }
  };

  useEffect(() => {
    fetchModules();
    fetchAccessKeys();
  }, []);

  const triggerAlert = (type: 'success' | 'error', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  // Seeding default modules
  const handleSeedModules = async () => {
    const { value } = await Dialog.confirm({
      title: 'Seed Modul Bawaan',
      message: 'Apakah Anda ingin memuat 34 Modul Bawaan KAVIO ke database? Modul dengan nama yang sama akan dilewati.',
      okButtonTitle: 'OK',
      cancelButtonTitle: 'Batal'
    });
    if (!value) return;
    
    onSetLoading(true);
    let seededCount = 0;
    try {
      // Get currently existing titles
      const existingTitles = new Set(modules.map(m => m.title));

      for (const m of defaultModules) {
        if (!existingTitles.has(m.title)) {
          await addDoc(collection(db, 'modules'), {
            title: m.title,
            level: m.level,
            content: m.content,
            isPublished: m.isPublished,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          seededCount++;
        }
      }
      triggerAlert('success', `Berhasil mengimpor ${seededCount} modul baru.`);
      fetchModules();
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Gagal mengimpor modul bawaan.');
    } finally {
      onSetLoading(false);
    }
  };

  // Save / Update Module
  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !moduleContent.trim()) return;

    setModuleFormLoading(true);
    try {
      const payload = {
        title: moduleTitle.trim(),
        level: moduleLevel,
        content: moduleContent,
        isPublished: isModulePublished,
        updatedAt: serverTimestamp()
      };

      if (isEditMode && editingModuleId) {
        await updateDoc(doc(db, 'modules', editingModuleId), payload);
        triggerAlert('success', 'Modul berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'modules'), {
          ...payload,
          createdAt: serverTimestamp()
        });
        triggerAlert('success', 'Modul baru berhasil dibuat!');
      }

      setIsModuleModalOpen(false);
      fetchModules();
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Gagal menyimpan modul.');
    } finally {
      setModuleFormLoading(false);
    }
  };

  // Delete Module
  const handleDeleteModule = async (moduleId: string, title: string) => {
    const { value } = await Dialog.confirm({
      title: 'Hapus Modul',
      message: `Apakah Anda yakin ingin menghapus modul "${title}"? Tindakan ini permanen.`,
      okButtonTitle: 'Hapus',
      cancelButtonTitle: 'Batal'
    });
    if (!value) return;
    try {
      await deleteDoc(doc(db, 'modules', moduleId));
      triggerAlert('success', 'Modul berhasil dihapus.');
      fetchModules();
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Gagal menghapus modul.');
    }
  };

  // Save Access Key
  const handleSaveAccessKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyString.trim() || selectedModuleIds.length === 0) return;

    setKeyFormLoading(true);
    try {
      // Check if key already exists locally
      const exists = accessKeys.some(k => k.key === newKeyString.trim().toUpperCase());
      if (exists) {
        triggerAlert('error', 'Kunci akses voucher tersebut sudah digunakan.');
        setKeyFormLoading(false);
        return;
      }

      const limitNum = keyUsageLimit.trim() !== '' ? parseInt(keyUsageLimit, 10) : null;

      await addDoc(collection(db, 'module_access_keys'), {
        key: newKeyString.trim().toUpperCase(),
        moduleIds: selectedModuleIds,
        expiryDate: keyExpiry || null,
        usageLimit: limitNum,
        usageCount: 0,
        createdAt: serverTimestamp()
      });

      triggerAlert('success', 'Kunci akses voucher berhasil dibuat!');
      setIsKeyModalOpen(false);
      fetchAccessKeys();
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Gagal menyimpan kunci akses.');
    } finally {
      setKeyFormLoading(false);
    }
  };

  // Delete Access Key
  const handleDeleteAccessKey = async (keyId: string, keyVal: string) => {
    const { value } = await Dialog.confirm({
      title: 'Hapus Kunci Akses',
      message: `Apakah Anda yakin ingin menghapus kunci akses "${keyVal}"?`,
      okButtonTitle: 'Hapus',
      cancelButtonTitle: 'Batal'
    });
    if (!value) return;
    try {
      await deleteDoc(doc(db, 'module_access_keys', keyId));
      triggerAlert('success', 'Kunci akses berhasil dihapus.');
      fetchAccessKeys();
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Gagal menghapus kunci akses.');
    }
  };

  // Editor helpers formatting: inserts at cursor
  const insertFormat = (syntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(startPos, endPos);
    let replacement = '';

    if (syntax === 'h1') replacement = `# ${selectedText || 'Header 1'}\n`;
    else if (syntax === 'h2') replacement = `## ${selectedText || 'Header 2'}\n`;
    else if (syntax === 'h3') replacement = `### ${selectedText || 'Header 3'}\n`;
    else if (syntax === 'h4') replacement = `#### ${selectedText || 'Header 4'}\n`;
    else if (syntax === 'quote') replacement = `> ${selectedText || 'Kutipan materi/callout penting'}\n`;
    else if (syntax === 'list') replacement = `- ${selectedText || 'Poin list'}\n`;
    else if (syntax === 'bold') replacement = `**${selectedText || 'teks tebal'}**`;

    const newContent = text.substring(0, startPos) + replacement + text.substring(endPos);
    setModuleContent(newContent);
    
    // Focus back and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + replacement.length, startPos + replacement.length);
    }, 50);
  };

  // Open Edit Module Modal
  const handleOpenEditModule = (m: Module) => {
    setIsEditMode(true);
    setEditingModuleId(m.id);
    setModuleTitle(m.title);
    setModuleLevel(m.level);
    setModuleContent(m.content);
    setIsModulePublished(m.isPublished);
    setEditorMode('write');
    setIsModuleModalOpen(true);
  };

  // Open Create Module Modal
  const handleOpenCreateModule = () => {
    setIsEditMode(false);
    setEditingModuleId(null);
    setModuleTitle('');
    setModuleLevel('elementary');
    setModuleContent('');
    setIsModulePublished(true);
    setEditorMode('write');
    setIsModuleModalOpen(true);
  };

  // Filters modules list
  const filteredModules = modules
    .filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(moduleSearch.toLowerCase()) ||
                            m.content.toLowerCase().includes(moduleSearch.toLowerCase());
      const matchesLevel = levelFilter === 'all' || m.level === levelFilter;
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'published' && m.isPublished) ||
                            (statusFilter === 'draft' && !m.isPublished);
      return matchesSearch && matchesLevel && matchesStatus;
    })
    .sort((a, b) => {
      if (moduleSortOrder === 'title-asc') {
        return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
      }
      if (moduleSortOrder === 'title-desc') {
        return b.title.localeCompare(a.title, undefined, { numeric: true, sensitivity: 'base' });
      }
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return moduleSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Filters keys list
  const filteredKeys = accessKeys.filter(k => {
    return k.key.toLowerCase().includes(keySearch.toLowerCase());
  });

  if (isModuleModalOpen) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto space-y-6 animate-fadeIn" id="module-editor-page">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50 pb-4 shrink-0">
          <button
            type="button"
            onClick={() => setIsModuleModalOpen(false)}
            className="flex items-center gap-1.5 text-xs font-black text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Kelola Modul</span>
          </button>
          
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {isEditMode ? 'Mode Edit' : 'Modul Baru'}
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white leading-tight">
            {isEditMode ? 'EDIT MODUL BELAJAR' : 'BUAT MODUL BELAJAR BARU'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Tulis materi belajar dengan formatting terstruktur untuk siswa Anda.</p>
        </div>

        <form onSubmit={handleSaveModule} className="space-y-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-3xs flex flex-col h-[70vh]">
          {/* Meta Inputs row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs shrink-0">
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Judul Modul</label>
              <input
                type="text"
                required
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                placeholder="Contoh: UNIT 1 - MY HOME"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Level Tingkatan</label>
              <CustomDropdown
                value={moduleLevel}
                onChange={(val) => setModuleLevel(val as any)}
                options={[
                  { value: 'elementary', label: 'Elementary / Pemula' },
                  { value: 'junior', label: 'Junior / Menengah' },
                  { value: 'senior', label: 'Senior / Lanjutan' }
                ]}
                className="w-full"
              />
            </div>
          </div>

          {/* Sub Tab: Tulis Konten vs Pratinjau */}
          <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-xl text-[10px] font-bold w-fit shrink-0">
            <button
              type="button"
              onClick={() => setEditorMode('write')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                editorMode === 'write' ? 'bg-white dark:bg-slate-800 text-indigo-700 shadow-3xs' : 'text-gray-500 dark:text-slate-400'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Tulis Konten (Markdown)</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('preview')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                editorMode === 'preview' ? 'bg-white dark:bg-slate-800 text-indigo-700 shadow-3xs' : 'text-gray-500 dark:text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau (Preview)</span>
            </button>
          </div>

          {/* Editor Content Area */}
          <div className="flex-1 flex flex-col min-h-0 space-y-2.5">
            {editorMode === 'write' ? (
              <>
                <div className="flex items-center justify-between shrink-0">
                  <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Konten Materi (Markdown)</label>
                  
                  {/* Helper toolbar */}
                  <div className="flex items-center gap-1 bg-gray-150 p-1 rounded-xl shrink-0">
                    <button type="button" onClick={() => insertFormat('h1')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Header 1"><Heading1 className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormat('h2')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Header 2"><Heading2 className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormat('h3')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Header 3"><Heading3 className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormat('h4')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Header 4"><Heading4 className="w-3.5 h-3.5" /></button>
                    <div className="h-4 w-[1px] bg-gray-300 mx-0.5" />
                    <button type="button" onClick={() => insertFormat('quote')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Quotes / Callouts"><Quote className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormat('list')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Bullet list"><List className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormat('bold')} title="Teks Tebal" className="text-[10px] font-black w-6.5 h-6.5 flex items-center justify-center hover:bg-white dark:bg-slate-800 hover:text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors cursor-pointer">B</button>
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  required
                  value={moduleContent}
                  onChange={(e) => setModuleContent(e.target.value)}
                  placeholder="# **UNIT 1: ALL ABOUT ME**&#10;&#10;## **Materi Utama**&#10;Tulis materi detail di sini. Gunakan tombol editor di atas untuk membantu formatting cepat..."
                  className="flex-1 w-full p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs font-mono resize-none overflow-y-auto"
                />
              </>
            ) : (
              <>
                <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider shrink-0">Hasil Pratinjau Tampilan Siswa</label>
                <div className="flex-1 w-full p-6 sm:p-8 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700/50 rounded-2xl overflow-y-auto select-text shadow-3xs custom-scrollbar text-xs leading-relaxed font-sans prose max-w-none">
                  <MarkdownRenderer content={moduleContent || '*Materi masih kosong. Tulis sesuatu untuk melihat hasil preview.*'} />
                </div>
              </>
            )}
          </div>

          {/* Footer switches & actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50 shrink-0 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModulePublished(!isModulePublished)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                  isModulePublished ? 'bg-indigo-600' : 'bg-gray-250'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-800 transition-transform duration-200 ${
                  isModulePublished ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
              <span className="text-[10px] font-bold text-gray-600 dark:text-slate-300">Publikasikan Modul Langsung ke Siswa</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsModuleModalOpen(false)}
                className="btn-duo-slate px-4 py-2.5 font-black"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={moduleFormLoading}
                className="btn-duo-green px-5 py-2.5 font-black flex items-center gap-1.5 shadow-xs disabled:opacity-40"
              >
                {moduleFormLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>SIMPAN MODUL</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto" id="module-manager-page">
      
      {/* Alert Banner */}
      <AnimatePresence>
        {alert && (
          <div className={`fixed bottom-6 right-6 p-4 rounded-2xl border shadow-xl flex items-center gap-2.5 z-50 animate-fadeIn ${
            alert.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {alert.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span className="text-xs font-bold">{alert.msg}</span>
          </div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-700/50 pb-6">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kelola Pembelajaran</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
            Pustaka & Akses Modul
          </h1>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleSeedModules}
            className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>SEED MODUL BAWAAN ({defaultModules.length})</span>
          </button>
          
          <button
            onClick={activeSubTab === 'modules' ? handleOpenCreateModule : () => {
              setNewKeyString('');
              setSelectedModuleIds([]);
              setKeyExpiry('');
              setKeyUsageLimit('');
              setIsKeyModalOpen(true);
            }}
            className="btn-duo-green px-5 py-3 text-xs font-black flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            style={{ minHeight: '44px' }}
          >
            <Plus className="w-4.5 h-4.5" />
            <span>{activeSubTab === 'modules' ? 'BUAT MODUL BARU' : 'BUAT KUNCI VOUCHER'}</span>
          </button>
        </div>
      </div>

      {/* Tab Switch Selector (Modules vs Access Keys) */}
      <div className="flex bg-gray-100 dark:bg-slate-700/80 p-1 rounded-2xl text-xs font-bold self-start w-fit">
        <button
          onClick={() => setActiveSubTab('modules')}
          className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'modules' ? 'bg-white dark:bg-slate-800 text-indigo-700 shadow-xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Daftar Modul Belajar</span>
        </button>
        <button
          onClick={() => setActiveSubTab('keys')}
          className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'keys' ? 'bg-white dark:bg-slate-800 text-indigo-700 shadow-xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Kelola Kunci Akses (Voucher)</span>
        </button>
      </div>

      {/* Sub-Tab 1: MODULES LIST & EDITOR FOUNDATION */}
      {activeSubTab === 'modules' && (
        <div className="space-y-6">
          {/* Filters & Sorting */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={moduleSearch}
                  onChange={(e) => setModuleSearch(e.target.value)}
                  placeholder="Cari judul modul atau teks konten..."
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs"
                />
              </div>

              {/* Level Filters */}
              <div className="flex bg-gray-100 dark:bg-slate-700/85 p-1 rounded-xl text-xs font-bold w-fit self-start md:self-auto">
                <button onClick={() => setLevelFilter('all')} className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${levelFilter === 'all' ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-3xs' : 'text-gray-500 dark:text-slate-400'}`}>Semua Level</button>
                <button onClick={() => setLevelFilter('elementary')} className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${levelFilter === 'elementary' ? 'bg-white dark:bg-slate-800 text-amber-700 shadow-3xs' : 'text-gray-500 dark:text-slate-400'}`}>Elementary</button>
                <button onClick={() => setLevelFilter('junior')} className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${levelFilter === 'junior' ? 'bg-white dark:bg-slate-800 text-purple-700 shadow-3xs' : 'text-gray-500 dark:text-slate-400'}`}>Junior</button>
                <button onClick={() => setLevelFilter('senior')} className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${levelFilter === 'senior' ? 'bg-white dark:bg-slate-800 text-emerald-700 shadow-3xs' : 'text-gray-500 dark:text-slate-400'}`}>Senior</button>
              </div>
            </div>

            {/* Additional Status Filter & Sorting Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 dark:text-slate-400">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Status:</span>
                <div className="flex bg-gray-100 dark:bg-slate-700 p-0.5 rounded-lg">
                  <button type="button" onClick={() => setStatusFilter('all')} className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 shadow-3xs' : 'hover:text-gray-800 dark:text-slate-100'}`}>Semua</button>
                  <button type="button" onClick={() => setStatusFilter('published')} className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${statusFilter === 'published' ? 'bg-white dark:bg-slate-800 text-indigo-750 shadow-3xs' : 'hover:text-gray-800 dark:text-slate-100'}`}>Terbit</button>
                  <button type="button" onClick={() => setStatusFilter('draft')} className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${statusFilter === 'draft' ? 'bg-white dark:bg-slate-800 text-amber-700 shadow-3xs' : 'hover:text-gray-800 dark:text-slate-100'}`}>Draf</button>
                </div>
              </div>

              {/* Sorting Filter */}
              <div className="flex items-center gap-2 ml-0 sm:ml-auto">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Urutan:</span>
                <div className="flex bg-gray-100 dark:bg-slate-700 p-0.5 rounded-lg">
                  <button type="button" onClick={() => setModuleSortOrder('title-asc')} className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${moduleSortOrder === 'title-asc' ? 'bg-white dark:bg-slate-800 text-indigo-750 shadow-3xs' : 'hover:text-gray-800 dark:text-slate-100'}`}>A-Z</button>
                  <button type="button" onClick={() => setModuleSortOrder('title-desc')} className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${moduleSortOrder === 'title-desc' ? 'bg-white dark:bg-slate-800 text-indigo-750 shadow-3xs' : 'hover:text-gray-800 dark:text-slate-100'}`}>Z-A</button>
                  <button type="button" onClick={() => setModuleSortOrder('newest')} className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${moduleSortOrder === 'newest' ? 'bg-white dark:bg-slate-800 text-indigo-750 shadow-3xs' : 'hover:text-gray-800 dark:text-slate-100'}`}>Terbaru</button>
                  <button type="button" onClick={() => setModuleSortOrder('oldest')} className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${moduleSortOrder === 'oldest' ? 'bg-white dark:bg-slate-800 text-indigo-750 shadow-3xs' : 'hover:text-gray-800 dark:text-slate-100'}`}>Terlama</button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Modules */}
          {loading.modules ? (
            <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" /></div>
          ) : filteredModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((m) => (
                <div key={m.id} className="card-duo p-5 flex flex-col justify-between space-y-4 hover:border-indigo-200 transition-colors">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${
                        m.level === 'elementary' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border-amber-200' :
                        m.level === 'junior' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200'
                      }`}>
                        {m.level}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${m.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-150 text-gray-500 dark:text-slate-400'}`}>
                        {m.isPublished ? 'Publish' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{m.title}</h3>
                    <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">
                      {m.content.replace(/[#>*-]/g, '').substring(0, 120)}...
                    </p>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => handleOpenEditModule(m)}
                      className="flex-1 btn-duo-blue py-2 text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>EDIT</span>
                    </button>
                    <button
                      onClick={() => handleDeleteModule(m.id, m.title)}
                      className="p-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-all cursor-pointer"
                      title="Hapus Modul"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-12 text-center">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-400 mt-3">Tidak ada modul belajar yang ditemukan.</p>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: VOUCHER ACCESS KEYS LIST */}
      {activeSubTab === 'keys' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
              placeholder="Cari berdasarkan kode voucher..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs"
            />
          </div>

          {/* Keys Table / List */}
          {loading.keys ? (
            <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" /></div>
          ) : filteredKeys.length > 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-gray-250 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700/50 font-extrabold text-gray-500 dark:text-slate-400">
                    <th className="p-4">Kode Kunci (Voucher)</th>
                    <th className="p-4">Jumlah Modul Terikat</th>
                    <th className="p-4">Masa Berlaku (Expiry)</th>
                    <th className="p-4">Penggunaan (Limit)</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-800 dark:text-slate-100">
                  {filteredKeys.map((k) => (
                    <tr key={k.id} className="hover:bg-gray-50 dark:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-700 tracking-wider uppercase">{k.key}</td>
                      <td className="p-4">{k.moduleIds?.length || 0} Modul</td>
                      <td className="p-4 text-gray-500 dark:text-slate-400">{k.expiryDate ? k.expiryDate : <span className="text-gray-300">Tanpa Batas</span>}</td>
                      <td className="p-4 font-mono">
                        <span className="font-bold">{k.usageCount}</span> / {k.usageLimit !== null ? k.usageLimit : '∞'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteAccessKey(k.id, k.key)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          title="Hapus Kunci Akses"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-12 text-center">
              <Key className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-400 mt-3">Tidak ada kunci akses voucher yang aktif.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: MODULE EDITOR FORM (NEW & EDIT) */}
      <AnimatePresence>
        {isModuleModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal-duo w-[850px] max-h-[90vh] max-w-[95vw] p-6 space-y-4 bg-white dark:bg-slate-800 shadow-2xl relative flex flex-col"
            >
              {/* Close */}
              <button
                onClick={() => setIsModuleModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:bg-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="border-b border-gray-100 dark:border-slate-700/50 pb-3">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  {isEditMode ? 'EDITOR MODUL BELAJAR' : 'BUAT MODUL BELAJAR BARU'}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Tulis materi belajar dengan formatting terstruktur untuk siswa Anda.</p>
              </div>

              <form onSubmit={handleSaveModule} className="space-y-4 flex-1 flex flex-col min-h-0">
                
                {/* Meta Inputs row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs shrink-0">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Judul Modul</label>
                    <input
                      type="text"
                      required
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      placeholder="Contoh: UNIT 1 - MY HOME"
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Level Tingkatan</label>
                    <CustomDropdown
                      value={moduleLevel}
                      onChange={(val) => setModuleLevel(val as any)}
                      options={[
                        { value: 'elementary', label: 'Elementary / Pemula' },
                        { value: 'junior', label: 'Junior / Menengah' },
                        { value: 'senior', label: 'Senior / Lanjutan' }
                      ]}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Editor Content Area (With rich helpers) */}
                <div className="flex-1 flex flex-col min-h-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Konten Materi (Markdown)</label>
                    
                    {/* Helper toolbar */}
                    <div className="flex items-center gap-1 bg-gray-150 p-1 rounded-xl">
                      <button type="button" onClick={() => insertFormat('h1')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Header 1"><Heading1 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => insertFormat('h2')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Header 2"><Heading2 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => insertFormat('h3')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Header 3"><Heading3 className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => insertFormat('h4')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Header 4"><Heading4 className="w-3.5 h-3.5" /></button>
                      <div className="h-4 w-[1px] bg-gray-300 mx-0.5" />
                      <button type="button" onClick={() => insertFormat('quote')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Quotes / Callouts"><Quote className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => insertFormat('list')} className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-white dark:bg-slate-800 rounded-lg transition-colors cursor-pointer" title="Bullet list"><List className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => insertFormat('bold')} title="Teks Tebal" className="text-[10px] font-black w-6.5 h-6.5 flex items-center justify-center hover:bg-white dark:bg-slate-800 hover:text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors cursor-pointer">B</button>
                    </div>
                  </div>

                  <textarea
                    ref={textareaRef}
                    required
                    value={moduleContent}
                    onChange={(e) => setModuleContent(e.target.value)}
                    placeholder="# **UNIT 1: ALL ABOUT ME**&#10;&#10;## **Materi Utama**&#10;Tulis materi detail di sini. Gunakan tombol editor di atas untuk membantu formatting cepat..."
                    className="flex-1 w-full p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs font-mono resize-none overflow-y-auto"
                  />
                </div>

                {/* Footer switches & actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModulePublished(!isModulePublished)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                        isModulePublished ? 'bg-indigo-600' : 'bg-gray-250'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-800 transition-transform duration-200 ${
                        isModulePublished ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-slate-300">Publikasikan Modul Langsung ke Siswa</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModuleModalOpen(false)}
                      className="btn-duo-slate px-4 py-2.5 text-xs font-black"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={moduleFormLoading}
                      className="btn-duo-green px-5 py-2.5 text-xs font-black flex items-center gap-1.5 shadow-xs disabled:opacity-40"
                    >
                      {moduleFormLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>SIMPAN MODUL</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ACCESS KEY CREATOR VOUCHER FORM */}
      <AnimatePresence>
        {isKeyModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal-duo w-[520px] max-h-[85vh] max-w-[95vw] p-6 space-y-4 bg-white dark:bg-slate-800 shadow-2xl relative flex flex-col"
            >
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:bg-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="border-b border-gray-100 dark:border-slate-700/50 pb-3 shrink-0">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">BUAT KUNCI VOUCHER BARU</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Siswa dapat menginput kunci voucher ini di tab Pustaka Modul untuk mengakses modul terkait.</p>
              </div>

              <form onSubmit={handleSaveAccessKey} className="space-y-4 flex-1 flex flex-col min-h-0 text-xs">
                
                {/* Key string & usage limit row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Kode Kunci (Key)</label>
                    <input
                      type="text"
                      required
                      value={newKeyString}
                      onChange={(e) => setNewKeyString(e.target.value.toUpperCase())}
                      placeholder="CONTOH: KAVIO-ELEMENTARY-UNIT1"
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs placeholder-gray-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Batas Penggunaan (Usage Limit)</label>
                    <input
                      type="number"
                      value={keyUsageLimit}
                      onChange={(e) => setKeyUsageLimit(e.target.value)}
                      placeholder="Kosongkan untuk Unlimited"
                      min={1}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs placeholder-gray-300"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="space-y-1 shrink-0">
                  <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">Tanggal Kadaluarsa (Expiry Date)</label>
                  <CustomDatePicker
                    value={keyExpiry}
                    onChange={(val) => setKeyExpiry(val)}
                    placeholder="Pilih Tanggal Kadaluarsa (Kosongkan jika tak ada)"
                    className="w-full"
                  />
                </div>

                {/* Modules Selection with Multi Checkbox */}
                <div className="flex-1 flex flex-col min-h-0 space-y-2">
                  <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider shrink-0">Pilih Modul yang Terikat ({selectedModuleIds.length})</label>
                  
                  {modules.length > 0 ? (
                    <div className="flex-1 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-y-auto p-3 space-y-2.5 bg-gray-50 dark:bg-slate-900/50 custom-scrollbar">
                      {modules.map((m) => {
                        const checked = selectedModuleIds.includes(m.id);
                        return (
                          <label key={m.id} className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 border border-gray-150 rounded-xl cursor-pointer hover:border-indigo-200 transition-colors select-none">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                if (checked) {
                                  setSelectedModuleIds(prev => prev.filter(id => id !== m.id));
                                } else {
                                  setSelectedModuleIds(prev => [...prev, m.id]);
                                }
                              }}
                              className="w-4 h-4 text-indigo-600 dark:text-indigo-400 rounded border-gray-350 focus:ring-indigo-500 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{m.level}</span>
                              <p className="text-xs font-bold text-gray-800 dark:text-slate-100 truncate leading-tight">{m.title}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Harap buat modul terlebih dahulu.</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsKeyModalOpen(false)}
                    className="btn-duo-slate px-4 py-2.5 text-xs font-black"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={keyFormLoading || selectedModuleIds.length === 0}
                    className="btn-duo-green px-5 py-2.5 text-xs font-black flex items-center gap-1.5 shadow-xs disabled:opacity-40"
                  >
                    {keyFormLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>BUAT KUNCI VOUCHER</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
