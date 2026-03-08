import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';

export default function ShakeHug() {
  const [hugs, setHugs] = useState(() => parseInt(localStorage.getItem('shariya_hugs') || '0'));
  const [showCounter, setShowCounter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lastShake = useRef(0);
  const audioCtx = useRef(null);

  const playDing = useCallback(() => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }, []);

  const triggerHug = useCallback(() => {
    const now = Date.now();
    if (now - lastShake.current < 1000) return;
    lastShake.current = now;

    setHugs(prev => {
      const next = prev + 1;
      localStorage.setItem('shariya_hugs', next.toString());
      return next;
    });

    setShowCounter(true);
    playDing();

    // Shimmer effect on body
    document.body.classList.add('shimmer-effect');
    setTimeout(() => document.body.classList.remove('shimmer-effect'), 1000);

    // Float hearts from edges
    for (let i = 0; i < 15; i++) {
        createHeart();
    }
  }, [playDing]);

  const createHeart = () => {
    const heart = document.createElement('div');
    heart.className = 'floating-heart-hug';
    heart.innerHTML = '❤️';
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const startX = side === 'left' ? -20 : window.innerWidth + 20;
    const startY = Math.random() * window.innerHeight;
    
    heart.style.left = startX + 'px';
    heart.style.top = startY + 'px';
    heart.style.position = 'fixed';
    heart.style.fontSize = (10 + Math.random() * 30) + 'px';
    heart.style.zIndex = '10000';
    document.body.appendChild(heart);

    gsap.to(heart, {
      x: (side === 'left' ? 1 : -1) * (100 + Math.random() * 200),
      y: startY - (200 + Math.random() * 300),
      opacity: 0,
      scale: 2,
      rotation: Math.random() * 360,
      duration: 1.5 + Math.random(),
      ease: 'power1.out',
      onComplete: () => heart.remove()
    });
  };

  useEffect(() => {
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    if (!checkMobile) return;

    let lastX = null, lastY = null, lastZ = null;
    const threshold = 15;

    const handleMotion = (event) => {
      const { x, y, z } = event.accelerationIncludingGravity;
      if (lastX !== null) {
        const deltaX = Math.abs(lastX - x);
        const deltaY = Math.abs(lastY - y);
        const deltaZ = Math.abs(lastZ - z);

        if (deltaX + deltaY + deltaZ > threshold * 3) {
          triggerHug();
        }
      }
      lastX = x; lastY = y; lastZ = z;
    };

    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      // Add a listener for clicks to request permission IF needed (usually on a button click)
      const requestPermission = () => {
        DeviceMotionEvent.requestPermission()
          .then(state => {
            if (state === 'granted') {
              window.addEventListener('devicemotion', handleMotion);
            }
          })
          .catch(console.error);
        window.removeEventListener('click', requestPermission);
      };
      window.addEventListener('click', requestPermission);
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [triggerHug]);

  if (!isMobile) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      textAlign: 'center',
      pointerEvents: 'none',
      width: '100%'
    }}>
      <div className={`shake-prompt ${hugs > 0 ? 'fade-out' : ''}`} style={{
        background: 'rgba(255, 110, 180, 0.2)',
        backdropFilter: 'blur(10px)',
        padding: '10px 20px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.9rem',
        display: 'inline-block',
        border: '1px solid rgba(255, 110, 180, 0.3)',
        animation: 'pulse 2s infinite'
      }}>
        Shake your phone to send Shariya a hug! 🤗
      </div>

      {showCounter && (
        <div className="hug-counter" style={{
          marginTop: '10px',
          color: 'var(--starlight-gold)',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          You've sent her {hugs} {hugs === 1 ? 'hug' : 'hugs'} today! ❤️
        </div>
      )}
    </div>
  );
}
