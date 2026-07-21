import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

interface InteractiveOwlProps {
  className?: string;
}

export default function InteractiveOwl({ className = "w-64 h-64" }: InteractiveOwlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pupil offset positions (smoothed via lerp)
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Target pupil offsets
  const targetRef = useRef({ leftX: 0, leftY: 0, rightX: 0, rightY: 0 });
  const currentRef = useRef({ leftX: 0, leftY: 0, rightX: 0, rightY: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Track mouse movement across the viewport
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate center points of left and right eyes in SVG coordinate percentage space
      const leftEyeCenterX = rect.left + rect.width * 0.35;
      const leftEyeCenterY = rect.top + rect.height * 0.38;

      const rightEyeCenterX = rect.left + rect.width * 0.65;
      const rightEyeCenterY = rect.top + rect.height * 0.38;

      const maxDisplacement = rect.width * 0.06; // Maximum pupil travel distance

      // Left eye vector calculation
      const ldx = e.clientX - leftEyeCenterX;
      const ldy = e.clientY - leftEyeCenterY;
      const lDist = Math.hypot(ldx, ldy);
      const lAngle = Math.atan2(ldy, ldx);
      const lRadius = Math.min(lDist * 0.09, maxDisplacement);
      targetRef.current.leftX = Math.cos(lAngle) * lRadius;
      targetRef.current.leftY = Math.sin(lAngle) * lRadius;

      // Right eye vector calculation
      const rdx = e.clientX - rightEyeCenterX;
      const rdy = e.clientY - rightEyeCenterY;
      const rDist = Math.hypot(rdx, rdy);
      const rAngle = Math.atan2(rdy, rdx);
      const rRadius = Math.min(rDist * 0.09, maxDisplacement);
      targetRef.current.rightX = Math.cos(rAngle) * rRadius;
      targetRef.current.rightY = Math.sin(rAngle) * rRadius;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth lerp loop for pupil motion
  useEffect(() => {
    const updatePupils = () => {
      const ease = 0.12; // Easing factor for fluid pupil tracking

      currentRef.current.leftX += (targetRef.current.leftX - currentRef.current.leftX) * ease;
      currentRef.current.leftY += (targetRef.current.leftY - currentRef.current.leftY) * ease;
      currentRef.current.rightX += (targetRef.current.rightX - currentRef.current.rightX) * ease;
      currentRef.current.rightY += (targetRef.current.rightY - currentRef.current.rightY) * ease;

      setLeftPupil({ x: currentRef.current.leftX, y: currentRef.current.leftY });
      setRightPupil({ x: currentRef.current.rightX, y: currentRef.current.rightY });

      animFrameRef.current = requestAnimationFrame(updatePupils);
    };

    animFrameRef.current = requestAnimationFrame(updatePupils);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Random eye blink interval for realistic lifelike feel
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.2) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 160);
      }
    }, 4200);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={`relative select-none ${className}`}
      animate={{
        y: [0, -8, 0],
        rotateZ: [0, -1.5, 1.5, 0]
      }}
      transition={{
        duration: 3.8,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      whileHover={{ scale: 1.04, rotateZ: 2 }}
      whileTap={{ scale: 0.96 }}
    >
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        style={{ filter: 'drop-shadow(0 15px 25px rgba(50, 30, 15, 0.25))' }}
      >
        <defs>
          {/* Main Owl Body 3D Radial Gradient */}
          <radialGradient id="owlBodyGrad" cx="45%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#7c4e2b" />
            <stop offset="60%" stopColor="#59341c" />
            <stop offset="100%" stopColor="#3d210f" />
          </radialGradient>

          {/* Ear Tufts Gradient */}
          <linearGradient id="owlEarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#683d20" />
            <stop offset="100%" stopColor="#452410" />
          </linearGradient>

          {/* Wings Dark Gradient */}
          <linearGradient id="owlWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4d2b14" />
            <stop offset="100%" stopColor="#2c1609" />
          </linearGradient>

          {/* Soft Cream/Peach Belly Patch Radial Gradient */}
          <radialGradient id="owlBellyGrad" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fce5d8" />
            <stop offset="70%" stopColor="#f7ba9f" />
            <stop offset="100%" stopColor="#eb9575" />
          </radialGradient>

          {/* Eye Outer Ring Gradient */}
          <radialGradient id="owlEyeRingGrad" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#452713" />
            <stop offset="100%" stopColor="#241207" />
          </radialGradient>

          {/* Eye Yellow Iris Radial Gradient (Glow Effect) */}
          <radialGradient id="owlIrisGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fff9a6" />
            <stop offset="45%" stopColor="#ffd700" />
            <stop offset="85%" stopColor="#ff9f00" />
            <stop offset="100%" stopColor="#d97700" />
          </radialGradient>

          {/* Vibrant Orange Beak Gradient */}
          <linearGradient id="owlBeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff8500" />
            <stop offset="70%" stopColor="#e65100" />
            <stop offset="100%" stopColor="#bf3600" />
          </linearGradient>

          {/* Pupil Gradient */}
          <radialGradient id="owlPupilGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#261b15" />
            <stop offset="100%" stopColor="#0d0805" />
          </radialGradient>
        </defs>

        <g>
          {/* Shadow under base */}
          <ellipse cx="150" cy="275" rx="70" ry="12" fill="rgba(0,0,0,0.15)" />

          {/* Left Ear Tuft (Pointy Curved Ear) */}
          <path 
            d="M 68 76 C 42 22, 102 38, 114 54 Z" 
            fill="url(#owlEarGrad)" 
            stroke="#3a1e0d" 
            strokeWidth="3"
          />

          {/* Right Ear Tuft (Pointy Curved Ear) */}
          <path 
            d="M 232 76 C 258 22, 198 38, 186 54 Z" 
            fill="url(#owlEarGrad)" 
            stroke="#3a1e0d" 
            strokeWidth="3"
          />

          {/* Main Body & Round Head */}
          <path 
            d="M 150 44 C 74 44, 46 90, 46 160 C 46 235, 78 268, 150 268 C 222 268, 254 235, 254 160 C 254 90, 226 44, 150 44 Z" 
            fill="url(#owlBodyGrad)" 
            stroke="#341b0b"
            strokeWidth="4"
          />

          {/* Left Wing Shadow Overlay */}
          <path 
            d="M 46 135 C 30 160, 36 215, 72 242 C 60 205, 50 165, 46 135 Z" 
            fill="url(#owlWingGrad)" 
          />

          {/* Right Wing Shadow Overlay */}
          <path 
            d="M 254 135 C 270 160, 264 215, 228 242 C 240 205, 250 165, 254 135 Z" 
            fill="url(#owlWingGrad)" 
          />

          {/* Large Soft Peach/Cream Belly Circle */}
          <ellipse 
            cx="150" 
            cy="198" 
            rx="56" 
            ry="50" 
            fill="url(#owlBellyGrad)" 
            stroke="#e09070" 
            strokeWidth="1.5" 
          />

          {/* EYE SOCKET OUTER RINGS */}
          <circle cx="106" cy="115" r="43" fill="url(#owlEyeRingGrad)" stroke="#2b1509" strokeWidth="3" />
          <circle cx="194" cy="115" r="43" fill="url(#owlEyeRingGrad)" stroke="#2b1509" strokeWidth="3" />

          {/* GLOWING YELLOW IRISES */}
          <circle cx="106" cy="115" r="37" fill="url(#owlIrisGrad)" stroke="#804a00" strokeWidth="2" />
          <circle cx="194" cy="115" r="37" fill="url(#owlIrisGrad)" stroke="#804a00" strokeWidth="2" strokeOpacity="0.8" />

          {/* LEFT INTERACTIVE PUPIL WITH DOUBLE SPECULAR REFLECTION */}
          <g transform={`translate(${leftPupil.x}, ${leftPupil.y})`}>
            {/* Main Pupil Circle */}
            <circle cx="106" cy="115" r="20" fill="url(#owlPupilGrad)" />
            
            {/* Primary Big Glossy Reflection Dot (Top Left) */}
            <circle cx="100" cy="108" r="6.5" fill="#FFFFFF" opacity="0.95" />
            
            {/* Secondary Small Reflection Dot (Bottom Right) */}
            <circle cx="113" cy="121" r="2.8" fill="#FFFFFF" opacity="0.85" />
          </g>

          {/* RIGHT INTERACTIVE PUPIL WITH DOUBLE SPECULAR REFLECTION */}
          <g transform={`translate(${rightPupil.x}, ${rightPupil.y})`}>
            {/* Main Pupil Circle */}
            <circle cx="194" cy="115" r="20" fill="url(#owlPupilGrad)" />
            
            {/* Primary Big Glossy Reflection Dot (Top Left) */}
            <circle cx="188" cy="108" r="6.5" fill="#FFFFFF" opacity="0.95" />
            
            {/* Secondary Small Reflection Dot (Bottom Right) */}
            <circle cx="197" cy="121" r="2.8" fill="#FFFFFF" opacity="0.85" />
          </g>

          {/* EYELIDS OVERLAY FOR REALISTIC BLINKING */}
          {isBlinking && (
            <>
              <ellipse cx="106" cy="115" rx="38" ry="38" fill="#4d2b14" />
              <path d="M 68 115 Q 106 140 144 115" stroke="#ffd700" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <ellipse cx="194" cy="115" rx="38" ry="38" fill="#4d2b14" />
              <path d="M 156 115 Q 194 140 232 115" stroke="#ffd700" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* VIBRANT ORANGE BEAK (Inverted Triangle pointing down) */}
          <path 
            d="M 136 122 L 164 122 L 150 152 Z" 
            fill="url(#owlBeakGrad)" 
            stroke="#a63a00" 
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Beak Highlight */}
          <polygon points="138,124 162,124 150,129" fill="#ffa733" opacity="0.6" />
        </g>
      </svg>
    </motion.div>
  );
}
