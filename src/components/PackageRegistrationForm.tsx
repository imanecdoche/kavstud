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
import CustomDropdown from './CustomDropdown';
import CustomDatePicker from './CustomDatePicker';
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
        className="fixed inset-0 bg-black/70 backdrop-blur-xs"
      />

      {/* Main Form Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#2F3138] rounded-[4px] p-6 sm:p-8 shadow-[0_6px_16px_rgba(0,0,0,0.6)] border border-white/20 overflow-y-auto z-50 space-y-6 custom-scrollbar text-white"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[9px] font-bold uppercase text-[#66C0F4] tracking-wider bg-[#66C0F4]/15 px-2 py-0.5 rounded-[2px] border border-[#66C0F4]/30">
              FORMULIR PENDAFTARAN PAKET
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mt-1">
              PENDAFTARAN PAKET BELAJAR
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8A8A8A] hover:text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-6 animate-scaleUp">
            <div className="w-16 h-16 bg-[#A1CD44]/20 border border-[#A1CD44]/40 text-[#A1CD44] rounded-[2px] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase">
                PENDAFTARAN BERHASIL TERKIRIM
              </h3>
              <p className="text-xs font-medium text-[#C6D4DF] max-w-md mx-auto leading-relaxed">
                Terima kasih. Data pendaftaran Anda untuk paket <strong className="text-[#66C0F4]">{selectedPackageName}</strong> telah diterima oleh Tim Kavio Edu. Admin kami akan menghubungi WhatsApp Wali dalam 1x24 jam.
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-[40px] px-8 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold uppercase rounded-[2px] shadow-md transition-all cursor-pointer"
            >
              SELESAI
            </button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmitInit} className="space-y-5">
            {formError && (
              <div className="p-3 bg-[#FF4B4B]/20 border border-[#FF4B4B]/30 rounded-[2px] text-xs font-bold text-[#FF4B4B] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Wali */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                  Nama Wali Siswa <span className="text-[#FF4B4B]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Ahmad Subagyo"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-black/40 border border-white/15 text-white text-xs font-medium placeholder-[#8A8A8A] focus:border-[#66C0F4] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Nama Siswa */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                  Nama Lengkap Siswa <span className="text-[#FF4B4B]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Faiz Ahmad"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-black/40 border border-white/15 text-white text-xs font-medium placeholder-[#8A8A8A] focus:border-[#66C0F4] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Tanggal Lahir & Age Auto-Calculator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                    Tanggal Lahir Siswa <span className="text-[#FF4B4B]">*</span>
                  </label>
                  {studentDob && (
                    <span className="text-[9px] font-bold text-[#A1CD44] bg-[#A1CD44]/20 border border-[#A1CD44]/40 px-2 py-0.5 rounded-[2px] uppercase">
                      Umur: {studentAge} Tahun
                    </span>
                  )}
                </div>
                <CustomDatePicker
                  value={studentDob}
                  onChange={(val) => setStudentDob(val)}
                  placeholder="Pilih Tanggal Lahir"
                />
              </div>

              {/* No. WA Wali */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                  No. WhatsApp Wali <span className="text-[#FF4B4B]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-black/40 border border-white/15 text-white text-xs font-medium placeholder-[#8A8A8A] focus:border-[#66C0F4] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Alamat Siswa */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                Alamat Lengkap Rumah Siswa <span className="text-[#FF4B4B]">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#8A8A8A]" />
                <textarea
                  required
                  rows={2}
                  placeholder="Masukkan jalan, RT/RW, kelurahan, kecamatan, dan kota tempat tinggal..."
                  value={studentAddress}
                  onChange={(e) => setStudentAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-black/40 border border-white/15 text-white text-xs font-medium placeholder-[#8A8A8A] focus:border-[#66C0F4] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Selection Options: Paket & Jenjang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                  Paket Yang Dipilih
                </label>
                <CustomDropdown
                  value={selectedPackageId}
                  onChange={(val) => {
                    setSelectedPackageId(val);
                    const found = packageList.find(p => p.id === val);
                    if (found) setSelectedPackageName(found.name);
                  }}
                  options={packageList.map(p => ({ value: p.id, label: p.name }))}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                  Tingkat Sekolah / Kelas Siswa
                </label>
                <CustomDropdown
                  value={gradeLevel}
                  onChange={(val) => setGradeLevel(val)}
                  options={[
                    { value: 'SD', label: 'SD (Sekolah Dasar)' },
                    { value: 'SMP', label: 'SMP (Sekolah Menengah Pertama)' },
                    { value: 'SMA', label: 'SMA / SMK (Sekolah Menengah Atas)' },
                    { value: 'Umum', label: 'Umum / Persiapan Ujian' }
                  ]}
                />
              </div>
            </div>

            {/* Opsi Waktu / Jadwal Favorit */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                Pilihan Sesi Waktu Bimbingan (Favorit)
              </label>
              <CustomDropdown
                value={preferredSchedule}
                onChange={(val) => setPreferredSchedule(val)}
                options={[
                  { value: 'Pagi (09.00 - 11.00 WIB)', label: 'Pagi (09.00 - 11.00 WIB)' },
                  { value: 'Siang (13.00 - 15.00 WIB)', label: 'Siang (13.00 - 15.00 WIB)' },
                  { value: 'Sore (15.30 - 17.00 WIB)', label: 'Sore (15.30 - 17.00 WIB)' },
                  { value: 'Malam (19.00 - 20.30 WIB)', label: 'Malam (19.00 - 20.30 WIB)' }
                ]}
              />
            </div>

            {/* Instruksi Khusus Untuk Tutor */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#C6D4DF] uppercase tracking-wider">
                Instruksi Khusus untuk Tutor (Opsional)
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-[#8A8A8A]" />
                <textarea
                  rows={2}
                  placeholder="Contoh: Siswa agak pemalu, mohon diajarkan secara perlahan & santai. Atau butuh fokus perbaikan di Matematika Dasar."
                  value={tutorInstructions}
                  onChange={(e) => setTutorInstructions(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-black/40 border border-white/15 text-white text-xs font-medium placeholder-[#8A8A8A] focus:border-[#66C0F4] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Footer Form Submit Button */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-[40px] flex-1 bg-black/40 hover:bg-white/10 text-white border border-white/20 text-xs font-bold uppercase rounded-[2px] transition-all cursor-pointer flex items-center justify-center"
              >
                BATAL
              </button>

              <button
                type="submit"
                className="h-[40px] flex-1 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold uppercase rounded-[2px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                id="btn-submit-registration-init"
              >
                <Send className="w-4 h-4 text-[#171A21]" />
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
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#2F3138] rounded-[4px] p-6 sm:p-8 shadow-[0_6px_16px_rgba(0,0,0,0.6)] border border-white/20 z-60 space-y-6 text-white"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-black/40 border border-white/20 text-[#B9A074] rounded-[2px] flex items-center justify-center mx-auto shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  APAKAH DATA SUDAH BENAR?
                </h3>
                <p className="text-xs font-medium text-[#C6D4DF]">
                  Mohon periksa kembali rincian data pendaftaran Anda sebelum dikirim.
                </p>
              </div>

              {/* Data Summary List */}
              <div className="bg-black/40 rounded-[2px] p-4 space-y-2 border border-white/10 text-xs font-bold text-white">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-[#8A8A8A]">Wali Siswa:</span>
                  <span className="text-white font-bold">{guardianName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-[#8A8A8A]">Nama Siswa:</span>
                  <span className="text-white font-bold">{studentName} ({studentAge} Tahun)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-[#8A8A8A]">No. WA Wali:</span>
                  <span className="text-white font-bold">{guardianPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-[#8A8A8A]">Paket Dipilih:</span>
                  <span className="text-[#66C0F4] font-bold">{selectedPackageName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-[#8A8A8A]">Pilihan Waktu:</span>
                  <span className="text-white font-bold">{preferredSchedule}</span>
                </div>
                {tutorInstructions && (
                  <div className="pt-1">
                    <span className="text-[#8A8A8A] block mb-0.5">Instruksi Tutor:</span>
                    <span className="font-medium text-[#C6D4DF] block bg-[#171A21] p-2 rounded-[2px] border border-white/10">
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
                  className="h-[40px] flex-1 bg-black/40 hover:bg-white/10 text-white border border-white/20 text-xs font-bold uppercase rounded-[2px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  id="btn-confirm-edit"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>EDIT</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="h-[40px] flex-1 bg-[#A1CD44] hover:bg-[#86AE33] text-[#171A21] text-xs font-bold uppercase rounded-[2px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  id="btn-confirm-submit"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 border-2 border-[#171A21] border-t-transparent rounded-full animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#171A21]" />
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
