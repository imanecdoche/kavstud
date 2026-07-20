import React from 'react';

export function Spinner({ className = 'w-6 h-6 text-indigo-600 dark:text-indigo-400' }: { className?: string }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 p-6 rounded-3xl space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-slate-600 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-md w-1/3" />
          <div className="h-2.5 bg-gray-200 dark:bg-slate-600 rounded-md w-1/4" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-md w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-md w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonList({ items = 4 }: { items?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded-md w-1/4 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: items }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-md w-1/2" />
                <div className="h-2.5 bg-gray-200 dark:bg-slate-600 rounded-md w-1/3" />
              </div>
            </div>
            <div className="w-16 h-3 bg-gray-200 dark:bg-slate-600 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stat block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-28 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl p-5 space-y-3">
          <div className="h-2.5 bg-gray-200 dark:bg-slate-600 rounded-md w-1/2" />
          <div className="h-7 bg-gray-200 dark:bg-slate-600 rounded-md w-1/4" />
        </div>
        <div className="h-28 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl p-5 space-y-3">
          <div className="h-2.5 bg-gray-200 dark:bg-slate-600 rounded-md w-1/2" />
          <div className="h-7 bg-gray-200 dark:bg-slate-600 rounded-md w-1/4" />
        </div>
        <div className="h-28 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-2xl p-5 space-y-3 sm:col-span-2 lg:col-span-1">
          <div className="h-2.5 bg-gray-200 dark:bg-slate-600 rounded-md w-1/2" />
          <div className="h-7 bg-gray-200 dark:bg-slate-600 rounded-md w-1/4" />
        </div>
      </div>
      
      {/* Grid splits */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="h-64 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6" />
          <div className="h-64 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6" />
        </div>
        <div className="h-96 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6" />
      </div>
    </div>
  );
}

export function SkeletonSettings() {
  return (
    <div className="space-y-8 animate-pulse max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
          <div className="w-16 h-16 bg-gray-200 dark:bg-slate-600 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded-md w-32" />
            <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-md w-48" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-md w-1/4" />
          <div className="h-10 bg-gray-200 dark:bg-slate-600 rounded-xl w-full" />
          <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-md w-1/4" />
          <div className="h-10 bg-gray-200 dark:bg-slate-600 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="space-y-8 animate-pulse max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6" />
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          <div className="h-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6" />
          <div className="h-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6" />
          <div className="h-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6" />
        </div>
      </div>
      <div className="h-64 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6" />
    </div>
  );
}
