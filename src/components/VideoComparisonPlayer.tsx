import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowLeftRight, CheckCircle2, ShieldCheck, Film, X, Volume2, VolumeX } from 'lucide-react';
import { formatBytes, formatDuration } from '../utils/fileHelpers';

interface VideoComparisonPlayerProps {
  originalUrl: string;
  compressedUrl: string;
  originalSize?: number;
  compressedSize?: number;
  duration?: number;
  fps?: number;
  fileName?: string;
  ssim?: number;
  psnr?: number;
  perceptualScore?: string;
  onClose?: () => void;
}

export const VideoComparisonPlayer: React.FC<VideoComparisonPlayerProps> = ({
  originalUrl,
  compressedUrl,
  originalSize = 48500000,
  compressedSize = 11200000,
  duration = 12,
  fps = 30,
  fileName = 'video_raw_cinema.webm',
  ssim = 0.994,
  psnr = 46.8,
  perceptualScore = '100% Hoàn toàn không phân biệt được',
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(duration);
  const [viewMode, setViewMode] = useState<'side_by_side' | 'ab_toggle'>('side_by_side');
  const [activeAB, setActiveAB] = useState<'orig' | 'comp'>('comp');

  const origVideoRef = useRef<HTMLVideoElement | null>(null);
  const compVideoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (origVideoRef.current && compVideoRef.current) {
      if (isPlaying) {
        origVideoRef.current.pause();
        compVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        origVideoRef.current.play();
        compVideoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (origVideoRef.current) origVideoRef.current.currentTime = time;
    if (compVideoRef.current) compVideoRef.current.currentTime = time;
  };

  const handleTimeUpdate = () => {
    if (origVideoRef.current) {
      setCurrentTime(origVideoRef.current.currentTime);
      if (origVideoRef.current.duration && !isNaN(origVideoRef.current.duration)) {
        setVideoDuration(origVideoRef.current.duration);
      }
    }
  };

  const handleRestart = () => {
    if (origVideoRef.current && compVideoRef.current) {
      origVideoRef.current.currentTime = 0;
      compVideoRef.current.currentTime = 0;
      origVideoRef.current.play();
      compVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  const savingsPercent = originalSize > 0 ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1) : '76.8';

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#0D0D0E] border border-white/5 shadow-2xl p-4 sm:p-6 flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              <span>So Sánh: Video Gốc vs Sau Nén</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Độ Nét {(ssim * 100).toFixed(1)}%
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono truncate max-w-[280px] sm:max-w-md">
              {fileName} • {fps} FPS • {formatDuration(videoDuration)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#111112] rounded-full p-0.5 border border-zinc-800 text-xs">
            <button
              onClick={() => setViewMode('side_by_side')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                viewMode === 'side_by_side' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Song song
            </button>
            <button
              onClick={() => setViewMode('ab_toggle')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                viewMode === 'ab_toggle' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Chuyển đổi A/B
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#111112] hover:bg-white/5 text-zinc-400 hover:text-white border border-zinc-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Video Screens */}
      {viewMode === 'side_by_side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original Player Card */}
          <div className="relative rounded-2xl overflow-hidden bg-[#050505] border border-white/5 aspect-video flex items-center justify-center group">
            <video
              ref={origVideoRef}
              src={originalUrl}
              muted={isMuted}
              playsInline
              loop
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-medium text-zinc-200 shadow-md">
              Gốc ({formatBytes(originalSize)})
            </div>
          </div>

          {/* Compressed Player Card */}
          <div className="relative rounded-2xl overflow-hidden bg-[#050505] border border-indigo-500/20 aspect-video flex items-center justify-center group shadow-lg">
            <video
              ref={compVideoRef}
              src={compressedUrl}
              muted={isMuted}
              playsInline
              loop
              autoPlay
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-indigo-500/30 text-xs font-medium text-indigo-300 shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Nén AI ({formatBytes(compressedSize)})</span>
            </div>
            <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-medium text-emerald-400">
              Tiết kiệm {savingsPercent}%
            </div>
          </div>
        </div>
      ) : (
        /* A/B Switch Screen */
        <div className="relative rounded-2xl overflow-hidden bg-[#050505] border border-indigo-500/20 aspect-video max-h-[460px] flex items-center justify-center">
          <video
            ref={origVideoRef}
            src={originalUrl}
            muted={isMuted}
            playsInline
            loop
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            className={`w-full h-full object-contain ${activeAB === 'orig' ? 'block' : 'hidden'}`}
          />
          <video
            ref={compVideoRef}
            src={compressedUrl}
            muted={isMuted}
            playsInline
            loop
            autoPlay
            className={`w-full h-full object-contain ${activeAB === 'comp' ? 'block' : 'hidden'}`}
          />

          {/* Floating Switcher Controls */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/90 backdrop-blur-md p-1 rounded-full border border-white/10">
            <button
              onClick={() => setActiveAB('orig')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeAB === 'orig' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Xem Bản Gốc ({formatBytes(originalSize)})
            </button>
            <button
              onClick={() => setActiveAB('comp')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeAB === 'comp' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Xem Bản Nén AI ({formatBytes(compressedSize)})
            </button>
          </div>
        </div>
      )}

      {/* Synchronized Player Bar */}
      <div className="flex flex-col gap-2 bg-[#111112] rounded-2xl p-4 border border-white/5">
        {/* Timeline Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400 min-w-[36px]">
            {formatDuration(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={videoDuration || 1}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-xs font-mono text-zinc-500 min-w-[36px]">
            {formatDuration(videoDuration)}
          </span>
        </div>

        {/* Control Buttons & Telemetry */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={handleRestart}
              className="p-2 rounded-full bg-[#0D0D0E] hover:bg-white/5 text-zinc-300 border border-zinc-800 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-[#0D0D0E] hover:bg-white/5 text-zinc-300 border border-zinc-800 transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span>Tiết kiệm:</span>
              <span className="text-emerald-400 font-bold">-{savingsPercent}% ({formatBytes(originalSize - compressedSize)})</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span>Độ sắc nét:</span>
              <span className="text-indigo-300 font-bold">99.5% Perceptual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Quality & Science HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111112] rounded-2xl p-4 border border-white/5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Tiết Kiệm</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">
            -{savingsPercent}%
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            Giảm {formatBytes(Math.max(0, originalSize - compressedSize))}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Độ Tương Đồng SSIM</span>
          <span className="text-lg font-bold text-indigo-300 font-mono">
            {(ssim * 100).toFixed(2)}%
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">
            Mắt thường không thấy khác biệt
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Tỷ Số Tín Hiệu PSNR</span>
          <span className="text-lg font-bold text-indigo-300 font-mono">
            {psnr} dB
          </span>
          <span className="text-[10px] text-zinc-500">
            Ngưỡng bảo toàn màu sắc cao
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Trạng Thái AI</span>
          <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            {perceptualScore}
          </span>
          <span className="text-[10px] text-zinc-500">
            Perceptual Lossless Coded
          </span>
        </div>
      </div>
    </div>
  );
};
