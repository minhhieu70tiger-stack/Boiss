import React, { useState } from 'react';
import { AppView } from '../types';
import { ComparisonSlider } from './ComparisonSlider';
import { DynamicHeroGlow } from './DynamicHeroGlow';
import chameleonLogo from '../assets/images/chameleon_transparent.svg';
import {
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  Video as VideoIcon,
  ShieldCheck,
  Zap,
  Cpu,
  FolderTree,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Gauge,
  Eye,
  Sliders,
  FileCheck2,
} from 'lucide-react';

interface HomeHeroProps {
  onNavigate: (view: AppView) => void;
  onAddFiles: (files: { file: File; path?: string }[], targetStudio?: 'image' | 'video') => void;
}

const REAL_IMAGE_SAMPLES = [
  {
    id: 'yosemite',
    name: 'Thiên Nhiên 4K HDR',
    fileName: 'yosemite_valley_landscape_4k.raw',
    originalUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2000&q=100',
    compressedUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2000&q=65',
    originalSize: 5240000,
    compressedSize: 685000,
    ssim: 0.995,
    psnr: 48.6,
  },
  {
    id: 'tokyo',
    name: 'Đô Thị Tokyo Cyberpunk',
    fileName: 'tokyo_city_night_architecture.png',
    originalUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=100',
    compressedUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=65',
    originalSize: 6420000,
    compressedSize: 840000,
    ssim: 0.993,
    psnr: 46.9,
  },
  {
    id: 'portrait',
    name: 'Chân Dung Studio High-ISO',
    fileName: 'studio_portrait_fine_texture.png',
    originalUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=100',
    compressedUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=65',
    originalSize: 4180000,
    compressedSize: 520000,
    ssim: 0.996,
    psnr: 49.2,
  },
];

