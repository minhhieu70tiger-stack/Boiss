import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, ZoomIn, Eye, Layers, ArrowLeftRight, CheckCircle2, ShieldCheck, X, Download } from 'lucide-react';
import { formatBytes, downloadBlob } from '../utils/fileHelpers';

interface ComparisonSliderProps {
  originalUrl: string;
  compressedUrl: string;
  originalSize?: number;
  compressedSize?: number;
  ssim?: number;
  psnr?: number;
  perceptualScore?: string;
  fileName?: string;
  isEnhanced?: boolean;
  onClose?: () => void;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalUrl,
  compressedUrl,
  originalSize = 2840000,
  compressedSize = 420000,
  ssim = 0.994,
  psnr = 46.8,
  perceptualScore = 'Chất lượng thị giác tốt',
  fileName = 'so-sanh-chat-luong.png',
  isEnhanced = false,
  onClose,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLoupe, setShowLoupe] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50 });

  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setLoupePos({ x, y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#0D0D0E] border border-white/10 shadow-2xl p-4 sm:p-6 flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <span>{isEnhanced ? 'So Sánh: Ảnh Gốc vs Ảnh Đã Làm Nét' : 'So Sánh: Ảnh Gốc vs Sau Khi Nén'}</span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {isEnhanced ? 'Đã làm nét' : `Độ nét ${(ssim * 100).toFixed(1)}%`}
              </span>
            </h3>
            <p className="text-xs text-zinc-400 truncate max-w-[280px] sm:max-w-md">
              Kéo thanh trượt ở giữa để kiểm tra độ nét của ảnh
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-[#111112] rounded-xl p-1 border border-zinc-800 text-xs">
            <span className="text-[11px] text-zinc-500 px-2">Phóng to:</span>
            {[1, 2].map((scale) => (
              <button
                key={scale}
                onClick={() => setZoomLevel(scale)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  zoomLevel === scale ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {scale}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowLoupe(!showLoupe)}
            className={`px-3 py-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              showLoupe
                ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                : 'bg-[#111112] border-zinc-800 text-zinc-300 hover:bg-white/5'
            }`}
            title="Bật kính lúp soi chi tiết"
          >
            <ZoomIn className="w-4 h-4" />
            <span className="hidden sm:inline">Kính lúp</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Comparison Canvas Stage */}
      <div
        ref={containerRef}
        id="interactive-comparison-stage"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[340px] sm:h-[480px] rounded-2xl overflow-hidden select-none cursor-ew-resize bg-[#050505] border border-white/10"
      >
        {/* Compressed / Enhanced (Right / Base) Image */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: `${sliderPos}% 50%`,
          }}
        >
          <img
            src={compressedUrl}
            alt="Processed Version"
            className="w-full h-full object-contain pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Label Enhanced / Compressed */}
          <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-violet-950/90 backdrop-blur-md border border-violet-500/40 text-xs font-semibold text-violet-200 shadow-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            <span>{isEnhanced ? `Ảnh Đã Làm Nét (${formatBytes(compressedSize)})` : `Sau Khi Nén (${formatBytes(compressedSize)})`}</span>
          </div>
        </div>

        {/* Original (Left / Clipped Overlay) Image */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{
            width: `${sliderPos}%`,
          }}
        >
          <div
            className="absolute inset-0 h-full flex items-center justify-center overflow-hidden"
            style={{
              width: `${containerWidth}px`,
              transform: `scale(${zoomLevel})`,
              transformOrigin: `${sliderPos}% 50%`,
            }}
          >
            <img
              src={originalUrl}
              alt="Original Raw Version"
              className="w-full h-full object-contain pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Label Original */}
          <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-zinc-200 shadow-lg">
            <span>{isEnhanced ? `Ảnh Gốc Ban Đầu (${formatBytes(originalSize)})` : `Ảnh Gốc (${formatBytes(originalSize)})`}</span>
          </div>
        </div>

        {/* Draggable Vertical Slider Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.8)] cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          <div className="w-9 h-9 rounded-full bg-violet-600 border-2 border-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform">
            <ArrowLeftRight className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Loupe Floating Magnifier Overlay */}
        {showLoupe && (
          <div
            className="absolute z-30 pointer-events-none w-44 h-44 rounded-full border-2 border-violet-400 shadow-2xl overflow-hidden bg-black"
            style={{
              left: `calc(${loupePos.x}% - 88px)`,
              top: `calc(${loupePos.y}% - 88px)`,
              backgroundImage: `url(${sliderPos > loupePos.x ? originalUrl : compressedUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '400%',
              backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
            }}
          >
            <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-mono text-violet-300 bg-black/80 py-0.5">
              400% Zoom {sliderPos > loupePos.x ? '(Ảnh Gốc)' : '(Ảnh Đã Làm Nét)'}
            </div>
          </div>
        )}
      </div>

      {/* Simple Information HUD & Download Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111112] rounded-2xl p-4 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {perceptualScore}
            </p>
            <p className="text-xs text-zinc-400">
              Độ nét đạt {(ssim * 100).toFixed(1)}% • Mọi chi tiết và viền ảnh đều được làm rõ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={compressedUrl}
            download={`${fileName.replace(/\.[^/.]+$/, '')}_lam_net.png`}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Tải Ảnh Đã Làm Nét Về Máy</span>
          </a>
        </div>
      </div>
    </div>
  );
};
