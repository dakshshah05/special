import React, { useEffect, useRef, useState, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// CSS-only orbiting sphere for Chapter 2
const OrbitingSphere = memo(function OrbitingSphere() {
  return (
    <div style={{
      position: 'relative', width: '300px', height: '300px', margin: '0 auto',
    }}>
      {/* Main sphere */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '150px', height: '150px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #3d1b6e, #1a0533)',
        boxShadow: '0 0 40px rgba(255,110,180,0.3), inset 0 0 30px rgba(255,110,180,0.1)',
        animation: 'pulse 3s ease-in-out infinite',
      }} />
      {/* Ring */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '250px', height: '250px',
        transform: 'translate(-50%, -50%) rotateX(60deg)',
        border: '2px solid rgba(255,215,0,0.5)',
        borderRadius: '50%',
        animation: 'spin 8s linear infinite',
      }} />
      {/* Orbiting dots */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#e8c4ff',
          boxShadow: '0 0 10px #e8c4ff',
          animation: `orbit 4s linear infinite ${i * 1}s`,
          transformOrigin: '0 0',
        }} />
      ))}
      <style>{`
        @keyframes spin { from { transform: translate(-50%,-50%) rotateX(60deg) rotate(0deg); } to { transform: translate(-50%,-50%) rotateX(60deg) rotate(360deg); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 40px rgba(255,110,180,0.3); } 50% { box-shadow: 0 0 60px rgba(255,110,180,0.5); } }
        @keyframes orbit { 0% { transform: rotate(0deg) translateX(120px) scale(1); } 50% { transform: rotate(180deg) translateX(120px) scale(0.6); } 100% { transform: rotate(360deg) translateX(120px) scale(1); } }
      `}</style>
    </div>
  );
});

// CSS confetti for Chapter 3
const CSSConfetti = memo(function CSSConfetti() {
  const colors = ['#ff6eb4', '#ffd700', '#e8c4ff', '#ffffff'];
  return (
    <div style={{ position: 'relative', width: '300px', height: '300px', overflow: 'hidden', margin: '0 auto' }}>
      {Array.from({ length: 25 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `-${10 + Math.random() * 20}%`,
          width: `${4 + Math.random() * 6}px`,
          height: `${6 + Math.random() * 10}px`,
          background: colors[i % colors.length],
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          animation: `confettiFall ${3 + Math.random() * 3}s linear infinite ${Math.random() * 3}s`,
          opacity: 0.7,
        }} />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

export default memo(function TimelineSection() {
  const containerRef = useRef(null);
  const panelsRef = useRef(null);
  const [ageCount, setAgeCount] = useState(19);

  useEffect(() => {
    const container = containerRef.current;
    const panels = panelsRef.current;
    if (!container || !panels) return;

    const totalWidth = panels.scrollWidth - window.innerWidth;

    const scrollTween = gsap.to(panels, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => `+=${totalWidth}`,
        onUpdate: (self) => {
          if (self.progress > 0.3 && self.progress < 0.7) {
            const p = (self.progress - 0.3) / 0.4;
            setAgeCount(Math.floor(19 + p));
          }
        }
      }
    });

    const textElements = panels.querySelectorAll('.timeline-reveal');
    textElements.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            containerAnimation: scrollTween,
            start: 'left 80%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section id="timeline" ref={containerRef} style={{ overflow: 'hidden' }}>
      <div ref={panelsRef} style={{ display: 'flex', width: 'fit-content', height: '100vh' }}>
        {/* Chapter 1 */}
        <div className="timeline-panel pastel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', maxWidth: '1200px' }}>
            <div style={{
              flex: 1, height: '400px', borderRadius: '20px', overflow: 'hidden',
              background: 'linear-gradient(135deg, #2d1b4e, #1a0533)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '6rem', filter: 'drop-shadow(0 0 20px rgba(255,110,180,0.5))' }}>🌸</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="timeline-chapter-title timeline-reveal">Chapter One</div>
              <div className="timeline-text timeline-reveal" style={{ color: '#e8c4ff' }}>
                Once a teenager, <br/><span style={{ color: '#ff6eb4' }}>wild and free</span> — <br/>
                chasing dreams through <br/>starlit nights...
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 2 */}
        <div className="timeline-panel cosmic">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', maxWidth: '1200px' }}>
            <div style={{ flex: 1 }}>
              <div className="timeline-chapter-title timeline-reveal">Chapter Two</div>
              <div className="timeline-text timeline-reveal" style={{ color: '#ffffff' }}>
                Now <span className="age-counter">{ageCount}</span> <br/>
                <span style={{ color: '#ffd700' }}>and radiant</span> — <br/>
                stepping into a new <br/>chapter of brilliance.
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <OrbitingSphere />
            </div>
          </div>
        </div>

        {/* Chapter 3 */}
        <div className="timeline-panel golden">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', maxWidth: '1200px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CSSConfetti />
            </div>
            <div style={{ flex: 1 }}>
              <div className="timeline-chapter-title timeline-reveal">Chapter Three</div>
              <div className="timeline-text timeline-reveal" style={{ color: '#ffd700' }}>
                This is <span style={{ color: '#ff6eb4' }}>your day</span>, <br/>
                Shariya — <br/>the universe <br/>celebrates <span style={{ color: '#ffffff' }}>you</span>. ✨
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
