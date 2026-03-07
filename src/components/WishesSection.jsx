import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import gsap from 'gsap';

// CSS firework particles
const CSSFireworks = memo(function CSSFireworks({ active }) {
  if (!active) return null;

  const colors = ['#ff6eb4', '#ffd700', '#e8c4ff', '#ffffff'];
  const particles = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * Math.PI * 2;
    const speed = 80 + Math.random() * 120;
    return {
      tx: Math.cos(angle) * speed,
      ty: Math.sin(angle) * speed - 40,
      color: colors[i % colors.length],
      delay: Math.random() * 0.3,
      size: 3 + Math.random() * 4,
    };
  });

  return (
    <div style={{ position: 'absolute', top: '40%', left: '50%', zIndex: 1 }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: '50%',
          background: p.color,
          boxShadow: `0 0 6px ${p.color}`,
          animation: `firework 2s ease-out ${p.delay}s forwards`,
          '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
        }} />
      ))}
      <style>{`
        @keyframes firework {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          70% { opacity: 0.8; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

export default memo(function WishesSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);
  const shimmerRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const text = 'Happy 20th Birthday';
          let idx = 0;
          title.textContent = '';
          const interval = setInterval(() => {
            if (idx < text.length) {
              title.textContent = text.substring(0, idx + 1);
              idx++;
            } else {
              clearInterval(interval);
              gsap.to(title, {
                filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.6)) drop-shadow(0 0 60px rgba(255,110,180,0.3))',
                duration: 1, ease: 'power2.inOut',
              });
              setTimeout(() => setShowFireworks(true), 500);
            }
          }, 100);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleWishClick = useCallback(() => {
    setShowShimmer(true);
    if (shimmerRef.current) {
      gsap.fromTo(shimmerRef.current, { opacity: 0 }, {
        opacity: 1, duration: 0.5, ease: 'power2.in',
        onComplete: () => {
          gsap.to(shimmerRef.current, { opacity: 0, duration: 2, ease: 'power2.out', delay: 0.5 });
        }
      });
    }
  }, []);

  return (
    <section id="wishes" ref={sectionRef} className="section wishes-section">
      <CSSFireworks active={showFireworks} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div ref={titleRef} className="wishes-title" />
        <div style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
          color: 'var(--lavender-glow)', marginTop: '1rem', fontStyle: 'italic',
          opacity: showFireworks ? 1 : 0, transition: 'opacity 1s ease',
        }}>
          Shariya ✦
        </div>
        <button className="wish-button interactive" onClick={handleWishClick} style={{
          opacity: showFireworks ? 1 : 0, transition: 'opacity 1s ease 0.5s',
          pointerEvents: showFireworks ? 'auto' : 'none',
        }}>
          Make a Wish 🌠
        </button>
      </div>

      <div ref={shimmerRef} className="shimmer-overlay" style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(255,110,180,0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(255,215,0,0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(232,196,255,0.1) 0%, transparent 60%)
        `,
      }} />
    </section>
  );
});
