import React from 'react';
import { AppView } from '../types';
import { Image as ImageIcon, Video as VideoIcon, Home } from 'lucide-react';
import chameleonLogo from '../assets/images/chameleon_transparent.svg';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  imageQueueCount: number;
  videoQueueCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  imageQueueCount,
  videoQueueCount,
}) => {
  return (
    <header className="sticky top-2 sm:top-5 z-50 w-full max-w-5xl mx-auto px-2 sm:px-6 transition-all duration-300">
      <div className="w-full bg-[#0D0D0E]/95 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black/90 px-2.5 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4 select-none">
        {/* Brand Logo with Crisp Chameleon Mascot */}
        <div
          id="brand-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <img
              src={chameleonLogo}
              alt="Boiscales Chameleon Mascot"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-sm sm:text-lg font-bold tracking-tight text-white group-hover:text-violet-200 transition-colors hidden min-[360px]:inline-block">
            BOISCALES
          </span>
        </div>

        {/* Center / Right Symmetrical Navigation Pills */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-[#111112] p-1 rounded-full border border-white/5 shrink-0">
          <button
            id="nav-tab-home"
            onClick={() => onNavigate('home')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 min-h-[34px] sm:min-h-[38px] ${
              currentView === 'home'
                ? 'bg-white/15 text-white border border-white/15 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Trang Tổng quan"
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Tổng quan</span>
          </button>

          <button
            id="nav-tab-image-studio"
            onClick={() => onNavigate('image_studio')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 min-h-[34px] sm:min-h-[38px] ${
              currentView === 'image_studio'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Image Studio - Nén Ảnh"
          >
            <ImageIcon className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="hidden min-[480px]:inline">Image</span>
            {imageQueueCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {imageQueueCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-video-studio"
            onClick={() => onNavigate('video_studio')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 min-h-[34px] sm:min-h-[38px] ${
              currentView === 'video_studio'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Video Studio - Nén Video"
          >
            <VideoIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="hidden min-[480px]:inline">Video</span>
            {videoQueueCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {videoQueueCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
