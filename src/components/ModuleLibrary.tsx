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
  increment,
  onSnapshot
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
  isPublished?: boolean;
  isPublic?: boolean;
}

interface ModuleLibraryProps {
  userProfile?: UserProfile | null;
  onSetLoading?: (loading: boolean) => void;
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
          return <em key={iIdx} className="italic text-[#C6D4DF]">{italicPart}</em>;
        }
        return italicPart;
      });

      if (isBold) {
        return <strong key={bIdx} className="font-bold text-white">{renderedItalics}</strong>;
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
        <div key={`chat-${idx}`} className="my-4 p-4 bg-black/40 border border-white/10 rounded-[3px] space-y-3 shrink-0 max-w-lg mx-auto w-full">
          {chatLines.map((line, lIdx) => {
            const speakerIndex = uniqueSpeakers.indexOf(line.speaker);
            const isRight = speakerIndex === 1;
            return (
              <div key={lIdx} className={`flex flex-col ${isRight ? 'items-end' : 'items-start'} space-y-1`}>
                <span className="text-[9px] font-bold text-[#8A8A8A] uppercase px-1 tracking-wider font-mono">
                  {line.speaker}
                </span>
                <div className={`max-w-[85%] px-3.5 py-2 text-xs font-medium rounded-[3px] ${
                  isRight 
                    ? 'bg-[#A1CD44]/20 text-white border border-[#A1CD44]/30' 
                    : 'bg-[#66C0F4]/20 text-white border border-[#66C0F4]/30'
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
        .filter(r => !/^[|\s-:]+$/.test(r))
        .map(r => 
          r.split('|')
            .map(c => c.trim())
            .filter((_, i, arr) => i > 0 && i < arr.length - 1)
        );

      elements.push(
        <div key={`table-${idx}`} className="my-5 overflow-x-auto border border-white/10 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.5)] bg-black/40 shrink-0">
          <table className="min-w-full divide-y divide-white/10 text-left border-collapse">
            <thead className="bg-[#171A21]">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-[10px] font-bold text-[#66C0F4] uppercase tracking-wider font-mono">{formatText(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-black/40">
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 text-xs text-white font-medium">
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

      const chatMatch = trimmed.match(/^([A-Z][A-Za-z0-9\s]{1,15}):\s*(.+)$/);
      if (chatMatch && !inAside) {
        if (inTable) { inTable = false; flushTable(idx); }
        if (!inChat) { inChat = true; chatLines = []; }
        chatLines.push({ speaker: chatMatch[1].trim(), text: chatMatch[2].trim() });
        continue;
      } else { if (inChat) { inChat = false; flushChat(idx); } }

      if (trimmed.startsWith('|') && !inAside) {
        if (!inTable) { inTable = true; tableRows = []; }
        tableRows.push(line);
        continue;
      } else { if (inTable) { inTable = false; flushTable(idx); } }

      if (trimmed === '<aside>') { inAside = true; asideContent = []; continue; }
      if (trimmed === '</aside>') {
        inAside = false;
        const nonExpired = asideContent.map(l => l.trim()).filter(l => l !== '');
        const icon = nonExpired[0] || '🌟';
        const bodyText = nonExpired.slice(1).join(' ');
        elements.push(
          <div key={`aside-${idx}`} className="my-5 p-4 bg-black/40 border border-[#A1CD44]/40 rounded-[3px] flex items-start gap-3.5 shadow-md">
            <span className="text-xl shrink-0 leading-none select-none">{icon}</span>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#A1CD44] uppercase tracking-wider font-mono block">Tip Belajar</span>
              <p className="text-xs font-medium text-[#C6D4DF] leading-relaxed">
                {formatText(bodyText)}
              </p>
            </div>
          </div>
        );
        continue;
      }
      if (inAside) { asideContent.push(line); continue; }

      if (trimmed.startsWith('# ')) { elements.push(<h1 key={idx} className="text-xl sm:text-2xl font-bold text-white border-b border-white/10 pb-2 mt-6 mb-3 uppercase tracking-tight">{formatText(trimmed.substring(2))}</h1>); continue; }
      if (trimmed.startsWith('## ')) { elements.push(<h2 key={idx} className="text-base sm:text-lg font-bold text-[#66C0F4] mt-5 mb-2.5 uppercase tracking-tight">{formatText(trimmed.substring(3))}</h2>); continue; }
      if (trimmed.startsWith('### ')) { elements.push(<h3 key={idx} className="text-xs sm:text-sm font-bold text-[#A1CD44] mt-4 mb-2 uppercase tracking-wider">{formatText(trimmed.substring(4))}</h3>); continue; }
      if (trimmed.startsWith('#### ')) { elements.push(<h4 key={idx} className="text-xs font-bold text-white mt-3 mb-1.5 uppercase">{formatText(trimmed.substring(5))}</h4>); continue; }
      
      if (trimmed.startsWith('> ')) {
        const textOnly = trimmed.replace('> ', '');
        elements.push(<blockquote key={idx} className="my-4 pl-4 py-3 border-l-2 border-[#66C0F4] bg-black/40 text-[#C6D4DF] text-xs leading-relaxed italic rounded-[2px]">{formatText(textOnly)}</blockquote>);
        continue;
      }
      
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) { elements.push(<ul key={idx} className="list-disc list-inside pl-4 my-2 text-xs text-[#C6D4DF] leading-relaxed space-y-1"><li>{formatText(trimmed.substring(2))}</li></ul>); continue; }
      if (/^\d+\.\s/.test(trimmed)) { elements.push(<motion.ol key={idx} className="list-decimal list-inside pl-4 my-2 text-xs text-[#C6D4DF] leading-relaxed space-y-1"><li>{formatText(trimmed.replace(/^\d+\.\s/, ''))}</li></motion.ol>); continue; }
      if (trimmed === '---') { elements.push(<hr key={idx} className="my-6 border-t border-white/10" />); continue; }
      if (!trimmed) { elements.push(<div key={idx} className="h-2" />); continue; }

      elements.push(<p key={idx} className="text-xs text-[#C6D4DF] leading-relaxed my-2.5">{formatText(trimmed)}</p>);
    }

    if (inChat) flushChat(lines.length);
    if (inTable) flushTable(lines.length);

    return elements;
  };

  return <div className="space-y-2">{parseLines(content)}</div>;
}

export default function ModuleLibrary({ userProfile }: ModuleLibraryProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevelFilter, setActiveLevelFilter] = useState<'all' | 'elementary' | 'junior' | 'senior'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [unlockedModuleIds, setUnlockedModuleIds] = useState<string[]>([]);
  const [favoriteModuleIds, setFavoriteModuleIds] = useState<string[]>([]);
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [readerFontFamily, setReaderFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.unlockedModules) setUnlockedModuleIds(userProfile.unlockedModules);
    if (userProfile?.favoriteModules) setFavoriteModuleIds(userProfile.favoriteModules);

    setLoading(true);
    let unsub = () => {};
    if (db) {
      try {
        const modulesRef = collection(db, 'modules');
        unsub = onSnapshot(modulesRef, (snapshot) => {
          const items: Module[] = [];
          snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            items.push({ id: docSnap.id, title: d.title || 'Untitled', content: d.content || '', level: d.level || 'elementary', isPublic: d.isPublic ?? true });
          });
          setModules(items);
          setLoading(false);
        });
      } catch { setLoading(false); }
    }
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => { unsub(); window.removeEventListener('scroll', handleScroll); };
  }, [userProfile]);

  const filteredModules = modules.filter(m => {
    if (searchQuery.trim() && !(m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.content.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    if (activeLevelFilter !== 'all' && m.level !== activeLevelFilter) return false;
    if (showFavoritesOnly && !favoriteModuleIds.includes(m.id)) return false;
    if (!m.isPublic && !unlockedModuleIds.includes(m.id)) return false;
    return true;
  });

  const handleToggleFavorite = async (moduleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyFav = favoriteModuleIds.includes(moduleId);
    const newFavList = isCurrentlyFav ? favoriteModuleIds.filter(id => id !== moduleId) : [...favoriteModuleIds, moduleId];
    setFavoriteModuleIds(newFavList);
    if (auth.currentUser && db) await updateDoc(doc(db, 'users', auth.currentUser.uid), { favoriteModules: newFavList }).catch(() => {});
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleClaimAccessKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim() || !auth.currentUser || !db) return;
    setVoucherLoading(true);
    try {
      const q = query(collection(db, 'module_access_keys'), where('code', '==', voucherCode.trim().toUpperCase()));
      const querySnap = await getDocs(q);
      if (querySnap.empty) { setVoucherError('Kode tidak valid.'); }
      else {
        const keyDoc = querySnap.docs[0];
        const targetModuleIds = keyDoc.data().targetModuleIds || [];
        await runTransaction(db, async (t) => {
          t.update(doc(db, 'module_access_keys', keyDoc.id), { usageCount: increment(1) });
          t.update(doc(db, 'users', auth.currentUser!.uid), { unlockedModules: Array.from(new Set([...unlockedModuleIds, ...targetModuleIds])) });
        });
        setUnlockedModuleIds(prev => Array.from(new Set([...prev, ...targetModuleIds])));
        setVoucherSuccess('Sukses!');
        setTimeout(() => setIsAccessModalOpen(false), 2000);
      }
    } catch { setVoucherError('Gagal.'); } finally { setVoucherLoading(false); }
  };

  if (selectedModule) {
    return (
      <div className="w-full space-y-6 relative animate-fadeIn font-sans text-white pb-16" id="print-area">
        <div className="sticky top-0 bg-[#2F3138] border-b border-white/10 z-30 p-4 sm:p-6 w-full shadow-[0_4px_16px_rgba(0,0,0,0.6)] space-y-3 text-white" id="print-header">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedModule(null)} className="flex items-center gap-1.5 text-xs font-bold text-[#66C0F4] hover:underline transition-colors cursor-pointer uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" /> <span>Kembali ke Pustaka</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-[9px] font-bold uppercase tracking-wider bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/30 font-mono">{selectedModule.level}</span>
              <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2 text-[#8A8A8A] hover:text-white"><Type className="w-4 h-4" /></button>
              <button onClick={() => window.print()} className="p-2 text-[#8A8A8A] hover:text-white"><Download className="w-4 h-4" /></button>
              <button onClick={(e) => handleToggleFavorite(selectedModule.id, e)} className="p-2 text-[#8A8A8A] hover:text-[#A1CD44]"><Star className={favoriteModuleIds.includes(selectedModule.id) ? 'fill-[#A1CD44]' : ''} /></button>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white uppercase leading-tight tracking-tight">{selectedModule.title}</h1>
        </div>
        <div className={`w-full bg-[#2F3138] border border-white/10 rounded-[3px] p-6 sm:p-8 ${readerFontSize === 'sm' ? 'text-xs' : readerFontSize === 'lg' ? 'text-base' : 'text-sm'} ${readerFontFamily}`}>
          <MarkdownRenderer content={selectedModule.content} />
        </div>
        {showScrollTop && <button onClick={scrollToTop} className="fixed bottom-6 right-6 p-3 bg-[#66C0F4] text-[#171A21] rounded-full shadow-lg"><ChevronUp className="w-5 h-5" /></button>}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 w-full font-sans text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[10px] font-bold text-[#66C0F4] uppercase tracking-wider block font-mono">PUSTAKA SISWA</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-0.5">
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
          className="h-[42px] px-5 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold flex items-center justify-center gap-2 rounded-[2px] shrink-0 cursor-pointer uppercase tracking-wider border-none transition-all"
        >
          <Key className="w-4 h-4 text-[#171A21]" />
          <span>KUNCI AKSES VOUCHER</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8A8A8A] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi, unit, atau kata kunci..."
            className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#66C0F4] transition-all"
          />
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-black/40 p-1 rounded-[2px] border border-white/15 text-xs font-bold">
            <button
              onClick={() => setActiveLevelFilter('all')}
              className={`px-3.5 py-1.5 rounded-[2px] transition-all cursor-pointer uppercase tracking-wider ${
                activeLevelFilter === 'all' ? 'bg-[#66C0F4] text-[#171A21]' : 'text-[#C6D4DF] hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveLevelFilter('elementary')}
              className={`px-3.5 py-1.5 rounded-[2px] transition-all cursor-pointer uppercase tracking-wider ${
                activeLevelFilter === 'elementary' ? 'bg-[#66C0F4] text-[#171A21]' : 'text-[#C6D4DF] hover:text-white'
              }`}
            >
              Elementary
            </button>
            <button
              onClick={() => setActiveLevelFilter('junior')}
              className={`px-3.5 py-1.5 rounded-[2px] transition-all cursor-pointer uppercase tracking-wider ${
                activeLevelFilter === 'junior' ? 'bg-[#66C0F4] text-[#171A21]' : 'text-[#C6D4DF] hover:text-white'
              }`}
            >
              Junior
            </button>
            <button
              onClick={() => setActiveLevelFilter('senior')}
              className={`px-3.5 py-1.5 rounded-[2px] transition-all cursor-pointer uppercase tracking-wider ${
                activeLevelFilter === 'senior' ? 'bg-[#66C0F4] text-[#171A21]' : 'text-[#C6D4DF] hover:text-white'
              }`}
            >
              Senior
            </button>
          </div>

          {/* Fav Filter Toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2.5 rounded-[2px] border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider ${
              showFavoritesOnly 
                ? 'bg-[#A1CD44] text-[#171A21] border-[#A1CD44]' 
                : 'bg-black/40 border-white/15 text-[#C6D4DF] hover:bg-white/10 hover:text-white'
            }`}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-[#171A21] text-[#171A21]' : 'text-[#8A8A8A]'}`} />
            <span>Favorit Saya</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card Modules */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#66C0F4] animate-spin" />
        </div>
      ) : filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((m, index) => {
            const isFav = favoriteModuleIds.includes(m.id);
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModule(m)}
                className="group bg-[#2F3138] border border-white/10 hover:border-[#66C0F4] rounded-[3px] p-5 flex flex-col justify-between space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer transition-all text-white stagger-item"
                style={{ animationDelay: `${Math.min(index * 40, 800)}ms` }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-[9px] font-bold uppercase tracking-wider bg-[#A1CD44]/20 text-[#A1CD44] border border-[#A1CD44]/30 font-mono">
                      {m.level}
                    </span>

                    {/* Fav Action */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(m.id, e)}
                      className="p-1 text-[#8A8A8A] hover:text-[#A1CD44] rounded-[2px] transition-colors cursor-pointer"
                      title={isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-[#A1CD44] text-[#A1CD44]' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white uppercase group-hover:text-[#66C0F4] transition-colors line-clamp-1">
                    {m.title}
                  </h3>

                  <p className="text-[11px] text-[#C6D4DF] line-clamp-3 leading-relaxed">
                    {m.content.replace(/[#>*-]/g, '').substring(0, 150)}...
                  </p>
                </div>

                <div className="w-full flex items-center justify-between text-[10px] font-bold text-[#66C0F4] uppercase tracking-wider pt-3 border-t border-white/10">
                  <span>BUKA MATERI</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#2F3138] border border-white/10 rounded-[3px] p-12 text-center space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <BookOpen className="w-10 h-10 text-[#8A8A8A] mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase">Tidak ada modul belajar yang terbuka</h3>
          <p className="text-xs text-[#C6D4DF] max-w-sm mx-auto leading-relaxed">
            Gunakan Kunci Akses Voucher dari guru Anda untuk membuka modul materi pembelajaran baru.
          </p>
        </div>
      )}

      {/* Access Key Claims Drawer / Modal */}
      <AnimatePresence>
        {isAccessModalOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-[400px] max-w-[90vw] p-6 space-y-4 bg-[#2F3138] border border-white/15 rounded-[3px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative text-white font-sans"
            >
              <button
                onClick={() => setIsAccessModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-1 pb-2 border-b border-white/10">
                <div className="w-10 h-10 bg-black/40 border border-white/10 text-[#66C0F4] rounded-[2px] flex items-center justify-center mx-auto">
                  <Key className="w-5 h-5 text-[#66C0F4]" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase pt-1 tracking-tight">Buka Akses Modul</h3>
                <p className="text-[10px] text-[#C6D4DF]">Masukkan kode kunci voucher Anda untuk membuka materi.</p>
              </div>

              {/* Feedback Alerts */}
              {voucherError && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-[2px] text-[10px] font-bold text-red-400 flex items-center gap-1.5 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <p>{voucherError}</p>
                </div>
              )}
              {voucherSuccess && (
                <div className="p-3 bg-[#A1CD44]/20 border border-[#A1CD44]/40 rounded-[2px] text-[10px] font-bold text-[#A1CD44] flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A1CD44] shrink-0" />
                  <p>{voucherSuccess}</p>
                </div>
              )}

              <form onSubmit={handleClaimAccessKey} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">KODE VOUCHER / KUNCI</label>
                  <input
                    type="text"
                    required
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Contoh: KAVIO-UNIT1-START"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-[2px] text-xs text-white font-mono text-center uppercase focus:outline-none focus:border-[#66C0F4] placeholder-[#8A8A8A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={voucherLoading || !voucherCode.trim()}
                  className="w-full h-[40px] bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold rounded-[2px] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider border-none disabled:opacity-40"
                >
                  {voucherLoading && <Loader2 className="w-4 h-4 animate-spin text-[#171A21]" />}
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
