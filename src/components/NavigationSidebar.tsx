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
  Calendar,
  Terminal
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

  // Custom Mouse-Follow Tooltip State
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (text: string, e: React.MouseEvent) => {
    if (!isCollapsed) return;
    setHoveredTooltip(text);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isCollapsed) return;
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredTooltip(null);
  };
  
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
    setHoveredTooltip(null);
  };

  const isDevAccount = userProfile?.email === 'fatih@kavio.tec.edu';

  const menuSections = isDevAccount ? [
    {
      title: 'TEACHER TOOLS',
      items: [
        { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'schedules' as const, label: 'Jadwal Saya', icon: Calendar },
        { id: 'students' as const, label: 'Manajemen Siswa', icon: Users },
        { id: 'circles' as const, label: 'Kavio Circle', icon: CircleDot },
        { id: 'modules' as const, label: 'Kelola Modul', icon: BookOpen },
        { id: 'assignments' as const, label: 'Kelola Tugas', icon: NotebookText },
        { id: 'packages' as const, label: 'Paket', icon: Package },
        { id: 'settings' as const, label: 'Pengaturan', icon: Settings }
      ]
    },
    {
      title: 'DEVELOPER CONTROL',
      items: [
        { id: 'devtools' as const, label: 'DEV TOOLS CENTER', icon: Terminal }
      ]
    }
  ] : [
    {
      title: role === 'teacher' ? 'TEACHER TOOLS' : undefined,
      items: [
        { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'schedules' as const, label: role === 'teacher' ? 'Jadwal Bimbingan' : 'Jadwal Saya', icon: Calendar },
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
      {/* Custom Steam Design System Tooltip */}
      {hoveredTooltip && isCollapsed && (
        <div
          className="fixed z-[100] pointer-events-none bg-[#2F3138] border border-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-[2px] shadow-[0_4px_16px_rgba(0,0,0,0.8)] tracking-wider uppercase whitespace-nowrap"
          style={{
            left: `${mousePos.x + 14}px`,
            top: `${mousePos.y + 6}px`
          }}
        >
          {hoveredTooltip}
        </div>
      )}

      {/* Mobile Header Bar */}
      <header className="lg:hidden h-14 bg-[#171A21] border-b border-white/10 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2.5 text-[#C6D4DF] hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
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
            className="p-2 text-[#C6D4DF] hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
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
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 shadow-sm bg-[#171A21] text-[#FFFFFF] border-r border-white/10 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header & Brand Logo */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <Logo iconOnly={isCollapsed} />
          
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 rounded-[2px] text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Close sidebar"
            id="btn-close-sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Mini Profile Section */}
        <div className="p-4 border-b border-white/10">
          <div className={`flex items-center gap-3 transition-all ${
            isCollapsed 
              ? 'justify-center' 
              : 'bg-[#2F3138] border border-white/10 rounded-[3px] p-3'
          }`}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 border bg-[#66C0F4]/20 text-[#66C0F4] border-[#66C0F4]/40 shadow-xs">
              <img 
                src={userProfile?.photoURL || '/aset/default-avatar.svg'} 
                alt={userProfile?.fullName || 'User'} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/aset/default-avatar.svg';
                }}
              />
            </div>
            
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                className="min-w-0 flex-1"
              >
                <p className="text-xs font-bold truncate leading-tight text-[#FFFFFF]">
                  {userProfile?.fullName || 'Loading...'}
                </p>
                <p className="text-[9px] truncate mt-0.5 text-[#C6D4DF]">
                  {userProfile?.email}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation Menu Links Categorized */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && !isCollapsed && (
                <div className="px-3.5 pt-2 pb-1 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#66C0F4]">
                    {section.title}
                  </span>
                  <div className="h-[1px] flex-1 ml-2 bg-white/10" />
                </div>
              )}
              {isCollapsed && sIdx > 0 && (
                <div className="my-2 border-t border-white/10" />
              )}

              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                const flag = featureFlags.find(f => f.id === item.id);
                const isMaintenance = flag && !flag.enabled;
                const tooltipText = isMaintenance ? `${item.label} (Maintenance)` : item.label;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileOpen(false);
                      setHoveredTooltip(null);
                    }}
                    onMouseEnter={(e) => handleMouseEnter(tooltipText, e)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex items-center text-xs font-bold transition-all group cursor-pointer ${
                      isCollapsed ? 'justify-center p-2.5 rounded-[2px]' : 'px-3.5 py-2.5 gap-3 rounded-[2px]'
                    } ${
                      isActive
                        ? 'bg-[#66C0F4] text-[#171A21] font-extrabold shadow-[0_2px_6px_rgba(0,0,0,0.3)]'
                        : isMaintenance
                        ? 'text-[#B9A074] bg-[#B9A074]/10 border-l-2 border-[#B9A074]'
                        : 'text-[#C6D4DF] hover:text-white hover:bg-white/10'
                    }`}
                    id={`menu-item-${item.id}`}
                  >
                    <div className="relative shrink-0">
                      <IconComponent className={`w-4.5 h-4.5 ${
                        isActive ? 'text-[#171A21]' : isMaintenance ? 'text-[#B9A074]' : 'text-[#848E94] group-hover:text-white'
                      }`} />
                      {isMaintenance && isCollapsed && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B9A074] animate-ping" />
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
                          <span className="bg-[#B9A074] text-[#171A21] text-[9px] font-black px-1.5 py-0.2 rounded-[2px] uppercase shrink-0">
                            Maint
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
        <div className="p-3 border-t border-white/10 bg-[#2F3138] space-y-1 shrink-0">
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('/blog');
              } else {
                window.location.href = '/blog';
              }
              setIsMobileOpen(false);
              setHoveredTooltip(null);
            }}
            onMouseEnter={(e) => handleMouseEnter('Kavio Blog', e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-full flex items-center rounded-[2px] text-xs font-bold text-[#C6D4DF] hover:text-white hover:bg-white/10 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5 gap-3'
            }`}
            id="btn-kavio-blog"
          >
            <Newspaper className="w-4.5 h-4.5 shrink-0 text-[#66C0F4]" />
            {!isCollapsed && <span className="uppercase tracking-wider font-bold text-[11px]">Kavio Blog</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab('inbox');
              setIsMobileOpen(false);
              setHoveredTooltip(null);
            }}
            onMouseEnter={(e) => handleMouseEnter('Inbox', e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-full flex items-center rounded-[2px] text-xs font-bold transition-all cursor-pointer relative ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5 gap-3'
            } ${
              activeTab === 'inbox'
                ? 'bg-[#66C0F4] text-[#171A21]'
                : 'text-[#C6D4DF] hover:text-white hover:bg-white/10'
            }`}
            id="btn-sidebar-inbox"
          >
            <div className="relative shrink-0">
              <Inbox className={`w-4.5 h-4.5 ${activeTab === 'inbox' ? 'text-[#171A21]' : 'text-[#66C0F4]'}`} />
              {hasUnreadInbox && isCollapsed && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF4B4B] animate-pulse" />
              )}
            </div>
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span className="uppercase tracking-wider font-bold text-[11px]">Inbox</span>
                {hasUnreadInbox && (
                  <span className="w-2 h-2 rounded-full bg-[#FF4B4B] animate-pulse" />
                )}
              </div>
            )}
          </button>

          <button
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            onMouseEnter={(e) => handleMouseEnter(isDarkMode ? 'Mode Terang' : 'Mode Gelap', e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-full flex items-center rounded-[2px] text-xs font-bold text-[#C6D4DF] hover:text-white hover:bg-white/10 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5 gap-3'
            }`}
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5 shrink-0 text-[#66C0F4]" /> : <Moon className="w-4.5 h-4.5 shrink-0 text-[#66C0F4]" />}
            {!isCollapsed && <span>{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>}
          </button>

          <button
            onClick={onLogout}
            onMouseEnter={(e) => handleMouseEnter('Keluar', e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-full flex items-center rounded-[2px] text-xs font-bold text-[#C6D4DF] hover:text-[#FF4B4B] hover:bg-[#FF4B4B]/10 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5 gap-3'
            }`}
            id="btn-logout"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {!isCollapsed && <span>Keluar</span>}
          </button>

          {/* Desktop Collapse Arrow Button */}
          <button
            onClick={toggleCollapse}
            onMouseEnter={(e) => handleMouseEnter(isCollapsed ? 'Perluas Sidebar' : 'Kecilkan Sidebar', e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="hidden lg:flex w-full items-center justify-center p-2 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] cursor-pointer transition-colors"
            id="btn-toggle-collapse"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
