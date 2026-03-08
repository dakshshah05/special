import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const moods = {
  hero: { bg: '#0a0010', accent: '#ff6eb4', particle: 'stars' },
  memory: { bg: '#2a1500', accent: '#ffd700', particle: 'fireflies' },
  cake: { bg: '#0f0520', accent: '#e8c4ff', particle: 'confetti' },
  letter: { bg: '#1a0a05', accent: '#ffbf00', particle: 'wax' },
  wish: { bg: '#001010', accent: '#00ff88', particle: 'aurora' }
};

function AmbientParticles({ mood }) {
    const pointsRef = useRef();
    const count = 2000;
    
    const [positions, colors] = React.useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return [pos, col];
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        pointsRef.current.rotation.y = t * 0.05;
        pointsRef.current.rotation.x = t * 0.02;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color={moods[mood].accent} transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

export default function DynamicEnvironment() {
  const [currentMood, setCurrentMood] = useState('hero');
  const bgRef = useRef(new THREE.Color('#0a0010'));

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      
      let newMood = 'hero';
      if (scrollY > height * 6) newMood = 'wish';
      else if (scrollY > height * 4) newMood = 'letter';
      else if (scrollY > height * 3) newMood = 'cake';
      else if (scrollY > height * 1) newMood = 'memory';
      
      if (newMood !== currentMood) {
          setCurrentMood(newMood);
          gsap.to(bgRef.current, {
              r: new THREE.Color(moods[newMood].bg).r,
              g: new THREE.Color(moods[newMood].bg).g,
              b: new THREE.Color(moods[newMood].bg).b,
              duration: 3,
              onUpdate: () => {
                  document.body.style.backgroundColor = bgRef.current.getStyle();
              }
          });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentMood]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -2 }}>
      <Canvas 
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1]} // Fix resolution for background
      >
        <AmbientParticles mood={currentMood} />
      </Canvas>
    </div>
  );
}
