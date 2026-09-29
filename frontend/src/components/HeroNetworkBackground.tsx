import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
}

export const HeroNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(249, 115, 22, ',  // orange-500
      'rgba(245, 158, 11, ',  // amber-500
      'rgba(251, 146, 60, ',  // orange-400
      'rgba(234, 88, 12, ',   // orange-600
    ];

    let particles: Particle[] = [];

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 32 : 65;
    const maxDistance = isMobile ? 85 : 125;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2 + 1.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          radius,
          baseRadius: radius,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.45 + 0.25,
        });
      }
    };

    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(249, 115, 22, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw mouse interactive connections
      if (mouse.x > 0 && mouse.y > 0) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const lineAlpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(234, 88, 12, ${lineAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Subtle attraction toward mouse
            particles[i].x += dx * 0.008;
            particles[i].y += dy * 0.008;
          }
        }
      }

      // Draw & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Glowing outer halo on some particles
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha * 0.18})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-[720px] pointer-events-none -z-10 overflow-hidden select-none">
      {/* Soft Ambient Core Light */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] lg:w-[1200px] h-[380px] sm:h-[450px] rounded-full bg-gradient-to-b from-orange-100/60 via-amber-50/40 to-transparent blur-3xl" />

      {/* Subtle Math & Quiz Knowledge Glyphs drifting */}
      <span className="absolute top-24 left-[12%] text-orange-400/25 text-2xl font-mono select-none animate-float-slow">
        ?
      </span>
      <span className="absolute top-44 left-[24%] text-amber-400/20 text-xl font-bold select-none animate-float-reverse">
        ✦
      </span>
      <span className="absolute top-32 right-[18%] text-orange-400/25 text-lg font-mono select-none animate-float-slow">
        ∑
      </span>
      <span className="absolute top-56 right-[10%] text-amber-500/20 text-xl font-bold select-none animate-float-reverse">
        ✓
      </span>
      <span className="absolute top-20 right-[32%] text-orange-300/30 text-sm font-semibold select-none animate-float-slow">
        100%
      </span>
      <span className="absolute top-64 left-[8%] text-amber-400/20 text-base font-mono select-none animate-float-reverse">
        [A]
      </span>

      {/* HTML5 Dynamic AI Knowledge Network Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full [mask-image:linear-gradient(to_bottom,black_60%,transparent_98%)]"
      />
    </div>
  );
};

export default HeroNetworkBackground;
