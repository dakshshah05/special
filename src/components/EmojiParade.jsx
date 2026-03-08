import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const emojis = ['🎂', '🌹', '🎈', '⭐', '💫', '🦋', '🌸', '🎉', '✨', '💝'];

export default function EmojiParade() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 100;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.color = color;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animateTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const emojiElements = document.querySelectorAll('.marching-emoji');
      emojiElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const parentRect = canvas.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = (rect.top + rect.height / 2) - parentRect.top;
        
        if (Math.random() > 0.5) {
          particles.push(new Particle(x, y, '#ffd700'));
        }
      });

      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateTrail);
    };
    animateTrail();

    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleClick = (e) => {
    const el = e.currentTarget;
    gsap.to(el, {
      rotate: 360,
      scale: 2,
      duration: 0.5,
      ease: 'back.out(2)',
      onComplete: () => {
        gsap.to(el, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
             // Re-spawn or just keep it popped? Let's just reset
             setTimeout(() => {
               gsap.set(el, { scale: 1, opacity: 1, rotate: 0 });
             }, 2000);
          }
        });
      }
    });
  };

  return (
    <div className="emoji-parade-container" style={{
      position: 'relative',
      height: '100px',
      width: '100%',
      overflow: 'hidden',
      background: 'transparent',
      marginTop: '-50px'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      />
      <div className="emoji-track" style={{
        display: 'flex',
        gap: '40px',
        position: 'absolute',
        bottom: '20px',
        animation: 'march 20s linear infinite'
      }}>
        {[...emojis, ...emojis].map((emoji, i) => (
          <span
            key={i}
            className="marching-emoji"
            onClick={handleClick}
            style={{
              fontSize: '2rem',
              cursor: 'pointer',
              display: 'inline-block',
              animation: `emoji-bounce ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
