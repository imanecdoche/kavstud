import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PackageDetail, { PackageData } from './PackageDetail';
import PackageRegistrationForm from './PackageRegistrationForm';

function PackageCarousel({ 
  items, 
  priceLabel, 
  onSelectPackage 
}: { 
  items: PackageData[]; 
  priceLabel: string;
  onSelectPackage: (pkg: PackageData) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
  const goPrev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Carousel viewport */}
      <div className="relative w-full flex items-center justify-center">
        {/* Prev button */}
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="absolute left-0 z-30 w-11 h-11 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-110 active:scale-90 transition-all cursor-pointer border border-gray-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Cards track */}
        <div className="overflow-hidden w-full mx-14" style={{ height: '500px' }}>
          <div className="relative w-full h-full flex items-center justify-center">
            {items.map((pkg, index) => {
              const offset = index - activeIndex;
              const isActive = offset === 0;
              const absOffset = Math.abs(offset);

              if (absOffset > 2) return null;

              const xPos = offset * 280;
              const scale = isActive ? 1 : 0.8;
              const opacity = isActive ? 1 : absOffset === 1 ? 0.45 : 0.15;
              const zIndex = isActive ? 20 : 10 - absOffset;

              return (
                <motion.div
                  key={pkg.id}
                  animate={{
                    x: xPos,
                    scale,
                    opacity,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={() => {
                    if (offset === 1) goNext();
                    if (offset === -1) goPrev();
                    if (isActive) onSelectPackage(pkg);
                  }}
                  className={`absolute w-[320px] ${pkg.bgColor} ${pkg.borderClass} rounded-[2rem] p-7 flex flex-col items-center overflow-hidden shadow-md cursor-pointer`}
                  style={{ zIndex, left: '50%', marginLeft: '-160px' }}
                >
                  {/* Text */}
                  <div className="text-center w-full mb-3">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-1 font-display">{pkg.name}</h2>
                    {priceLabel === '/bulan' ? (
                      <>
                        <div className="flex items-end justify-center gap-1 mb-1 text-gray-900">
                          <span className="text-base font-bold">Rp</span>
                          <span className="text-2xl font-black leading-none">{pkg.price}</span>
                          <span className="text-xs font-semibold mb-0.5">/bulan</span>
                        </div>
                        <p className="text-xs font-medium text-gray-700">{pkg.details}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-gray-700 mb-1">{pkg.details}</p>
                        <div className="flex items-end justify-center gap-1 text-gray-900">
                          <span className="text-base font-bold">Rp</span>
                          <span className="text-3xl font-black leading-none">{pkg.price}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">/sesi/siswa</p>
                      </>
                    )}
                  </div>

                  {/* Illustration */}
                  <div className={`relative w-full ${pkg.id === 'squad' ? 'max-w-[280px]' : 'max-w-[220px]'} aspect-square`}>
                    <img
                      src={pkg.image}
                      alt={`${pkg.name} illustration`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Badge */}
                  {pkg.badge && (
                    <img
                      src={pkg.badge}
                      alt="Badge"
                      className={`absolute ${pkg.id === 'squad' ? 'w-28 h-28' : 'w-20 h-20'} object-contain z-20 ${pkg.badgePos}`}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={goNext}
          disabled={activeIndex === items.length - 1}
          className="absolute right-0 z-30 w-11 h-11 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:scale-110 active:scale-90 transition-all cursor-pointer border border-gray-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* CTA Button */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <button 
          onClick={() => onSelectPackage(items[activeIndex])}
          className="bg-gray-900 text-white text-sm font-bold py-3 px-8 rounded-2xl shadow-lg hover:bg-gray-800 active:scale-95 transition-all cursor-pointer border-b-4 border-b-gray-950 active:border-b-0 active:translate-y-[4px]"
          id="btn-learn-more"
        >
          Lihat Selengkapnya
        </button>
      </motion.div>

      {/* Dot indicators */}
      <div className="flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === activeIndex
                ? 'w-7 h-3 bg-gray-800 dark:bg-white'
                : 'w-3 h-3 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const packages: PackageData[] = [
    {
      id: 'seed',
      name: 'SEED',
      price: '150.000',
      details: '3 pertemuan x 60 menit',
      bgColor: 'bg-[#F2F8D5]',
      borderClass: 'border-2 border-[#D9E6AD] border-b-[6px] border-b-[#C3D28E]',
      image: '/aset/seedloogo.png',
      badge: null,
      badgePos: '',
      priceLabel: '/bulan'
    },
    {
      id: 'grow',
      name: 'GROW',
      price: '200.000',
      details: '4 pertemuan x 60 menit',
      bgColor: 'bg-[#F2E7DC]',
      borderClass: 'border-2 border-[#E1CDB9] border-b-[6px] border-b-[#CCB29B]',
      image: '/aset/growlogo.png',
      badge: null,
      badgePos: '',
      priceLabel: '/bulan'
    },
    {
      id: 'boost',
      name: 'BOOST',
      price: '350.000',
      details: '8 pertemuan x 60 menit',
      bgColor: 'bg-[#FADBD8]',
      borderClass: 'border-2 border-[#F0B8B2] border-b-[6px] border-b-[#DB9B93]',
      image: '/aset/boostlogo.png',
      badge: '/aset/save12pbadge.png',
      badgePos: 'bottom-4 right-4',
      priceLabel: '/bulan'
    },
    {
      id: 'master',
      name: 'MASTER',
      price: '500.000',
      details: '8 pertemuan x 90 menit',
      bgColor: 'bg-[#FBDC9A]',
      borderClass: 'border-2 border-[#F4C46A] border-b-[6px] border-b-[#E0AB49]',
      image: '/aset/masterlogo.png',
      badge: '/aset/bestvaluebadge.png',
      badgePos: 'bottom-4 left-4',
      priceLabel: '/bulan'
    }
  ];

  const circlePackages: PackageData[] = [
    {
      id: 'duo',
      name: 'DUO',
      price: '45.000',
      details: '2 siswa • 60 menit',
      bgColor: 'bg-[#ADCFFB]',
      borderClass: 'border-2 border-[#94BBF2] border-b-[6px] border-b-[#79A5E6]',
      image: '/aset/duo.png',
      badge: '/aset/focusedlearningbadge.png',
      badgePos: 'bottom-2 left-2',
      priceLabel: '/sesi/siswa'
    },
    {
      id: 'trio',
      name: 'TRIO',
      price: '40.000',
      details: '3 siswa • 60 menit',
      bgColor: 'bg-[#FFF6CC]',
      borderClass: 'border-2 border-[#E5DCB7] border-b-[6px] border-b-[#CCBB8A]',
      image: '/aset/trio.png',
      badge: null,
      badgePos: '',
      priceLabel: '/sesi/siswa'
    },
    {
      id: 'squad',
      name: 'SQUAD',
      price: '35.000',
      details: '4-5 siswa • 60 menit',
      bgColor: 'bg-[#BEF4C1]',
      borderClass: 'border-2 border-[#AADCAE] border-b-[6px] border-b-[#93C898]',
      image: '/aset/suqad.png',
      badge: '/aset/bestchoicebadge.png',
      badgePos: 'bottom-2 left-0 right-0 mx-auto',
      priceLabel: '/sesi/siswa'
    }
  ];

  // If a package is selected for detail view
  if (selectedPackage) {
    return (
      <>
        <PackageDetail 
          pkg={selectedPackage}
          onBack={() => setSelectedPackage(null)}
          onRegister={(pkg) => setShowRegisterForm(true)}
        />

        <AnimatePresence>
          {showRegisterForm && (
            <PackageRegistrationForm 
              initialPackage={selectedPackage}
              onClose={() => setShowRegisterForm(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="space-y-16 animate-fadeIn max-w-4xl mx-auto pb-12 px-4">
      {/* PAKET PRIVATE */}
      <div>
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-wider font-display">
            PAKET PRIVATE
          </h1>
        </div>
        <PackageCarousel 
          items={packages} 
          priceLabel="/bulan" 
          onSelectPackage={(pkg) => setSelectedPackage(pkg)} 
        />
      </div>

      {/* PAKET CIRCLE */}
      <div>
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-wider font-display">
            PAKET CIRCLE
          </h1>
        </div>
        <PackageCarousel 
          items={circlePackages} 
          priceLabel="/sesi/siswa" 
          onSelectPackage={(pkg) => setSelectedPackage(pkg)} 
        />
      </div>
    </div>
  );
}
