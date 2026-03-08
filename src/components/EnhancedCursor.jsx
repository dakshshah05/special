import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

export default function EnhancedCursor() {
  const canvasRef = useRef(null);
  const blobRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState('default'); // 'default', 'crown', 'magnify', 'flame'
  const hearts = useRef([]);
  const lastTime = useRef(0);

  // Magnetic Targets handling
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Magnetic pull logic
      const targets = document.querySelectorAll('.magnetic-target, button, a, .interactive');
      let targetPos = { x: e.clientX, y: e.clientY };
      let pullX = 0;
      let pullY = 0;

      targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        
        if (dist < 100) {
          const force = (100 - dist) / 100;
          pullX = (centerX - e.clientX) * force * 0.5;
          pullY = (centerY - e.clientY) * force * 0.5;
        }
      });

      lastMousePos.current = { 
        x: e.clientX + pullX, 
        y: e.clientY + pullY 
      };

      // State check
      const hoveredEl = document.elementFromPoint(e.clientX, e.clientY);
      if (hoveredEl) {
          if (hoveredEl.textContent === 'Shariya' || hoveredEl.closest('.hero-title')) setCursorState('crown');
          else if (hoveredEl.closest('.carousel-image-wrapper')) setCursorState('magnify');
          else if (hoveredEl.closest('.cake-section')) setCursorState('flame');
          else setCursorState('default');
      }

      // GSAP move blob
      gsap.to(blobRef.current, {
        x: lastMousePos.current.x,
        y: lastMousePos.current.y,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    const handleClick = (e) => {
        // Radial burst
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i;
            const velocity = 5 + Math.random() * 5;
            hearts.current.push({
                x: e.clientX,
                y: e.clientY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: 15 + Math.random() * 10,
                life: 1,
                rotation: Math.random() * Math.PI,
                color: `hsl(${340 + Math.random() * 20}, 100%, 70%)`
            });
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('click', handleClick);
    };
  }, []);

  // Canvas Animation loop for Heart Trail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const render = (time) => {
      const delta = time - lastTime.current;
      lastTime.current = time;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add hearts based on movement
      const dist = Math.hypot(
          mousePos.current.x - lastMousePos.current.x,
          mousePos.current.y - lastMousePos.current.y
      );
      if (dist > 2) {
          const density = Math.min(5, Math.floor(dist / 10) + 1);
          for (let i = 0; i < density; i++) {
              hearts.current.push({
                  x: mousePos.current.x + (Math.random() - 0.5) * 10,
                  y: mousePos.current.y + (Math.random() - 0.5) * 10,
                  vx: (Math.random() - 0.5) * 1,
                  vy: (Math.random() - 0.5) * 1,
                  size: 6 + Math.random() * 12,
                  life: 1,
                  rotation: (Math.random() - 0.5) * 60 * (Math.PI / 180),
                  color: hearts.current.length % 3 === 0 ? 'var(--rose-pink)' : 
                         hearts.current.length % 3 === 1 ? 'var(--starlight-gold)' : 'var(--lavender-glow)'
              });
          }
      }

      // Update and Draw hearts
      hearts.current = hearts.current.filter(h => h.life > 0.01);
      hearts.current.forEach(h => {
        h.x += h.vx;
        h.y += h.vy;
        h.life -= 0.015; // ~1.5s total life
        h.rotation += 0.01;
        
        ctx.globalAlpha = h.life;
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);
        ctx.font = `${h.size}px serif`;
        ctx.fillStyle = h.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❤️', 0, 0);
        ctx.restore();
      });

      requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="heart-trail-canvas" />
      
      <div className="cursor-blob-container">
        <div ref={blobRef} style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          background: 'var(--rose-pink)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          filter: 'blur(5px)',
          opacity: 0.8,
          boxShadow: '0 0 20px var(--rose-pink)'
        }}>
          {cursorState === 'crown' && '👑'}
          {cursorState === 'magnify' && '🔍'}
          {cursorState === 'flame' && '🔥'}
        </div>
      </div>

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
    </>
  );
}
