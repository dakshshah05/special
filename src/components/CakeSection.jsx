import React, { useRef, useState, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReveal } from '../hooks/useReveal';

// Simple flame glow (no shader)
const Flame = memo(function Flame({ position, isLit }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current && isLit) {
      const t = clock.getElapsedTime();
      ref.current.scale.setScalar(0.8 + Math.sin(t * 8) * 0.2);
      ref.current.material.opacity = 0.7 + Math.sin(t * 6) * 0.3;
    } else if (ref.current && !isLit) {
      ref.current.material.opacity = Math.max(0, ref.current.material.opacity - 0.03);
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.06, 6, 6]} />
      <meshBasicMaterial color="#ffaa33" transparent opacity={isLit ? 0.9 : 0} />
    </mesh>
  );
});

const Candle = memo(function Candle({ position, isLit }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 6]} />
        <meshBasicMaterial color="#fff5e6" />
      </mesh>
      <Flame position={[0, 0.3, 0]} isLit={isLit} />
    </group>
  );
});

const FrostingDots = memo(function FrostingDots({ radius, y, count = 10, color = '#ff6eb4' }) {
  const dots = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
    }),
  [radius, y, count]);

  return (
    <group>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.035, 4, 4]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
});

const BirthdayCake = memo(function BirthdayCake({ onBlow }) {
  const [candlesLit, setCandlesLit] = useState(true);

  const handleClick = () => {
    if (candlesLit) {
      setCandlesLit(false);
      setTimeout(() => { if (onBlow) onBlow(); }, 1000);
    }
  };

  const candlePositions = [[0, 1.55, 0], [0.25, 1.55, 0.1], [-0.25, 1.55, -0.1], [0.1, 1.55, -0.2], [-0.1, 1.55, 0.2]];

  return (
    <group onClick={handleClick}>
      {/* Layer 1 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.55, 20]} />
        <meshStandardMaterial color="#f5e6cc" roughness={0.8} />
      </mesh>
      <FrostingDots radius={1.12} y={0.28} count={12} color="#ff6eb4" />

      {/* Layer 2 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.45, 20]} />
        <meshStandardMaterial color="#ffe4e8" roughness={0.7} />
      </mesh>
      <FrostingDots radius={0.82} y={0.73} count={10} color="#ffd700" />

      {/* Layer 3 */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.45, 20]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.6} />
      </mesh>
      <FrostingDots radius={0.57} y={1.17} count={8} color="#e8c4ff" />

      {candlePositions.map((pos, i) => (
        <Candle key={i} position={pos} isLit={candlesLit} />
      ))}

      {candlesLit && <pointLight position={[0, 1.8, 0]} intensity={0.5} color="#ffa500" distance={3} />}
    </group>
  );
});

export default memo(function CakeSection() {
  const sectionRef = useReveal({ y: 40 });
  const [blownOut, setBlownOut] = useState(false);

  return (
    <section id="cake" ref={sectionRef} className="section cake-section" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 300, color: 'var(--rose-pink)', marginBottom: '1rem',
        letterSpacing: '0.1em', textAlign: 'center', zIndex: 2,
      }}>
        Make a Wish ✦
      </h2>
      <div className="cake-canvas" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Canvas
          camera={{ position: [3, 3, 3], fov: 40 }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 3]} intensity={0.5} />
          <BirthdayCake onBlow={() => setBlownOut(true)} />
          <OrbitControls enableZoom={false} enablePan={false}
            minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2}
            autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
      <p className="blow-text" style={{ opacity: blownOut ? 0 : 0.7, transition: 'opacity 0.5s' }}>
        {blownOut ? '🎉 Wish granted!' : '✨ Click the cake to blow out the candles ✨'}
      </p>
    </section>
  );
});
