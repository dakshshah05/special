import React, { useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Global Confetti Burst (for the "20" easter egg)
const EasterEggConfetti = memo(function EasterEggConfetti({ active, onComplete }) {
  useEffect(() => {
    if (active) {
      const t = setTimeout(onComplete, 5000);
      return () => clearTimeout(t);
    }
  }, [active, onComplete]);

  if (!active) return null;

  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: -50,
    tx: (Math.random() - 0.5) * window.innerWidth,
    ty: window.innerHeight + 100,
    color: ['#ff6eb4', '#ffd700', '#e8c4ff', '#ffffff'][i % 4],
    delay: Math.random() * 0.5,
    size: 4 + Math.random() * 8,
    rot: Math.random() * 720 - 360,
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', top: '20%', width: '100%', textAlign: 'center',
        fontFamily: 'var(--font-serif)', fontSize: '4rem', color: 'var(--starlight-gold)',
        textShadow: '0 0 30px rgba(255,215,0,0.8)', zIndex: 10
      }}>
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 3, ease: 'easeOut' }}>
          Bonus: Happy 20th! 🎉
        </motion.div>
      </div>
      {particles.map((p, i) => (
        <motion.div key={p.id}
          style={{
            position: 'absolute', left: p.x, top: p.y, width: p.size, height: p.size,
            background: p.color, borderRadius: i % 3 === 0 ? '50%' : '2px',
          }}
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{ y: p.ty, x: p.tx, rotate: p.rot }}
          transition={{ duration: 2 + Math.random() * 2, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
});

// A single sparkle burst on click
const ClickSparkle = memo(function ClickSparkle({ x, y, onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1000);
    return () => clearTimeout(t);
  }, [onComplete]);

  const sparks = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    angle: (i / 6) * Math.PI * 2,
    dist: 30 + Math.random() * 20,
  }));

  return (
    <div style={{ position: 'fixed', left: x, top: y, zIndex: 99999, pointerEvents: 'none' }}>
      <motion.div
        style={{
          position: 'absolute', left: -20, top: -20, width: 40, height: 40,
          border: '2px solid rgba(255,110,180,0.6)', borderRadius: '50%',
        }}
        initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      {sparks.map(s => (
        <motion.div key={s.id}
          style={{
            position: 'absolute', left: -2, top: -2, width: 4, height: 4,
            background: '#ffd700', borderRadius: '50%', boxShadow: '0 0 6px #ffd700'
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos(s.angle) * s.dist, y: Math.sin(s.angle) * s.dist,
            scale: 0, opacity: 0
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
});

export default memo(function MicroInteractions() {
  const [sparkles, setSparkles] = useState([]);
  const [easterEgg, setEasterEgg] = useState(false);
  
  // 1. Global Click Sparkles
  useEffect(() => {
    const handleClick = (e) => {
      // Don't spawn them furiously if clicking fast, just cap it
      setSparkles(prev => {
        const newSparkle = { id: Date.now(), x: e.clientX, y: e.clientY };
        return [...prev.slice(-4), newSparkle]; // keep max 5 active
      });
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const removeSparkle = useCallback((id) => {
    setSparkles(prev => prev.filter(s => s.id !== id));
  }, []);

  // 2. Keyboard Konami/Easter Egg (Typing "20")
  useEffect(() => {
    let keyBuffer = '';
    const handleKey = (e) => {
      keyBuffer += e.key;
      if (keyBuffer.length > 5) keyBuffer = keyBuffer.slice(-5); // keep buffer small
      
      if (keyBuffer.endsWith('20')) {
        setEasterEgg(true);
        keyBuffer = ''; // reset
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      {/* Render active click sparkles */}
      <AnimatePresence>
        {sparkles.map(s => (
          <ClickSparkle key={s.id} x={s.x} y={s.y} onComplete={() => removeSparkle(s.id)} />
        ))}
      </AnimatePresence>

      {/* Render the hidden "20" easter egg */}
      <EasterEggConfetti active={easterEgg} onComplete={() => setEasterEgg(false)} />
    </>
  );
});
