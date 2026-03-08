import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

const milestones = [
    { p: 25, m: "Getting warmer... 🌸" },
    { p: 50, m: "You're loved so much 💕" },
    { p: 75, m: "Almost there... 💗" },
    { p: 100, m: "Maximum Love Reached! 💝" }
];

export default function LoveMeter() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // Check milestones
      const currentMilestone = milestones.reduce((prev, curr) => {
          return (scrolled >= curr.p) ? curr : prev;
      }, null);
      
      if (currentMilestone && currentMilestone.m !== message) {
          setMessage(currentMilestone.m);
          if (scrolled >= 100) {
              // Full effect
              document.body.style.background = 'var(--rose-pink)';
              setTimeout(() => {
                  document.body.style.background = '';
              }, 500);
          }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [message]);

  return (
    <div className="love-meter-container">
      <div className="love-meter-fill" style={{ height: `${scrollProgress}%` }}>
        <div className="love-meter-liquid" />
        {scrollProgress > 20 && (
          <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50px',
            whiteSpace: 'nowrap',
            color: 'var(--rose-pink)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0,0,0,0.5)',
            background: 'rgba(255,255,255,0.1)',
            padding: '5px 15px',
            borderRadius: '15px',
            backdropFilter: 'blur(5px)',
            opacity: message ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}>
            {message}
          </div>
        )}
      </div>
      
      {[25, 50, 75].map(p => (
          <div key={p} className="meter-milestone" style={{ bottom: `${p}%` }}>❤️</div>
      ))}
    </div>
  );
}
