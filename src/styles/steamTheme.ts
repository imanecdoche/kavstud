/**
 * Steam Design System Tokens & Tailwind Class Generators
 * Single Source of Truth: store.steampowered.com-DESIGN.md
 * Strictly used for Teacher Dashboard & Teacher Components.
 */

export const steamColors = {
  // Primary
  steamBlue: '#66C0F4',
  limeGreen: '#A1CD44',

  // Accents
  brightCyan: '#1A9FFF',
  warmGold: '#B9A074',

  // Interactive & Surfaces
  darkNavy: '#171A21',
  charcoal: '#2F3138',
  jetBlack: '#000000',
  offWhiteSurface: '#F7F8F8',

  // Neutrals
  cloudWhite: '#FFFFFF',
  lightGray: '#C6D4DF',
  mediumGray: '#DCDEDF',
  iconGray: '#848E94',
  mutedGray: '#8A8A8A',

  // Borders
  borderSubtle: 'rgba(255, 255, 255, 0.14)',
  borderGray: '#BDBDBD',

  // Status
  warningOrange: '#FFA500',
};

// Reusable Tailwind Class Constants for Steam UI
export const steamClasses = {
  // Container & Page Shell
  shell: 'bg-[#171A21] text-[#FFFFFF] font-sans min-h-screen selection:bg-[#66C0F4] selection:text-[#171A21]',
  header: 'bg-[#171A21] border-b border-white/10 h-[54px] px-4 flex items-center justify-between',
  sidebar: 'bg-[#171A21] border-r border-white/10 w-[280px] flex flex-col',

  // Nav Items
  navLink: 'text-[#C6D4DF] hover:text-[#FFFFFF] text-[13px] font-normal px-3 py-2 border-b-2 border-transparent hover:border-[#66C0F4] transition-all cursor-pointer flex items-center gap-2',
  navLinkActive: 'text-[#FFFFFF] text-[13px] font-bold px-3 py-2 border-b-2 border-[#66C0F4] bg-white/5 flex items-center gap-2',

  // Buttons
  btnPrimary: 'bg-[#66C0F4] hover:bg-[#5DADE2] active:bg-[#52A4CC] text-[#FFFFFF] text-[13px] font-normal px-4 py-2 rounded-[2px] border-0 min-h-[38px] transition-all cursor-pointer disabled:bg-[#BDBDBD] disabled:text-[#8A8A8A] disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)]',
  btnSecondary: 'bg-transparent hover:bg-[#66C0F4]/15 active:bg-[#66C0F4]/25 text-[#FFFFFF] hover:text-[#66C0F4] text-[13px] font-normal px-4 py-2 rounded-[2px] border border-white/20 hover:border-[#66C0F4] min-h-[38px] transition-all cursor-pointer flex items-center justify-center gap-2',
  btnGreen: 'bg-[#A1CD44] hover:bg-[#99B93B] active:bg-[#8DA936] text-[#171A21] text-[11px] font-bold px-3 py-1.5 rounded-[2px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]',
  btnGhost: 'bg-transparent hover:bg-[#66C0F4]/10 text-[#FFFFFF] hover:text-[#66C0F4] text-[11px] font-normal px-2 py-1 rounded-[2px] transition-all cursor-pointer flex items-center justify-center gap-1',
  btnDanger: 'bg-[#FF4B4B] hover:bg-[#E03E3E] text-[#FFFFFF] text-[13px] font-normal px-4 py-2 rounded-[2px] transition-all cursor-pointer flex items-center justify-center gap-2',

  // Cards & Containers
  cardTile: 'bg-[#2F3138] border border-white/10 rounded-[3px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all',
  cardFeatured: 'bg-gradient-to-br from-[#2F3138] to-[#171A21] border border-white/10 rounded-[4px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.6)] text-[#FFFFFF]',
  cardModal: 'bg-[#2F3138] border border-white/20 rounded-[4px] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.6)] text-[#FFFFFF]',

  // Inputs & Forms
  input: 'bg-black/40 border border-white/15 text-[#FFFFFF] placeholder-[#8A8A8A] text-[13px] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#66C0F4] focus:ring-1 focus:ring-[#66C0F4] transition-all w-full',
  select: 'bg-black/40 border border-white/15 text-[#FFFFFF] text-[12px] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#66C0F4] transition-all w-full cursor-pointer',
  label: 'text-[#C6D4DF] text-[12px] font-normal mb-1 block',
  
  // Badges & Chips
  badgeGreen: 'bg-[#A1CD44] text-[#171A21] text-[11px] font-bold px-2 py-0.5 rounded-[2px] inline-flex items-center gap-1',
  badgeBlue: 'bg-[#66C0F4]/15 border border-[#66C0F4] text-[#66C0F4] text-[11px] font-normal px-2 py-0.5 rounded-[3px] inline-flex items-center gap-1',
  badgeGold: 'bg-[#B9A074]/20 border border-[#B9A074] text-[#B9A074] text-[11px] font-bold px-2 py-0.5 rounded-[3px] inline-flex items-center gap-1',
  badgeGray: 'bg-white/10 text-[#C6D4DF] text-[11px] font-normal px-2 py-0.5 rounded-[2px] inline-flex items-center gap-1',

  // Tables
  table: 'w-full text-left border-collapse text-[12px]',
  tableHeader: 'bg-[#171A21] text-[#C6D4DF] font-bold text-[12px] uppercase tracking-wider p-3 border-b border-white/10',
  tableRow: 'border-b border-white/5 hover:bg-white/5 transition-colors bg-[#2F3138]/50',
  tableCell: 'p-3 text-[#FFFFFF] text-[12px]',
};
