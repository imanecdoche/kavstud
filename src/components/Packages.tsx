import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PackageDetail, { PackageData } from './PackageDetail';
import PackageRegistrationForm from './PackageRegistrationForm';

function PackageCardItem({
  pkg,
  offset,
  isActive,
  priceLabel,
  onSelectPackage,
  goNext,
  goPrev,
  isLandingPage = false
}: {
  key?: string;
  pkg: PackageData;
  offset: number;
  isActive: boolean;
  priceLabel: string;
  onSelectPackage: (pkg: PackageData) => void;
  goNext: () => void;
  goPrev: () => void;
  isLandingPage?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const xMouse = useMotionValue(0);
  const yMouse = useMotionValue(0);

  // Smooth springs for mouse movement (Emil Kowalski spring principles)
  const springConfig = { stiffness: 200, damping: 22 };
  const mouseRotateX = useSpring(useTransform(yMouse, [-0.5, 0.5], [14, -14]), springConfig);
  const mouseRotateY = useSpring(useTransform(xMouse, [-0.5, 0.5], [-14, 14]), springConfig);

  // Parallax layers for 3D depth
  const priceTranslateX = useSpring(useTransform(xMouse, [-0.5, 0.5], [-12, 12]), springConfig);
  const priceTranslateY = useSpring(useTransform(yMouse, [-0.5, 0.5], [-12, 12]), springConfig);
  const imgTranslateX = useSpring(useTransform(xMouse, [-0.5, 0.5], [-18, 18]), springConfig);
  const imgTranslateY = useSpring(useTransform(yMouse, [-0.5, 0.5], [-18, 18]), springConfig);
  const badgeTranslateX = useSpring(useTransform(xMouse, [-0.5, 0.5], [25, -25]), springConfig);
  const badgeTranslateY = useSpring(useTransform(yMouse, [-0.5, 0.5], [25, -25]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    xMouse.set(x);
    yMouse.set(y);
  };

  const handleMouseEnter = () => {
    if (isActive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    xMouse.set(0);
    yMouse.set(0);
  };

  const absOffset = Math.abs(offset);
  const xPos = offset * 295; // Slightly wider spread for better card visibility
  const scale = isActive ? (isHovered ? 1.05 : 1.02) : 0.86; // Side cards are slightly larger and clearer
  const opacity = isActive ? 1 : absOffset === 1 ? 0.75 : 0.2;
  const zIndex = isActive ? 20 : 10 - absOffset;
  const carouselRotateY = isActive ? 0 : offset < 0 ? 22 : -22; // Softer, more elegant 3D angle
  const blur = isActive ? 0 : 1.2; // Subtle depth of field for non-active cards

  return (
    <motion.div
      key={pkg.id}
      animate={{
        x: xPos,
        scale,
        opacity,
        rotateY: carouselRotateY,
        filter: `blur(${blur}px)`,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 26,
      }}
      onClick={() => {
        if (offset === 1) goNext();
        if (offset === -1) goPrev();
        if (isActive && !isLandingPage) onSelectPackage(pkg);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        zIndex,
        left: '50%',
        marginLeft: '-170px',
        rotateX: isActive ? mouseRotateX : 0,
        rotateY: isActive ? mouseRotateY : carouselRotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`absolute w-[340px] ${pkg.bgColor} ${pkg.borderClass} rounded-[2.2rem] p-7 flex flex-col items-center overflow-hidden shadow-xl cursor-pointer transition-shadow duration-300 hover:shadow-2xl`}
    >
      {/* Horizontal Light Sheen / Kilau Cahaya Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.45) 45%, rgba(255, 255, 255, 0.75) 50%, rgba(255, 255, 255, 0.45) 55%, transparent 80%)',
          transform: 'translateZ(75px)',
          mixBlendMode: 'overlay',
        }}
        animate={{
          x: isHovered && isActive ? ['-160%', '160%'] : '-160%',
        }}
        transition={{
          duration: 1.3,
          ease: [0.23, 1, 0.32, 1],
          repeat: isHovered && isActive ? Infinity : 0,
          repeatDelay: 0.9,
        }}
      />

      {/* Header Info */}
      <div className="text-center w-full mb-1 z-10 pointer-events-none" style={{ transform: 'translateZ(20px)' }}>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-1 font-display">{pkg.name}</h2>
        
        {/* Price Block with 3D Parallax Elevation & Hover Scale */}
        <motion.div
          style={{
            x: isActive ? priceTranslateX : 0,
            y: isActive ? priceTranslateY : 0,
            transform: 'translateZ(45px)',
          }}
          animate={{
            scale: isHovered && isActive ? 1.12 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 22,
          }}
          className="inline-block"
        >
          {priceLabel === '/bulan' ? (
            <>
              <div className="flex items-end justify-center gap-1 mb-1 text-gray-900 drop-shadow-xs">
                <span className="text-base font-bold">Rp</span>
                <span className="text-3xl font-black leading-none">{pkg.price}</span>
                <span className="text-xs font-semibold mb-0.5">/bulan</span>
              </div>
              <p className="text-xs font-medium text-gray-700">{pkg.details}</p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-gray-700 mb-1">{pkg.details}</p>
              <div className="flex items-end justify-center gap-1 text-gray-900 drop-shadow-xs">
                <span className="text-base font-bold">Rp</span>
                <span className="text-3xl font-black leading-none">{pkg.price}</span>
              </div>
              <p className="text-xs font-bold text-gray-900">/sesi/siswa</p>
            </>
          )}
        </motion.div>
      </div>

      {/* Enlarged 3D Parallax Illustration */}
      <motion.div
        className={`relative w-full ${pkg.id === 'squad' ? 'max-w-[310px]' : 'max-w-[265px]'} aspect-square flex items-center justify-center my-1`}
        style={{
          x: isActive ? imgTranslateX : 0,
          y: isActive ? imgTranslateY : 0,
          transform: 'translateZ(35px)',
        }}
      >
        <img
          src={pkg.image}
          alt={`${pkg.name} illustration`}
          className="w-full h-full object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105"
        />
      </motion.div>

      {/* Parallax Badge */}
      {pkg.badge && (
        <motion.img
          src={pkg.badge}
          alt="Badge"
          style={{
            x: isActive ? badgeTranslateX : 0,
            y: isActive ? badgeTranslateY : 0,
            transform: 'translateZ(65px)',
          }}
          className={`absolute ${pkg.id === 'squad' ? 'w-32 h-32' : 'w-24 h-24'} object-contain z-20 ${pkg.badgePos} drop-shadow-xl`}
        />
      )}
    </motion.div>
  );
}

function PackageCarousel({ 
  items, 
  priceLabel, 
  onSelectPackage,
  isLandingPage = false,
  onNavigateToContact
}: { 
  items: PackageData[]; 
  priceLabel: string;
  onSelectPackage: (pkg: PackageData) => void;
  isLandingPage?: boolean;
  onNavigateToContact?: () => void;
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
          className="absolute left-0 z-30 w-11 h-11 bg-white text-gray-800 rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 border-b-4 border-b-gray-300 hover:scale-110 active:scale-90 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Window */}
        <div className="relative w-full h-[520px] py-6 flex items-center justify-center overflow-hidden sm:overflow-visible">
          <div className="relative w-full h-full flex items-center justify-center">
            {items.map((pkg, index) => {
              const offset = index - activeIndex;
              return (
                <PackageCardItem
                  key={pkg.id}
                  pkg={pkg}
                  offset={offset}
                  isActive={offset === 0}
                  priceLabel={priceLabel}
                  onSelectPackage={onSelectPackage}
                  goNext={goNext}
                  goPrev={goPrev}
                  isLandingPage={isLandingPage}
                />
              );
            })}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={goNext}
          disabled={activeIndex === items.length - 1}
          className="absolute right-0 z-30 w-11 h-11 bg-white text-gray-800 rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 border-b-4 border-b-gray-300 hover:scale-110 active:scale-90 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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
          onClick={() => {
            if (isLandingPage && onNavigateToContact) {
              onNavigateToContact();
            } else {
              onSelectPackage(items[activeIndex]);
            }
          }}
          className="btn-duo-green px-8 py-3.5 text-xs font-black uppercase tracking-wider shadow-lg"
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
                ? 'w-8 h-3 bg-[#1CB0F6] border border-[#0092E0]'
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

interface PackagesProps {
  isLandingPage?: boolean;
  onNavigateToContact?: () => void;
}

export default function Packages({ isLandingPage = false, onNavigateToContact }: PackagesProps) {
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
  if (selectedPackage && !isLandingPage) {
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
        <div className="text-center mb-8">
          <span className="inline-block px-6 py-2.5 bg-[#58CC02] text-white font-display font-black text-2xl md:text-3xl uppercase tracking-wider rounded-2xl border-b-4 border-b-[#46A302] shadow-md">
            PAKET PRIVATE
          </span>
        </div>
        <PackageCarousel 
          items={packages} 
          priceLabel="/bulan" 
          onSelectPackage={(pkg) => setSelectedPackage(pkg)} 
          isLandingPage={isLandingPage}
          onNavigateToContact={onNavigateToContact}
        />
      </div>

      {/* PAKET CIRCLE */}
      <div>
        <div className="text-center mb-8">
          <span className="inline-block px-6 py-2.5 bg-[#1CB0F6] text-white font-display font-black text-2xl md:text-3xl uppercase tracking-wider rounded-2xl border-b-4 border-b-[#0092E0] shadow-md">
            PAKET CIRCLE
          </span>
        </div>
        <PackageCarousel 
          items={circlePackages} 
          priceLabel="/sesi/siswa" 
          onSelectPackage={(pkg) => setSelectedPackage(pkg)} 
          isLandingPage={isLandingPage}
          onNavigateToContact={onNavigateToContact}
        />
      </div>
    </div>
  );
}
