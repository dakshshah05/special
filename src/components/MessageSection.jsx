/* eslint-disable no-unused-vars, react-hooks/purity, react-hooks/immutability, react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
import React, { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// CSS star dots instead of Canvas
const StarDots = memo(function StarDots() {
  const stars = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
  })), []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          borderRadius: '50%',
          background: '#ffffff',
          animation: `twinkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
          opacity: 0.4,
        }} />
      ))}
      <style>{`
        @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
});

const EnvelopeIcon = memo(function EnvelopeIcon({ progress }) {
  return (
    <div className="envelope-icon">
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect x="2" y="15" width="76" height="43" rx="4" fill="none" stroke="#ff6eb4" strokeWidth="1.5" opacity="0.8" />
        <path d={`M2 15 L40 ${15 + (1 - progress) * 25} L78 15`} fill="none" stroke="#ffd700" strokeWidth="1.5" opacity="0.8" />
        <text x="40" y="42" textAnchor="middle" fill="#ff6eb4" fontSize="16" style={{ opacity: progress }}>ðŸ’Œ</text>
      </svg>
    </div>
  );
});

const message = `Dear Shariya,

As you leave your teenage years behind and step into the beautiful world of your twenties, know that every moment has been a gift. You are not just turning a page â€” you are writing a whole new chapter, filled with magic, love, and infinite possibility.

The stars themselves seem to shine a little brighter when you smile, and the universe conspires to make your dreams come true. You are brave, you are brilliant, and you are so deeply loved.

Here's to twenty years of you making the world a more beautiful place. May this year bring you everything your heart desires and more.

Happy 20th Birthday, Shariya ðŸŒ¹`;

export default memo(function MessageSection() {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const [envelopeProgress, setEnvelopeProgress] = React.useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const textContainer = textContainerRef.current;
    if (!section || !textContainer) return;

    const words = message.split(/(\s+)/);
    textContainer.innerHTML = '';
    words.forEach(word => {
      if (word.trim()) {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        textContainer.appendChild(span);
      } else if (word.includes('\n')) {
        textContainer.appendChild(document.createElement('br'));
        textContainer.appendChild(document.createElement('br'));
      } else {
        textContainer.appendChild(document.createTextNode(' '));
      }
    });

    ScrollTrigger.create({
      trigger: section, start: 'top 80%', end: 'top 30%', scrub: true,
      onUpdate: (self) => setEnvelopeProgress(self.progress),
    });

    const wordSpans = textContainer.querySelectorAll('.word');
    gsap.fromTo(wordSpans,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.02, ease: 'power3.out',
        scrollTrigger: { trigger: textContainer, start: 'top 70%', toggleActions: 'play none none none' }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === section || t.trigger === textContainer) t.kill();
      });
    };
  }, []);

  return (
    <section id="message" ref={sectionRef} className="section" style={{
      background: 'var(--deep-void)', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 0',
    }}>
      <StarDots />
      <div className="message-container" style={{ zIndex: 2 }}>
        <EnvelopeIcon progress={envelopeProgress} />
        <div ref={textContainerRef} className="message-text" />
      </div>
    </section>
  );
});

