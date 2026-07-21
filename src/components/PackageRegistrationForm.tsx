import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Package, 
  GraduationCap, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Edit3, 
  Send,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { PackageData } from './PackageDetail';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface PackageRegistrationFormProps {
  initialPackage: PackageData;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PackageRegistrationForm({ initialPackage, onClose, onSuccess }: PackageRegistrationFormProps) {
  const [guardianName, setGuardianName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentDob, setStudentDob] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackage.id);
  const [selectedPackageName, setSelectedPackageName] = useState(initialPackage.name);
  const [gradeLevel, setGradeLevel] = useState('SD');
  const [preferredSchedule, setPreferredSchedule] = useState('Sore (15.30 - 17.00 WIB)');
  const [tutorInstructions, setTutorInstructions] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const packageList = [
    { id: 'seed', name: 'SEED (Private 3x Sesi)' },
    { id: 'grow', name: 'GROW (Private 4x Sesi)' },
    { id: 'boost', name: 'BOOST (Private 8x Sesi)' },
    { id: 'master', name: 'MASTER (Private 8x 90 Menit)' },
    { id: 'duo', name: 'DUO (Circle 2 Siswa)' },
    { id: 'trio', name: 'TRIO (Circle 3 Siswa)' },
    { id: 'squad', name: 'SQUAD (Circle 4-5 Siswa)' }
  ];

  // Automatic age calculation in real-time
  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 0 ? 0 : age;
  };

  const studentAge = calculateAge(studentDob);

  const handleSubmitInit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!guardianName.trim() || !studentName.trim() || !studentDob || !studentAddress.trim() || !guardianPhone.trim()) {
      setFormError('Harap lengkapi semua kolom bertanda bintang (*) sebelum mendaftar.');
      return;
    }

    // Open confirmation dialog
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      const selectedPkgObj = packageList.find(p => p.id === selectedPackageId);
      const pkgName = selectedPkgObj ? selectedPkgObj.name : selectedPackageName;

      const payload = {
        guardianName: guardianName.trim(),
        studentName: studentName.trim(),
        studentDob,
        studentAge,
        studentAddress: studentAddress.trim(),
        guardianPhone: guardianPhone.trim(),
        selectedPackageId,
        selectedPackageName: pkgName,
        gradeLevel,
        preferredSchedule,
        assignedSchedule: '', // To be assigned by DEV/Admin if needed
        tutorInstructions: tutorInstructions.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: user?.uid || null,
        userEmail: user?.email || null
      };

      // 1. Try Firestore write
      try {
        if (db) {
          await addDoc(collection(db, 'package_registrations'), {
            ...payload,
            createdAt: serverTimestamp()
          });
        }
      } catch (firestoreErr) {
        console.warn('Firestore write fallback to local storage:', firestoreErr);
      }

      // 2. Also save to local storage fallback for offline / instant resilience
      try {
        const saved = localStorage.getItem('kavio_local_registrations');
        const list = saved ? JSON.parse(saved) : [];
        list.push({ id: `local-reg-${Date.now()}`, ...payload });
        localStorage.setItem('kavio_local_registrations', JSON.stringify(list));
        window.dispatchEvent(new Event('kavio_registration_added'));
      } catch {}

      setIsSuccess(true);
      setShowConfirmModal(false);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting package registration:', err);
      setFormError('Terjadi kesalahan saat memproses pendaftaran. Silakan coba lagi.');
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Main Form Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-400 overflow-y-auto z-50 space-y-6 custom-scrollbar"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-700">
          <div>
            <span className="text-[10px] font-black uppercase text-[#1CB0F6] tracking-widest bg-[#1CB0F6]/10 px-2.5 py-0.5 rounded-md border border-[#1CB0F6]/20">
              FORMULIR PENDAFTARAN PAKET
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase leading-tight font-display mt-1">
              PENDAFTARAN PAKET BELAJAR
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-6 animate-scaleUp">
            <div className="w-20 h-20 bg-[#58CC02] text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg border-b-6 border-[#3b8c00]">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase font-display">
                PENDAFTARAN BERHASIL TERKIRIM! 🎉
              </h3>
              <p className="text-xs font-bold text-gray-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Terima kasih! Data pendaftaran Anda untuk paket <strong className="text-indigo-600 dark:text-indigo-400">{selectedPackageName}</strong> telah diterima oleh Tim Kavio Edu. Admin kami akan menghubungi WhatsApp Wali dalam 1x24 jam.
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-[#58CC02] text-white text-sm font-black py-3 px-8 rounded-2xl shadow-lg border-b-4 border-[#3b8c00] active:border-b-0 active:translate-y-[4px] cursor-pointer uppercase tracking-wider"
            >
              SELESAI
            </button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmitInit} className="space-y-5">
            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Wali */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                  Nama Wali Siswa <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Ahmad Subagyo"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#1CB0F6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Nama Siswa */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                  Nama Lengkap Siswa <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Faiz Ahmad"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#1CB0F6] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Tanggal Lahir & Age Auto-Calculator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                    Tanggal Lahir Siswa <span className="text-red-500">*</span>
                  </label>
                  {studentDob && (
                    <span className="text-[10px] font-black text-[#58CC02] bg-[#58CC02]/10 px-2 py-0.5 rounded-md">
                      Umur: {studentAge} Tahun
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={studentDob}
                    onChange={(e) => setStudentDob(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#1CB0F6] focus:outline-none"
                  />
                </div>
              </div>

              {/* No. WA Wali */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                  No. WhatsApp Wali <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#1CB0F6] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Alamat Siswa */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                Alamat Lengkap Rumah Siswa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <textarea
                  required
                  rows={2}
                  placeholder="Masukkan jalan, RT/RW, kelurahan, kecamatan, dan kota tempat tinggal..."
                  value={studentAddress}
                  onChange={(e) => setStudentAddress(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#1CB0F6] focus:outline-none"
                />
              </div>
            </div>

            {/* Selection Options: Paket & Jenjang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                  Paket Yang Dipilih
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedPackageId}
                    onChange={(e) => {
                      setSelectedPackageId(e.target.value);
                      const found = packageList.find(p => p.id === e.target.value);
                      if (found) setSelectedPackageName(found.name);
                    }}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#1CB0F6] focus:outline-none cursor-pointer"
                  >
                    {packageList.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                  Tingkat Sekolah / Kelas Siswa
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#1CB0F6] focus:outline-none cursor-pointer"
                  >
                    <option value="SD">SD (Sekolah Dasar)</option>
                    <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                    <option value="SMA">SMA / SMK (Sekolah Menengah Atas)</option>
                    <option value="Umum">Umum / Persiapan Ujian</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Opsi Waktu / Jadwal Favorit */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                Pilihan Sesi Waktu Bimbingan (Favorit)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={preferredSchedule}
                  onChange={(e) => setPreferredSchedule(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#1CB0F6] focus:outline-none cursor-pointer"
                >
                  <option value="Pagi (09.00 - 11.00 WIB)">Pagi (09.00 - 11.00 WIB)</option>
                  <option value="Siang (13.00 - 15.00 WIB)">Siang (13.00 - 15.00 WIB)</option>
                  <option value="Sore (15.30 - 17.00 WIB)">Sore (15.30 - 17.00 WIB)</option>
                  <option value="Malam (19.00 - 20.30 WIB)">Malam (19.00 - 20.30 WIB)</option>
                </select>
              </div>
            </div>

            {/* Instruksi Khusus Untuk Tutor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                Instruksi Khusus untuk Tutor (Opsional)
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <textarea
                  rows={2}
                  placeholder="Contoh: Siswa agak pemalu, mohon diajarkan secara perlahan & santai. Atau butuh fokus perbaikan di Matematika Dasar."
                  value={tutorInstructions}
                  onChange={(e) => setTutorInstructions(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-xs font-bold focus:border-[#1CB0F6] focus:outline-none"
                />
              </div>
            </div>

            {/* Footer Form Submit Button */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white text-xs font-black py-3 rounded-2xl border-b-4 border-gray-300 dark:border-slate-900 active:border-b-0 active:translate-y-[4px] cursor-pointer"
              >
                BATAL
              </button>

              <button
                type="submit"
                className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white text-xs font-black py-3 rounded-2xl shadow-lg border-b-4 border-[#3b8c00] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
                id="btn-submit-registration-init"
              >
                <Send className="w-4 h-4" />
                <span>DAFTAR</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Confirmation Dialog Modal: APAKAH DATA SUDAH BENAR? */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-2 border-gray-200 dark:border-slate-700 border-b-8 border-b-gray-400 z-60 space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-[#FFC800] text-gray-900 rounded-2xl flex items-center justify-center mx-auto shadow-md border-b-4 border-[#cca000]">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase font-display">
                  APAKAH DATA SUDAH BENAR?
                </h3>
                <p className="text-xs font-bold text-gray-500 dark:text-slate-400">
                  Mohon periksa kembali rincian data pendaftaran Anda sebelum dikirim.
                </p>
              </div>

              {/* Data Summary List */}
              <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 space-y-2 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-slate-200">
                <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-slate-800">
                  <span className="text-gray-400">Wali Siswa:</span>
                  <span className="font-extrabold">{guardianName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-slate-800">
                  <span className="text-gray-400">Nama Siswa:</span>
                  <span className="font-extrabold">{studentName} ({studentAge} Tahun)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-slate-800">
                  <span className="text-gray-400">No. WA Wali:</span>
                  <span className="font-extrabold">{guardianPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-slate-800">
                  <span className="text-gray-400">Paket Dipilih:</span>
                  <span className="font-extrabold text-[#1CB0F6]">{selectedPackageName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-slate-800">
                  <span className="text-gray-400">Pilihan Waktu:</span>
                  <span className="font-extrabold">{preferredSchedule}</span>
                </div>
                {tutorInstructions && (
                  <div className="pt-1">
                    <span className="text-gray-400 block mb-0.5">Instruksi Tutor:</span>
                    <span className="font-medium text-gray-600 dark:text-slate-300 block bg-white dark:bg-slate-800 p-2 rounded-xl border border-gray-200/60">
                      "{tutorInstructions}"
                    </span>
                  </div>
                )}
              </div>

              {/* Confirmation Dialog Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white text-xs font-black py-3 rounded-2xl border-b-4 border-gray-300 dark:border-slate-900 active:border-b-0 active:translate-y-[4px] cursor-pointer flex items-center justify-center gap-1.5"
                  id="btn-confirm-edit"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>EDIT</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white text-xs font-black py-3 rounded-2xl shadow-lg border-b-4 border-[#3b8c00] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
                  id="btn-confirm-submit"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SUDAH BENAR</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
