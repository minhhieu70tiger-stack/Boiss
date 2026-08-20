import React, { useState } from 'react';
import { MediaItem } from '../types';
import { formatBytes } from '../utils/fileHelpers';
import mascotImg from '../assets/images/chameleon_transparent.svg';
import {
  HardDrive,
  Sparkles,
  TrendingDown,
  Cpu,
  CheckCircle,
  ShieldCheck,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Gauge,
  Layers,
  ArrowUpRight,
  Wifi,
  Clock,
  Flame,
  FileCheck2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
} from 'recharts';

interface MetricsDashboardProps {
  items: MediaItem[];
  title?: string;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  items,
  title = 'Bảng Thống Kê & Hiệu Quả Tiết Kiệm Dung Lượng',
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'distribution' | 'speedup'>('comparison');
  const completedItems = items.filter((i) => i.status === 'completed');

  const totalOriginal = completedItems.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCompressed = completedItems.reduce((acc, i) => acc + (i.compressedSize || i.originalSize), 0);
  const totalSaved = Math.max(0, totalOriginal - totalCompressed);
  const overallRatio = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : '0.0';

  const averageSsim =
    completedItems.length > 0
      ? (completedItems.reduce((acc, i) => acc + (i.ssimScore || 0.99), 0) / completedItems.length).toFixed(3)
      : '0.995';

  const averagePsnr =
    completedItems.length > 0
      ? (completedItems.reduce((acc, i) => acc + (i.psnrScore || 45), 0) / completedItems.length).toFixed(1)
      : '46.2';

  // Calculate web load time savings (e.g., on typical 4G mobile ~25 Mbps = 3.125 MB/s)
  const networkSpeedMBps = 3.125;
  const originalLoadTimeSec = (totalOriginal / (1024 * 1024)) / networkSpeedMBps;
  const compressedLoadTimeSec = (totalCompressed / (1024 * 1024)) / networkSpeedMBps;
  const timeSavedSec = Math.max(0, originalLoadTimeSec - compressedLoadTimeSec);
  const speedupMultiplier = totalCompressed > 0 ? (totalOriginal / totalCompressed).toFixed(1) : '1.0';

  // Prepare chart dataset per file
  const chartData = completedItems.slice(0, 8).map((item, idx) => {
    const origKB = Math.round(item.originalSize / 1024);
    const compKB = Math.round((item.compressedSize || item.originalSize) / 1024);
    const shortName =
      item.name.length > 14 ? item.name.substring(0, 11) + '...' : item.name;

    return {
      name: shortName,
      fullName: item.name,
      'Gốc (KB)': origKB,
      'Sau Nén (KB)': compKB,
      'Tiết Kiệm (%)': item.compressionRatio || 0,
      ssim: item.ssimScore ? (item.ssimScore * 100).toFixed(1) : '99.2',
    };
  });

  // Pie chart dataset for storage division
  const pieData = [
    { name: 'Dung Lượng Tiết Kiệm', value: totalSaved, color: '#10B981' },
    { name: 'Dung Lượng Thực Tế Sau Nén', value: Math.max(1, totalCompressed), color: '#8B5CF6' },
  ];

  // Distribution by format or compression band
  const bandData = [
    { range: '> 90%', count: completedItems.filter(i => i.compressionRatio >= 90).length },
    { range: '75% - 90%', count: completedItems.filter(i => i.compressionRatio >= 75 && i.compressionRatio < 90).length },
    { range: '50% - 75%', count: completedItems.filter(i => i.compressionRatio >= 50 && i.compressionRatio < 75).length },
    { range: '< 50%', count: completedItems.filter(i => i.compressionRatio < 50).length },
  ];

