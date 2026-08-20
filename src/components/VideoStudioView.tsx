import React, { useState } from 'react';
import { MediaItem, VideoSettings } from '../types';
import { DropzoneFolder } from './DropzoneFolder';
import { MetricsDashboard } from './MetricsDashboard';
import { VideoComparisonPlayer } from './VideoComparisonPlayer';
import { compressVideo } from '../utils/videoCompressor';
import { formatBytes, formatDuration, downloadBlob, createZipBundle } from '../utils/fileHelpers';
import confetti from 'canvas-confetti';
import {
  Film,
  Sliders,
  Download,
  Trash2,
  Play,
  RefreshCw,
  FolderArchive,
  Eye,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Zap,
  Info,
  Check,
  ShieldCheck,
  Cpu,
  Video,
  FileCheck,
} from 'lucide-react';

interface VideoStudioViewProps {
  items: MediaItem[];
  setItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  onAddFiles: (files: { file: File; path?: string }[]) => void;
}

export const VideoStudioView: React.FC<VideoStudioViewProps> = ({
  items,
  setItems,
  onAddFiles,
}) => {
  const [comparingItem, setComparingItem] = useState<MediaItem | null>(null);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState<VideoSettings>({
    mode: 'ai_auto',
    targetResolution: 'original',
    crfLevel: 23,
    frameRate: 'original',
    audioBitrate: 'original',
    format: 'webm',
  });

  const videoItems = items.filter((i) => i.type === 'video');
  const pendingItems = videoItems.filter((i) => i.status === 'pending');
  const completedItems = videoItems.filter((i) => i.status === 'completed');

  const processSingleItem = async (item: MediaItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'processing', progress: 5 } : i))
    );

    try {
      const result = await compressVideo(item, settings, (progress) => {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, progress } : i))
        );
      });

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, ...result } : i))
      );
    } catch (err: any) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: 'error', errorMessage: err.message || 'Lỗi nén video' }
            : i
        )
      );
    }
  };

  const processAll = async () => {
    setIsProcessingAll(true);
    const toProcess = videoItems.filter((i) => i.status === 'pending' || i.status === 'error');

    for (const item of toProcess) {
      await processSingleItem(item);
    }

    setIsProcessingAll(false);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleDownloadAllZip = async () => {
    if (completedItems.length === 0) return;
    try {
      setIsZipping(true);
      const zipBlob = await createZipBundle(completedItems, (p) => setZipProgress(p));
      downloadBlob(zipBlob, `Boiscales_Videos_Optimized_${Date.now()}.zip`);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  const handleClearAll = () => {
    setItems((prev) => prev.filter((i) => i.type !== 'video'));
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Video Studio • Nén Video
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-light text-white tracking-tight">
            Studio Nén Video
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Nén video MP4, WebM, MOV mượt mà. Tự động tối ưu dung lượng giúp truyền tải nhanh mà vẫn giữ độ nét khung hình.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all ${
              showSettings
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-[#111112] border-zinc-800 text-zinc-300 hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tùy Chọn Nén</span>
          </button>

          {videoItems.length > 0 && (
            <>
              <button
                onClick={processAll}
                disabled={isProcessingAll || pendingItems.length === 0}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white px-5 py-2 rounded-full text-xs font-medium tracking-wider uppercase shadow-md shadow-indigo-500/20 transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
              >
                {isProcessingAll ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Nén Toàn Bộ ({pendingItems.length})</span>
              </button>

              {completedItems.length > 0 && (
                <button
                  onClick={handleDownloadAllZip}
                  disabled={isZipping}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-[#111112] hover:bg-white/5 text-indigo-300 text-xs font-medium tracking-wider uppercase transition-all disabled:opacity-50"
                >
                  <FolderArchive className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {isZipping ? `Đang nén ZIP (${zipProgress}%)...` : `Tải Toàn Bộ ZIP (${completedItems.length})`}
                  </span>
                </button>
              )}

              <button
                onClick={handleClearAll}
                className="p-2 rounded-full bg-[#111112] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-all"
                title="Xóa danh sách video"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Advanced Settings Drawer */}
      {showSettings && (
        <div className="bg-[#0D0D0E] rounded-3xl p-6 border border-white/5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>Cấu Hình Nén Video Chuyên Sâu</span>
            </h4>
            <span className="text-[11px] text-zinc-500 font-mono">
              Codec: VP9 / H.264 High Profile
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Video Mode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-medium">Chế độ tối ưu:</label>
              <select
                value={settings.mode}
                onChange={(e) => setSettings({ ...settings, mode: e.target.value as any })}
                className="bg-[#111112] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="ai_auto">Tự động tối ưu</option>
                <option value="cinema_smooth">Chất lượng cao</option>
                <option value="web_fast">Dung lượng nhẹ</option>
                <option value="social_discord">Giới hạn &lt;8MB (Email/Chat)</option>
                <option value="custom">Tùy chỉnh CRF thủ công</option>
              </select>
            </div>

            {/* Resolution Target */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-medium">Độ phân giải mục tiêu:</label>
              <select
                value={settings.targetResolution}
                onChange={(e) => setSettings({ ...settings, targetResolution: e.target.value as any })}
                className="bg-[#111112] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="original">Giữ nguyên gốc (Auto Scale)</option>
                <option value="4k">4K Ultra HD (3840x2160)</option>
                <option value="2k">2K QHD (2560x1440)</option>
                <option value="1080p">Full HD (1920x1080)</option>
                <option value="720p">HD (1280x720)</option>
                <option value="480p">SD (854x480)</option>
              </select>
            </div>

            {/* Frame Rate */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-medium">Tốc độ khung hình (FPS):</label>
              <select
                value={settings.frameRate}
                onChange={(e) => setSettings({ ...settings, frameRate: e.target.value as any })}
                className="bg-[#111112] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="original">Tự động (Giữ nguyên theo nguồn)</option>
                <option value="60">60 FPS (Mượt mà nhất)</option>
                <option value="30">30 FPS (Chuẩn truyền thông)</option>
                <option value="24">24 FPS (Chuẩn điện ảnh cinematic)</option>
              </select>
            </div>

            {/* Audio Profile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-medium">Âm thanh kèm theo:</label>
              <select
                value={settings.audioBitrate}
                onChange={(e) => setSettings({ ...settings, audioBitrate: e.target.value as any })}
                className="bg-[#111112] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="original">Bảo toàn âm thanh gốc (AAC 192k)</option>
                <option value="128k">Tối ưu âm thanh 128 kbps</option>
                <option value="64k">Âm thanh siêu nhẹ 64 kbps</option>
                <option value="mute">Tắt tiếng (Giảm thêm 15% dung lượng)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Summary if files exist */}
      {videoItems.length > 0 && <MetricsDashboard items={videoItems} />}

      {/* Comparison Modal Overlay */}
      {comparingItem && comparingItem.compressedUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl my-auto animate-in zoom-in-95 duration-200">
            <VideoComparisonPlayer
              originalUrl={comparingItem.originalUrl}
              compressedUrl={comparingItem.compressedUrl}
              originalSize={comparingItem.originalSize}
              compressedSize={comparingItem.compressedSize}
              duration={comparingItem.duration}
              fps={comparingItem.fps}
              fileName={comparingItem.name}
              ssim={comparingItem.ssimScore}
              onClose={() => setComparingItem(null)}
            />
          </div>
        </div>
      )}

      {/* Dropzone for folder & batch import */}
      <DropzoneFolder
        onFilesAdded={onAddFiles}
        acceptType="video"
        title="Thêm video hoặc toàn bộ Folder chứa video"
        subtitle="Hỗ trợ MP4, WebM, MOV, MKV, AVI • Tự động giữ nguyên cấu trúc thư mục"
        isCompact={videoItems.length > 0}
      />

      {/* Items Table Queue */}
      {videoItems.length > 0 && (
        <div className="bg-[#0A0A0D] rounded-3xl overflow-hidden border border-white/10 flex flex-col shadow-2xl relative">
          {/* Glowing header bar */}
          <div className="p-5 bg-gradient-to-r from-[#121217] via-[#0E0E12] to-[#121217] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>Bảng Tiến Trình & Thông Số Nén Video</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                    {videoItems.length} video
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Xử lý cục bộ Canvas & WebCodecs VP9 / AV1 High-Profile
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Check className="w-3 h-3" />
                  {completedItems.length} hoàn tất
                </span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400">
                  {pendingItems.length} đang chờ
                </span>
              </div>

              {completedItems.length > 1 && (
                <button
                  onClick={handleDownloadAllZip}
                  disabled={isZipping}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Tải Tất Cả ZIP</span>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#0E0E12]/80 backdrop-blur text-zinc-400 font-medium border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-5">Tệp Tin Video</th>
                  <th className="py-3.5 px-4 font-mono">Dung Lượng Gốc</th>
                  <th className="py-3.5 px-4 font-mono">Sau Nén AI</th>
                  <th className="py-3.5 px-4">Mức Tiết Kiệm</th>
                  <th className="py-3.5 px-4">Độ Nét (SSIM)</th>
                  <th className="py-3.5 px-4">Thời Lượng</th>
                  <th className="py-3.5 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {videoItems.map((item) => {
                  const isDone = item.status === 'completed';
                  const isWorking = item.status === 'processing';
                  const savings = isDone ? item.compressionRatio : 0;
                  const ext = item.name.split('.').pop()?.toUpperCase() || 'VID';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Video File Name & Icon/Thumbnail */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-950 border border-white/10 flex-shrink-0 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/40 transition-colors shadow-md">
                            <Film className="w-5 h-5" />
                            <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono font-bold px-1 rounded bg-black/80 text-zinc-300 border border-white/10 uppercase">
                              {ext}
                            </span>
                          </div>

                          <div className="max-w-[220px] sm:max-w-xs flex flex-col gap-1">
                            <p className="font-medium text-white truncate font-mono text-xs group-hover:text-indigo-200 transition-colors" title={item.name}>
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono flex-wrap">
                              {item.originalDimensions && (
                                <span className="text-zinc-400">
                                  {item.originalDimensions.width} × {item.originalDimensions.height} • {item.fps || 30} FPS
                                </span>
                              )}
                              {item.folderPath && (
                                <span className="truncate text-indigo-400/80">
                                  📁 {item.folderPath}
                                </span>
                              )}
                            </div>

                            {/* Intelligent Adaptive Parameters Badge */}
                            {isDone && item.encodingDetails && (
                              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                                  CRF {item.encodingDetails.crf}
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5">
                                  {item.encodingDetails.motionComplexity === 'high'
                                    ? 'Động nhanh'
                                    : item.encodingDetails.motionComplexity === 'low'
                                    ? 'Tĩnh'
                                    : 'Tiêu chuẩn'}
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-white/5">
                                  {item.encodingDetails.codec.split(' ')[0]} 4:2:0
                                </span>
                                {item.encodingDetails.twoPassApplied && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    2-Pass
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Original Size */}
                      <td className="py-3.5 px-4 font-mono font-medium text-zinc-300">
                        <span className="bg-zinc-900/80 px-2 py-1 rounded-md border border-white/5">
                          {formatBytes(item.originalSize)}
                        </span>
                      </td>

                      {/* Compressed Size */}
                      <td className="py-3.5 px-4 font-mono">
                        {isDone ? (
                          <div className="flex items-baseline gap-1.5 font-medium">
                            <span className="text-indigo-300 font-semibold bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                              {formatBytes(item.compressedSize)}
                            </span>
                            <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                              ({item.compressedFormat})
                            </span>
                          </div>
                        ) : isWorking ? (
                          <div className="flex items-center gap-2 text-indigo-400 font-mono bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                            <span>{item.progress}%</span>
                          </div>
                        ) : (
                          <span className="text-zinc-500 italic">Chờ xử lý</span>
                        )}
                      </td>

                      {/* Savings % */}
                      <td className="py-3.5 px-4">
                        {isDone ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 w-fit shadow-sm">
                              -{savings}%
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              Giảm {formatBytes(Math.max(0, item.originalSize - (item.compressedSize || item.originalSize)))}
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* SSIM & Quality */}
                      <td className="py-3.5 px-4">
                        {isDone ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono font-bold text-indigo-300 text-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                              {(item.ssimScore * 100).toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-zinc-400 truncate max-w-[150px]">
                              {item.perceptualScore || '100% Hoàn toàn không phân biệt được'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 font-mono text-zinc-400">
                        <span className="bg-zinc-900/60 px-2 py-1 rounded-md border border-white/5">
                          {item.duration ? formatDuration(item.duration) : '—'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isDone && (
                            <>
                              <button
                                onClick={() => setComparingItem(item)}
                                className="p-2 rounded-xl bg-[#141418] hover:bg-indigo-600/20 text-zinc-400 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-all shadow-sm active:scale-95 cursor-pointer"
                                title="Mở trình so sánh đồng bộ video"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() =>
                                  item.compressedBlob &&
                                  downloadBlob(
                                    item.compressedBlob,
                                    `${item.name.replace(/\.[^/.]+$/, '')}_boiscales.webm`
                                  )
                                }
                                className="p-2 rounded-xl bg-[#141418] hover:bg-emerald-600/20 text-zinc-400 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 transition-all shadow-sm active:scale-95 cursor-pointer"
                                title="Tải video đã tối ưu về máy"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {item.status === 'pending' && (
                            <button
                              onClick={() => processSingleItem(item)}
                              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                            >
                              Nén
                            </button>
                          )}

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 rounded-xl bg-[#141418] hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all shadow-sm active:scale-95 cursor-pointer"
                            title="Xóa video khỏi danh sách"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
