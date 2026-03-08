import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function GrandFinale() {
  const [active, setActive] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const finaleRef = useRef();
  const starRef = useRef();
  const faceRef = useRef();
  const textGroupRef = useRef();
  const btnRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      // If triggered once, we stop listening to save performance
      if (hasTriggered) return;

      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollMax = Math.max(1, docHeight - winHeight);
      const scrolled = (scrollTop / scrollMax) * 100;

      // Trigger at 97% to be safe across all screen sizes
      if (scrolled >= 97 && !active) {
          triggerFinale();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active, hasTriggered]);

  const triggerFinale = () => {
    setActive(true);
    setHasTriggered(true);
    
    // Explicitly show the overlay
    gsap.set(finaleRef.current, { display: 'flex', pointerEvents: 'auto', opacity: 0 });
    
    const tl = gsap.timeline();
    
    // Initial setup to ensure elements are hidden before animation
    gsap.set([faceRef.current, textGroupRef.current, btnRef.current, starRef.current], { 
      opacity: 0, 
      scale: 0 
    });

    tl.to(finaleRef.current, { opacity: 1, duration: 1 })
      // Phase 1: Star Burst
      .set(starRef.current, { opacity: 1, scale: 1 })
      .to(starRef.current, { 
          scale: 60, 
          opacity: 0, 
          duration: 1.8, 
          ease: 'power4.in' 
      })
      // Phase 2: Content Reveal
      .to(faceRef.current, { 
          scale: 1, 
          opacity: 1, 
          rotation: 360, 
          duration: 1.5, 
          ease: 'back.out(1.7)' 
      }, '-=0.5')
      .to(textGroupRef.current, { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1, 
          ease: 'power3.out' 
      }, '-=0.5')
      .to(btnRef.current, { 
          scale: 1, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'elastic.out(1, 0.5)' 
      }, '-=0.3');
  };

  const closeFinale = () => {
    gsap.to(finaleRef.current, { 
      opacity: 0, 
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(finaleRef.current, { display: 'none', pointerEvents: 'none' });
        setActive(false);
        // Scroll to Wishes section
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
        style={{
            position: 'fixed',
            inset: 0,
            background: 'black',
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999999, // Max priority
            padding: '20px'
        }}
    >
        {/* The Burst Star */}
        <div ref={starRef} style={{
            position: 'absolute',
            width: '15px',
            height: '15px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 100px 40px white',
            pointerEvents: 'none'
        }} />

        {/* Shariya's Face */}
        <div ref={faceRef} style={{ position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
            <img 
                src="/photos/photo-14.jpg" 
                alt="Shariya" 
                style={{ 
                    width: 'min(300px, 60vw)', 
                    height: 'min(300px, 60vw)', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    border: '6px solid #ffd700',
                    boxShadow: '0 0 50px rgba(255, 215, 0, 0.4)'
                }} 
            />
        </div>

        {/* Text Block */}
        <div ref={textGroupRef} style={{ textAlign: 'center', zIndex: 10 }}>
            <div style={{ 
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', 
                fontFamily: 'serif', 
                color: '#ffd700',
                maxWidth: '90vw',
                margin: '0 auto',
                lineHeight: '1.2',
                fontWeight: 'bold'
            }}>
                "To Shariya, the most beautiful 20-year-old in the universe"
            </div>
            <div style={{ 
                marginTop: '1.5rem', 
                fontSize: '0.9rem', 
                color: 'white', 
                opacity: 0.8,
                letterSpacing: '0.4em',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }}>
                Happy Birthday
            </div>
        </div>

        {/* Back Button */}
        <button 
            ref={btnRef}
            onClick={closeFinale}
            className="interactive"
            style={{ 
                marginTop: '3.5rem', 
                background: 'white', 
                border: 'none', 
                color: 'black', 
                padding: '12px 35px', 
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                zIndex: 100,
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s ease'
            }}
        >
            BACK TO MEMORIES
        </button>
    </div>
  );
}
