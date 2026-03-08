import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function GrandFinale() {
  const [active, setActive] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const finaleRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      // If it's already triggered once, don't listen anymore
      if (hasTriggered) return;

      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;

      if (scrolled >= 99.5 && !active) {
          triggerFinale();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active, hasTriggered]);

  const triggerFinale = () => {
    setActive(true);
    setHasTriggered(true); // Mark as triggered so it never happens again
    const tl = gsap.timeline();
    
    tl.to(finaleRef.current, { opacity: 1, pointerEvents: 'auto', duration: 1 })
      .to('.finale-star', { scale: 1.5, opacity: 1, duration: 1 })
      .to('.finale-star', { scale: 50, opacity: 0, duration: 1.5, ease: 'power4.in' })
      .from('.finale-face-container', { scale: 0, rotation: 360, opacity: 0, duration: 2, ease: 'elastic.out(1, 0.3)' }, '-=0.5')
      .from('.finale-text', { y: 100, opacity: 0, stagger: 0.5, duration: 1, ease: 'power3.out' }, '-=1')
      .to('.finale-confetti', { opacity: 1, duration: 1 });
  };

  const closeFinale = () => {
    gsap.to(finaleRef.current, { 
      opacity: 0, 
      pointerEvents: 'none', 
      duration: 0.5,
      onComplete: () => {
        setActive(false);
        // Scroll back to the Wishes section (or slightly above the very end)
        const wishesSection = document.getElementById('wishes');
        if (wishesSection) {
          wishesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Fallback: Scroll up slightly
          window.scrollBy({ top: -500, behavior: 'smooth' });
        }
      }
    });
  };

  return (
    <div 
        ref={finaleRef} 
        className={`finale-overlay ${active ? 'active' : ''}`}
        style={{
            position: 'fixed',
            inset: 0,
            background: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 100000
        }}
    >
        <div className="finale-star" style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            background: 'white',
            borderRadius: '50%',
            opacity: 0,
            boxShadow: '0 0 50px 20px white'
        }} />

        <div className="finale-face-container">
            <img src="/photos/photo-14.jpg" alt="Shariya" />
        </div>

        <div className="finale-text" style={{ 
            marginTop: '3rem', 
            fontSize: '2rem', 
            fontFamily: 'var(--font-serif)', 
            color: 'var(--starlight-gold)',
            textAlign: 'center',
            maxWidth: '80%',
            lineHeight: '1.6'
        }}>
            "To Shariya, the most beautiful 20-year-old in the universe"
        </div>

        <div className="finale-text" style={{ 
            marginTop: '1rem', 
            fontSize: '1.2rem', 
            color: 'white', 
            opacity: 0.7,
            letterSpacing: '0.5em',
            textAlign: 'center'
        }}>
            HAPPY BIRTHDAY
        </div>

        <button 
            onClick={closeFinale}
            style={{ 
                marginTop: '4rem', 
                background: 'none', 
                border: '1px solid white', 
                color: 'white', 
                padding: '10px 30px', 
                borderRadius: '50px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.1em',
                transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = 'black';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = 'white';
            }}
        >
            Back to Memories
        </button>
    </div>
  );
}
