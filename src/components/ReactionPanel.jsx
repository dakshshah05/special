import React, { useState } from 'react';
import gsap from 'gsap';

const reactions = [
  { emoji: '😍', label: 'In Love', id: 'inlove' },
  { emoji: '🥺', label: 'Emotional', id: 'emotional' },
  { emoji: '😊', label: 'Happy', id: 'happy' },
  { emoji: '💃', label: 'Dance', id: 'dance' },
  { emoji: '🌹', label: 'Romantic', id: 'romantic' }
];

export default function ReactionPanel() {
  const [counts, setCounts] = useState({
      inlove: 47,
      emotional: 23,
      happy: 89,
      dance: 12,
      romantic: 65
  });

  const triggerReaction = (id) => {
    setCounts(prev => ({ ...prev, [id]: prev[id] + 1 }));

    switch(id) {
      case 'inlove':
        // Heart burst
        for (let i = 0; i < 50; i++) {
           const heart = document.createElement('div');
           heart.innerHTML = '❤️';
           heart.style.position = 'fixed';
           heart.style.left = Math.random() * 100 + 'vw';
           heart.style.top = '110vh';
           heart.style.zIndex = '20000';
           document.body.appendChild(heart);
           gsap.to(heart, {
               y: '-120vh',
               x: '+=' + (Math.random() - 0.5) * 400,
               rotation: Math.random() * 360,
               opacity: 0,
               duration: 2 + Math.random() * 2,
               onComplete: () => heart.remove()
           });
        }
        break;
      case 'happy':
        // Confetti
        for (let i = 0; i < 100; i++) {
            const c = document.createElement('div');
            c.style.position = 'fixed';
            c.style.width = '10px';
            c.style.height = '10px';
            c.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            c.style.left = (i % 2 === 0 ? 0 : 100) + 'vw';
            c.style.top = Math.random() * 100 + 'vh';
            c.style.zIndex = '20000';
            document.body.appendChild(c);
            gsap.to(c, {
                x: (i % 2 === 0 ? 50 : -50) + 'vw',
                y: '+=200',
                rotation: 720,
                opacity: 0,
                duration: 1 + Math.random(),
                onComplete: () => c.remove()
            });
        }
        break;
      case 'emotional':
        // Warm tone
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = 0;
        overlay.style.background = 'rgba(255, 100, 0, 0.1)';
        overlay.style.zIndex = '15000';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);
        gsap.to(overlay, { opacity: 0, duration: 3, onComplete: () => overlay.remove() });
        break;
      case 'romantic':
        // Candlelight dim
        const dim = document.createElement('div');
        dim.style.position = 'fixed';
        dim.style.inset = 0;
        dim.style.background = 'rgba(0,0,0,0.4)';
        dim.style.zIndex = '15000';
        dim.style.pointerEvents = 'none';
        document.body.appendChild(dim);
        gsap.to(dim, { opacity: 0, duration: 5, onComplete: () => dim.remove() });
        break;
      default:
        break;
    }
  };

  return (
    <div className="reaction-panel">
      {reactions.map(r => (
        <button 
            key={r.id} 
            className="reaction-btn interactive" 
            onClick={() => triggerReaction(r.id)}
            title={r.label}
        >
          {r.emoji}
          <span className="reaction-count">{counts[r.id]}</span>
        </button>
      ))}
    </div>
  );
}
