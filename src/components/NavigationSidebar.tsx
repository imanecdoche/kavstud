import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  NotebookText, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  User,
  Users,
  CircleDot,
  BookOpen,
  Moon,
  Sun,
  Package,
  Newspaper,
  Inbox,
  FileSpreadsheet,
  Wrench,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { UserProfile } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getLocalFeatureFlags } from '../utils/featureFlags';

interface NavigationSidebarProps {
  role: 'teacher' | 'student';
  activeTab: 'dashboard' | 'assignments' | 'settings' | 'circles' | 'students' | 'modules' | 'packages' | 'inbox' | 'registrations' | 'devtools' | 'schedules';
  setActiveTab: (tab: 'dashboard' | 'assignments' | 'settings' | 'circles' | 'students' | 'modules' | 'packages' | 'inbox' | 'registrations' | 'devtools' | 'schedules') => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onNavigate?: (path: string) => void;
}

export default function NavigationSidebar({
  role,
  activeTab,
  setActiveTab,
  userProfile,
  onLogout,
  isMobileOpen,
  setIsMobileOpen,
  onNavigate
}: NavigationSidebarProps) {
  // Remember collapsed state on desktop
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('kavio_sidebar_collapsed');
    return saved === 'true';
  });
  
  const { theme, setTheme, isDarkMode } = useTheme();

  const [hasUnreadInbox, setHasUnreadInbox] = useState(() => {
    try {
      const count = localStorage.getItem('kavio_unread_inbox_count');
      return count !== null && parseInt(count, 10) > 0;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const checkUnread = () => {
      try {
        const count = localStorage.getItem('kavio_unread_inbox_count');
        setHasUnreadInbox(count !== null && parseInt(count, 10) > 0);
      } catch {
        setHasUnreadInbox(false);
      }
    };
    
    checkUnread();
    const interval = setInterval(checkUnread, 800);
    window.addEventListener('storage', checkUnread);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkUnread);
    };
  }, []);

  const [featureFlags, setFeatureFlags] = useState(() => getLocalFeatureFlags());

  useEffect(() => {
    const handleFlagsChange = () => setFeatureFlags(getLocalFeatureFlags());
    window.addEventListener('kavio_feature_flags_updated', handleFlagsChange);
    return () => window.removeEventListener('kavio_feature_flags_updated', handleFlagsChange);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('kavio_sidebar_collapsed', String(next));
      return next;
    });
  };

  const isDevAccount = userProfile?.email === 'fatih@kavio.tec.edu';

  const menuSections = isDevAccount ? [
    {
      title: 'TEACHER TOOLS',
      items: [
        { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'schedules' as const, label: 'Jadwal & Bimbingan', icon: Calendar },
        { id: 'students' as const, label: 'Manajemen Siswa', icon: Users },
        { id: 'circles' as const, label: 'Kavio Circle', icon: CircleDot },
        { id: 'modules' as const, label: 'Kelola Modul', icon: BookOpen },
        { id: 'assignments' as const, label: 'Kelola Tugas', icon: NotebookText },
        { id: 'packages' as const, label: 'Paket', icon: Package },
        { id: 'settings' as const, label: 'Pengaturan', icon: Settings }
      ]
    },
    {
      title: 'DEV TOOLS',
      items: [
        { id: 'registrations' as const, label: 'Pendaftaran Paket', icon: FileSpreadsheet },
        { id: 'devtools' as const, label: 'Kontrol Maintenance', icon: Wrench }
      ]
    }
  ] : [
    {
      title: role === 'teacher' ? 'TEACHER TOOLS' : undefined,
      items: [
        { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'schedules' as const, label: 'Jadwal & Bimbingan', icon: Calendar },
        ...(role === 'teacher' ? [
          { id: 'students' as const, label: 'Manajemen Siswa', icon: Users },
          { id: 'circles' as const, label: 'Kavio Circle', icon: CircleDot }
        ] : []),
        { id: 'modules' as const, label: role === 'teacher' ? 'Kelola Modul' : 'Pustaka Modul', icon: BookOpen },
        { id: 'assignments' as const, label: role === 'teacher' ? 'Kelola Tugas' : 'Tugas Saya', icon: NotebookText },
        { id: 'packages' as const, label: 'Paket', icon: Package },
        { id: 'settings' as const, label: 'Pengaturan', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Top Navbar (Floating Header) */}
      <header className="lg:hidden h-16 bg-white dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700/50 px-4 flex items-center justify-between sticky top-0 z-40 w-full">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-2xl transition-colors cursor-pointer"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Toggle navigation menu"
            id="btn-toggle-mobile-sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Logo iconOnly={false} />
        </div>

        {/* Mobile Header Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            className="p-2 text-gray-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            style={{ minWidth: '40px', minHeight: '40px' }}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 bg-white dark:bg-slate-800 border-r-2 border-gray-100 dark:border-slate-700/60 flex flex-col transition-all duration-300 shadow-sm ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header & Brand Logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-slate-800 shrink-0">
          <Logo iconOnly={isCollapsed} />
          
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:bg-slate-900 rounded-xl cursor-pointer"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Close sidebar"
            id="btn-close-sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Mini Profile Section */}
        <div className="p-4 border-b border-gray-50 dark:border-slate-800">
          <div className={`flex items-center gap-3 transition-all ${
            isCollapsed 
              ? 'justify-center' 
              : 'bg-gray-50 dark:bg-slate-900/70 border border-gray-100 dark:border-slate-700/50 rounded-2xl p-3'
          }`}>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs overflow-hidden shrink-0 border border-indigo-200/60 shadow-3xs">
              {userProfile?.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt={userProfile.fullName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                userProfile?.fullName?.charAt(0).toUpperCase() || <User className="w-4 h-4" />
              )}
            </div>
            
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                className="min-w-0 flex-1"
              >
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight">
                  {userProfile?.fullName || 'Loading...'}
                </p>
                <p className="text-[9px] text-gray-400 truncate mt-0.5">
                  {userProfile?.email}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation Menu Links Categorized into TEACHER TOOLS & DEV TOOLS */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && !isCollapsed && (
                <div className="px-3.5 pt-2 pb-1 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-[#1CB0F6] dark:text-[#1CB0F6] tracking-widest font-display">
                    {section.title}
                  </span>
                  <div className="h-[1px] flex-1 bg-gray-200 dark:bg-slate-700/60 ml-2" />
                </div>
              )}
              {isCollapsed && sIdx > 0 && (
                <div className="my-2 border-t border-gray-200 dark:border-slate-700/60" />
              )}

              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                const flag = featureFlags.find(f => f.id === item.id);
                const isMaintenance = flag && !flag.enabled;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center text-xs font-black transition-all group cursor-pointer ${
                      isCollapsed ? 'justify-center p-2.5 rounded-xl' : 'px-3.5 py-2.5 gap-3 rounded-2xl'
                    } ${
                      isActive 
                        ? 'bg-[#1CB0F6] text-white border-b-4 border-[#0092E0] shadow-xs translate-y-[-1px]' 
                        : isMaintenance
                        ? 'text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 border-b-2 border-amber-200'
                        : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-slate-700/70 border-b-2 border-transparent'
                    }`}
                    title={isCollapsed ? (isMaintenance ? `${item.label} (Maintenance Mode)` : item.label) : undefined}
                    id={`menu-item-${item.id}`}
                  >
                    <div className="relative shrink-0">
                      <IconComponent className={`w-4.5 h-4.5 ${
                        isActive ? 'text-white' : isMaintenance ? 'text-amber-500' : 'text-gray-400 group-hover:text-gray-700 dark:text-slate-200'
                      }`} />
                      {isMaintenance && isCollapsed && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF9600] animate-ping" />
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="truncate uppercase tracking-wider text-[11px]"
                        >
                          {item.label}
                        </motion.span>
                        {isMaintenance && (
                          <span className="bg-[#FF9600] text-gray-900 text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase shrink-0">
                            🛠️ Maint
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Desktop Collapse Toggle, Theme Toggle & Logout Button */}
        <div className="p-3 border-t border-gray-50 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/30 space-y-1 shrink-0">
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('/blog');
              } else {
                window.location.href = '/blog';
              }
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center rounded-xl text-xs font-bold text-gray-700 dark:text-slate-200 hover:text-indigo-600 hover:bg-indigo-50/70 dark:hover:bg-slate-800 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5 gap-3'
            }`}
            title={isCollapsed ? 'Kavio Blog' : undefined}
            id="btn-kavio-blog"
          >
            <Newspaper className="w-4.5 h-4.5 shrink-0 text-indigo-500" />
            {!isCollapsed && <span className="uppercase tracking-wider font-extrabold text-[11px]">Kavio Blog</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab('inbox');
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5 gap-3'
            } ${
              activeTab === 'inbox'
                ? 'bg-[#1CB0F6] text-white border-b-4 border-[#0092E0] shadow-xs translate-y-[-1px]'
                : 'text-gray-700 dark:text-slate-200 hover:text-indigo-600 hover:bg-indigo-50/70 dark:hover:bg-slate-800'
            }`}
            title={isCollapsed ? 'Inbox / Notifikasi' : undefined}
            id="btn-sidebar-inbox"
          >
            <div className="relative shrink-0">
              <Inbox className={`w-4.5 h-4.5 ${activeTab === 'inbox' ? 'text-white' : 'text-indigo-500'}`} />
              {hasUnreadInbox && isCollapsed && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF4B4B] animate-pulse" />
              )}
            </div>
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span className="uppercase tracking-wider font-extrabold text-[11px]">Inbox</span>
                {hasUnreadInbox && (
                  <span className="w-2 h-2 rounded-full bg-[#FF4B4B] animate-pulse" />
                )}
              </div>
            )}
          </button>

          <button
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            className={`w-full flex items-center rounded-xl text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-slate-800 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5 gap-3'
            }`}
            title={isCollapsed ? (isDarkMode ? 'Mode Terang' : 'Mode Gelap') : undefined}
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5 shrink-0" /> : <Moon className="w-4.5 h-4.5 shrink-0" />}
            {!isCollapsed && <span>{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>}
          </button>

          <button
            onClick={onLogout}
            className={`w-full flex items-center rounded-xl text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5 gap-3'
            }`}
            title={isCollapsed ? 'Keluar' : undefined}
            id="btn-logout"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {!isCollapsed && <span>Keluar</span>}
          </button>

          {/* Desktop Collapse Arrow Button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center justify-center p-2 text-gray-400 hover:text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:bg-slate-700/50 rounded-xl cursor-pointer transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            id="btn-toggle-collapse"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
