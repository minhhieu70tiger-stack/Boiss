import React, { useState } from 'react';
import { MediaItem, ImageSettings, EnhancePreset, EnhanceSettings, ImageStudioTab } from '../types';
import { DropzoneFolder } from './DropzoneFolder';
import { MetricsDashboard } from './MetricsDashboard';
import { ComparisonSlider } from './ComparisonSlider';
import { compressImage } from '../utils/imageCompressor';
import { enhanceImageClarity } from '../utils/imageEnhancer';
import { formatBytes, downloadBlob, createZipBundle } from '../utils/fileHelpers';
import confetti from 'canvas-confetti';
import {
  Download,
  Trash2,
  Play,
  CheckCircle2,
  RefreshCw,
  FolderArchive,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Layers,
  Wand2,
  Focus,
  FileText,
  UserCheck,
  Maximize2,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ImageStudioViewProps {
  items: MediaItem[];
  setItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  onAddFiles: (files: { file: File; path?: string }[]) => void;
}

const ENHANCE_PRESETS: {
  id: EnhancePreset;
  name: string;
  desc: string;
  tag: string;
  icon: any;
  settings: Partial<EnhanceSettings>;
}[] = [
  {
    id: 'ai_smart_clarity',
    name: 'Tự động làm nét',
    desc: 'Phù hợp mọi loại ảnh, tự động làm ảnh nét đẹp và trong trẻo',
    tag: 'Khuyên dùng',
    icon: Wand2,
    settings: { sharpness: 120, clarity: 60, deblurStrength: 50, denoise: 25, vibrance: 10, upscaleFactor: 1 },
  },
  {
    id: 'portrait_micro_detail',
    name: 'Khuôn mặt & Chân dung',
    desc: 'Làm rõ nét mặt, ánh mắt, nụ cười. Rất tốt cho ảnh gia đình, ảnh kỷ niệm, ảnh cũ',
    tag: 'Ảnh người',
    icon: UserCheck,
    settings: { sharpness: 115, clarity: 70, deblurStrength: 45, denoise: 35, vibrance: 15, upscaleFactor: 1 },
  },
  {
    id: 'text_document_sharp',
    name: 'Chữ viết & Giấy tờ',
    desc: 'Làm rõ chữ cho ảnh chụp hóa đơn, sách, tài liệu scan, đơn thuốc, chữ bị mờ',
    tag: 'Hóa đơn & Tài liệu',
    icon: FileText,
    settings: { sharpness: 180, clarity: 95, deblurStrength: 75, denoise: 50, vibrance: 0, upscaleFactor: 1 },
  },
  {
    id: 'deblur_restore',
    name: 'Khử mờ & Rung tay',
    desc: 'Khôi phục ảnh bị rung tay khi chụp, ảnh bị out nét hoặc mờ do chuyển động',
    tag: 'Ảnh mờ rung',
    icon: Focus,
    settings: { sharpness: 160, clarity: 85, deblurStrength: 90, denoise: 30, vibrance: 8, upscaleFactor: 1 },
  },
  {
    id: 'super_resolution_2x',
    name: 'Phóng to rõ nét 2X',
    desc: 'Tăng gấp đôi kích thước ảnh mà không bị vỡ hình, giữ chi tiết sắc nét',
    tag: 'Phóng to',
    icon: Maximize2,
    settings: { sharpness: 130, clarity: 65, deblurStrength: 60, denoise: 25, vibrance: 10, upscaleFactor: 2 },
  },
];

export const ImageStudioView: React.FC<ImageStudioViewProps> = ({
  items,
  setItems,
  onAddFiles,
}) => {
  const [activeTab, setActiveTab] = useState<ImageStudioTab>('enhance');
  const [comparingItem, setComparingItem] = useState<MediaItem | null>(null);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState<ImageSettings>({
    activeTab: 'enhance',
    mode: 'ai_auto',
    targetFormat: 'auto',
    quality: 0.82,
    maxWidth: 0,
    maxHeight: 0,
    preserveExif: false,
    smartDither: true,
    smartSharpen: true,
    aiPerceptualCutoff: true,
    enhancement: {
      enabled: true,
      preset: 'ai_smart_clarity',
      sharpness: 120,
      clarity: 60,
      deblurStrength: 50,
      denoise: 25,
      vibrance: 10,
      upscaleFactor: 1,
    },
  });

  const imageItems = items.filter((i) => i.type === 'image');
  const pendingItems = imageItems.filter((i) => i.status === 'pending');
  const completedItems = imageItems.filter((i) => i.status === 'completed');

  const applyEnhancePreset = (presetId: EnhancePreset) => {
    const p = ENHANCE_PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    setSettings((prev) => ({
      ...prev,
      enhancement: {
        ...prev.enhancement,
        preset: presetId,
        ...p.settings,
      },
    }));
  };

  const processSingleItem = async (item: MediaItem, customMode?: 'compress' | 'enhance') => {
    const mode = customMode || (activeTab === 'compress' ? 'compress' : 'enhance');

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'processing', progress: 10 } : i))
    );

    try {
      let result: Partial<MediaItem>;
      if (mode === 'enhance') {
        result = await enhanceImageClarity(item, settings.enhancement, (progress) => {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, progress } : i))
          );
        });
      } else {
        result = await compressImage(item, settings, (progress) => {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, progress } : i))
          );
        });
      }

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, ...result } : i))
      );
    } catch (err: any) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: 'error', errorMessage: err.message || 'Lỗi xử lý ảnh' }
            : i
        )
      );
    }
  };

  const processAll = async () => {
    setIsProcessingAll(true);
    const toProcess = imageItems.filter((i) => i.status === 'pending' || i.status === 'error');

    for (const item of toProcess) {
      await processSingleItem(item);
    }

    setIsProcessingAll(false);
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const handleDownloadAllZip = async () => {
    if (completedItems.length === 0) return;
    try {
      setIsZipping(true);
      const zipBlob = await createZipBundle(completedItems, (p) => setZipProgress(p));
      downloadBlob(zipBlob, `Anh_Da_Lam_Net_${Date.now()}.zip`);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  const handleClearAll = () => {
    setItems((prev) => prev.filter((i) => i.type !== 'image'));
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
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
              Công cụ làm nét ảnh dễ dùng
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-tight">
            Làm Nét Ảnh Nhanh & Đơn Giản
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Phục hồi ảnh mờ, khử rung tay, làm rõ nét mặt và tài liệu chỉ với 1 lần bấm. Xử lý trực tiếp trên máy, hoàn toàn an toàn và riêng tư.
          </p>
        </div>

        {/* Global Tab Switcher */}
        <div className="flex items-center bg-[#101014] p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveTab('enhance')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'enhance'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Làm Nét Ảnh</span>
          </button>

          <button
            onClick={() => setActiveTab('compress')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'compress'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Nén Dung Lượng</span>
          </button>
        </div>
      </div>

      {/* Easy 3-Step Guide for Seniors and Beginners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-[#0C0C10] p-4 sm:p-5 rounded-3xl border border-white/5">
        <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.02]">
          <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
            1
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Chọn ảnh cần làm nét</h4>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              Bấm nút chọn ảnh bên dưới hoặc kéo thả ảnh vào khung.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.02]">
          <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
            2
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Chọn kiểu ảnh</h4>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              Chọn &quot;Tự động&quot;, &quot;Khuôn mặt&quot; hoặc &quot;Chữ viết&quot; tùy theo ảnh của bạn.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.02]">
          <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-sm shrink-0">
            3
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Bấm làm nét & Tải về</h4>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              Bấm nút &quot;Làm Nét Ngay&quot; và bấm Tải ảnh về máy khi hoàn tất.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Selection */}
      {activeTab === 'enhance' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-violet-400" />
              <span>Bước 2: Chọn kiểu làm nét phù hợp với ảnh của bạn</span>
            </h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs text-zinc-400 hover:text-violet-300 flex items-center gap-1 font-medium transition-colors cursor-pointer py-1 px-2.5 rounded-lg bg-zinc-900 border border-white/5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showSettings ? 'Ẩn cài đặt nâng cao' : 'Cài đặt nâng cao'}</span>
              {showSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ENHANCE_PRESETS.map((p) => {
              const Icon = p.icon;
              const isSelected = settings.enhancement.preset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => applyEnhancePreset(p.id)}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'bg-violet-950/40 border-violet-500/80 shadow-lg shadow-violet-500/15 ring-2 ring-violet-500/40'
                      : 'bg-[#0E0E12] border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl border flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-violet-600 text-white border-violet-400 shadow-md'
                        : 'bg-zinc-900 border-white/10 text-zinc-400 group-hover:text-violet-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                        {p.name}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isSelected
                          ? 'bg-violet-500/20 text-violet-200 border border-violet-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Advanced Fine-Tuning Drawer */}
      {showSettings && (
        <div className="bg-[#0D0D0E] rounded-3xl p-6 border border-white/10 flex flex-col gap-5 animate-in fade-in slide-in-from-top-3 duration-300 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-violet-400" />
              <span>Bảng điều khiển thông số kỹ thuật (Dành cho người dùng nâng cao)</span>
            </h4>
          </div>

          {activeTab === 'enhance' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Sharpness slider */}
              <div className="flex flex-col gap-2 bg-[#121217] p-3.5 rounded-2xl border border-white/5">
                <div className="flex justify-between text-xs font-medium text-zinc-300">
                  <span>Độ sắc nét (Sharpness):</span>
                  <span className="text-violet-400 font-mono font-bold">{settings.enhancement.sharpness}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  step={5}
                  value={settings.enhancement.sharpness}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enhancement: { ...settings.enhancement, sharpness: parseInt(e.target.value), preset: 'custom' },
                    })
                  }
                  className="h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <span className="text-[10px] text-zinc-500">Tăng độ nét viền cạnh của ảnh</span>
              </div>

              {/* Clarity / Micro-contrast */}
              <div className="flex flex-col gap-2 bg-[#121217] p-3.5 rounded-2xl border border-white/5">
                <div className="flex justify-between text-xs font-medium text-zinc-300">
                  <span>Chi tiết vi mô (Clarity):</span>
                  <span className="text-violet-400 font-mono font-bold">{settings.enhancement.clarity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={settings.enhancement.clarity}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enhancement: { ...settings.enhancement, clarity: parseInt(e.target.value), preset: 'custom' },
                    })
                  }
                  className="h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <span className="text-[10px] text-zinc-500">Cân bằng tương phản thích ứng (CLAHE)</span>
              </div>

              {/* Deblur Strength */}
              <div className="flex flex-col gap-2 bg-[#121217] p-3.5 rounded-2xl border border-white/5">
                <div className="flex justify-between text-xs font-medium text-zinc-300">
                  <span>Khử nhòe (Deblur):</span>
                  <span className="text-violet-400 font-mono font-bold">{settings.enhancement.deblurStrength}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={settings.enhancement.deblurStrength}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enhancement: { ...settings.enhancement, deblurStrength: parseInt(e.target.value), preset: 'custom' },
                    })
                  }
                  className="h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <span className="text-[10px] text-zinc-500">Khôi phục độ sắc nét của ảnh bị mờ rung</span>
              </div>

              {/* Denoise */}
              <div className="flex flex-col gap-2 bg-[#121217] p-3.5 rounded-2xl border border-white/5">
                <div className="flex justify-between text-xs font-medium text-zinc-300">
                  <span>Lọc nhiễu hạt (Denoise):</span>
                  <span className="text-violet-400 font-mono font-bold">{settings.enhancement.denoise}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={settings.enhancement.denoise}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enhancement: { ...settings.enhancement, denoise: parseInt(e.target.value), preset: 'custom' },
                    })
                  }
                  className="h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <span className="text-[10px] text-zinc-500">Làm mịn vùng nhiễu hạt</span>
              </div>

              {/* Vibrance */}
              <div className="flex flex-col gap-2 bg-[#121217] p-3.5 rounded-2xl border border-white/5">
                <div className="flex justify-between text-xs font-medium text-zinc-300">
                  <span>Độ tươi màu (Vibrance):</span>
                  <span className="text-violet-400 font-mono font-bold">+{settings.enhancement.vibrance}%</span>
                </div>
                <input
                  type="range"
                  min={-30}
                  max={50}
                  step={5}
                  value={settings.enhancement.vibrance}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enhancement: { ...settings.enhancement, vibrance: parseInt(e.target.value), preset: 'custom' },
                    })
                  }
                  className="h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <span className="text-[10px] text-zinc-500">Tăng độ bão hòa màu sắc tự nhiên</span>
              </div>

              {/* Upscale Factor */}
              <div className="flex flex-col gap-2 bg-[#121217] p-3.5 rounded-2xl border border-white/5">
                <label className="text-xs font-medium text-zinc-300">Tỉ lệ phóng to:</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[1, 2, 4].map((scale) => (
                    <button
                      key={scale}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          enhancement: { ...settings.enhancement, upscaleFactor: scale as any },
                        })
                      }
                      className={`py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        settings.enhancement.upscaleFactor === scale
                          ? 'bg-violet-600 text-white shadow-md'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {scale}X {scale === 1 ? '(Gốc)' : scale === 2 ? 'HD' : '4K'}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500">Nội suy và tái tạo chi tiết</span>
              </div>
            </div>
          ) : (
            /* Compression Settings */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium">Chế độ nén:</label>
                <select
                  value={settings.mode}
                  onChange={(e) => setSettings({ ...settings, mode: e.target.value as any })}
                  className="bg-[#111112] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
                >
                  <option value="ai_auto">Tự động tối ưu</option>
                  <option value="lossless_balanced">Cân bằng chất lượng</option>
                  <option value="ultra_compress">Nén dung lượng tối đa</option>
                  <option value="pixel_perfect">Chất lượng cao nhất</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium">Định dạng đích:</label>
                <select
                  value={settings.targetFormat}
                  onChange={(e) => setSettings({ ...settings, targetFormat: e.target.value as any })}
                  className="bg-[#111112] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
                >
                  <option value="auto">Auto (Tự chọn WebP tối ưu)</option>
                  <option value="webp">WebP (Tiết kiệm dung lượng)</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG (Giữ độ trong suốt)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-zinc-400 font-medium">
                  <span>Chất lượng:</span>
                  <span className="text-violet-400 font-mono">{Math.round(settings.quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={1.0}
                  step={0.02}
                  value={settings.quality}
                  disabled={settings.mode === 'ai_auto'}
                  onChange={(e) => setSettings({ ...settings, quality: parseFloat(e.target.value) })}
                  className="h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500 disabled:opacity-40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-medium">Kích thước tối đa:</label>
                <select
                  value={settings.maxWidth}
                  onChange={(e) => setSettings({ ...settings, maxWidth: parseInt(e.target.value) })}
                  className="bg-[#111112] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
                >
                  <option value={0}>Giữ nguyên độ phân giải gốc</option>
                  <option value={3840}>Giới hạn 4K (3840px)</option>
                  <option value={2560}>Giới hạn 2K (2560px)</option>
                  <option value={1920}>Giới hạn Full HD (1920px)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Actions Banner */}
      {imageItems.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-950/40 via-[#101015] to-[#101015] p-5 rounded-3xl border border-violet-500/20 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Đã thêm <span className="text-violet-300 font-bold">{imageItems.length} bức ảnh</span>
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {pendingItems.length > 0
                  ? `Có ${pendingItems.length} ảnh đang chờ làm nét`
                  : 'Tất cả ảnh đã được xử lý xong!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {pendingItems.length > 0 && (
              <button
                onClick={processAll}
                disabled={isProcessingAll}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isProcessingAll ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>
                  {isProcessingAll
                    ? 'Đang làm nét...'
                    : activeTab === 'enhance'
                    ? `BẤM ĐỂ LÀM NÉT (${pendingItems.length} ẢNH)`
                    : `BẤM ĐỂ NÉN (${pendingItems.length} ẢNH)`}
                </span>
              </button>
            )}

            {completedItems.length > 0 && (
              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <FolderArchive className="w-4 h-4" />
                <span>
                  {isZipping ? `Đang nén ZIP (${zipProgress}%)...` : `Tải Tất Cả Ảnh Về Máy (${completedItems.length})`}
                </span>
              </button>
            )}

            <button
              onClick={handleClearAll}
              className="p-3.5 rounded-2xl bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-white/5 transition-all cursor-pointer"
              title="Xóa danh sách ảnh"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal Overlay */}
      {comparingItem && comparingItem.compressedUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl my-auto animate-in zoom-in-95 duration-200">
            <ComparisonSlider
              originalUrl={comparingItem.originalUrl}
              compressedUrl={comparingItem.compressedUrl}
              originalSize={comparingItem.originalSize}
              compressedSize={comparingItem.compressedSize}
              ssim={comparingItem.ssimScore}
              psnr={comparingItem.psnrScore}
              perceptualScore={comparingItem.perceptualScore}
              fileName={comparingItem.name}
              isEnhanced={comparingItem.compressedFormat.includes('ENHANCED')}
              onClose={() => setComparingItem(null)}
            />
          </div>
        </div>
      )}

      {/* Dropzone for folder & batch import */}
      <DropzoneFolder
        onFilesAdded={onAddFiles}
        acceptType="image"
        title="Thêm ảnh mờ nhòe cần làm nét hoặc nén dung lượng"
        subtitle="Kéo thả ảnh vào đây hoặc bấm nút Chọn ảnh bên dưới • Xử lý cực nhanh trên máy"
        isCompact={imageItems.length > 0}
      />

      {/* Items Table Queue */}
      {imageItems.length > 0 && (
        <div className="bg-[#0A0A0D] rounded-3xl overflow-hidden border border-white/10 flex flex-col shadow-2xl relative">
          <div className="p-5 bg-[#101014] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span>Danh Sách Ảnh</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">
                    {imageItems.length} ảnh
                  </span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Bấm &quot;Xem thử&quot; để so sánh ảnh trước và sau, hoặc bấm &quot;Tải về&quot; để lưu ảnh vào máy
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#0E0E12]/80 backdrop-blur text-zinc-400 font-medium border-b border-white/5">
                <tr>
                  <th className="py-4 px-5">Tên Ảnh & Dung Lượng</th>
                  <th className="py-4 px-4 font-mono">Kích Thước (Pixel)</th>
                  <th className="py-4 px-4">Trạng Thái</th>
                  <th className="py-4 px-4">Đánh Giá Chi Tiết</th>
                  <th className="py-4 px-5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {imageItems.map((item) => {
                  const isDone = item.status === 'completed';
                  const isWorking = item.status === 'processing';
                  const ext = item.name.split('.').pop()?.toUpperCase() || 'IMG';
                  const isEnhanced = item.compressedFormat?.includes('ENHANCED');

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* File Name & Thumbnail */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 flex-shrink-0 flex items-center justify-center group-hover:border-violet-500/40 transition-colors shadow-md">
                            <img
                              src={item.compressedUrl || item.originalUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono font-bold px-1 rounded bg-black/80 text-zinc-300 border border-white/10 uppercase">
                              {ext}
                            </span>
                          </div>

                          <div className="max-w-[220px] sm:max-w-xs flex flex-col gap-1">
                            <p className="font-medium text-white truncate text-sm group-hover:text-violet-200 transition-colors" title={item.name}>
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                              <span>
                                {formatBytes(item.originalSize)}
                              </span>
                              {item.folderPath && (
                                <span className="truncate text-violet-400/80">
                                  📁 {item.folderPath}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Dimensions */}
                      <td className="py-4 px-4 font-mono text-xs text-zinc-300">
                        {item.compressedDimensions ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-400">
                              {item.originalDimensions?.width}×{item.originalDimensions?.height}
                            </span>
                            {item.compressedDimensions.width !== item.originalDimensions?.width && (
                              <>
                                <ArrowRight className="w-3 h-3 text-violet-400" />
                                <span className="text-violet-300 font-bold">
                                  {item.compressedDimensions.width}×{item.compressedDimensions.height} px
                                </span>
                              </>
                            )}
                          </div>
                        ) : item.originalDimensions ? (
                          <span>{item.originalDimensions.width} × {item.originalDimensions.height} px</span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* Status / Output Size */}
                      <td className="py-4 px-4 font-mono">
                        {isDone ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {isEnhanced ? 'Đã làm nét' : `Đã nén -${item.compressionRatio}%`}
                            </span>
                          </div>
                        ) : isWorking ? (
                          <div className="flex items-center gap-2 text-violet-300 font-mono bg-violet-500/10 px-3 py-1 rounded-lg border border-violet-500/20 w-fit text-xs">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-400" />
                            <span>Đang làm nét {item.progress}%</span>
                          </div>
                        ) : (
                          <span className="text-zinc-500 text-xs">Chờ làm nét</span>
                        )}
                      </td>

                      {/* Clarity Metric */}
                      <td className="py-4 px-4">
                        {isDone ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-violet-300 text-xs">
                              {item.perceptualScore}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              Độ nét {(item.ssimScore * 100).toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isDone && (
                            <>
                              <button
                                onClick={() => setComparingItem(item)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-violet-600/20 text-zinc-200 hover:text-violet-200 border border-white/10 hover:border-violet-500/30 transition-all text-xs font-medium cursor-pointer"
                                title="So sánh ảnh trước và sau khi làm nét"
                              >
                                <Eye className="w-4 h-4 text-violet-400" />
                                <span>Xem thử</span>
                              </button>

                              <button
                                onClick={() =>
                                  item.compressedBlob &&
                                  downloadBlob(
                                    item.compressedBlob,
                                    `${item.name.replace(/\.[^/.]+$/, '')}_lam_net.png`
                                  )
                                }
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                                title="Tải ảnh này về máy"
                              >
                                <Download className="w-4 h-4" />
                                <span>Tải về</span>
                              </button>
                            </>
                          )}

                          {item.status === 'pending' && (
                            <button
                              onClick={() => processSingleItem(item, activeTab === 'compress' ? 'compress' : 'enhance')}
                              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs tracking-wide flex items-center gap-1.5 shadow-md shadow-violet-600/20 active:scale-95 cursor-pointer"
                              title="Làm nét bức ảnh này"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{activeTab === 'compress' ? 'Nén ngay' : 'Làm nét ngay'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 rounded-xl bg-[#141418] hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer ml-1"
                            title="Xóa tệp này"
                          >
                            <Trash2 className="w-4 h-4" />
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
