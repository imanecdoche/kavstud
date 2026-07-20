import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Palette, 
  Layers, 
  Grid, 
  FileSpreadsheet, 
  FileText, 
  Layout, 
  Settings, 
  Menu, 
  X,
  Compass
} from 'lucide-react';
import { ActiveTab } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: Compass },
    { id: 'tokens' as ActiveTab, label: 'Design Tokens', icon: Palette },
    { id: 'buttons-inputs' as ActiveTab, label: 'Buttons & Inputs', icon: Layers },
    { id: 'components' as ActiveTab, label: 'Components', icon: Grid },
    { id: 'tables' as ActiveTab, label: 'Tables & Lists', icon: FileSpreadsheet },
    { id: 'forms' as ActiveTab, label: 'Forms & Validation', icon: FileText },
    { id: 'assignments' as ActiveTab, label: 'Assignments Engine', icon: BookOpen },
    { id: 'layouts' as ActiveTab, label: 'Layout Previews', icon: Layout },
    { id: 'settings' as ActiveTab, label: 'Settings & Dev info', icon: Settings },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden h-14 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700/50 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 min-w-0">
          <Logo className="h-5 max-w-[130px] w-auto text-indigo-600 dark:text-indigo-400 shrink-0" />
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 text-gray-500 dark:text-slate-400 hover:text-black hover:bg-gray-50 dark:bg-slate-900 rounded-lg active:scale-95 transition-all"
          aria-label="Open navigation menu"
          id="btn-mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
            id="sidebar-backdrop"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        drag="x"
        dragConstraints={{ right: 0, left: -280 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) {
            setIsOpen(false);
          }
        }}
        className={`fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700/50 flex flex-col z-50 lg:sticky lg:translate-x-0 lg:opacity-100 transition-none`}
        id="app-sidebar"
        style={{
          // Override position-fixed on desktop so it embeds naturally in layout
          position: window.innerWidth >= 1024 ? 'sticky' : 'fixed'
        }}
      >
        {/* Header inside sidebar */}
        <div className="h-16 px-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <Logo className="h-5 max-w-[135px] w-auto text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-[10px] text-gray-400 font-sans tracking-widest uppercase mt-1 font-medium pl-0.5">
              Design System
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 dark:bg-slate-900 rounded-lg"
            aria-label="Close menu"
            id="btn-close-sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30/75 text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 dark:text-slate-400 hover:text-black hover:bg-gray-50 dark:bg-slate-900'
                }`}
                id={`menu-item-${item.id}`}
              >
                <IconComponent className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-slate-300'
                }`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator" 
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info inside sidebar */}
        <div className="p-4 border-t border-gray-50 bg-gray-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-gray-700 dark:text-slate-200">Sandbox v1.2.0</span>
              <span className="text-[9px] text-gray-400">Environment: Dev</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
