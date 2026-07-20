import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { 
  CircleDot, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Pencil, 
  Archive, 
  FolderOpen, 
  UserCheck, 
  HelpCircle, 
  AlertCircle,
  Sparkles,
  ChevronRight,
  UserX,
  X,
  Info,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Circle, Assignment, Submission } from '../types';
import EmptyState from './EmptyState';

interface CircleManagementProps {
  students: UserProfile[];
  teacherProfile: UserProfile | null;
  onNavigate: (path: string) => void;
  onSetLoading: (loading: boolean) => void;
}

export default function CircleManagement({ 
  students, 
  teacherProfile, 
  onNavigate, 
  onSetLoading 
}: CircleManagementProps) {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sub-tabs: 'dashboard' | 'members'
  const [subTab, setSubTab] = useState<'dashboard' | 'members'>('dashboard');

  // Modal forms states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCircleId, setEditingCircleId] = useState<string | null>(null);
  const [circleName, setCircleName] = useState('');
  const [circleDescription, setCircleDescription] = useState('');
  const [circleCapacity, setCircleCapacity] = useState<number>(5);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters and search inside Member Management
  const [memberSearch, setMemberSearch] = useState('');
  const [classTypeFilter, setClassTypeFilter] = useState<'all' | 'PRIVATE' | 'CIRCLE'>('all');
  const [circleFilter, setCircleFilter] = useState<string>('all'); // 'all' | 'unassigned' | circleId

  // Drag and drop visual feedback states
  const [draggedStudentId, setDraggedStudentId] = useState<string | null>(null);
  const [activeDropZoneId, setActiveDropZoneId] = useState<string | null>(null);

  // Load circles and assignments
  useEffect(() => {
    if (!teacherProfile) return;

    // Listen to all circles created by this teacher
    const circlesQuery = query(
      collection(db, 'circles'),
      where('teacherId', '==', teacherProfile.uid)
    );
    const unsubscribeCircles = onSnapshot(circlesQuery, (snapshot) => {
      const circs: Circle[] = [];
      snapshot.forEach((doc) => {
        circs.push({ id: doc.id, ...doc.data() } as Circle);
      });
      setCircles(circs);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError('Gagal memuat data circle.');
      setLoading(false);
    });

    // Listen to assignments
    const assignmentsQuery = query(
      collection(db, 'assignments'),
      where('teacherId', '==', teacherProfile.uid)
    );
    const unsubscribeAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
      const assigns: Assignment[] = [];
      snapshot.forEach((doc) => {
        assigns.push({ id: doc.id, ...doc.data() } as Assignment);
      });
      setAssignments(assigns);
    });

    // Listen to submissions
    const unsubscribeSubmissions = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      const subs: Submission[] = [];
      snapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() } as Submission);
      });
      setSubmissions(subs);
    });

    return () => {
      unsubscribeCircles();
      unsubscribeAssignments();
      unsubscribeSubmissions();
    };
  }, [teacherProfile]);

  // Handle Create / Edit Circle Save
  const handleSaveCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!circleName.trim()) {
      setFormError('Nama Circle wajib diisi.');
      return;
    }
    if (circleCapacity < 1) {
      setFormError('Kapasitas maksimal minimal 1 siswa.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload: any = {
        name: circleName.trim(),
        description: circleDescription.trim(),
        capacity: Number(circleCapacity),
        teacherId: teacherProfile?.uid || '',
        updatedAt: serverTimestamp()
      };

      if (isEditMode && editingCircleId) {
        await updateDoc(doc(db, 'circles', editingCircleId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        payload.isArchived = false;
        await addDoc(collection(db, 'circles'), payload);
      }

      // Reset
      setCircleName('');
      setCircleDescription('');
      setCircleCapacity(5);
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingCircleId(null);
    } catch (err) {
      console.error(err);
      setFormError('Gagal menyimpan circle. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Archive / Unarchive Circle
  const handleToggleArchiveCircle = async (circle: Circle) => {
    try {
      await updateDoc(doc(db, 'circles', circle.id), {
        isArchived: !circle.isArchived,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui status Circle.');
    }
  };

  // Delete Circle
  const handleDeleteCircle = async (circleId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus Circle ini secara permanen? Semua siswa di dalam Circle ini akan dialihkan menjadi tanpa Circle.')) {
      return;
    }

    try {
      onSetLoading(true);
      // Remove students inside this circle
      const studentsInCircle = students.filter(s => s.circleId === circleId);
      for (const s of studentsInCircle) {
        await updateDoc(doc(db, 'users', s.uid), {
          circleId: null
        });
      }

      // Delete the circle document
      await deleteDoc(doc(db, 'circles', circleId));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus Circle.');
    } finally {
      onSetLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (circle: Circle) => {
    setCircleName(circle.name);
    setCircleDescription(circle.description || '');
    setCircleCapacity(circle.capacity || 5);
    setEditingCircleId(circle.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Change Student Class Type
  const handleChangeClassType = async (studentId: string, type: 'PRIVATE' | 'CIRCLE') => {
    try {
      const updatePayload: any = {
        classType: type
      };
      
      // Rule: Changing Class Type to PRIVATE automatically removes student from current Circle
      if (type === 'PRIVATE') {
        updatePayload.circleId = null;
      }

      await updateDoc(doc(db, 'users', studentId), updatePayload);
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui Tipe Kelas siswa.');
    }
  };

  // Move / Assign Student to Circle
  const handleAssignStudentToCircle = async (studentId: string, circleId: string | null) => {
    try {
      // Find student
      const student = students.find(s => s.uid === studentId);
      if (!student) return;

      // Rule: Students with PRIVATE class type cannot belong to any Circle
      if (circleId && student.classType === 'PRIVATE') {
        alert('Siswa dengan Tipe Kelas PRIVATE tidak dapat dimasukkan ke dalam Circle. Silakan ubah tipe kelas siswa menjadi CIRCLE terlebih dahulu.');
        return;
      }

      // If moving to a circle, check capacity
      if (circleId) {
        const targetCircle = circles.find(c => c.id === circleId);
        if (targetCircle) {
          const currentMembers = students.filter(s => s.circleId === circleId).length;
          if (currentMembers >= targetCircle.capacity) {
            alert(`Circle "${targetCircle.name}" sudah mencapai kapasitas maksimal (${targetCircle.capacity} siswa).`);
            return;
          }
        }
      }

      await updateDoc(doc(db, 'users', studentId), {
        circleId: circleId,
        // Automatically ensure classType is CIRCLE if they are placed inside a circle
        ...(circleId ? { classType: 'CIRCLE' } : {})
      });
    } catch (err) {
      console.error(err);
      alert('Gagal memindahkan siswa.');
    }
  };

  // DRAG AND DROP HANDLERS
  const handleDragStart = (e: React.DragEvent, studentId: string) => {
    e.dataTransfer.setData('text/plain', studentId);
    setDraggedStudentId(studentId);
  };

  const handleDragEnd = () => {
    setDraggedStudentId(null);
    setActiveDropZoneId(null);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setActiveDropZoneId(id);
  };

  const handleDrop = async (e: React.DragEvent, targetCircleId: string | null) => {
    e.preventDefault();
    const studentId = e.dataTransfer.getData('text/plain');
    if (studentId) {
      await handleAssignStudentToCircle(studentId, targetCircleId);
    }
    setActiveDropZoneId(null);
    setDraggedStudentId(null);
  };

  // STATS COMPUTATION FOR CARDS
  const getCircleStats = (circleId: string) => {
    const members = students.filter(s => s.circleId === circleId);
    const circleAssigns = assignments.filter(a => a.assignmentTarget === 'CIRCLE' && a.targetId === circleId);
    
    // For each assignment sent to this circle, let's look at submissions from circle members
    let completed = 0;
    let pending = 0;
    let remedialCount = 0;
    let totalScore = 0;
    let gradedCount = 0;

    members.forEach(member => {
      circleAssigns.forEach(assign => {
        // Find if this member submitted
        const sub = submissions.find(s => s.assignmentId === assign.id && s.studentId === member.uid);
        if (sub) {
          if (sub.status === 'graded') {
            completed++;
            if (sub.score !== null) {
              totalScore += sub.score;
              gradedCount++;
            }
          } else if (sub.status === 'remedial') {
            remedialCount++;
          } else {
            // submitted but not graded yet
            completed++; // we can count it or treat as review
          }
        } else {
          pending++;
        }
      });
    });

    const avgScore = gradedCount > 0 ? Math.round(totalScore / gradedCount) : null;

    return {
      totalMembers: members.length,
      assignmentsCount: circleAssigns.length,
      completed,
      pending,
      remedialCount,
      averageScore: avgScore
    };
  };

  // Filter members list based on filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(memberSearch.toLowerCase()) || 
                          student.email.toLowerCase().includes(memberSearch.toLowerCase());
    
    const matchesClassType = classTypeFilter === 'all' || student.classType === classTypeFilter;
    
    let matchesCircle = true;
    if (circleFilter === 'unassigned') {
      matchesCircle = !student.circleId;
    } else if (circleFilter !== 'all') {
      matchesCircle = student.circleId === circleFilter;
    }

    return matchesSearch && matchesClassType && matchesCircle;
  });

  return (
    <div className="space-y-8" id="circle-management-module">
      {/* Module Title & Subtabs Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <CircleDot className="w-8 h-8 text-indigo-600 animate-pulse" />
            <span>Kavio Circle</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola lingkaran belajar kecil, penugasan kelompok, dan pantau statistik perkembangan siswa secara kolektif.
          </p>
        </div>

        <div className="flex gap-2 bg-gray-100/70 p-1.5 rounded-2xl shrink-0 self-start md:self-center">
          <button
            onClick={() => setSubTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'dashboard'
                ? 'bg-white text-gray-900 shadow-3xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Dashboard Circle
          </button>
          <button
            onClick={() => setSubTab('members')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'members'
                ? 'bg-white text-gray-900 shadow-3xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Manajemen Anggota
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="h-48 bg-gray-200/60 rounded-3xl" />
          <div className="h-48 bg-gray-200/60 rounded-3xl" />
          <div className="h-48 bg-gray-200/60 rounded-3xl" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* TAB 1: CIRCLE DASHBOARD GRID */}
          {subTab === 'dashboard' && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <span>Daftar Kelompok Belajar ({circles.length})</span>
                </h2>

                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setCircleName('');
                    setCircleDescription('');
                    setCircleCapacity(5);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer"
                  style={{ minHeight: '40px' }}
                >
                  <Plus className="w-4 h-4" />
                  Tambah Circle Baru
                </button>
              </div>

              {circles.length === 0 ? (
                <EmptyState
                  icon={CircleDot}
                  title="Belum Ada Circle"
                  description="Anda belum membuat kelompok belajar Circle. Buat kelompok untuk mengelompokkan siswa secara efisien."
                  actionText="Buat Circle Pertama"
                  onActionClick={() => setIsModalOpen(true)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {circles.map(circle => {
                    const stats = getCircleStats(circle.id);
                    const isFull = stats.totalMembers >= circle.capacity;
                    
                    return (
                      <div
                        key={circle.id}
                        className={`bg-white border rounded-3xl p-6 shadow-3xs flex flex-col justify-between space-y-5 transition-all relative group hover:border-gray-200 hover:shadow-2xs ${
                          circle.isArchived ? 'opacity-60 bg-gray-50/50' : 'border-gray-100'
                        }`}
                      >
                        <div className="space-y-3.5">
                          {/* Title & Archival/Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 leading-tight truncate group-hover:text-indigo-600 transition-colors">
                                {circle.name}
                              </h3>
                              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
                                <Calendar className="w-3 h-3" />
                                {circle.createdAt ? new Date(circle.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'Baru saja'}
                              </p>
                            </div>

                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 uppercase tracking-wider ${
                              circle.isArchived 
                                ? 'bg-gray-100 text-gray-500' 
                                : isFull 
                                  ? 'bg-red-50 text-red-600 border border-red-100'
                                  : 'bg-green-50 text-green-700 border border-green-100'
                            }`}>
                              {circle.isArchived ? 'Diarsipkan' : isFull ? 'Penuh' : 'Tersedia'}
                            </span>
                          </div>

                          {/* Description */}
                          {circle.description && (
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                              {circle.description}
                            </p>
                          )}

                          {/* Members count / capacity slider visual */}
                          <div className="space-y-1.5 pt-1.5">
                            <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                              <span>Anggota Terdaftar</span>
                              <span className="font-mono">{stats.totalMembers} / {circle.capacity} Siswa</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${isFull ? 'bg-red-500' : 'bg-indigo-600'}`} 
                                style={{ width: `${Math.min(100, (stats.totalMembers / circle.capacity) * 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Mini Stats Banner */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-center">
                            <div className="p-2 bg-gray-50/70 border border-gray-100/30 rounded-xl">
                              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Tugas Circle</span>
                              <span className="text-xs font-bold text-gray-800 block mt-0.5 font-mono">{stats.assignmentsCount}</span>
                            </div>
                            <div className="p-2 bg-gray-50/70 border border-gray-100/30 rounded-xl">
                              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Nilai Rata2</span>
                              <span className="text-xs font-bold text-indigo-600 block mt-0.5 font-mono">
                                {stats.averageScore !== null ? stats.averageScore : '-'}
                              </span>
                            </div>
                          </div>

                          {/* Expanded stats bar */}
                          <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              Selesai: <strong className="text-gray-600 font-mono">{stats.completed}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Menunggu: <strong className="text-gray-600 font-mono">{stats.pending}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Remedial: <strong className="text-gray-600 font-mono">{stats.remedialCount}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                          <button
                            onClick={() => onNavigate(`/circle/${circle.id}`)}
                            className="flex-1 py-2 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors active:scale-98"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            Buka Profile
                          </button>

                          <button
                            onClick={() => openEditModal(circle)}
                            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-xl cursor-pointer transition-colors"
                            title="Edit Circle"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleArchiveCircle(circle)}
                            className={`p-2 rounded-xl cursor-pointer transition-colors ${
                              circle.isArchived 
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-600' 
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                            }`}
                            title={circle.isArchived ? 'Pulihkan dari Arsip' : 'Arsipkan Circle'}
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteCircle(circle.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl cursor-pointer transition-colors"
                            title="Hapus Circle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: INTERACTIVE MEMBER MANAGEMENT */}
          {subTab === 'members' && (
            <motion.div
              key="members-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Info Tips Alert */}
              <div className="p-4 bg-indigo-50/40 border border-indigo-100/30 rounded-2xl flex gap-3 text-xs text-indigo-800">
                <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold">💡 Tips Manajemen Anggota Circle:</p>
                  <p className="text-indigo-700 leading-relaxed text-[11px]">
                    <strong>Desktop:</strong> Silakan seret (drag) nama siswa dari panel kiri atau antar kolom circle dan lepaskan (drop) ke dalam kolom circle tujuan Anda untuk memindahkan. <br />
                    <strong>Mobile:</strong> Gunakan dropdown menu cepat pada kartu nama siswa untuk memindahkan atau mengubah tipe kelas secara instan.
                  </p>
                </div>
              </div>

              {/* Layout splits */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
                {/* Left Pool column: Students Directory */}
                <div className="xl:col-span-1 bg-white border border-gray-100 rounded-3xl p-5 shadow-3xs space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-500" />
                      Daftar Siswa ({filteredStudents.length})
                    </h3>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      Seret siswa dari sini ke kolom Circle di samping kanan.
                    </p>
                  </div>

                  {/* Search and Filters */}
                  <div className="space-y-3 pt-2">
                    {/* Search query input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                      <input
                        type="text"
                        placeholder="Cari nama siswa..."
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    {/* Class Type Filters */}
                    <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 rounded-xl">
                      {(['all', 'PRIVATE', 'CIRCLE'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setClassTypeFilter(type)}
                          className={`py-1 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer text-center ${
                            classTypeFilter === type
                              ? 'bg-white text-gray-900 shadow-3xs'
                              : 'text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          {type === 'all' ? 'Semua' : type}
                        </button>
                      ))}
                    </div>

                    {/* Circle assignment filter */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Filter Kelompok</label>
                      <select
                        value={circleFilter}
                        onChange={(e) => setCircleFilter(e.target.value)}
                        className="block w-full px-2.5 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-gray-700 font-semibold"
                      >
                        <option value="all">Semua Siswa</option>
                        <option value="unassigned">Siswa Tanpa Circle</option>
                        {circles.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Drag drop dropzone for unassigned pool */}
                  <div 
                    onDragOver={(e) => handleDragOver(e, 'unassigned')}
                    onDrop={(e) => handleDrop(e, null)}
                    className={`space-y-2 max-h-96 overflow-y-auto pr-1 p-2 rounded-2xl border transition-all ${
                      activeDropZoneId === 'unassigned'
                        ? 'border-indigo-500 bg-indigo-50/20'
                        : 'border-transparent'
                    }`}
                  >
                    {filteredStudents.length === 0 ? (
                      <div className="py-8 text-center">
                        <UserX className="w-8 h-8 text-gray-300 mx-auto" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">Tidak Ada Siswa</p>
                      </div>
                    ) : (
                      filteredStudents.map(student => {
                        const inCircle = circles.find(c => c.id === student.circleId);
                        
                        return (
                          <div
                            key={student.uid}
                            draggable
                            onDragStart={(e) => handleDragStart(e, student.uid)}
                            onDragEnd={handleDragEnd}
                            className={`p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl flex flex-col gap-2.5 transition-all cursor-grab active:cursor-grabbing hover:shadow-3xs ${
                              draggedStudentId === student.uid ? 'opacity-40 border-indigo-400' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{student.fullName}</p>
                                <p className="text-[9px] text-gray-400 truncate leading-normal">{student.email}</p>
                              </div>

                              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                            </div>

                            {/* Info badges */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                student.classType === 'PRIVATE'
                                  ? 'bg-teal-50 text-teal-700 border border-teal-100'
                                  : 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100'
                              }`}>
                                {student.classType || 'PRIVATE'}
                              </span>

                              {inCircle ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded text-[8px] font-bold truncate max-w-[80px]">
                                  {inCircle.name}
                                </span>
                              ) : (
                                student.classType === 'CIRCLE' && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded text-[8px] font-bold uppercase">
                                    Belum Di-Circle
                                  </span>
                                )
                              )}
                            </div>

                            {/* Mobile action dropdown */}
                            <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                              {/* ClassType Changer */}
                              <select
                                value={student.classType || 'PRIVATE'}
                                onChange={(e) => handleChangeClassType(student.uid, e.target.value as any)}
                                className="bg-white border border-gray-100 rounded-lg text-[9px] font-bold p-1 text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                              >
                                <option value="PRIVATE">PRIVATE</option>
                                <option value="CIRCLE">CIRCLE</option>
                              </select>

                              {/* Circle assignment dropdown */}
                              <select
                                disabled={student.classType === 'PRIVATE'}
                                value={student.circleId || ''}
                                onChange={(e) => handleAssignStudentToCircle(student.uid, e.target.value || null)}
                                className="bg-white border border-gray-100 rounded-lg text-[9px] font-bold p-1 text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-300 cursor-pointer max-w-[90px] truncate"
                              >
                                <option value="">Keluar Circle</option>
                                {circles.map(c => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right grid: Interactive Circle Drop Zones */}
                <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {circles.map(circle => {
                    const members = students.filter(s => s.circleId === circle.id);
                    const isOver = activeDropZoneId === circle.id;
                    const isFull = members.length >= circle.capacity;
                    
                    return (
                      <div
                        key={circle.id}
                        onDragOver={(e) => handleDragOver(e, circle.id)}
                        onDrop={(e) => handleDrop(e, circle.id)}
                        className={`bg-white border rounded-3xl p-5 shadow-3xs flex flex-col justify-between space-y-4 min-h-[320px] transition-all ${
                          isOver 
                            ? 'border-indigo-500 ring-2 ring-indigo-500/10 bg-indigo-50/10' 
                            : 'border-gray-100'
                        }`}
                      >
                        {/* Circle Header */}
                        <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                              {circle.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium font-mono mt-0.5">
                              Maks: {circle.capacity} siswa
                            </p>
                          </div>

                          <span className={`px-2 py-0.5 text-[8px] font-mono font-bold rounded-full ${
                            isFull 
                              ? 'bg-red-50 text-red-600' 
                              : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {members.length} / {circle.capacity}
                          </span>
                        </div>

                        {/* Drag and drop target member items */}
                        <div className="flex-1 space-y-2 overflow-y-auto max-h-64 pr-1">
                          {members.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                              <UserCheck className="w-6 h-6 text-gray-300" />
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Letakkan Siswa</p>
                              <p className="text-[8px] text-gray-400 mt-1 max-w-[120px]">Seret & letakkan nama siswa ke area ini.</p>
                            </div>
                          ) : (
                            members.map(memb => (
                              <div
                                key={memb.uid}
                                draggable
                                onDragStart={(e) => handleDragStart(e, memb.uid)}
                                onDragEnd={handleDragEnd}
                                className={`p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl flex items-center justify-between gap-2.5 cursor-grab active:cursor-grabbing transition-all hover:shadow-4xs ${
                                  draggedStudentId === memb.uid ? 'opacity-40 border-indigo-300' : ''
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-gray-800 truncate leading-tight">{memb.fullName}</p>
                                  <p className="text-[9px] text-gray-400 truncate mt-0.5">{memb.email}</p>
                                </div>

                                <button
                                  onClick={() => handleAssignStudentToCircle(memb.uid, null)}
                                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0 transition-all cursor-pointer"
                                  title="Keluarkan dari Circle"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Drop zone visual helper */}
                        <div className="text-[9px] text-center text-gray-400 italic font-medium">
                          {isFull ? '⚠️ Circle sudah penuh' : '✨ Siap menerima siswa'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Circle Create / Edit Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-3xl border border-gray-100 w-full max-w-md p-6 sm:p-8 space-y-5 shadow-lg relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-50">
              <h2 className="text-lg font-display font-bold text-gray-900">
                {isEditMode ? 'Sunting Kelompok Circle' : 'Tambah Circle Baru'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-4 bg-red-50 border border-red-200/50 rounded-2xl text-xs text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveCircle} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Nama Circle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={circleName}
                  onChange={(e) => setCircleName(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Contoh: Kelompok Singa, Circle Aljabar"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Deskripsi Kelompok <span className="text-gray-400">(Opsional)</span>
                </label>
                <textarea
                  rows={2}
                  value={circleDescription}
                  onChange={(e) => setCircleDescription(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  placeholder="Keterangan mengenai circle belajar ini..."
                />
              </div>

              {/* Capacity Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-700 font-semibold">
                  <span>Kapasitas Maksimal Siswa</span>
                  <span className="text-indigo-600 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                    {circleCapacity} Siswa
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={circleCapacity}
                  onChange={(e) => setCircleCapacity(Number(e.target.value))}
                  className="w-full accent-indigo-600 bg-gray-100 rounded-lg appearance-none h-2"
                />
                <span className="text-[10px] text-gray-400 block leading-tight">
                  Batas default adalah 5 siswa, namun Anda dapat mengubahnya sewaktu-waktu sesuai kebutuhan.
                </span>
              </div>

              {/* Submit button */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 font-semibold rounded-xl text-xs hover:bg-gray-50 cursor-pointer active:scale-98 transition-all"
                  style={{ minHeight: '44px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !circleName.trim()}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs shadow-3xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                  style={{ minHeight: '44px' }}
                >
                  <Sparkles className="w-4 h-4" />
                  {isSubmitting ? 'Memproses...' : isEditMode ? 'Simpan Perubahan' : 'Buat Circle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
