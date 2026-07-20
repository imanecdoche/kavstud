import { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  Info, 
  Layers, 
  RotateCcw,
  Check,
  AlertTriangle,
  Flame,
  CheckCircle,
  Database,
  Calendar,
  Layers3,
  Cpu
} from 'lucide-react';
import { ChangelogEntry } from '../types';

interface SettingsPanelProps {
  onExport: () => void;
  onImport: (data: string) => boolean;
  onReset: () => void;
  changelog: ChangelogEntry[];
  buildDate: string;
  appEnvironment: string;
}

export default function SettingsPanel({ 
  onExport, 
  onImport, 
  onReset, 
  changelog,
  buildDate,
  appEnvironment
}: SettingsPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [importText, setImportText] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [storageUsage, setStorageUsage] = useState<string>('0 B');
  const [cacheCleared, setCacheCleared] = useState(false);

  // Measure LocalStorage Storage Usage
  const calculateStorage = () => {
    let totalBytes = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    if (totalBytes < 1024) {
      setStorageUsage(`${totalBytes} B`);
    } else if (totalBytes < 1048576) {
      setStorageUsage(`${(totalBytes / 1024).toFixed(2)} KB`);
    } else {
      setStorageUsage(`${(totalBytes / 1048576).toFixed(2)} MB`);
    }
  };

  useEffect(() => {
    calculateStorage();
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Show status feedback
  const triggerFeedback = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fullscreen helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        triggerFeedback('error', 'Fullscreen requests restricted by sandbox container.');
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Import JSON validation
  const handleImportSubmit = () => {
    if (!importText.trim()) {
      triggerFeedback('error', 'Silakan masukkan teks JSON data.');
      return;
    }
    const success = onImport(importText);
    if (success) {
      triggerFeedback('success', 'Data berhasil diimport & dimigrasi!');
      setImportText('');
      calculateStorage();
    } else {
      triggerFeedback('error', 'Format data tidak valid!');
    }
  };

  // Clear cache action
  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
    triggerFeedback('success', 'Cache system sandbox berhasil dibersihkan!');
  };

  return (
    <div className="space-y-8 max-w-4xl" id="settings-panel">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900">
          Settings & Sandbox Developer Control
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor configuration tokens, storage indicators, and manage applet backup payloads safely.
        </p>
      </div>

      {/* Grid: App Details & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: App Info Card */}
        <div className="border border-gray-100 bg-white rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" />
            Application Information
          </h2>
          <div className="divide-y divide-gray-50 text-xs">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-500">App Name</span>
              <span className="font-medium text-gray-900">KAVIO EDU</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-500">Framework</span>
              <span className="font-medium text-gray-900">React + Vite + Tailwind v4</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-500">Build Target Date</span>
              <span className="font-medium text-gray-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {buildDate}
              </span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-500">Environment</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50 font-medium">
                {appEnvironment}
              </span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-gray-500">Storage Usage</span>
              <span className="font-mono text-gray-700 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-gray-400" />
                {storageUsage}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:text-black flex items-center gap-1.5 transition-all cursor-pointer bg-white active:scale-95"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              {isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}
            </button>
            <button
              onClick={handleClearCache}
              className="px-3 py-1.5 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:text-black flex items-center gap-1.5 transition-all cursor-pointer bg-white active:scale-95"
            >
              <Cpu className={`w-3.5 h-3.5 text-indigo-500 ${cacheCleared ? 'animate-spin' : ''}`} />
              Clear Cache
            </button>
          </div>
        </div>

        {/* Box 2: Actions Sandbox */}
        <div className="border border-gray-100 bg-white rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-500" />
            Import / Export Data
          </h2>
          <p className="text-xs text-gray-500">
            Export all sandbox mock data structures, active assignment states, and settings to a JSON format.
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onExport();
                triggerFeedback('success', 'Data berhasil diexport ke file download!');
              }}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
            <button
              onClick={onReset}
              className="px-3 py-2 bg-rose-50 border border-rose-200/50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset App Data
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-50">
            <label className="block text-[11px] font-semibold text-gray-700">Import JSON Schema Data</label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='Paste JSON data here (e.g. {"version": "1.2.0", "data": ...})'
              className="w-full h-16 p-2 text-xs font-mono border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-400 bg-gray-50/50 resize-none"
            />
            <button
              onClick={handleImportSubmit}
              className="w-full py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Load and Validate Import
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {toastMessage && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200/50' 
            : 'bg-rose-50 text-rose-800 border-rose-200/50'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Changelog Section conforming to the prompt rules */}
      <div className="border border-gray-100 bg-white rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Layers3 className="w-4 h-4 text-indigo-500" />
          App Changelog System
        </h2>
        <div className="space-y-6">
          {changelog.map((entry, index) => (
            <div key={entry.version} className="relative pl-6 pb-2 border-l-2 border-gray-100 last:border-0 last:pb-0">
              {/* Bullet node */}
              <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-3">
                <span className="font-display font-semibold text-sm text-gray-900">
                  Version {entry.version}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Released: {entry.date}
                </span>
              </div>

              <ul className="space-y-2 text-xs font-mono">
                {entry.changes.map((change, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2">
                    <span className={`shrink-0 font-bold ${
                      change.type === 'add' ? 'text-emerald-500' :
                      change.type === 'change' ? 'text-blue-500' :
                      'text-rose-500'
                    }`}>
                      {change.type === 'add' ? '+' : change.type === 'change' ? '*' : '-'}
                    </span>
                    <span className="text-gray-600 font-sans">{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
