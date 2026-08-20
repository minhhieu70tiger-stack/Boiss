import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import chameleonLogo from '../assets/images/chameleon_transparent.svg';

interface IntroScreenProps {
  onComplete: () => void;
}

// Glowing Carved Halloween Jack-o'-Lantern Component
const JackOLantern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative ${className}`}>
    {/* Internal Fiery Candle Flicker Glow */}
    <motion.div
      animate={{
        opacity: [0.7, 1, 0.8, 0.95, 0.75],
        scale: [0.98, 1.05, 1, 1.03, 0.98],
      }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute inset-0 bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-300 rounded-full blur-xl opacity-80"
    />

    {/* SVG Carved Pumpkin */}
    <svg
      viewBox="0 0 120 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-[0_10px_25px_rgba(255,100,0,0.6)] relative z-10"
    >
      <defs>
        <radialGradient id="pumpkinGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff851b" />
          <stop offset="70%" stopColor="#e65100" />
          <stop offset="100%" stopColor="#8d2600" />
        </radialGradient>
        <linearGradient id="fireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="50%" stopColor="#ffb300" />
          <stop offset="100%" stopColor="#ff3d00" />
        </linearGradient>
      </defs>

      {/* Pumpkin Stem (Cuống bí) */}
      <path
        d="M60 22 C58 12 66 5 74 3 C72 10 68 15 64 22 Z"
        fill="#33691e"
        stroke="#1b5e20"
        strokeWidth="1.5"
      />

      {/* Pumpkin Body Ridges (Thân quả bí ngô) */}
      {/* Outer lobes */}
      <ellipse cx="32" cy="62" rx="26" ry="34" fill="url(#pumpkinGrad)" />
      <ellipse cx="88" cy="62" rx="26" ry="34" fill="url(#pumpkinGrad)" />
      {/* Mid lobes */}
      <ellipse cx="44" cy="63" rx="25" ry="36" fill="url(#pumpkinGrad)" />
      <ellipse cx="76" cy="63" rx="25" ry="36" fill="url(#pumpkinGrad)" />
      {/* Center lobe */}
      <ellipse cx="60" cy="64" rx="24" ry="38" fill="url(#pumpkinGrad)" />

      {/* Highlight reflections */}
      <path
        d="M48 35 Q58 32 72 35"
        stroke="#ffa726"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Carved Glowing Eyes (Mắt tam giác ma quái phát sáng) */}
      <polygon points="40,50 49,60 35,61" fill="url(#fireGrad)" filter="drop-shadow(0 0 4px #ffeb3b)" />
      <polygon points="80,50 85,61 71,60" fill="url(#fireGrad)" filter="drop-shadow(0 0 4px #ffeb3b)" />

      {/* Carved Nose (Mũi) */}
      <polygon points="60,60 65,68 55,68" fill="url(#fireGrad)" filter="drop-shadow(0 0 3px #ffeb3b)" />

      {/* Carved Jagged Mouth with Teeth (Miệng răng cưa rùng rợn) */}
      <path
        d="M36 78 Q45 88 60 88 Q75 88 84 78 Q78 83 74 77 Q70 85 60 85 Q50 85 46 77 Q42 83 36 78 Z"
        fill="url(#fireGrad)"
        filter="drop-shadow(0 0 6px #ff9800)"
      />
    </svg>
  </div>
);

// Spiderweb Accent in top corners
const SpiderWeb: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="0.8"
    className={`absolute top-0 ${side === 'left' ? 'left-0' : 'right-0 -scale-x-100'} w-24 h-24 text-orange-400/20 pointer-events-none`}
  >
    <path d="M0,0 L100,0 M0,0 L0,100 M0,0 L100,100 M0,0 L70,100 M0,0 L100,70 M0,0 L40,100 M0,0 L100,40" />
    <path d="M20,0 Q20,20 0,20 M40,0 Q40,40 0,40 M60,0 Q60,60 0,60 M80,0 Q80,80 0,80" />
  </svg>
);

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullyExited, setIsFullyExited] = useState(false);

  useEffect(() => {
    // Auto curtain reveal timing
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 1600); // 1.6s of Halloween spectacle

    const exitTimer = setTimeout(() => {
      setIsFullyExited(true);
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  const handleManualOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      setIsFullyExited(true);
      onComplete();
    }, 1000);
  };

  if (isFullyExited) return null;

  return (
    <div
      onClick={handleManualOpen}
      className="fixed inset-0 z-[9999] pointer-events-auto cursor-pointer select-none overflow-hidden bg-black"
    >
      {/* ========================================================================= */}
      {/* 1. LEFT VELVET CURTAIN (Kéo rèm sang trái) */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isOpen ? '-100%' : 0 }}
        transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#09050e] border-r border-orange-500/30 overflow-hidden shadow-[30px_0_60px_rgba(0,0,0,0.95)] z-20"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 80% 50%, rgba(255, 115, 0, 0.09) 0%, transparent 65%),
            linear-gradient(90deg, #050208 0%, #0d0617 70%, #150921 100%)
          `,
        }}
      >
        <SpiderWeb side="left" />

        {/* Velvet Folds */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-around">
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-black/70 to-transparent" />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-black/80 to-transparent" />
        </div>

        {/* Glowing Orange Seam */}
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-orange-400 to-transparent shadow-[0_0_15px_#f97316]" />

        {/* Flying Bats Silhouette Left */}
        <motion.div
          animate={{ x: [-15, 35, -15], y: [15, -25, 15], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 pointer-events-none"
        >
          <svg width="42" height="25" viewBox="0 0 24 24" fill="currentColor" className="text-orange-400/50">
            <path d="M12 4c-1.5 2-4 3-7 1 0 4 3 7 7 10 4-3 7-6 7-10-3 2-5.5 1-7-1z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. RIGHT VELVET CURTAIN (Kéo rèm sang phải) */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isOpen ? '100%' : 0 }}
        transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#09050e] border-l border-orange-500/30 overflow-hidden shadow-[-30px_0_60px_rgba(0,0,0,0.95)] z-20"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(255, 115, 0, 0.09) 0%, transparent 65%),
            linear-gradient(270deg, #050208 0%, #0d0617 70%, #150921 100%)
          `,
        }}
      >
        <SpiderWeb side="right" />

        {/* Velvet Folds */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-around">
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-black/80 to-transparent" />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-black/70 to-transparent" />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>

        {/* Glowing Orange Seam */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-orange-400 to-transparent shadow-[0_0_15px_#f97316]" />

        {/* Flying Bats Silhouette Right */}
        <motion.div
          animate={{ x: [20, -30, 20], y: [-20, 20, -20], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 pointer-events-none"
        >
          <svg width="34" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-violet-400/50">
            <path d="M12 4c-1.5 2-4 3-7 1 0 4 3 7 7 10 4-3 7-6 7-10-3 2-5.5 1-7-1z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. CENTERPIECE: HALLOWEEN JACK-O'-LANTERN & BOISCALES MASCOT LOGO */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(14px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-4"
          >
            {/* Spooky Harvest Moon & Eerie Purple-Orange Fog */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 120, 0, 0.4) 0%, rgba(168, 85, 247, 0.28) 45%, transparent 70%)',
                  filter: 'blur(60px)',
                }}
              />

              {/* Floating Pumpkin & Chameleon Composition */}
              <div className="relative flex items-end justify-center gap-3">
                {/* Central Mascot Chameleon */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center"
                >
                  <img
                    src={chameleonLogo}
                    alt="Boiscales Mascot"
                    className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(255,115,0,0.5)]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                {/* Carved Glowing Halloween Jack-o'-Lantern Pumpkin (Trái Bí Ngô Halloween Phát Sáng) */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
                  transition={{
                    scale: { duration: 0.5, delay: 0.15 },
                    rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 -ml-5 -mb-2 relative z-20"
                >
                  <JackOLantern />
                </motion.div>
              </div>
            </div>

            {/* Clean Brand Title */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.25em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] uppercase">
                BOISCALES
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
