import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useReveal } from '../hooks/useReveal';

const gradients = [
  'linear-gradient(135deg, #ff6eb4 0%, #e8c4ff 100%)',
  'linear-gradient(135deg, #ffd700 0%, #ff6eb4 100%)',
  'linear-gradient(135deg, #e8c4ff 0%, #ffd700 100%)',
  'linear-gradient(135deg, #1a0533 0%, #ff6eb4 100%)',
  'linear-gradient(135deg, #ff6eb4 0%, #ffd700 100%)',
  'linear-gradient(135deg, #ffd700 0%, #e8c4ff 100%)',
];

const captions = [
  'A moment to remember ✨',
  'Radiance personified 🌹',
  'Golden memories 💫',
  'Under the stars 🌟',
  'Dreams in bloom 🌸',
  'Forever beautiful 💖',
];

export default function PhotoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const sectionRef = useReveal({ y: 40 });

  const rotateToIndex = (index) => {
    setActiveIndex(index);
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        rotateY: -index * 60,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  };

  const next = () => rotateToIndex((activeIndex + 1) % 6);
  const prev = () => rotateToIndex((activeIndex - 1 + 6) % 6);

  // Tilt on mouse move
  const handleMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardEl, {
      rotateX: -y * 15,
      rotateY: x * 15,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (cardEl) => {
    gsap.to(cardEl, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  return (
    <section
      id="carousel"
      ref={sectionRef}
      className="section"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, var(--deep-void), #0f0520, var(--deep-void))',
        padding: '4rem 0',
      }}
    >
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 300,
        color: 'var(--rose-pink)',
        marginBottom: '3rem',
        letterSpacing: '0.1em',
      }}>
        Moments ✦
      </h2>

      <div className="carousel-container">
        <button className="carousel-nav-btn prev interactive" onClick={prev}>‹</button>

        <div
          ref={trackRef}
          className="carousel-track"
          style={{ transform: `rotateY(${-activeIndex * 60}deg)` }}
        >
          {gradients.map((grad, i) => {
            const angle = (i / 6) * 360;
            const isActive = i === activeIndex;
            return (
              <div
                key={i}
                className={`carousel-card ${isActive ? 'active' : ''}`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(400px)`,
                  opacity: isActive ? 1 : 0.5,
                  transition: 'opacity 0.5s ease',
                }}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget.querySelector('.carousel-card-inner'))}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget.querySelector('.carousel-card-inner'))}
              >
                <div
                  className="carousel-card-inner"
                  style={{
                    background: grad,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    padding: '1.5rem',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1rem',
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}>
                    {captions[i]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="carousel-nav-btn next interactive" onClick={next}>›</button>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginTop: '2rem',
      }}>
        {gradients.map((_, i) => (
          <button
            key={i}
            onClick={() => rotateToIndex(i)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              background: i === activeIndex ? 'var(--rose-pink)' : 'rgba(255,110,180,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
