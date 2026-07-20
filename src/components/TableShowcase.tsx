import { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  HelpCircle,
  FileSpreadsheet,
  Plus,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Student {
  id: string;
  name: string;
  email: string;
  classSection: string;
  scoreAverage: number;
  attendance: string;
  status: 'active' | 'probation' | 'graduated';
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  submissions: number;
  status: 'graded' | 'waiting' | 'draft';
}

export default function TableShowcase() {
  // Mock State data
  const [students, setStudents] = useState<Student[]>([
    { id: 'ST-001', name: 'Ahmad Rafli', email: 'ahmad.rafli@kavio.edu', classSection: 'IPA-1', scoreAverage: 92.5, attendance: '98%', status: 'active' },
    { id: 'ST-002', name: 'Citra Kirana', email: 'citra.kirana@kavio.edu', classSection: 'IPA-1', scoreAverage: 88.0, attendance: '95%', status: 'active' },
    { id: 'ST-003', name: 'Dewi Lestari', email: 'dewi.lestari@kavio.edu', classSection: 'IPS-2', scoreAverage: 71.2, attendance: '82%', status: 'probation' },
    { id: 'ST-004', name: 'Farhan Azis', email: 'farhan.azis@kavio.edu', classSection: 'IPA-2', scoreAverage: 95.8, attendance: '100%', status: 'graduated' },
    { id: 'ST-005', name: 'Gita Savitri', email: 'gita.savitri@kavio.edu', classSection: 'IPS-1', scoreAverage: 84.5, attendance: '91%', status: 'active' },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 'ASG-101', title: 'Persamaan Reaksi Redoks', subject: 'Kimia Dasar', deadline: '2026-07-25', submissions: 24, status: 'waiting' },
    { id: 'ASG-102', title: 'Termokimia & Entalpi', subject: 'Kimia Dasar', deadline: '2026-07-18', submissions: 32, status: 'graded' },
    { id: 'ASG-103', title: 'Struktur Atom Molekul', subject: 'Kimia Lanjutan', deadline: '2026-08-01', submissions: 0, status: 'draft' },
  ]);

  // UI States
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'scoreAverage'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Multi select operations
  const handleSelectAllStudents = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudentRow = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk Delete Actions (No Native alerts)
  const executeBulkDelete = () => {
    setStudents(prev => prev.filter(s => !selectedStudentIds.includes(s.id)));
    setSelectedStudentIds([]);
    setIsConfirmDeleteOpen(false);
  };

  // Sorting controller
  const toggleSort = (field: 'name' | 'scoreAverage') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter students based on search terms
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.classSection.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  ).sort((a, b) => {
    let compA = a[sortField];
    let compB = b[sortField];
    if (typeof compA === 'string' && typeof compB === 'string') {
      return sortOrder === 'asc' 
        ? compA.localeCompare(compB) 
        : compB.localeCompare(compA);
    } else if (typeof compA === 'number' && typeof compB === 'number') {
      return sortOrder === 'asc' 
        ? compA - compB 
        : compB - compA;
    }
    return 0;
  });

  return (
    <div className="space-y-12 max-w-5xl" id="table-showcase">
      {/* Page Header */}
      <div className="border-b border-gray-100 dark:border-slate-700/50 pb-5">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-gray-900 dark:text-white">
          Tables & Lists Sandbox
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Demo tabel performa tinggi dengan sorting dinamis, pencarian realtime, bulk select, dan responsive stacking di mobile.
        </p>
      </div>

      {/* SECTION 1: STUDENT LIST (COMPLEX INTERACTIVE TABLE) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
              Daftar Siswa Aktif (Student Database)
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Mendukung multi-select delete & sorting rata-rata nilai.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Realtime Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, kelas, email..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800"
              />
            </div>

            {/* Bulk Action Button */}
            {selectedStudentIds.length > 0 && (
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                id="btn-bulk-delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus ({selectedStudentIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Outer Container (Guarantees NO Horizontal Scroll on outer margins, responds fluidly) */}
        <div className="border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xs">
          
          {/* Desktop Table View (Hidden on 320px - 430px, shown on sm/md/lg upwards) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-5 w-12">
                    <input
                      type="checkbox"
                      checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                      onChange={handleSelectAllStudents}
                      className="rounded border-gray-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="py-4 px-4">
                    <button 
                      onClick={() => toggleSort('name')}
                      className="flex items-center gap-1 hover:text-black font-bold uppercase transition-colors cursor-pointer"
                    >
                      Nama Siswa <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4">Kelas</th>
                  <th className="py-4 px-4">
                    <button 
                      onClick={() => toggleSort('scoreAverage')}
                      className="flex items-center gap-1 hover:text-black font-bold uppercase transition-colors cursor-pointer"
                    >
                      Rata-Rata Nilai <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-4 px-4">Presensi</th>
                  <th className="py-4 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id);
                    return (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-gray-50 dark:bg-slate-900/25 transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30/10' : ''}`}
                      >
                        <td className="py-3.5 px-5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectStudentRow(student.id)}
                            className="rounded border-gray-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">
                          <div>
                            <span>{student.name}</span>
                            <span className="block text-[10px] text-gray-400 font-normal mt-0.5">{student.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 dark:text-slate-400">{student.classSection}</td>
                        <td className="py-3.5 px-4 font-mono font-medium text-gray-700 dark:text-slate-200">{student.scoreAverage.toFixed(1)}/100</td>
                        <td className="py-3.5 px-4 text-gray-500 dark:text-slate-400">{student.attendance}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border ${
                            student.status === 'graduated' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 border-indigo-100 dark:border-indigo-800/50' :
                            student.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-100 dark:border-emerald-800/50' :
                            'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border-amber-100 dark:border-amber-800/50'
                          }`}>
                            {student.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 text-xs">
                      Tidak ada data siswa yang cocok dengan pencarian Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacking Card Layout (Strict compliance with 320px - 430px safety rules) */}
          <div className="block sm:hidden divide-y divide-gray-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                return (
                  <div 
                    key={student.id} 
                    className={`p-4 space-y-3 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30/15' : 'bg-white dark:bg-slate-800'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectStudentRow(student.id)}
                          className="rounded border-gray-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                        />
                        <div>
                          <p className="text-xs font-semibold text-gray-900 dark:text-white leading-snug">{student.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{student.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        student.status === 'graduated' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 border-indigo-100 dark:border-indigo-800/50' :
                        student.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-100 dark:border-emerald-800/50' :
                        'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border-amber-100 dark:border-amber-800/50'
                      }`}>
                        {student.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50 text-center">
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-medium">Kelas</span>
                        <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{student.classSection}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-medium">Nilai</span>
                        <span className="text-xs font-semibold font-mono text-gray-800 dark:text-slate-100">{student.scoreAverage.toFixed(1)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-medium">Presensi</span>
                        <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{student.attendance}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs">
                Tidak ada data siswa yang cocok dengan pencarian Anda.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: ASSIGNMENT TRACKING */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            Tugas Terjadwal (Recent Assignments List)
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">Menampilkan deadline pengerjaan kimia dan total pengumpulan siswa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assignments.map((asg) => (
            <div key={asg.id} className="border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                    {asg.subject}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block border ${
                    asg.status === 'graded' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-100 dark:border-emerald-800/50' :
                    asg.status === 'waiting' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 border-amber-100 dark:border-amber-800/50' :
                    'bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-700/50'
                  }`}>
                    {asg.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mt-2">{asg.title}</h3>
              </div>

              <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[11px]">
                <div className="text-gray-500 dark:text-slate-400">
                  Submissions: <span className="font-semibold text-gray-800 dark:text-slate-100">{asg.submissions}</span>
                </div>
                <div className="text-gray-400 font-mono text-[10px]">
                  DL: {asg.deadline}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INTERNAL APP CONFIRM DELETE DIALOG (Satisfying confirmation rules) */}
      <AnimatePresence>
        {isConfirmDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmDeleteOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative bg-white dark:bg-slate-800 border border-rose-100 w-full max-w-sm rounded-2xl p-6 shadow-xl z-10"
            >
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Konfirmasi Bulk Hapus
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Apakah Anda yakin ingin menghapus {selectedStudentIds.length} data siswa terpilih dari active local database?
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsConfirmDeleteOpen(false)}
                  className="px-3.5 py-1.5 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-black rounded-lg text-xs font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={executeBulkDelete}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  Ya, Hapus Semua
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
