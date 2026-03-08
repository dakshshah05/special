import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Center, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Rose({ position, index, isGolden, onRoseClick }) {
  const groupRef = useRef();
  const petalsRef = useRef();
  const [hovered, setHovered] = useState(false);

  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 10; i++) { // Reduced segments
        points.push(new THREE.Vector3(Math.sin(i * 0.2) * 0.05, i * 0.15, Math.cos(i * 0.2) * 0.05));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame(() => {
    if (petalsRef.current) petalsRef.current.rotation.y += 0.01;
  });

  return (
    <group position={position} ref={groupRef} onClick={() => onRoseClick(isGolden)}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh>
          <tubeGeometry args={[curve, 10, 0.02, 6, false]} />
          <meshStandardMaterial color={isGolden ? '#aa8800' : '#2d4d22'} />
        </mesh>
        <group position={[0, 1.5, 0]} ref={petalsRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          {[...Array(6)].map((_, i) => ( // Reduced petals
            <mesh key={i} rotation={[0, (i / 6) * Math.PI * 2, Math.PI / 4]}>
              <sphereGeometry args={[0.25, 12, 12]} />
              <meshStandardMaterial 
                color={isGolden ? '#ffd700' : '#ff6eb4'} 
                emissive={isGolden ? '#ffd700' : '#ff6eb4'}
                emissiveIntensity={hovered ? 0.8 : 0.2}
              />
            </mesh>
          ))}
          {hovered && <Sparkles count={10} scale={1} size={2} color={isGolden ? "#ffd700" : "#ff6eb4"} />}
        </group>
      </Float>
    </group>
  );
}

export default function RoseGarden({ onGoldenRoseClick }) {
  const [sunshineReveal, setSunshineReveal] = useState(false);

  const rosePositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < 20; i++) {
        pos.push([(i - 10) * 1.5 + (Math.random() - 0.5), -2, (Math.random() - 0.5) * 3]);
    }
    return pos;
  }, []);

  return (
    <section id="rose-garden" className="section rose-garden-section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-title-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 className="garden-title">Garden of 20 Roses 🌹</h2>
        <p className="garden-subtitle">Each one representing a year of your beauty</p>
      </div>
      <div style={{ width: '100%', height: '70vh' }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 40 }} gl={{ antialias: false }} dpr={1}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Center>
            {rosePositions.map((pos, i) => (
              <Rose key={i} position={pos} index={i} isGolden={i === 19} onRoseClick={(gold) => {
                  if (gold) { setSunshineReveal(true); onGoldenRoseClick(); }
              }} />
            ))}
          </Center>
        </Canvas>
      </div>
      {sunshineReveal && (
        <div className="sunshine-overlay active" style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'linear-gradient(to bottom, #ffd700, #ff6eb4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div className="sunshine-text" style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>YOU ARE MY SUNSHINE ☀️</div>
          <button onClick={() => setSunshineReveal(false)} style={{ marginTop: '2rem', padding: '10px 30px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}>Close</button>
        </div>
      )}
    </section>
  );
}
