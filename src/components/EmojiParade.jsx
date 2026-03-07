/* eslint-disable no-unused-vars, react-hooks/purity, react-hooks/immutability, react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
import React, { useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

const EMOJIS = ['ðŸŽ‚', 'ðŸŒ¹', 'ðŸŽˆ', 'â­', 'ðŸ’«', 'ðŸ¦‹', 'ðŸŒ¸', 'ðŸŽ‰', 'âœ¨', 'ðŸ’'];

const GlitterTrail = memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 100; // Expected height of the parade container
    };

    window.addEventListener('resize', resize);
    resize();

    // Spawns particles periodically to simulate a glitter trail behind the emojis
    const spawnParticles = () => {
      // Create a few random particles across the width to simulate the marquee trail
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? '#ffd700' : '#ff6eb4',
          alpha: 1,
          vy: Math.random() * -1 - 0.5, // Float up slightly
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.3) spawnParticles();

      particles.forEach((p, i) => {
        p.alpha -= 0.02;
        p.y += p.vy;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          // Add a little glow
          ctx.shadowBlur = 5;
          ctx.shadowColor = p.color;
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} 
    />
  );
});

export default function EmojiParade() {
  // We duplicate the array to create a seamless infinite marquee
  const paradeItems = [...EMOJIS, ...EMOJIS, ...EMOJIS];

  return (
    <div className="emoji-parade-container">
      <GlitterTrail />
      <div className="emoji-marquee">
        {paradeItems.map((emoji, index) => (
          <motion.div 
            key={index}
            className="parade-emoji interactive"
            whileHover={{ scale: 1.5, rotate: [0, -20, 20, -20, 0] }}
            whileTap={{ scale: 2, rotate: 360 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

