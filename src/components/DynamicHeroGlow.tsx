import React from 'react';

export const DynamicHeroGlow: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] sm:w-[130%] h-[140%] pointer-events-none -z-10 select-none overflow-visible"
    >
      {/* Soft Clean Violet/Indigo Aura behind Title */}
      <div
        className="absolute inset-0 rounded-full animate-pulse-slow opacity-35"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 48%, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.12) 40%, transparent 75%)',
          filter: 'blur(60px)',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  );
};
