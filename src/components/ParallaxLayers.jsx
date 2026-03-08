import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ParallaxLayers() {
  const containerRef = useRef(null);

  useEffect(() => {
    const layers = containerRef.current.querySelectorAll('.parallax-layer');
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 2;
      const yPos = (clientY / window.innerHeight - 0.5) * 2;

      layers.forEach((layer, i) => {
        const depth = (i + 1) * 20; // ±20px to ±140px
        gsap.to(layer, {
          x: xPos * depth,
          y: yPos * depth,
          duration: 1,
          ease: 'power2.out'
        });
      });
    };

    const handleOrientation = (e) => {
      const { beta, gamma } = e; // beta: -180 to 180 (front/back), gamma: -90 to 90 (left/right)
      const xPos = (gamma / 45); // Roughly -1 to 1 at 45deg tilt
      const yPos = (beta / 45);

      layers.forEach((layer, i) => {
        const depth = (i + 1) * 20;
        gsap.to(layer, {
          x: xPos * depth,
          y: yPos * depth,
          duration: 1,
          ease: 'power2.out'
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="parallax-viewport" ref={containerRef}>
      {/* Layer 1: Distant Nebula */}
      <div className="parallax-layer" style={{ 
        background: 'radial-gradient(circle at 20% 30%, #1a0533 0%, transparent 70%)',
        opacity: 0.4 
      }} />
      
      {/* Layer 2: Deep Starfield */}
      <div className="parallax-layer" style={{ 
        backgroundImage: 'radial-gradient(1px 1px at 10% 20%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent)',
        backgroundSize: '200px 200px',
        opacity: 0.2
      }} />

      {/* Layer 3: Mid Stars + Orbs */}
      <div className="parallax-layer">
        <div style={{ position: 'absolute', top: '20%', left: '70%', width: '150px', height: '150px', borderRadius: '50%', background: 'var(--lavender-glow)', opacity: 0.05, filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '60%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'var(--rose-pink)', opacity: 0.05, filter: 'blur(50px)' }} />
      </div>

      {/* Layer 4: Distant Drifting Petals (handled by Three.js usually, but here as a depth layer) */}
      <div className="parallax-layer" />

      {/* Layer 5: Main Content Reference (empty, content sits on top) */}
      <div className="parallax-layer" />

      {/* Layer 6: Foreground Floating Elements */}
      <div className="parallax-layer">
         {/* Could add floating hearts or subtle lights here */}
      </div>

      {/* Layer 7: Closest Overlay / Particles */}
      <div className="parallax-layer" style={{ 
        background: 'radial-gradient(circle at 80% 80%, rgba(255,215,0,0.05) 0%, transparent 50%)'
      }} />
    </div>
  );
}
