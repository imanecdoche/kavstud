import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  getDoc,
  runTransaction,
  increment
} from 'firebase/firestore';
import { 
  Search, 
  BookOpen, 
  BookMarked, 
  Download, 
  Star, 
  Key, 
  X, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  BookmarkCheck,
  ArrowLeft,
  ChevronUp,
  Type,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface Module {
  id: string;
  title: string;
  level: 'elementary' | 'junior' | 'senior';
  content: string;
  isPublished: boolean;
}

interface ModuleLibraryProps {
  userProfile: UserProfile | null;
  onSetLoading: (loading: boolean) => void;
}

// Simple Custom Markdown Renderer
// Simple Custom Markdown Renderer
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
            <span className="text-xl shrink-0 leading-none select-none">{icon}</span>
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

      // Default paragraph (strip basic bold markdown stars)
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

export default function ModuleLibrary({ userProfile, onSetLoading }: ModuleLibraryProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevelFilter, setActiveLevelFilter] = useState<'all' | 'elementary' | 'junior' | 'senior'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Access Voucher Code states
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);

  // Local student stats
  const [unlockedModuleIds, setUnlockedModuleIds] = useState<string[]>([]);
  const [favoriteModuleIds, setFavoriteModuleIds] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [readerFontFamily, setReaderFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setUnlockedModuleIds(userProfile.unlockedModules || []);
      setFavoriteModuleIds(userProfile.favoriteModules || []);
    }
  }, [userProfile]);

  useEffect(() => {
    const handleScroll = () => {
      // Check window scroll
      const scrolled = window.scrollY > 300 || document.documentElement.scrollTop > 300;
      
      // Also check if any parent scrollable container is scrolled
      const mainContent = document.querySelector('.overflow-y-auto');
      const innerScrolled = mainContent ? mainContent.scrollTop > 300 : false;
      
      setShowScrollTop(scrolled || innerScrolled);
    };

    window.addEventListener('scroll', handleScroll, { capture: true });
    
    // Also bind to any scrollable element inside dashboard
    const mainContent = document.querySelector('.overflow-y-auto');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, [selectedModule]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContent = document.querySelector('.overflow-y-auto');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Load all published modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'modules'), where('isPublished', '==', true));
        const snap = await getDocs(q);
        const fetched: Module[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Module);
        });
        setModules(fetched);
      } catch (err) {
        console.error('Error fetching modules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Filter Logic
  const filteredModules = modules.filter(m => {
    const isUnlocked = unlockedModuleIds.includes(m.id);
    if (!isUnlocked) return false; // Students can only view unlocked modules in their library

    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = activeLevelFilter === 'all' || m.level === activeLevelFilter;
    const matchesFav = !showFavoritesOnly || favoriteModuleIds.includes(m.id);

    return matchesSearch && matchesLevel && matchesFav;
  });

  // Toggle Favorite
  const handleToggleFavorite = async (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!auth.currentUser) return;
    
    const isFav = favoriteModuleIds.includes(moduleId);
    const userRef = doc(db, 'users', auth.currentUser.uid);

    try {
      if (isFav) {
        setFavoriteModuleIds(prev => prev.filter(id => id !== moduleId));
        await updateDoc(userRef, {
          favoriteModules: arrayRemove(moduleId)
        });
      } else {
        setFavoriteModuleIds(prev => [...prev, moduleId]);
        await updateDoc(userRef, {
          favoriteModules: arrayUnion(moduleId)
        });
      }
    } catch (err) {
      console.error('Error updating favorites:', err);
    }
  };

  // Claim Voucher Access Key
  const handleClaimAccessKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim() || !auth.currentUser) return;

    setVoucherLoading(true);
    setVoucherError(null);
    setVoucherSuccess(null);

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const keyQuery = query(collection(db, 'module_access_keys'), where('key', '==', voucherCode.trim().toUpperCase()));

    try {
      const querySnap = await getDocs(keyQuery);
      if (querySnap.empty) {
        setVoucherError('Kunci akses tidak valid atau tidak ditemukan.');
        setVoucherLoading(false);
        return;
      }

      const keyDoc = querySnap.docs[0];
      const keyData = keyDoc.data();
      const keyId = keyDoc.id;

      // Expiry Date Validation
      if (keyData.expiryDate) {
        const expiry = new Date(keyData.expiryDate);
        if (new Date() > expiry) {
          setVoucherError('Kunci akses ini telah kadaluarsa.');
          setVoucherLoading(false);
          return;
        }
      }

      // Usage Limit Validation
      if (keyData.usageLimit !== null && keyData.usageCount >= keyData.usageLimit) {
        setVoucherError('Batas pemakaian kunci akses ini telah habis.');
        setVoucherLoading(false);
        return;
      }

      // Modules validation
      const targetModuleIds = keyData.moduleIds || [];
      if (targetModuleIds.length === 0) {
        setVoucherError('Kunci akses ini tidak memiliki modul terkait.');
        setVoucherLoading(false);
        return;
      }

      // Check if student already unlocked all modules from this key
      const alreadyUnlockedAll = targetModuleIds.every((id: string) => unlockedModuleIds.includes(id));
      if (alreadyUnlockedAll) {
        setVoucherError('Anda sudah membuka semua modul yang terikat dengan kunci akses ini.');
        setVoucherLoading(false);
        return;
      }

      // Run Firestore Transaction to safely claim key usage
      await runTransaction(db, async (transaction) => {
        const keyRef = doc(db, 'module_access_keys', keyId);
        
        // 1. Increment Usage Count
        transaction.update(keyRef, {
          usageCount: increment(1)
        });

        // 2. Add unlocked modules to student profile
        const newUnlockedList = Array.from(new Set([...unlockedModuleIds, ...targetModuleIds]));
        transaction.update(userRef, {
          unlockedModules: newUnlockedList
        });
      });

      // Update local state lists
      const addedCount = targetModuleIds.filter((id: string) => !unlockedModuleIds.includes(id)).length;
      setUnlockedModuleIds(prev => Array.from(new Set([...prev, ...targetModuleIds])));
      setVoucherSuccess(`Sukses! Berhasil membuka ${addedCount} modul baru.`);
      setVoucherCode('');
      
      // Auto close success alert after 3 seconds
      setTimeout(() => {
        setIsAccessModalOpen(false);
        setVoucherSuccess(null);
      }, 3000);

    } catch (err) {
      console.error('Error claiming access key:', err);
      setVoucherError('Gagal memproses klaim kunci akses.');
    } finally {
      setVoucherLoading(false);
    }
  };

  // PDF Printing handler
  const handlePrintPDF = () => {
    window.print();
  };

  if (selectedModule) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto space-y-6 relative animate-fadeIn animate-duration-200" id="print-area">
        {/* Sticky Navigation & Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800/95 backdrop-blur-md z-20 py-4 border-b border-gray-100 dark:border-slate-700/50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-3 shrink-0" id="print-header">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center gap-1.5 text-xs font-black text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Pustaka</span>
            </button>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                selectedModule.level === 'elementary' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border-amber-200' :
                selectedModule.level === 'junior' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200'
              }`}>
                {selectedModule.level}
              </span>

              {/* Display Settings Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                    isSettingsOpen ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 text-indigo-700' : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:bg-slate-700 border-transparent'
                  }`}
                  title="Pengaturan Tampilan"
                >
                  <Type className="w-4 h-4" />
                </button>

                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 p-4 bg-white dark:bg-slate-800 border border-gray-150 rounded-2xl shadow-xl w-60 z-30 space-y-3.5 animate-fadeIn text-xs text-gray-800 dark:text-slate-100">
                    {/* Font Size Settings */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Ukuran Huruf</span>
                      <div className="grid grid-cols-4 gap-1 p-0.5 bg-gray-100 dark:bg-slate-700 rounded-lg font-bold">
                        {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setReaderFontSize(sz)}
                            className={`py-1 rounded-md text-center uppercase text-[9px] cursor-pointer transition-all ${
                              readerFontSize === sz ? 'bg-white dark:bg-slate-800 text-indigo-700 shadow-3xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:text-slate-100'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Family Settings */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Jenis Huruf</span>
                      <div className="grid grid-cols-3 gap-1 p-0.5 bg-gray-100 dark:bg-slate-700 rounded-lg font-bold">
                        {(['sans', 'serif', 'mono'] as const).map((ff) => (
                          <button
                            key={ff}
                            type="button"
                            onClick={() => setReaderFontFamily(ff)}
                            className={`py-1 rounded-md text-center capitalize text-[9px] cursor-pointer transition-all ${
                              readerFontFamily === ff ? 'bg-white dark:bg-slate-800 text-indigo-700 shadow-3xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:text-slate-100'
                            }`}
                          >
                            {ff}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Download PDF / Print */}
              <button
                onClick={handlePrintPDF}
                className="p-2 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-transparent"
                title="Simpan sebagai PDF / Cetak"
              >
                <Download className="w-4 h-4" />
              </button>
              {/* Favorite Toggle */}
              <button
                onClick={(e) => handleToggleFavorite(selectedModule.id, e)}
                className="p-2 text-gray-500 dark:text-slate-400 hover:text-amber-500 hover:bg-gray-100 dark:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-transparent"
              >
                <Star className={`w-4 h-4 ${favoriteModuleIds.includes(selectedModule.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Title Panel inside Sticky Header */}
          <h1 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white leading-tight">
            {selectedModule.title}
          </h1>
        </div>

        {/* Module Content Area */}
        <div className={`prose max-w-none bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-3xs select-text ${
          readerFontSize === 'sm' ? 'text-[11px] sm:text-xs leading-relaxed' :
          readerFontSize === 'base' ? 'text-xs sm:text-sm leading-relaxed' :
          readerFontSize === 'lg' ? 'text-sm sm:text-base leading-relaxed' :
          'text-base sm:text-lg leading-relaxed'
        } ${
          readerFontFamily === 'sans' ? 'font-sans' :
          readerFontFamily === 'serif' ? 'font-serif' :
          'font-mono'
        }`}>
          <MarkdownRenderer content={selectedModule.content} />
        </div>

        {/* Go To Top Floating Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg z-30 transition-all flex items-center justify-center cursor-pointer border-2 border-indigo-500 border-b-4 border-indigo-850 hover:scale-105 active:scale-95"
              title="Kembali ke Atas"
            >
              <ChevronUp className="w-5.5 h-5.5" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Dynamic Printing Style overrides (Applies only when printing) */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-area, #print-area * {
              visibility: visible;
            }
            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            #print-header {
              display: none !important;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto" id="module-library-page">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-700/50 pb-6">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pustaka Siswa</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
            Pustaka Modul Belajar
          </h1>
        </div>

        {/* Claim Key Button */}
        <button
          onClick={() => {
            setIsAccessModalOpen(true);
            setVoucherError(null);
            setVoucherSuccess(null);
          }}
          className="btn-duo-green px-5 py-3 text-xs font-black flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
          style={{ minHeight: '44px' }}
        >
          <Key className="w-4.5 h-4.5" />
          <span>KUNCI AKSES VOUCHER</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi, unit, atau kata kunci..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs"
          />
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex bg-gray-100 dark:bg-slate-700/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveLevelFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLevelFilter === 'all' ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-3xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveLevelFilter('elementary')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLevelFilter === 'elementary' ? 'bg-white dark:bg-slate-800 text-amber-700 shadow-3xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200'
              }`}
            >
              Elementary
            </button>
            <button
              onClick={() => setActiveLevelFilter('junior')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLevelFilter === 'junior' ? 'bg-white dark:bg-slate-800 text-purple-700 shadow-3xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200'
              }`}
            >
              Junior
            </button>
            <button
              onClick={() => setActiveLevelFilter('senior')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLevelFilter === 'senior' ? 'bg-white dark:bg-slate-800 text-emerald-700 shadow-3xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-200'
              }`}
            >
              Senior
            </button>
          </div>

          {/* Fav Filter Toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all ${
              showFavoritesOnly 
                ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 text-amber-600 dark:text-amber-400' 
                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:text-slate-100'
            }`}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Favorit Saya</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card Modules */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
        </div>
      ) : filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((m, index) => {
            const isFav = favoriteModuleIds.includes(m.id);
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModule(m)}
                className="card-duo-interactive p-5 flex flex-col justify-between space-y-4 shadow-xs stagger-item"
                style={{ animationDelay: `${Math.min(index * 40, 800)}ms` }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                      m.level === 'elementary' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border-amber-200' :
                      m.level === 'junior' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200'
                    }`}>
                      {m.level}
                    </span>

                    {/* Fav Action */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(m.id, e)}
                      className="p-1 text-gray-400 hover:text-amber-500 rounded-lg transition-colors cursor-pointer"
                      title={isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                    >
                      <Star className={`w-4.5 h-4.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:text-indigo-400 transition-colors line-clamp-1">
                    {m.title}
                  </h3>

                  <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">
                    {m.content.replace(/[#>*-]/g, '').substring(0, 150)}...
                  </p>
                </div>

                <div className="w-full flex items-center justify-between text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest pt-2 border-t border-gray-100 dark:border-slate-700/50">
                  <span>Buka Materi</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-12 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700 dark:text-slate-200">Tidak ada modul belajar yang terbuka</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            Gunakan Kunci Akses Voucher dari guru Anda untuk membuka modul materi pembelajaran baru.
          </p>
        </div>
      )}

      {/* Access Key Claims Drawer / Modal */}
      <AnimatePresence>
        {isAccessModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal-duo w-[400px] max-w-[90vw] p-6 space-y-4 bg-white dark:bg-slate-800 shadow-2xl relative"
            >
              <button
                onClick={() => setIsAccessModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:bg-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1 pb-2 border-b border-gray-100 dark:border-slate-700/50">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto shadow-3xs">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white pt-1">Buka Akses Modul</h3>
                <p className="text-[10px] text-gray-400">Masukkan kode kunci voucher Anda untuk membuka materi.</p>
              </div>

              {/* Feedback Alerts */}
              {voucherError && (
                <div className="p-3 bg-red-50 border border-red-200/50 rounded-xl text-[10px] font-bold text-red-600 flex items-center gap-1.5 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <p>{voucherError}</p>
                </div>
              )}
              {voucherSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200/50 rounded-xl text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <p>{voucherSuccess}</p>
                </div>
              )}

              <form onSubmit={handleClaimAccessKey} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase tracking-wider">KODE VOUCHER / KUNCI</label>
                  <input
                    type="text"
                    required
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Contoh: KAVIO-UNIT1-START"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-gray-900 dark:text-white font-mono text-center uppercase focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-3xs placeholder-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={voucherLoading || !voucherCode.trim()}
                  className="w-full btn-duo-green py-3 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-40"
                >
                  {voucherLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>KLAIM AKSES SEKARANG</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
