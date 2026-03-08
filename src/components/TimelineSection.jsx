import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Orbiting sphere for Chapter 2
function OrbitingSphere() {
  const groupRef = useRef();
  const ringRef = useRef();
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 12;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.3;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
    }
    
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        dummy.position.set(Math.cos(angle) * 2, Math.sin(angle) * 0.5, Math.sin(angle) * 2);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshStandardMaterial
          color="#1a0533"
          emissive="#ff6eb4"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.04, 12, 64]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.5}
        />
      </mesh>
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#e8c4ff" emissive="#e8c4ff" emissiveIntensity={1} />
      </instancedMesh>
      <pointLight position={[0, 0, 0]} intensity={1} color="#ff6eb4" distance={5} />
    </group>
  );
}

// Confetti particles for Chapter 3
function ConfettiParticles({ count = 80 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: Math.random() * 10,
      z: (Math.random() - 0.5) * 4,
      speed: 0.5 + Math.random() * 1,
      rotSpeed: Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
    })),
  [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      let y = p.y - (t * p.speed) % 10;
      if (y < -5) y += 10;

      dummy.position.set(
        p.x + Math.sin(t * 0.5 + p.phase) * 0.5,
        y,
        p.z
      );
      dummy.rotation.set(t * p.rotSpeed, t * p.rotSpeed * 0.5, 0);
      dummy.scale.set(0.08, 0.12, 0.02);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const colors = ['#ff6eb4', '#ffd700', '#e8c4ff', '#ffffff'];

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#ff6eb4"
        emissive="#ff6eb4"
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  );
}

export default function TimelineSection() {
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
        scrub: true,
        end: () => `+=${totalWidth}`,
        onUpdate: (self) => {
          // Age counter in chapter 2
          if (self.progress > 0.3 && self.progress < 0.7) {
            const ageProgress = (self.progress - 0.3) / 0.4;
            setAgeCount(Math.floor(19 + ageProgress));
          }
        }
      }
    });

    // Animate text reveals for each panel
    const textElements = panels.querySelectorAll('.timeline-reveal');
    textElements.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            containerAnimation: scrollTween,
            start: 'left 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="timeline" ref={containerRef} style={{ overflow: 'hidden' }}>
      <div
        ref={panelsRef}
        style={{
          display: 'flex',
          width: 'fit-content',
          height: '100vh',
        }}
      >
        {/* Chapter 1: Once a teenager */}
        <div className="timeline-panel pastel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', maxWidth: '1200px' }}>
            <div style={{ flex: 1, position: 'relative', height: '400px', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #2d1b4e, #1a0533)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  fontSize: '6rem',
                  filter: 'drop-shadow(0 0 20px rgba(255,110,180,0.5))',
                }}>
                  🌸
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="timeline-chapter-title timeline-reveal">Chapter One</div>
              <div className="timeline-text timeline-reveal" style={{ color: '#e8c4ff' }}>
                Once a teenager, <br/>
                <span style={{ color: '#ff6eb4' }}>wild and free</span> — <br/>
                chasing dreams through <br/>
                starlit nights...
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 2: Now 20 and radiant */}
        <div className="timeline-panel cosmic">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', maxWidth: '1200px' }}>
            <div style={{ flex: 1 }}>
              <div className="timeline-chapter-title timeline-reveal">Chapter Two</div>
              <div className="timeline-text timeline-reveal" style={{ color: '#ffffff' }}>
                Now <span className="age-counter">{ageCount}</span> <br/>
                <span style={{ color: '#ffd700' }}>and radiant</span> — <br/>
                stepping into a new <br/>
                chapter of brilliance.
              </div>
            </div>
            <div style={{ flex: 1, height: '400px' }}>
              <Canvas 
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
              >
                <ambientLight intensity={0.3} />
                <OrbitingSphere />
              </Canvas>
            </div>
          </div>
        </div>

        {/* Chapter 3: This is your day */}
        <div className="timeline-panel golden">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', maxWidth: '1200px' }}>
            <div style={{ flex: 1, height: '400px' }}>
              <Canvas 
                camera={{ position: [0, 0, 6], fov: 50 }}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
              >
                <ambientLight intensity={0.5} />
                <pointLight position={[3, 3, 3]} intensity={1} color="#ffd700" />
                <ConfettiParticles count={80} />
              </Canvas>
            </div>
            <div style={{ flex: 1 }}>
              <div className="timeline-chapter-title timeline-reveal">Chapter Three</div>
              <div className="timeline-text timeline-reveal" style={{ color: '#ffd700' }}>
                This is <span style={{ color: '#ff6eb4' }}>your day</span>, <br/>
                Shariya — <br/>
                the universe <br/>
                celebrates <span style={{ color: '#ffffff' }}>you</span>. ✨
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
