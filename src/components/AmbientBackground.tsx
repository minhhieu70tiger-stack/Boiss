import React, { useEffect, useRef } from 'react';

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  hue: number;
  wobbleSpeed: number;
  wobbleOffset: number;
}

interface Bat {
  x: number;
  y: number;
  speed: number;
  scale: number;
  wingPhase: number;
  angle: number;
  alpha: number;
}

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const emberCount = isMobile ? 22 : 45;
    const connectionDistance = isMobile ? 70 : 110;

    // 1. Initialize Halloween Floating Embers & Spirits
    const embers: Ember[] = [];
    for (let i = 0; i < emberCount; i++) {
      const rand = Math.random();
      // 32: Pumpkin Orange, 48: Amber Gold, 275: Spirit Violet, 150: Ghostly Green
      const hue = rand < 0.45 ? 32 : rand < 0.7 ? 45 : rand < 0.9 ? 275 : 155;
      const baseAlpha = Math.random() * 0.45 + 0.2;

      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.45 + 0.2), // Gently rise upwards like mystical campfire embers
        size: Math.random() * 2 + 1,
        alpha: baseAlpha,
        baseAlpha,
        hue,
        wobbleSpeed: Math.random() * 1.5 + 0.8,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    // 2. Initialize Mini Flying Bats
    const bats: Bat[] = [];
    const batCount = isMobile ? 2 : 4;
    for (let i = 0; i < batCount; i++) {
      bats.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.65), // Mostly in upper sky
        speed: Math.random() * 0.6 + 0.4,
        scale: Math.random() * 0.4 + 0.5,
        wingPhase: Math.random() * Math.PI * 2,
        angle: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.25 + 0.2,
      });
    }

    // Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      mousePos.current.active = true;
    };

    const handleMouseLeave = () => {
      mousePos.current.active = false;
      mousePos.current.x = -1000;
      mousePos.current.y = -1000;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Page Visibility Pause
    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        render(performance.now());
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();

    // Helper: Draw Bat on Canvas
    const drawBat = (ctx: CanvasRenderingContext2D, bat: Bat) => {
      ctx.save();
      ctx.translate(bat.x, bat.y);
      ctx.scale(bat.scale, bat.scale);
      ctx.rotate(bat.angle);

      const wingY = Math.sin(bat.wingPhase) * 6;

      ctx.fillStyle = `rgba(255, 140, 0, ${bat.alpha * 0.8})`;
      ctx.beginPath();
      // Bat body
      ctx.ellipse(0, 0, 3, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bat wings
      ctx.beginPath();
      // Left wing
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-7, -8 + wingY, -16, -2 + wingY);
      ctx.quadraticCurveTo(-10, 4 + wingY, -4, 2);
      ctx.quadraticCurveTo(-2, 4, 0, 0);
      // Right wing
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(7, -8 + wingY, 16, -2 + wingY);
      ctx.quadraticCurveTo(10, 4 + wingY, 4, 2);
      ctx.quadraticCurveTo(2, 4, 0, 0);

      ctx.fillStyle = `rgba(180, 120, 255, ${bat.alpha})`;
      ctx.fill();
      ctx.restore();
    };

    // Render Loop
    const render = (currentTime: number) => {
      if (!isVisible) return;

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      const timeSec = currentTime / 1000;

      ctx.clearRect(0, 0, width, height);

      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const mouseActive = mousePos.current.active;

      // 1. Draw Mouse Jack-o'-Lantern Glow Aura
      if (mouseActive && !isMobile) {
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 180);
        glow.addColorStop(0, 'rgba(255, 115, 0, 0.12)');
        glow.addColorStop(0.4, 'rgba(168, 85, 247, 0.05)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mx, my, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Update & Draw Rising Halloween Embers
      for (let i = 0; i < embers.length; i++) {
        const p = embers[i];

        // Horizontal sinusoidal gentle sway
        const sway = Math.sin(timeSec * p.wobbleSpeed + p.wobbleOffset) * 0.4;
        p.x += (p.vx + sway) * delta * 60;
        p.y += p.vy * delta * 60;

        // Wrap around top -> bottom
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;

        // Mouse interaction
        if (mouseActive) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 0) {
            const force = (130 - dist) / 130;
            p.x += (dx / dist) * force * 1.6;
            p.y += (dy / dist) * force * 1.6;
            p.alpha = Math.min(1, p.baseAlpha + force * 0.5);
          } else {
            p.alpha = p.baseAlpha;
          }
        }

        // Draw glowing ember
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${p.alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, 0.6)`;
        ctx.shadowBlur = p.size * 3;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // Filaments between nearby embers
        for (let j = i + 1; j < embers.length; j++) {
          const p2 = embers[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const lineAlpha = (1 - dist / connectionDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 145, 0, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      // 3. Update & Draw Flying Bats
      for (let k = 0; k < bats.length; k++) {
        const bat = bats[k];
        bat.x += bat.speed * delta * 60;
        bat.y += Math.sin(timeSec * 2 + k) * 0.4;
        bat.wingPhase += delta * 12;

        // Wrap bat screen edges
        if (bat.x > width + 50) {
          bat.x = -50;
          bat.y = Math.random() * (height * 0.6);
        }

        drawBat(ctx, bat);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#050308]"
    >
      {/* 1. Spooky Harvest Moon & Mystic Pumpkin Glow in Upper Center/Right */}
      <div
        className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[500px] sm:h-[650px] rounded-full animate-pulse-slow opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255, 120, 0, 0.28) 0%, rgba(147, 51, 234, 0.16) 40%, rgba(234, 88, 12, 0.04) 65%, transparent 80%)',
          filter: 'blur(90px)',
          willChange: 'transform, opacity',
        }}
      />

      {/* 2. Deep Violet Ambient Ghostly Light (Left) */}
      <div
        className="absolute top-[35%] -left-[10%] w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] rounded-full opacity-25"
        style={{
          background:
            'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(255, 107, 0, 0.08) 50%, transparent 75%)',
          filter: 'blur(100px)',
        }}
      />

      {/* 3. Warm Pumpkin Ember Hearth Glow (Bottom Center) */}
      <div
        className="absolute -bottom-[10%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] sm:h-[450px] rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255, 90, 0, 0.25) 0%, rgba(126, 34, 206, 0.1) 50%, transparent 80%)',
          filter: 'blur(95px)',
        }}
      />

      {/* 4. Top-Right Spiderweb Accent */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        className="absolute top-0 right-0 w-32 h-32 sm:w-44 sm:h-44 text-orange-400/10 pointer-events-none"
      >
        <path d="M100,0 L0,0 M100,0 L100,100 M100,0 L0,100 M100,0 L30,100 M100,0 L0,70 M100,0 L60,100 M100,0 L0,40" />
        <path d="M80,0 Q80,20 100,20 M60,0 Q60,40 100,40 M40,0 Q40,60 100,60 M20,0 Q20,80 100,80" />
      </svg>

      {/* 5. Top-Left Spiderweb Accent */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        className="absolute top-0 left-0 w-32 h-32 sm:w-44 sm:h-44 text-violet-400/10 pointer-events-none -scale-x-100"
      >
        <path d="M100,0 L0,0 M100,0 L100,100 M100,0 L0,100 M100,0 L30,100 M100,0 L0,70 M100,0 L60,100 M100,0 L0,40" />
        <path d="M80,0 Q80,20 100,20 M60,0 Q60,40 100,40 M40,0 Q40,60 100,60 M20,0 Q20,80 100,80" />
      </svg>

      {/* 6. High Performance Interactive HTML5 Canvas (Embers, Bats, Trails) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-85"
      />

      {/* 7. Ultra-fine Star / Stardust Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 180, 50, 0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
};
