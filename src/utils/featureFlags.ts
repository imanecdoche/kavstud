import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  maintenanceMessage?: string;
  iconName: string;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'modules',
    name: 'Pustaka Modul & Materi',
    description: 'Akses membaca & mengunduh modul pelajaran interaktif',
    enabled: true,
    maintenanceMessage: 'Pustaka modul sedang diperbarui dengan materi kurikulum terbaru.',
    iconName: 'BookOpen'
  },
  {
    id: 'assignments',
    name: 'Tugas & Evaluasi',
    description: 'Pengiriman tugas, pemeriksaan nilai, dan remedial',
    enabled: true,
    maintenanceMessage: 'Sistem evaluasi & pengumpulan tugas sedang dalam peningkatan server.',
    iconName: 'NotebookText'
  },
  {
    id: 'circles',
    name: 'Kavio Circle (Kelompok Belajar)',
    description: 'Grup belajar interaktif 2-5 siswa & jadwal bimbingan',
    enabled: true,
    maintenanceMessage: 'Fitur Kavio Circle sedang disesuaikan untuk pembagian kelompok baru.',
    iconName: 'CircleDot'
  },
  {
    id: 'packages',
    name: 'Pendaftaran Paket Belajar',
    description: 'Katalog paket private/circle & formulir pendaftaran',
    enabled: true,
    maintenanceMessage: 'Katalog paket & pendaftaran sedang ditinjau untuk pembaruan promo.',
    iconName: 'Package'
  },
  {
    id: 'blog',
    name: 'Kavio Blog & Portal Informasi',
    description: 'Artikel, panduan belajar, dan pengumuman resmi',
    enabled: true,
    maintenanceMessage: 'Portal blog Kavio sedang dalam pemeliharaan rutin.',
    iconName: 'Newspaper'
  },
  {
    id: 'inbox',
    name: 'Inbox & Pusat Notifikasi',
    description: 'Notifikasi real-time tugas baru, nilai, dan event',
    enabled: true,
    maintenanceMessage: 'Pusat notifikasi real-time sedang disinkronkan.',
    iconName: 'Inbox'
  }
];

// Helper to get local feature flags
export function getLocalFeatureFlags(): FeatureFlag[] {
  try {
    const saved = localStorage.getItem('kavio_feature_flags');
    if (saved) {
      const parsed: FeatureFlag[] = JSON.parse(saved);
      // Merge with default to ensure all keys exist
      return DEFAULT_FEATURE_FLAGS.map(def => {
        const found = parsed.find(p => p.id === def.id);
        return found ? { ...def, ...found } : def;
      });
    }
  } catch (e) {
    console.warn('Error reading local feature flags:', e);
  }
  return DEFAULT_FEATURE_FLAGS;
}

// Helper to save local feature flags and notify listeners
export function saveLocalFeatureFlags(flags: FeatureFlag[]) {
  try {
    localStorage.setItem('kavio_feature_flags', JSON.stringify(flags));
    window.dispatchEvent(new Event('kavio_feature_flags_updated'));

    // Try saving to Firestore system config if available
    if (db) {
      const sysRef = doc(db, 'system', 'feature_flags');
      setDoc(sysRef, { flags, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    }
  } catch (e) {
    console.warn('Error saving feature flags:', e);
  }
}
