import React, { useEffect, useRef } from 'react';

export const AuraCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouse = {
      x: width * 0.5,
      y: height * 0.45,
      targetX: width * 0.5,
      targetY: height * 0.45,
      isHovered: false
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = width * 0.5;
      mouse.targetY = height * 0.45;
      mouse.isHovered = false;
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Particle nodes for orbital aura effect
    const numParticles = 48;
    const particles = Array.from({ length: numParticles }, (_, i) => {
      const angle = (i / numParticles) * Math.PI * 2;
      const radius = 90 + Math.random() * 110;
      return {
        angle,
        radius,
        baseRadius: radius,
        speed: (Math.random() * 0.008 + 0.004) * (i % 2 === 0 ? 1 : -1),
        size: Math.random() * 2.2 + 1,
        color: i % 3 === 0 ? '#c084fc' : i % 3 === 1 ? '#818cf8' : '#a855f7',
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      };
    });

    let time = 0;

    const render = () => {
      time += 0.02;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const centerX = mouse.x;
      const centerY = mouse.y;

      // 1. Outer Deep Ambient Glow
      const ambientGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.min(width, height) * 0.6
      );
      ambientGradient.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
      ambientGradient.addColorStop(0.35, 'rgba(99, 102, 241, 0.08)');
      ambientGradient.addColorStop(0.7, 'rgba(147, 51, 234, 0.03)');
      ambientGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = ambientGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Core Glowing 3D Aura Sphere
      const sphereRadius = Math.min(width, height) * 0.18;
      const wobble = Math.sin(time * 1.5) * 6;
      const currentRadius = sphereRadius + wobble;

      const sphereGradient = ctx.createRadialGradient(
        centerX - currentRadius * 0.3,
        centerY - currentRadius * 0.3,
        currentRadius * 0.1,
        centerX,
        centerY,
        currentRadius * 1.3
      );
      sphereGradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      sphereGradient.addColorStop(0.2, 'rgba(216, 180, 254, 0.7)');
      sphereGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.45)');
      sphereGradient.addColorStop(0.85, 'rgba(79, 70, 229, 0.15)');
      sphereGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = sphereGradient;
      ctx.fill();

      // 3. Orbiting Geometric Rings
      ctx.save();
      ctx.translate(centerX, centerY);

      // Ring 1
      ctx.rotate(time * 0.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, currentRadius * 1.4, currentRadius * 0.6, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 14]);
      ctx.stroke();

      // Ring 2
      ctx.rotate(-time * 0.35 + 1);
      ctx.beginPath();
      ctx.ellipse(0, 0, currentRadius * 1.65, currentRadius * 0.7, -Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.stroke();

      ctx.restore();

      // 4. Floating Aura Particles & Connection Lines
      particles.forEach((p, idx) => {
        p.angle += p.speed;
        const currentP事Radius = p.baseRadius + Math.sin(time * 2 + p.pulseOffset) * 12;
        const px = centerX + Math.cos(p.angle) * currentP事Radius * 1.2;
        const py = centerY + Math.sin(p.angle) * currentP事Radius * 0.8;

        // Draw particle
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 3 + p.pulseOffset));
        ctx.fill();

        // Connect to nearest neighboring particle
        if (idx % 4 === 0) {
          const nextP = particles[(idx + 1) % particles.length];
          const npx = centerX + Math.cos(nextP.angle) * nextP.baseRadius * 1.2;
          const npy = centerY + Math.sin(nextP.angle) * nextP.baseRadius * 0.8;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(npx, npy);
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.12)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden pointer-events-auto ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
      />
    </div>
  );
};
