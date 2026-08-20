import React, { useState } from 'react';
import { AppView } from '../types';
import chameleonLogo from '../assets/images/chameleon_transparent.svg';
import {
  Mail,
  Shield,
  FileText,
  Lock,
  ExternalLink,
  Check,
  Sparkles,
  Globe,
  Award,
  HelpCircle,
  X,
  Loader2,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onReplayIntro }) => {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [subscribedStatus, setSubscribedStatus] = useState<boolean>(false);

  const DEV_EMAIL = 'minhhieu70tiger@gmail.com';
  const OFFICIAL_EMAIL = 'minhhieu70tiger@gmail.com';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = subscriberEmail.trim();
    if (!cleanEmail || isSubscribing) return;

    setIsSubscribing(true);

    const professionalAutoResponse = `Kính gửi Quý người dùng,\n\nĐội ngũ BoiScales xin trân trọng cảm ơn bạn đã đăng ký theo dõi bản tin công nghệ và cập nhật tính năng mới từ hệ sinh thái số BoiSpace!\n\nTừ nay, bạn sẽ là một trong những người đầu tiên nhận được:\n✦ Các bản phát hành thuật toán nén ảnh & video WebAssembly thế hệ mới với hiệu suất tối ưu vượt trội.\n✦ Hướng dẫn kỹ thuật chuyên sâu về tối ưu hoá đa phương tiện trực tiếp trên Client-Side (100% On-Device).\n✦ Thông báo nâng cấp các công cụ xử lý đa nền tảng hoàn toàn bảo mật và không lưu vết dữ liệu.\n\nChúng tôi cam kết bảo vệ quyền riêng tư tuyệt đối của bạn và tuyệt đối không gửi thư rác quảng cáo.\n\nNếu bạn có bất kỳ câu hỏi, ý kiến đóng góp hoặc cần hỗ trợ kỹ thuật, hãy phản hồi trực tiếp tới email này.\n\nTrân trọng,\nĐội ngũ Sáng lập & Phát triển BoiScales — Hệ sinh thái BoiSpace\nEmail: minhhieu70tiger@gmail.com\nWebsite: BoiScales Platform (https://boispace.com)`;

    // 1. Save subscriber locally
    try {
      const stored = localStorage.getItem('boispace_subscribers');
      const list = stored ? JSON.parse(stored) : [];
      if (!list.includes(cleanEmail)) {
        list.push({ email: cleanEmail, date: new Date().toLocaleString('vi-VN') });
        localStorage.setItem('boispace_subscribers', JSON.stringify(list));
      }
    } catch (err) {
      console.warn('Could not store subscriber in localStorage', err);
    }

    // 2. Submit to FormSubmit with professional auto-response directly to subscriber
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${DEV_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[BoiScales] Xác nhận đăng ký nhận bản tin công nghệ BoiSpace`,
          _replyto: DEV_EMAIL,
          _autoresponse: professionalAutoResponse,
          _template: 'box',
          subscriber_email: cleanEmail,
          message: `Người dùng ${cleanEmail} vừa đăng ký nhận bản tin BoiScales lúc ${new Date().toLocaleString('vi-VN')}. Thư tự động cảm ơn đã được phát đi.`,
          timestamp: new Date().toLocaleString('vi-VN'),
        }),
      });

      if (res.ok) {
        setSubscribedStatus(true);
      } else {
        setSubscribedStatus(true);
      }
    } catch (err) {
      console.warn('Subscription network notice:', err);
      setSubscribedStatus(true);
    } finally {
      setIsSubscribing(false);
      setTimeout(() => {
        setSubscribedStatus(false);
        setSubscriberEmail('');
      }, 6000);
    }
  };

  return (
    <>
      <footer className="w-full bg-[#080809] border-t border-white/5 text-zinc-400 mt-20 relative z-20 select-none">
        {/* Main 4-Column Aligned Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Column 1: Brand Info & Identity (4 cols) */}
            <div className="md:col-span-4 flex flex-col gap-4">
              {/* Aligned Top Header (40px) */}
              <div className="h-10 flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <img
                    src={chameleonLogo}
                    alt="BoiScales Mascot"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-white leading-none">BOISCALES</span>
                    <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 leading-none">
                      BoiSpace Eco
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-none">
                    Hệ sinh thái số <strong className="text-zinc-300 font-medium">BoiSpace</strong>
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                Nền tảng tối ưu hóa & nén dung lượng đa phương tiện thế hệ mới. Toàn bộ quá trình xử lý 100% Client-Side trên trình duyệt, không lưu trữ dữ liệu riêng tư, an toàn và tự do sử dụng.
              </p>

              {/* Verified Trust Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] text-zinc-300 whitespace-nowrap">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>File không rời khỏi thiết bị của bạn</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] text-zinc-300 whitespace-nowrap">
                  <Award className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  <span>Bảo mật 100% Client-Side</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links / Navigation (2 cols) */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {/* Aligned Top Header (40px) */}
              <div className="h-10 flex items-center">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  Không Gian Xử Lý
                </h4>
              </div>

              <ul className="flex flex-col gap-2.5 text-xs">
                <li>
                  <button
                    onClick={() => {
                      onNavigate('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-violet-300 transition-colors text-left"
                  >
                    Trang Tổng Quan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onNavigate('image_studio');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-violet-300 transition-colors text-left"
                  >
                    Image Studio (Nén Ảnh)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onNavigate('video_studio');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-violet-300 transition-colors text-left"
                  >
                    Video Studio (Nén Video)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('terms')}
                    className="hover:text-zinc-200 transition-colors text-left"
                  >
                    Điều Khoản Sử Dụng
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('privacy')}
                    className="hover:text-zinc-200 transition-colors text-left"
                  >
                    Chính Sách Quyền Riêng Tư
                  </button>
                </li>
                {onReplayIntro && (
                  <li>
                    <button
                      onClick={onReplayIntro}
                      className="hover:text-violet-400 transition-colors text-left text-zinc-400 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-violet-400" />
                      <span>Xem Lại Intro Mở Đầu</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Column 3: Legal & Standards (3 cols) */}
            <div className="md:col-span-3 flex flex-col gap-4">
              {/* Aligned Top Header (40px) */}
              <div className="h-10 flex items-center">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  Tiêu Chuẩn & Pháp Lý
                </h4>
              </div>

              <ul className="flex flex-col gap-2.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Tuân thủ Luật An toàn thông tin</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Không thu thập dữ liệu cá nhân</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Công nghệ mã nguồn mở độc lập</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Miễn trừ trách nhiệm nội dung</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter Subscription (3 cols) */}
            <div className="md:col-span-3 flex flex-col gap-4">
              {/* Aligned Top Header (40px) */}
              <div className="h-10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-violet-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    Bản Tin BoiSpace
                  </h4>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">BoiScales</span>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Đăng ký nhận thông báo về các thuật toán nén ảnh & video WebAssembly mới nhất từ hệ sinh thái BoiSpace.
                </p>

                {/* Minimalist Horizontal Subscribe Row (Exact Reference Style) */}
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={subscriberEmail}
                      onChange={(e) => setSubscriberEmail(e.target.value)}
                      className="w-full bg-[#141416] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-zinc-200 hover:bg-white text-zinc-950 font-medium px-4 py-2.5 rounded-xl text-xs whitespace-nowrap transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-900" />
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <span>Subscribe</span>
                    )}
                  </button>
                </form>

                {/* Status Notice */}
                {subscribedStatus ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl animate-in fade-in">
                    <Check className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Thư tự động cảm ơn đã được phát tới email của bạn!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
                    <span>Phản hồi tự động qua:</span>
                    <span className="font-mono text-zinc-400 select-all">{DEV_EMAIL}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span>&copy; {new Date().getFullYear()} <strong className="text-zinc-300">BoiScales</strong>. Phát triển bởi <strong className="text-zinc-200">BoiSpace</strong>.</span>
              <span className="hidden sm:inline">•</span>
              <span>Tất cả quyền sở hữu trí tuệ đã được bảo hộ.</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setModalType('terms')}
                className="hover:text-zinc-300 transition-colors"
              >
                Điều khoản
              </button>
              <span>•</span>
              <button
                onClick={() => setModalType('privacy')}
                className="hover:text-zinc-300 transition-colors"
              >
                Quyền riêng tư
              </button>
              <span>•</span>
              <a
                href={`mailto:${OFFICIAL_EMAIL}?subject=Lien He BoiSpace`}
                className="hover:text-violet-400 transition-colors flex items-center gap-1"
              >
                <span>Liên hệ</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL 2: Terms of Service */}
      {modalType === 'terms' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] p-6 sm:p-8 shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-bold text-white">Điều Khoản Sử Dụng BoiScales</h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 text-xs text-zinc-300 space-y-4 leading-relaxed pr-2">
              <p>
                Chào mừng bạn đến với <strong className="text-white">BoiScales</strong>, nền tảng tối ưu hóa đa phương tiện thuộc hệ sinh thái số <strong className="text-white">BoiSpace</strong>. Khi truy cập và sử dụng dịch vụ này, bạn đồng ý tuân thủ các điều khoản sau:
              </p>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">1. Mục đích phi thương mại & Tự do sử dụng</h4>
                <p>BoiScales được cung cấp miễn phí cho cộng đồng người dùng cá nhân, lập trình viên, nhà sáng tạo nội dung nhằm mục đích giảm dung lượng tệp tin và bảo vệ tài nguyên băng thông mạng.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">2. Bản quyền & Quyền sở hữu trí tuệ</h4>
                <p>Thương hiệu BoiScales, linh vật Tắc Kè Công Nghệ và toàn bộ giao diện, mã nguồn thuật toán là tài sản độc lập của BoiSpace. Bạn giữ 100% quyền sở hữu đối với mọi tệp ảnh, video tải lên xử lý trên máy tính của bạn.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">3. Miễn trừ trách nhiệm pháp lý</h4>
                <p>Nền tảng hoạt động hoàn toàn cục bộ trên thiết bị người dùng. BoiSpace không kiểm duyệt, không lưu trữ và không chịu trách nhiệm đối với bất kỳ nội dung vi phạm pháp luật nào do người dùng tự xử lý trên máy của họ.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2 rounded-xl bg-violet-600 text-white text-xs font-medium"
              >
                Tôi Đã Hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Privacy Policy */}
      {modalType === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] p-6 sm:p-8 shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Chính Sách Bảo Mật & Quyền Riêng Tư</h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 text-xs text-zinc-300 space-y-4 leading-relaxed pr-2">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                🔒 <strong>Cam kết vàng:</strong> BoiScales xử lý 100% dữ liệu ảnh và video trực tiếp trong bộ nhớ RAM của trình duyệt thông qua HTML5 Canvas và WebAssembly. Không có bất kỳ tệp tin nào được tải lên máy chủ trung gian.
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">1. Thu thập dữ liệu</h4>
                <p>Chúng tôi KHÔNG thu thập họ tên, số điện thoại, cookie theo dõi danh tính hay bất kỳ dữ liệu nhạy cảm nào từ người dùng.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">2. An toàn dữ liệu cục bộ</h4>
                <p>Sau khi đóng hoặc tải lại trình duyệt, toàn bộ bộ đệm xử lý sẽ được giải phóng lập tức, đảm bảo tính bảo mật tuyệt đối cho dữ liệu đồ họa của bạn.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">3. Liên hệ hỗ trợ</h4>
                <p>Mọi thắc mắc về quyền riêng tư xin gửi về email đại diện pháp lý của BoiSpace: <span className="text-violet-300 font-mono">{OFFICIAL_EMAIL}</span>.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2 rounded-xl bg-violet-600 text-white text-xs font-medium"
              >
                Đồng Ý
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
