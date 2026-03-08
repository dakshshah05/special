import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// Firework particles
function FireworkParticles({ active }) {
  const meshRef = useRef();
  const count = 500;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      // Random direction on sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 2 + Math.random() * 4;

      return {
        dir: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        ),
        color: i % 3 === 0 ? '#ff6eb4' : i % 3 === 1 ? '#ffd700' : '#e8c4ff',
        gravity: 0.8 + Math.random() * 0.4,
        life: 2 + Math.random() * 2,
      };
    }),
  [count]);

  const startTime = useRef(null);
  const [phase, setPhase] = useState('burst'); // 'burst' or 'reform'

  useFrame(({ clock }) => {
    if (!meshRef.current || !active) return;
    if (!startTime.current) startTime.current = clock.getElapsedTime();

    const elapsed = clock.getElapsedTime() - startTime.current;

    if (elapsed > 2 && phase === 'burst') {
      setPhase('reform');
    }

    particles.forEach((p, i) => {
      if (phase === 'burst') {
        const t = elapsed;
        dummy.position.set(
          p.dir.x * t,
          p.dir.y * t - p.gravity * t * t * 0.5,
          p.dir.z * t
        );
        const scale = Math.max(0, 0.05 * (1 - elapsed / p.life));
        dummy.scale.setScalar(scale);
      } else {
        // Reform into "20"
        const reformProgress = Math.min(1, (elapsed - 2) * 0.5);
        const targetPos = getNumberPosition(i, count);

        const currentX = p.dir.x * 2;
        const currentY = p.dir.y * 2 - p.gravity * 4 * 0.5;
        const currentZ = p.dir.z * 2;

        dummy.position.set(
          currentX + (targetPos.x - currentX) * easeInOut(reformProgress),
          currentY + (targetPos.y - currentY) * easeInOut(reformProgress),
          currentZ + (targetPos.z - currentZ) * easeInOut(reformProgress)
        );
        dummy.scale.setScalar(0.06 * reformProgress);
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#ff6eb4"
        emissive="#ffd700"
        emissiveIntensity={0.5}
      />
    </instancedMesh>
  );
}

// Generate positions for number "20"
function getNumberPosition(index, total) {
  // Create "20" shape with particles
  const half = total / 2;
  let x, y;

  if (index < half) {
    // "2" shape
    const t = index / half;
    if (t < 0.2) {
      x = -3 + t * 5 * 2;
      y = 2;
    } else if (t < 0.4) {
      x = -1;
      y = 2 - (t - 0.2) * 5 * 2;
    } else if (t < 0.6) {
      x = -3 + (t - 0.4) * 5 * 2;
      y = 0;
    } else if (t < 0.8) {
      x = -3;
      y = -(t - 0.6) * 5 * 2;
    } else {
      x = -3 + (t - 0.8) * 5 * 2;
      y = -2;
    }
  } else {
    // "0" shape
    const t = (index - half) / half;
    const angle = t * Math.PI * 2;
    x = 2 + Math.cos(angle) * 1;
    y = Math.sin(angle) * 2;
  }

  return {
    x: x * 0.5,
    y: y * 0.5,
    z: (Math.random() - 0.5) * 0.3,
  };
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function WishesSection() {
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

          // Typewriter effect
          const text = 'Happy 20th Birthday';
          let currentIndex = 0;
          title.textContent = '';

          const typeInterval = setInterval(() => {
            if (currentIndex < text.length) {
              title.textContent = text.substring(0, currentIndex + 1);
              currentIndex++;
            } else {
              clearInterval(typeInterval);
              // Glow effect after typing
              gsap.to(title, {
                filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.6)) drop-shadow(0 0 60px rgba(255,110,180,0.3))',
                duration: 1,
                ease: 'power2.inOut',
              });
              // Trigger fireworks
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
    
    // Create random floating stars/wishes
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'confetti-particle';
        star.innerHTML = '✨';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = '100vh';
        star.style.fontSize = (10 + Math.random() * 20) + 'px';
        document.body.appendChild(star);

        gsap.to(star, {
            y: -window.innerHeight - 200,
            x: '+=' + (Math.random() - 0.5) * 400,
            rotation: Math.random() * 720,
            opacity: 0,
            duration: 2 + Math.random() * 2,
            ease: 'power1.out',
            onComplete: () => star.remove()
        });
    }

    if (shimmerRef.current) {
      gsap.fromTo(shimmerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.in',
          onComplete: () => {
            gsap.to(shimmerRef.current, {
              opacity: 0,
              duration: 2.5,
              ease: 'power2.out',
              delay: 0.5,
            });
          }
        }
      );
    }
  }, []);

  return (
    <section id="wishes" ref={sectionRef} className="section wishes-section">
      {/* 3D Firework canvas */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <FireworkParticles active={showFireworks} />
        </Canvas>
      </div>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div ref={titleRef} className="wishes-title" />

        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.5rem',
          color: 'var(--lavender-glow)',
          marginTop: '1rem',
          fontStyle: 'italic',
          opacity: showFireworks ? 1 : 0,
          transition: 'opacity 1s ease',
        }}>
          Shariya ✦
        </div>

        <button
          className="wish-button interactive"
          onClick={handleWishClick}
          style={{
            opacity: showFireworks ? 1 : 0,
            transition: 'opacity 1s ease 0.5s',
            pointerEvents: showFireworks ? 'auto' : 'none',
          }}
        >
          Make a Wish 🌠
        </button>
      </div>

      {/* Shimmer overlay */}
      <div
        ref={shimmerRef}
        className="shimmer-overlay"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(255,110,180,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255,215,0,0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(232,196,255,0.1) 0%, transparent 60%)
          `,
        }}
      />
    </section>
  );
}