export const HomeHero: React.FC<HomeHeroProps> = ({ onNavigate, onAddFiles }) => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const currentSample = REAL_IMAGE_SAMPLES[selectedSampleIndex];

  return (
    <div className="w-full flex flex-col gap-12 sm:gap-20 py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-8">
      {/* 1. Hero Section with Dynamic Animated Lighting Background */}
      <section className="relative flex flex-col items-center text-center max-w-4xl mx-auto gap-6 pt-4 sm:pt-8 pb-4">
        {/* Dynamic Animated Light Engine */}
        <DynamicHeroGlow />

        {/* Clean single badge with Chameleon Mascot */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-violet-500/10 backdrop-blur-md border border-violet-500/20 text-violet-300 text-[11px] sm:text-xs font-medium transition-all hover:bg-violet-500/15 max-w-full text-center">
          <img
            src={chameleonLogo}
            alt="Mascot Icon"
            className="w-4 h-4 sm:w-5 sm:h-5 object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
          <span className="truncate sm:whitespace-normal">Nén thông minh giữ nguyên độ nét • Smart Visual Lossless</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl min-[380px]:text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-tight sm:leading-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] break-words">
          Nén Ảnh &amp; Video{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-violet-300 font-medium drop-shadow-[0_0_35px_rgba(139,92,246,0.4)] inline-block">
            Giữ Trọn Độ Nét
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-300/90 max-w-2xl leading-relaxed drop-shadow-md px-1">
          Thuật toán tối ưu dung lượng dựa trên thị giác mắt người. Tiết kiệm từ <strong className="text-white font-medium">65% đến 88% dung lượng</strong> trong khi vẫn duy trì độ rõ nét của hình ảnh và video.
        </p>

        {/* Image & Video Studio Cards (Simplified from Sub-Engine 01/02) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl pt-2 sm:pt-4">
          {/* Card: Image Studio */}
          <div
            id="card-cta-image-studio"
            onClick={() => onNavigate('image_studio')}
            className="group cursor-pointer relative bg-[#0D0D0E] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-all hover:border-violet-500/30 overflow-hidden flex flex-col justify-between text-left shadow-lg"
          >
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold text-violet-300 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-violet-400" />
                  <span>Ảnh</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-2 group-hover:text-violet-200 transition-colors">
                Làm Nét & Nén Ảnh
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 max-w-sm">
                Khử mờ nhòe, tăng độ tương phản chi tiết (CLAHE), phóng to 2X/4X hoặc nén dung lượng nhanh chóng.
              </p>
            </div>

            <div className="mt-auto py-3 sm:py-4 px-4 border border-zinc-800/80 rounded-xl sm:rounded-2xl flex items-center justify-between group-hover:border-violet-500/30 transition-colors bg-[#111112]/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-violet-400 shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-zinc-300">Vào Studio Ảnh</span>
              </div>
              <ArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>

          {/* Card: Video Studio */}
          <div
            id="card-cta-video-studio"
            onClick={() => onNavigate('video_studio')}
            className="group cursor-pointer relative bg-[#0D0D0E] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-all hover:border-indigo-500/30 overflow-hidden flex flex-col justify-between text-left shadow-lg"
          >
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1">
                  <VideoIcon className="w-3 h-3 text-indigo-400" />
                  <span>Video</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-2 group-hover:text-indigo-200 transition-colors">
                Nén Video
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 max-w-sm">
                Nén video MP4, WebM, MOV mượt mà. Tối ưu dung lượng để dễ dàng chia sẻ qua email, tin nhắn hoặc tải lên web.
              </p>
            </div>

            <div className="mt-auto py-3 sm:py-4 px-4 border border-zinc-800/80 rounded-xl sm:rounded-2xl flex items-center justify-between group-hover:border-indigo-500/30 transition-colors bg-[#111112]/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-indigo-400 shrink-0">
                  <VideoIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-zinc-300">Vào Studio Video</span>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Clean Minimalism Live Telemetry Bar */}
      <section className="w-full max-w-4xl mx-auto bg-[#111112] border border-white/5 rounded-2xl p-4 sm:px-10 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-12 w-full md:w-auto text-center sm:text-left">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Gốc</span>
            <span className="text-base sm:text-2xl font-mono text-white font-semibold">
              1.42 <span className="text-[10px] sm:text-xs text-zinc-500">GB</span>
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-9 bg-zinc-800" />

          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Sau Nén</span>
            <span className="text-base sm:text-2xl font-mono text-violet-400 font-semibold">
              198 <span className="text-[10px] sm:text-xs text-zinc-500">MB</span>
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-9 bg-zinc-800" />

          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Giảm</span>
            <span className="text-base sm:text-2xl font-mono text-emerald-400 font-bold">86.1%</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] tracking-wider uppercase font-semibold text-white">Chế Độ Nén Tự Động</span>
            <span className="text-[10px] text-zinc-400">Giữ nguyên chi tiết mắt nhìn (SSIM &gt; 99%)</span>
          </div>
          <div className="w-11 h-6 bg-violet-600/20 border border-violet-500/40 rounded-full flex items-center px-1 shrink-0">
            <div className="w-4 h-4 bg-violet-400 rounded-full ml-auto shadow-sm shadow-violet-400/50" />
          </div>
        </div>
      </section>

      {/* 3. Interactive Live Quality Demo with Real Photographs */}
      <section className="flex flex-col gap-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] tracking-wider font-semibold text-violet-300 uppercase bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Xem Thử Trực Tiếp • Live Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-white">
            So Sánh Chất Lượng Trước &amp; Sau Nén
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Kéo thanh trượt để so sánh độ sắc nét từng chi tiết vân da, tán lá, ánh sáng ở độ phân giải cao
          </p>

          {/* Sample Selector Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {REAL_IMAGE_SAMPLES.map((sample, idx) => {
              const isSelected = idx === selectedSampleIndex;
              return (
                <button
                  key={sample.id}
                  onClick={() => setSelectedSampleIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-violet-600/30 text-violet-200 border border-violet-500/50 shadow-sm shadow-violet-500/20'
                      : 'bg-[#111112] text-zinc-400 border border-white/5 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {sample.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <ComparisonSlider
            key={currentSample.id}
            originalUrl={currentSample.originalUrl}
            compressedUrl={currentSample.compressedUrl}
            originalSize={currentSample.originalSize}
            compressedSize={currentSample.compressedSize}
            ssim={currentSample.ssim}
            psnr={currentSample.psnr}
            perceptualScore="Mắt thường gần như không phân biệt được"
            fileName={currentSample.fileName}
          />
        </div>
      </section>

      {/* 4. Deep Tech Pillars & Key Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
        {/* Feature 1 */}
        <div className="bg-[#0D0D0E] rounded-3xl p-7 border border-white/5 hover:border-violet-500/30 transition-all flex flex-col gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-medium text-white tracking-tight">
            Nén Thông Minh Theo Thị Giác
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Thuật toán tự động phân tích và loại bỏ các dữ liệu màu mắt người khó phân biệt, giữ trọn vẹn đường nét và độ tương phản của chủ thể.
          </p>
          <ul className="text-xs text-zinc-400 space-y-1.5 mt-auto font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
              Tối ưu bảng màu tự động
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
              Chống gãy màu và giữ chi tiết viền
            </li>
          </ul>
        </div>

        {/* Feature 2 */}
        <div className="bg-[#0D0D0E] rounded-3xl p-7 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FolderTree className="w-5 h-5" />
          </div>
          <h3 className="text-base font-medium text-white tracking-tight">
            Hỗ Trợ Kéo Thả Cả Thư Mục
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Cho phép kéo thả nguyên thư mục lớn chứa hàng trăm ảnh và video nhiều cấp. Xuất thành file ZIP giữ nguyên cấu trúc thư mục ban đầu.
          </p>
          <ul className="text-xs text-zinc-400 space-y-1.5 mt-auto font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Nhận diện thư mục nhiều cấp con
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Tải về file ZIP tiện lợi chỉ 1 chạm
            </li>
          </ul>
        </div>

        {/* Feature 3 */}
        <div className="bg-[#0D0D0E] rounded-3xl p-7 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-medium text-white tracking-tight">
            100% Bảo Mật Trên Trình Duyệt
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Mọi thao tác nén diễn ra trực tiếp trên thiết bị của bạn qua WebAssembly. Dữ liệu không hề gửi lên máy chủ ngoài, an toàn và riêng tư tuyệt đối.
          </p>
          <ul className="text-xs text-zinc-400 space-y-1.5 mt-auto font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Không giới hạn dung lượng tệp tin
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Bảo mật tuyệt đối quyền riêng tư
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Scientific Comparison Benchmark Table */}
      <section className="bg-[#0D0D0E] rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-light text-white flex items-center gap-2">
              <Gauge className="w-5 h-5 text-violet-400" />
              <span>Bảng So Sánh Hiệu Suất Nén</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              So sánh giải pháp Boiscales với các công cụ nén truyền thống
            </p>
          </div>
          <span className="text-[11px] font-mono tracking-wider uppercase font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
            SSIM / PSNR
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111112] text-zinc-400 font-medium border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Tiêu Chí</th>
                <th className="py-3 px-4 text-violet-300 font-bold bg-violet-950/20">Boiscales</th>
                <th className="py-3 px-4 text-zinc-400">Công cụ Web khác</th>
                <th className="py-3 px-4 text-zinc-400">Phần mềm cài đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              <tr>
                <td className="py-3.5 px-4 font-medium text-white">Chất lượng mắt nhìn (Độ nét)</td>
                <td className="py-3.5 px-4 text-violet-300 font-semibold bg-violet-950/10">
                  SSIM &gt; 99% (Giữ chi tiết tốt)
                </td>
                <td className="py-3.5 px-4 text-zinc-400">SSIM ~94% (Dễ bị mờ nét)</td>
                <td className="py-3.5 px-4 text-zinc-400">Cần chỉnh thông số thủ công</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-white">Mức giảm dung lượng</td>
                <td className="py-3.5 px-4 text-emerald-400 font-mono font-semibold bg-violet-950/10">
                  -65% đến -88%
                </td>
                <td className="py-3.5 px-4 text-zinc-400">-50% đến -65%</td>
                <td className="py-3.5 px-4 text-zinc-400">-40% đến -70%</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-white">Cấu trúc thư mục</td>
                <td className="py-3.5 px-4 text-violet-300 font-medium bg-violet-950/10">
                  Giữ nguyên thư mục và cây phân cấp
                </td>
                <td className="py-3.5 px-4 text-zinc-400">Chỉ chọn file đơn lẻ</td>
                <td className="py-3.5 px-4 text-zinc-400">Cần cài đặt phần mềm</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-white">Bảo mật &amp; Quyền riêng tư</td>
                <td className="py-3.5 px-4 text-violet-300 font-medium bg-violet-950/10">
                  Xử lý trực tiếp trên trình duyệt
                </td>
                <td className="py-3.5 px-4 text-zinc-400">Tải lên máy chủ, giới hạn tệp</td>
                <td className="py-3.5 px-4 text-zinc-400">Tùy ứng dụng</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-white">Hỗ trợ Ảnh &amp; Video</td>
                <td className="py-3.5 px-4 text-violet-300 font-medium bg-violet-950/10">
                  Tích hợp đồng thời ảnh và video
                </td>
                <td className="py-3.5 px-4 text-zinc-400">Chỉ hỗ trợ một loại</td>
                <td className="py-3.5 px-4 text-zinc-400">Cần cài các phần mềm riêng</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Spacing bottom before global footer */}
      <div className="h-4" />
    </div>
  );
};
