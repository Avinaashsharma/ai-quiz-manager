import React, { useEffect, useRef } from 'react';

export const HeroWaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
    };

    // Twinkling AI sparkles
    let sparkles: Array<{
      x: number;
      y: number;
      size: number;
      alpha: number;
      speed: number;
      phase: number;
    }> = [];

    const initSparkles = (w: number, h: number) => {
      sparkles = Array.from({ length: 32 }, () => ({
        x: Math.random() * (w || window.innerWidth),
        y: Math.random() * (h || 600) * 0.75,
        size: Math.random() * 3 + 1.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.008,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resizeCanvas = () => {
      if (!canvas || !container) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const newWidth = rect.width || window.innerWidth;
      const newHeight = rect.height || 750;

      width = newWidth;
      height = newHeight;

      canvas.width = Math.floor(newWidth * dpr);
      canvas.height = Math.floor(newHeight * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (sparkles.length === 0) {
        initSparkles(width, height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Multi-layer flowing fluid waves
    const waves = [
      {
        baseY: 0.52,
        speed: 0.012,
        frequency: 0.0035,
        freq2: 0.007,
        amplitude: 38,
        strokeColor: 'rgba(249, 115, 22, 0.65)',
        fillGradient: [
          [0, 'rgba(249, 115, 22, 0.13)'],
          [1, 'rgba(255, 255, 255, 0)'],
        ],
      },
      {
        baseY: 0.56,
        speed: 0.016,
        frequency: 0.004,
        freq2: 0.0085,
        amplitude: 45,
        strokeColor: 'rgba(245, 158, 11, 0.6)',
        fillGradient: [
          [0, 'rgba(245, 158, 11, 0.12)'],
          [1, 'rgba(255, 255, 255, 0)'],
        ],
      },
      {
        baseY: 0.48,
        speed: 0.009,
        frequency: 0.003,
        freq2: 0.006,
        amplitude: 32,
        strokeColor: 'rgba(251, 146, 60, 0.55)',
        fillGradient: [
          [0, 'rgba(251, 146, 60, 0.1)'],
          [1, 'rgba(255, 255, 255, 0)'],
        ],
      },
      {
        baseY: 0.60,
        speed: 0.02,
        frequency: 0.0045,
        freq2: 0.009,
        amplitude: 42,
        strokeColor: 'rgba(234, 88, 12, 0.45)',
        fillGradient: [
          [0, 'rgba(234, 88, 12, 0.08)'],
          [1, 'rgba(255, 255, 255, 0)'],
        ],
      },
    ];

    let step = 0;

    const render = () => {
      if (width === 0 || height === 0) {
        resizeCanvas();
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      step += 1;

      // Draw Twinkling Sparkles across full width
      for (const sp of sparkles) {
        sp.phase += sp.speed;
        const currentAlpha = (Math.sin(sp.phase) + 1) * 0.5 * 0.5;

        ctx.save();
        ctx.translate(sp.x, sp.y);
        ctx.fillStyle = `rgba(249, 115, 22, ${currentAlpha})`;

        // 4-pointed star
        ctx.beginPath();
        ctx.moveTo(0, -sp.size);
        ctx.quadraticCurveTo(0, 0, sp.size, 0);
        ctx.quadraticCurveTo(0, 0, 0, sp.size);
        ctx.quadraticCurveTo(0, 0, -sp.size, 0);
        ctx.quadraticCurveTo(0, 0, 0, -sp.size);
        ctx.fill();
        ctx.restore();
      }

      // Draw Fluid Waves spanning 100% full width from x = -30 to width + 30
      for (let w = 0; w < waves.length; w++) {
        const wave = waves[w];
        const centerY = height * wave.baseY;

        ctx.beginPath();
        ctx.moveTo(-30, height);

        for (let x = -30; x <= width + 30; x += 6) {
          // Dual sine wave superposition for organic flowing feel
          let y =
            centerY +
            Math.sin(x * wave.frequency + step * wave.speed) * wave.amplitude +
            Math.cos(x * wave.freq2 + step * (wave.speed * 0.7)) * (wave.amplitude * 0.5);

          // Interactive mouse wave disturbance
          if (mouse.x > 0 && mouse.y > 0) {
            const dx = x - mouse.x;
            const dist = Math.abs(dx);
            if (dist < 200) {
              const influence = 1 - dist / 200;
              y += Math.sin(dist * 0.05 - step * 0.05) * influence * 24;
            }
          }

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width + 30, height);
        ctx.closePath();

        // Gradient Fill under wave
        const grad = ctx.createLinearGradient(0, centerY - wave.amplitude, 0, height);
        grad.addColorStop(wave.fillGradient[0][0] as number, wave.fillGradient[0][1] as string);
        grad.addColorStop(wave.fillGradient[1][0] as number, wave.fillGradient[1][1] as string);
        ctx.fillStyle = grad;
        ctx.fill();

        // Wave Glowing Crest Line
        ctx.strokeStyle = wave.strokeColor;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Edge-to-edge full width ambient warm background lighting */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-orange-100/35 via-amber-50/20 to-transparent" />

      {/* Left side ambient soft warm glow */}
      <div className="absolute -top-12 -left-20 w-[45vw] h-[450px] rounded-full bg-gradient-to-br from-orange-200/30 via-amber-100/20 to-transparent blur-3xl pointer-events-none" />

      {/* Right side ambient soft warm glow */}
      <div className="absolute -top-12 -right-20 w-[45vw] h-[450px] rounded-full bg-gradient-to-bl from-amber-200/30 via-orange-100/20 to-transparent blur-3xl pointer-events-none" />

      {/* Center radial warm illumination behind headline */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[70vw] max-w-4xl h-[420px] rounded-full bg-gradient-to-b from-orange-100/50 via-amber-50/25 to-transparent blur-3xl pointer-events-none" />

      {/* Fluid Wave Canvas spanning 100% full screen width */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]"
      />
    </div>
  );
};

export default HeroWaveBackground;
