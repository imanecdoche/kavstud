export interface RankTier {
  name: string;
  minLevel: number;
  maxLevel: number;
  badgePath: string;
  color: string;
  glowColor: string;
  isTop3?: boolean;
  description: string;
}

export const RANK_TIERS: RankTier[] = [
  { 
    name: 'Novice', 
    minLevel: 1, 
    maxLevel: 5, 
    badgePath: '/aset/badge_logos/Novice.png', 
    color: 'from-amber-500 to-yellow-600', 
    glowColor: 'rgba(245, 158, 11, 0.4)', 
    description: 'Pemula yang baru memulai langkah awal perjalanan belajar di Kavio.' 
  },
  { 
    name: 'Warrior', 
    minLevel: 6, 
    maxLevel: 15, 
    badgePath: '/aset/badge_logos/Warrior.png', 
    color: 'from-emerald-500 to-teal-600', 
    glowColor: 'rgba(20, 184, 166, 0.4)', 
    description: 'Pejuang gigih yang rajin menyelesaikan tugas-tugas harian.' 
  },
  { 
    name: 'Knight', 
    minLevel: 16, 
    maxLevel: 25, 
    badgePath: '/aset/badge_logos/Knight.png', 
    color: 'from-sky-500 to-blue-600', 
    glowColor: 'rgba(14, 165, 233, 0.4)', 
    description: 'Ksatria tangguh dengan pemahaman materi yang semakin solid.' 
  },
  { 
    name: 'Paladin', 
    minLevel: 26, 
    maxLevel: 35, 
    badgePath: '/aset/badge_logos/Paladin.png', 
    color: 'from-indigo-500 to-violet-600', 
    glowColor: 'rgba(99, 102, 241, 0.4)', 
    description: 'Pelindung kebenaran yang menguasai berbagai tantangan modul.' 
  },
  { 
    name: 'Captain', 
    minLevel: 36, 
    maxLevel: 45, 
    badgePath: '/aset/badge_logos/Captain.png', 
    color: 'from-purple-500 to-fuchsia-600', 
    glowColor: 'rgba(168, 85, 247, 0.4)', 
    description: 'Kapten tepercaya yang konsisten meraih capaian EXP tinggi.' 
  },
  { 
    name: 'Commander', 
    minLevel: 46, 
    maxLevel: 55, 
    badgePath: '/aset/badge_logos/Commander.png', 
    color: 'from-rose-500 to-pink-600', 
    glowColor: 'rgba(244, 63, 94, 0.4)', 
    description: 'Komandan berpengalaman yang mampu menginspirasi rekan belajar.' 
  },
  { 
    name: 'Hero', 
    minLevel: 56, 
    maxLevel: 70, 
    badgePath: '/aset/badge_logos/Hero.png', 
    color: 'from-red-500 to-orange-600', 
    glowColor: 'rgba(239, 68, 68, 0.4)', 
    description: 'Pahlawan akademis dengan performa dan pemahaman yang cemerlang.' 
  },
  { 
    name: 'Legend', 
    minLevel: 71, 
    maxLevel: 85, 
    badgePath: '/aset/badge_logos/Legend.png', 
    color: 'from-amber-400 via-orange-500 to-yellow-300', 
    glowColor: 'rgba(251, 191, 36, 0.8)', 
    isTop3: true, 
    description: 'Legenda hidup Kavio dengan reputasi keunggulan belajar luar biasa.' 
  },
  { 
    name: 'Mythic', 
    minLevel: 86, 
    maxLevel: 99, 
    badgePath: '/aset/badge_logos/Mythic.png', 
    color: 'from-fuchsia-500 via-purple-600 to-cyan-400', 
    glowColor: 'rgba(217, 70, 239, 0.9)', 
    isTop3: true, 
    description: 'Kekuatan mitis yang tak tergoyahkan dalam persaingan pengetahuan.' 
  },
  { 
    name: 'Immortal', 
    minLevel: 100, 
    maxLevel: 100, 
    badgePath: '/aset/badge_logos/Immortal.png', 
    color: 'from-cyan-400 via-sky-300 to-indigo-500', 
    glowColor: 'rgba(56, 189, 248, 0.95)', 
    isTop3: true, 
    description: 'Puncak abadi tertinggi pencapaian ilmu di Kavio Edu.' 
  }
];

// Calculate EXP required to reach level L
export function getRequiredExpForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let lvl = 1; lvl < level; lvl++) {
    total += 100 + (lvl - 1) * 25;
  }
  return total;
}

// Calculate level, rank tier, and progress metrics from totalAccumulatedExp
export function calculateLevelData(totalExp: number) {
  let level = 1;
  while (level < 100) {
    const nextLevelExp = getRequiredExpForLevel(level + 1);
    if (totalExp >= nextLevelExp) {
      level++;
    } else {
      break;
    }
  }

  const currentLevelMinExp = getRequiredExpForLevel(level);
  const nextLevelMinExp = level < 100 ? getRequiredExpForLevel(level + 1) : currentLevelMinExp + 2000;
  
  const currentExpInLevel = totalExp - currentLevelMinExp;
  const expNeededForNextLevel = nextLevelMinExp - currentLevelMinExp;
  const progressPercent = level >= 100 ? 100 : Math.min(100, Math.max(0, (currentExpInLevel / expNeededForNextLevel) * 100));

  const rankTier = RANK_TIERS.find(t => level >= t.minLevel && level <= t.maxLevel) || RANK_TIERS[0];

  return {
    level,
    totalExp,
    currentLevelMinExp,
    nextLevelMinExp,
    currentExpInLevel,
    expNeededForNextLevel,
    progressPercent,
    rankTier
  };
}
