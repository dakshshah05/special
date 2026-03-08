import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function EnhancedCursor() {
  const canvasRef = useRef(null);
  const blobRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState('default'); 
  const hearts = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      const targets = document.querySelectorAll('.magnetic-target, button, a, .interactive');
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

      lastMousePos.current = { x: e.clientX + pullX, y: e.clientY + pullY };

      gsap.to(blobRef.current, {
        x: lastMousePos.current.x,
        y: lastMousePos.current.y,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    const handleClick = (e) => {
        for (let i = 0; i < 8; i++) { // Reduced count
            const angle = (Math.PI * 2 / 8) * i;
            const velocity = 3 + Math.random() * 3;
            hearts.current.push({
                x: e.clientX,
                y: e.clientY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: 10 + Math.random() * 8,
                life: 1,
                rotation: Math.random() * Math.PI,
                color: '#ff6eb4'
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrame;
    const render = () => {
      if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth;
      if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dist = Math.hypot(mousePos.current.x - lastMousePos.current.x, mousePos.current.y - lastMousePos.current.y);
      if (dist > 5) {
          hearts.current.push({
              x: mousePos.current.x,
              y: mousePos.current.y,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              size: 5 + Math.random() * 10,
              life: 1,
              rotation: Math.random() * Math.PI,
              color: '#ff6eb4'
          });
      }

      hearts.current = hearts.current.filter(h => h.life > 0.02);
      hearts.current.forEach(h => {
        h.x += h.vx;
        h.y += h.vy;
        h.life -= 0.02;
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

      animationFrame = requestAnimationFrame(render);
    };
    
    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="heart-trail-canvas" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }} />
      <div className="cursor-blob-container" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100000 }}>
        <div ref={blobRef} style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          background: '#ff6eb4',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.8,
          boxShadow: '0 0 15px #ff6eb4'
        }} />
      </div>
    </>
  );
}