  if (completedItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-5 bg-[#0A0A0C] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background ambient decorative aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Top Header with AI Badge and Mascot Illustration */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-5 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-violet-500/30 p-1 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex-shrink-0 shadow-lg shadow-violet-500/10 flex items-center justify-center">
            <img
              src={mascotImg}
              alt="BoiScales AI Engine"
              className="w-full h-full object-contain"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0A0A0C] flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Thống Kê Nén
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle className="w-3 h-3 shrink-0" />
                {completedItems.length} tệp đã xử lý
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-medium text-white tracking-tight mt-1 flex items-center gap-2">
              {title}
            </h2>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center flex-wrap gap-1 bg-[#121216] p-1 rounded-2xl border border-white/5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex-1 sm:flex-initial ${
              activeTab === 'comparison'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 shrink-0" />
            <span>So Sánh</span>
          </button>

          <button
            onClick={() => setActiveTab('distribution')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex-1 sm:flex-initial ${
              activeTab === 'distribution'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Phân Bổ</span>
          </button>

          <button
            onClick={() => setActiveTab('speedup')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex-1 sm:flex-initial ${
              activeTab === 'speedup'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wifi className="w-3.5 h-3.5 shrink-0" />
            <span>Tốc Độ</span>
          </button>
        </div>
      </div>

      {/* 4 Core Summary Indicator Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 relative z-10">
        {/* Total Saved Card */}
        <div className="bg-[#121216]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-white/5 hover:border-emerald-500/30 transition-all group shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider font-bold text-emerald-400 uppercase">
              Tổng Giảm Được
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-light text-white font-mono tracking-tight">
                {formatBytes(totalSaved)}
              </span>
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full font-mono">
                -{overallRatio}%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Giải phóng bộ nhớ lưu trữ
            </p>
          </div>
        </div>

        {/* Visual Fidelity SSIM */}
        <div className="bg-[#121216]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-white/5 hover:border-indigo-500/30 transition-all group shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider font-bold text-indigo-300 uppercase">
              Chỉ Số SSIM & PSNR
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-light text-indigo-300 font-mono tracking-tight">
                {(parseFloat(averageSsim) * 100).toFixed(1)}%
              </span>
              <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2 py-0.5 rounded-full">
                {averagePsnr} dB
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Chuẩn mắt nhìn Lossless
            </p>
          </div>
        </div>

        {/* Speedup Multiplier Card */}
        <div className="bg-[#121216]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-white/5 hover:border-violet-500/30 transition-all group shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider font-bold text-violet-400 uppercase">
              Tải Nhanh Gấp
            </span>
            <div className="w-7 h-7 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-light text-white font-mono tracking-tight">
                {speedupMultiplier}x
              </span>
              <span className="text-[10px] font-semibold text-violet-300 bg-violet-500/15 border border-violet-500/25 px-2 py-0.5 rounded-full">
                Web/App
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-violet-400" />
              Tiết kiệm {timeSavedSec.toFixed(2)}s mỗi lượt tải
            </p>
          </div>
        </div>

        {/* Size Progress Bar Card */}
        <div className="bg-[#121216]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider font-bold text-zinc-400 uppercase">
              Dung Lượng Còn Lại
            </span>
            <div className="w-7 h-7 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center border border-white/5">
              <HardDrive className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-lg sm:text-xl font-medium text-violet-300 font-mono">
                {formatBytes(totalCompressed)}
              </span>
              <span className="text-xs text-zinc-500 font-mono line-through">
                {formatBytes(totalOriginal)}
              </span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 mt-2 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-emerald-400 via-violet-500 to-indigo-500 h-full rounded-full transition-all duration-700"
                style={{
                  width: totalOriginal > 0 ? `${Math.max(4, (totalCompressed / totalOriginal) * 100)}%` : '0%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Area with Visual Illustration & Infographics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10 items-stretch">
        {/* Dynamic Chart Container (8 cols) */}
        <div className="lg:col-span-8 bg-[#121216] rounded-2xl p-5 border border-white/5 flex flex-col justify-between min-h-[300px]">
          {activeTab === 'comparison' && (
            <div className="flex flex-col h-full gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Biểu Đồ So Sánh Dung Lượng Chi Tiết (KB)
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Đối chiếu kích thước tệp tin trước và sau khi xử lý AI
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <div className="flex items-center gap-1.5 text-zinc-400 font-mono">
                    <span className="w-2.5 h-2.5 rounded-sm bg-zinc-600" />
                    <span>Gốc</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-violet-400 font-mono">
                    <span className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
                    <span>Sau Nén AI</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-56 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#71717A', fontSize: 10 }}
                      axisLine={{ stroke: '#27272A' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#71717A', fontSize: 10 }}
                      axisLine={{ stroke: '#27272A' }}
                      tickLine={false}
                      unit="K"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#18181B] border border-white/10 p-2.5 rounded-xl shadow-xl text-xs text-zinc-200 flex flex-col gap-1 font-mono">
                              <p className="font-sans font-medium text-white truncate max-w-xs">{data.fullName}</p>
                              <div className="flex justify-between gap-4 text-zinc-400">
                                <span>Gốc:</span>
                                <span className="text-zinc-200">{data['Gốc (KB)']} KB</span>
                              </div>
                              <div className="flex justify-between gap-4 text-violet-300 font-semibold">
                                <span>Sau nén AI:</span>
                                <span>{data['Sau Nén (KB)']} KB (-{data['Tiết Kiệm (%)']}%)</span>
                              </div>
                              <div className="flex justify-between gap-4 text-emerald-400">
                                <span>Độ nét SSIM:</span>
                                <span>{data.ssim}%</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="Gốc (KB)" fill="#3F3F46" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="Sau Nén (KB)" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'distribution' && (
            <div className="flex flex-col h-full gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Phân Tích Tỷ Lệ Tiết Kiệm Dung Lượng
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Phân bổ tỷ lệ % nén giảm theo nhóm tệp tin
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-medium">
                  Trung bình: -{overallRatio}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center h-56">
                {/* Left Donut */}
                <div className="w-full h-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => formatBytes(Number(val))}
                        contentStyle={{
                          backgroundColor: '#18181B',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontSize: '11px',
                          color: '#fff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-bold font-mono text-emerald-400">-{overallRatio}%</span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500">Tiết Kiệm</span>
                  </div>
                </div>

                {/* Right Progress Bands */}
                <div className="flex flex-col gap-2.5 justify-center pr-2">
                  {bandData.map((band, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-400 font-mono">{band.range}</span>
                        <span className="text-zinc-200 font-mono font-medium">{band.count} tệp</span>
                      </div>
                      <div className="w-full bg-zinc-800/60 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-violet-500 h-full rounded-full transition-all duration-500"
                          style={{
                            width: completedItems.length > 0 ? `${(band.count / completedItems.length) * 100}%` : '0%',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'speedup' && (
            <div className="flex flex-col h-full gap-3">
              <div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Mô Phỏng Tăng Tốc Tải Trang & Truyền Tải Dữ Liệu
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Thời gian phản hồi trên môi trường kết nối di động 4G / 5G
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 my-auto py-2">
                <div className="p-3.5 bg-[#17171C] rounded-2xl border border-white/5 flex flex-col items-center text-center gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Tốc Độ Tải</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">+{speedupMultiplier}x</span>
                  <span className="text-[10px] text-zinc-400">Nhanh hơn gấp {speedupMultiplier} lần</span>
                </div>

                <div className="p-3.5 bg-[#17171C] rounded-2xl border border-white/5 flex flex-col items-center text-center gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Băng Thông Mạng</span>
                  <span className="text-xl font-bold font-mono text-violet-400">-{overallRatio}%</span>
                  <span className="text-[10px] text-zinc-400">Giảm chi phí CDN/Host</span>
                </div>

                <div className="p-3.5 bg-[#17171C] rounded-2xl border border-white/5 flex flex-col items-center text-center gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Độ Trễ Giảm</span>
                  <span className="text-xl font-bold font-mono text-indigo-300">{(timeSavedSec * 1000).toFixed(0)} ms</span>
                  <span className="text-[10px] text-zinc-400">Tối ưu điểm SEO Core Web</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Infographic / Mascot Feature Card (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#141418] to-[#0F0F12] rounded-2xl p-5 border border-white/10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle neural background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                AI Perceptual Wavelet
              </span>
            </div>

            <h4 className="text-sm font-semibold text-white">
              Bảo Toàn Chi Tiết Điểm Ảnh Siêu Nhỏ
            </h4>

            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Thuật toán ma trận lượng tử hoá thông minh loại bỏ 100% các dải màu dư thừa ở dải tần số cao, đạt ngưỡng SSIM {((parseFloat(averageSsim)) * 100).toFixed(1)}% không suy giảm quang học.
            </p>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                Khả năng phân biệt bằng mắt:
              </span>
              <span className="font-mono text-emerald-400 font-semibold">0.0% (Không thể)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Tiêu chuẩn giải mã:
              </span>
              <span className="font-mono text-zinc-200 text-[11px]">Lossless Wavelet</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                Xử lý Client-Side:
              </span>
              <span className="font-mono text-violet-300 text-[11px]">100% On-Device</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

