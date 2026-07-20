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
  CircleDot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { UserProfile } from '../types';

interface NavigationSidebarProps {
  role: 'teacher' | 'student';
  activeTab: 'dashboard' | 'assignments' | 'settings' | 'circles' | 'students';
  setActiveTab: (tab: 'dashboard' | 'assignments' | 'settings' | 'circles' | 'students') => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function NavigationSidebar({
  role,
  activeTab,
  setActiveTab,
  userProfile,
  onLogout,
  isMobileOpen,
  setIsMobileOpen
}: NavigationSidebarProps) {
  // Remember collapsed state on desktop
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('kavio_sidebar_collapsed');
    return saved === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('kavio_sidebar_collapsed', String(next));
      return next;
    });
  };

  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    ...(role === 'teacher' ? [
      {
        id: 'students' as const,
        label: 'Manajemen Siswa',
        icon: Users
      },
      {
        id: 'circles' as const,
        label: 'Kavio Circle',
        icon: CircleDot
      }
    ] : []),
    {
      id: 'assignments' as const,
      label: role === 'teacher' ? 'Kelola Tugas' : 'Tugas Saya',
      icon: NotebookText
    },
    {
      id: 'settings' as const,
      label: 'Pengaturan',
      icon: Settings
    }
  ];

  return (
    <>
      {/* Mobile Top Navbar (Floating Header) */}
      <header className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 flex items-center justify-between sticky top-0 z-40 w-full">
        <div className="flex items-center gap-2 min-w-0">
          <Logo className="h-5 max-w-[130px] w-auto text-indigo-600 shrink-0" />
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 text-[9px] font-bold text-indigo-700 rounded-md border border-indigo-100 uppercase font-sans shrink-0">
            {role === 'teacher' ? 'Guru' : 'Siswa'}
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -mr-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all active:scale-95 cursor-pointer"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Open sidebar"
          id="btn-mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Backdrop for Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
            id="sidebar-backdrop"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        animate={{ 
          width: isCollapsed ? 80 : 260,
          transition: { duration: 0.2, ease: 'easeInOut' }
        }}
        className={`fixed inset-y-0 left-0 bg-white border-r border-gray-100 flex flex-col z-50 lg:sticky h-screen shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform lg:transition-none`}
        id="app-sidebar"
        style={{
          width: isCollapsed ? '80px' : '260px'
        }}
      >
        {/* Header inside Sidebar */}
        <div className="h-16 px-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <Logo className={`${isCollapsed ? 'h-5 max-w-[42px]' : 'h-5 max-w-[135px]'} w-auto text-indigo-600 shrink-0 transition-all`} />
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 text-[9px] font-bold text-indigo-700 rounded-md border border-indigo-100 uppercase font-sans shrink-0"
              >
                {role === 'teacher' ? 'Guru' : 'Siswa'}
              </motion.span>
            )}
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Close sidebar"
            id="btn-close-sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Mini Profile Section */}
        <div className="p-4 border-b border-gray-50">
          <div className={`bg-gray-50/70 border border-gray-100 rounded-2xl flex items-center gap-3 transition-all ${isCollapsed ? 'p-2 justify-center' : 'p-3'}`}>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs overflow-hidden shrink-0 border border-indigo-200/60 shadow-3xs">
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
                <p className="text-xs font-bold text-gray-900 truncate leading-tight">
                  {userProfile?.fullName || 'Loading...'}
                </p>
                <p className="text-[9px] text-gray-400 truncate mt-0.5">
                  {userProfile?.email}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
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
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 border-b-2 border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
                id={`menu-item-${item.id}`}
              >
                <IconComponent className={`w-4.5 h-4.5 shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-700'
                }`} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate uppercase tracking-wider text-[11px]"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Collapse Toggle & Logout Button */}
        <div className="p-3 border-t border-gray-50 bg-gray-50/30 space-y-1 shrink-0">
          <button
            onClick={onLogout}
            className={`w-full flex items-center rounded-xl text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50/50 transition-all cursor-pointer ${
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
            className="hidden lg:flex w-full items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl cursor-pointer transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            id="btn-toggle-collapse"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
