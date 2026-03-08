import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function GrandFinale() {
  const [active, setActive] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const finaleRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (hasTriggered) return;

      const winScroll = window.pageYOffset || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;

      // Triggering slightly before 100% to ensure it hits on all browsers
      if (scrolled >= 98 && !active) {
          triggerFinale();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active, hasTriggered]);

  const triggerFinale = () => {
    setActive(true);
    setHasTriggered(true);
    
    // Use GSAP directly on the overlay for visibility
    gsap.set(finaleRef.current, { display: 'flex', pointerEvents: 'auto' });
    
    const tl = gsap.timeline();
    tl.to(finaleRef.current, { opacity: 1, duration: 1 })
      .to('.finale-star', { scale: 50, opacity: 0, duration: 2, ease: 'power4.in' })
      .from('.finale-face-container', { scale: 0, rotation: 360, opacity: 0, duration: 1.5, ease: 'back.out(1.7)' }, '-=0.5')
      .from('.finale-text-group', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
      .from('.finale-back-btn', { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.3');
  };

  const closeFinale = () => {
    gsap.to(finaleRef.current, { 
      opacity: 0, 
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(finaleRef.current, { display: 'none', pointerEvents: 'none' });
        setActive(false);
        const wishesSection = document.getElementById('wishes');
        if (wishesSection) {
            wishesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  };

  return (
    <div 
        ref={finaleRef} 
        className="finale-overlay"
        style={{
            position: 'fixed',
            inset: 0,
            background: 'black',
            display: 'none', // Controlled by GSAP
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 2000000 // Extremely high
        }}
    >
        <div className="finale-star" style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 100px 40px white'
        }} />

        <div className="finale-face-container" style={{ position: 'relative', zIndex: 10 }}>
            <img 
                src="/photos/photo-14.jpg" 
                alt="Shariya" 
                style={{ 
                    width: '300px', 
                    height: '300px', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    border: '8px solid var(--starlight-gold)',
                    boxShadow: '0 0 50px rgba(255, 215, 0, 0.5)'
                }} 
            />
        </div>

        <div className="finale-text-group" style={{ textAlign: 'center', zIndex: 10, marginTop: '2rem' }}>
            <div style={{ 
                fontSize: '2.5rem', 
                fontFamily: 'var(--font-serif)', 
                color: 'var(--starlight-gold)',
                maxWidth: '80vw',
                margin: '0 auto',
                lineHeight: '1.2'
            }}>
                "To Shariya, the most beautiful 20-year-old in the universe"
            </div>
            <div style={{ 
                marginTop: '1.5rem', 
                fontSize: '1rem', 
                color: 'white', 
                opacity: 0.6,
                letterSpacing: '0.6em',
                fontWeight: 'bold'
            }}>
                HAPPY BIRTHDAY
            </div>
        </div>

        <button 
            className="finale-back-btn"
            onClick={closeFinale}
            style={{ 
                marginTop: '4rem', 
                background: 'white', 
                border: 'none', 
                color: 'black', 
                padding: '15px 40px', 
                borderRadius: '50px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                zIndex: 100,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
        >
            Back to Memories
        </button>
    </div>
  );
}
