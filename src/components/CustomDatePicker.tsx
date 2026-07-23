import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from './CustomDropdown';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Pilih Tanggal...',
  className = '',
  id,
  disabled = false
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Parse current value or default to today
  const parseValueDate = (valStr: string) => {
    if (!valStr) return new Date();
    const parts = valStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    return new Date();
  };

  const initialDate = parseValueDate(value);
  const [viewDate, setViewDate] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? initialDate : null);

  // Sync internal state when value changes externally
  useEffect(() => {
    if (value) {
      const parsed = parseValueDate(value);
      setSelectedDate(parsed);
      setViewDate(parsed);
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Days in current view month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Days in previous month for padding grid
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const newSelected = new Date(currentYear, currentMonth, day);
    setSelectedDate(newSelected);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      onChange(`${yyyy}-${mm}-${dd}`);
    }
    setIsOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setViewDate(today);
  };

  // Display text formatted in Indonesian
  const getFormattedDisplayText = () => {
    if (!value) return null;
    const d = parseValueDate(value);
    return `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  return (
    <div className={`relative ${className}`} id={id}>
      {/* Input Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="w-full min-h-[48px] px-4 py-2.5 bg-white dark:bg-slate-800 border border-[#C1C1C1] dark:border-slate-700 rounded-xl text-sm font-bold text-left flex items-center justify-between gap-2 cursor-pointer hover:border-[#1CB0F6] focus:outline-none focus:border-[#1CB0F6] focus:ring-2 focus:ring-[#1CB0F6]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={value ? 'text-[#3C3C3C] dark:text-white' : 'text-gray-400 font-normal'}>
          {getFormattedDisplayText() || placeholder}
        </span>
        <Calendar className="w-4 h-4 text-[#1CB0F6] shrink-0" />
      </button>

      {/* Centered Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fadeIn"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-duo w-[360px] max-w-[95vw] p-6 space-y-5 relative my-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-sky-600">
                  <Calendar className="w-5 h-5" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    Pilih Tanggal
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Month / Year Nav */}
              <div className="flex items-center justify-between bg-sky-50/60 p-2 rounded-2xl border border-sky-100">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-sky-100 rounded-xl text-gray-700 dark:text-slate-200 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  <CustomDropdown
                    value={currentMonth.toString()}
                    onChange={(val) => setViewDate(new Date(currentYear, parseInt(val, 10), 1))}
                    options={MONTH_NAMES_ID.map((name, idx) => ({ value: idx.toString(), label: name }))}
                    size="sm"
                    variant="minimal"
                    dropdownWidth="w-32"
                  />
                  <CustomDropdown
                    value={currentYear.toString()}
                    onChange={(val) => setViewDate(new Date(parseInt(val, 10), currentMonth, 1))}
                    options={Array.from({ length: 80 }, (_, i) => 1960 + i).map((yr) => ({ value: yr.toString(), label: yr.toString() }))}
                    size="sm"
                    variant="minimal"
                    dropdownWidth="w-24"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-sky-100 rounded-xl text-gray-700 dark:text-slate-200 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day Headers Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {DAY_NAMES_ID.map((dName, idx) => (
                  <span key={idx} className="text-[10px] font-black text-gray-400 uppercase py-1">
                    {dName}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Empty cells for prev month days */}
                {Array.from({ length: firstDayOfMonth }).map((_, idx) => {
                  const prevDayNum = daysInPrevMonth - firstDayOfMonth + idx + 1;
                  return (
                    <div
                      key={`prev-${idx}`}
                      className="p-2 text-xs font-bold text-gray-300 rounded-xl select-none"
                    >
                      {prevDayNum}
                    </div>
                  );
                })}

                {/* Days of view month */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const active = isSelected(dayNum);
                  const today = isToday(dayNum);

                  return (
                    <button
                      key={`day-${dayNum}`}
                      type="button"
                      onClick={() => handleSelectDay(dayNum)}
                      className={`p-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        active
                          ? 'bg-[#1CB0F6] text-white border-b-4 border-[#0092E0] shadow-xs scale-105'
                          : today
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'hover:bg-sky-50 text-gray-800 dark:text-slate-100'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              {/* Footer Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700/50 gap-2">
                <button
                  type="button"
                  onClick={handleSetToday}
                  className="btn-duo-slate px-3 py-2 text-xs font-black text-gray-600 dark:text-slate-300"
                >
                  Hari Ini
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="btn-duo-slate px-3 py-2 text-xs font-black text-gray-500 dark:text-slate-400"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!selectedDate}
                    className="btn-duo-green px-4 py-2 text-xs font-black flex items-center gap-1 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Pilih</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
