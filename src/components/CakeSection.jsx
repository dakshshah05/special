import React, { useRef, useState, useMemo, memo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReveal } from '../hooks/useReveal';
import { motion, AnimatePresence } from 'framer-motion';

// Simple flame glow
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

const BirthdayCake = memo(function BirthdayCake({ onBlow, onEat }) {
  const [candlesLit, setCandlesLit] = useState(true);
  const groupRef = useRef();

  const handleClick = () => {
    if (candlesLit) {
      setCandlesLit(false);
      setTimeout(() => { if (onBlow) onBlow(); }, 1000);
    } else {
      // Cake bounce animation
      if (groupRef.current) {
        let t = 0;
        const bounce = setInterval(() => {
          t += 0.1;
          const scale = 1 - Math.sin(t * Math.PI) * 0.1;
          const y = Math.sin(t * Math.PI) * 0.1;
          groupRef.current.scale.set(1, scale, 1);
          groupRef.current.position.y = y;
          if (t >= 1) {
            clearInterval(bounce);
            groupRef.current.scale.set(1, 1, 1);
            groupRef.current.position.y = 0;
          }
        }, 16);
      }
      if (onEat) onEat();
    }
  };

  const candlePositions = [[0, 1.55, 0], [0.25, 1.55, 0.1], [-0.25, 1.55, -0.1], [0.1, 1.55, -0.2], [-0.1, 1.55, 0.2]];

  return (
    <group ref={groupRef} onClick={handleClick}>
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
  const [slices, setSlices] = useState([]);
  const [sliceCount, setSliceCount] = useState(0);

  const handleEat = useCallback(() => {
    setSliceCount(c => c + 1);
    const newSlice = {
      id: Date.now(),
      x: 30 + Math.random() * 40, // percentage 30-70%
      y: 30 + Math.random() * 30,
      rot: (Math.random() - 0.5) * 30
    };
    setSlices(prev => [...prev.slice(-4), newSlice]);
  }, []);

  return (
    <section id="cake" ref={sectionRef} className="section cake-section" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative'
    }}>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 300, color: 'var(--rose-pink)', marginBottom: '1rem',
        letterSpacing: '0.1em', textAlign: 'center', zIndex: 2,
      }}>
        Make a Wish ✦
      </h2>
      <div className="cake-canvas interactive" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
        <Canvas
          camera={{ position: [3, 3, 3], fov: 40 }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 3]} intensity={0.5} />
          <BirthdayCake onBlow={() => setBlownOut(true)} onEat={handleEat} />
          <OrbitControls enableZoom={false} enablePan={false}
            minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2}
            autoRotate autoRotateSpeed={0.5} />
        </Canvas>

        {/* Floating slice easter eggs */}
        <AnimatePresence>
          {slices.map(s => (
            <motion.div key={s.id}
              style={{
                position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
                fontFamily: 'var(--font-serif)', fontSize: '2rem',
                color: 'var(--starlight-gold)', fontWeight: 'bold',
                pointerEvents: 'none', zIndex: 10,
                textShadow: '0 0 10px rgba(255,215,0,0.5)'
              }}
              initial={{ opacity: 1, y: 0, scale: 0.5, rotate: s.rot }}
              animate={{ opacity: 0, y: -100, scale: 1.2, rotate: s.rot + 10 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              onAnimationComplete={() => setSlices(prev => prev.filter(x => x.id !== s.id))}
            >
              +1 Slice 🍰
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="blow-text" style={{ transition: 'opacity 0.5s' }}>
        {!blownOut && '✨ Click the cake to blow out the candles ✨'}
        {blownOut && sliceCount === 0 && '🎉 Wish granted! Click the cake to grab a slice!'}
        {blownOut && sliceCount > 0 && `You've eaten ${sliceCount} slice${sliceCount > 1 ? 's' : ''} 🍰`}
      </p>
    </section>
  );
});
