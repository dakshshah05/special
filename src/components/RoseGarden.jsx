import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Center, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

function Rose({ position, index, isGolden, onRoseClick }) {
  const [bloomed, setBloomed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const stemRef = useRef();
  const petalsRef = useRef();
  const groupRef = useRef();

  // Create stem geometry
  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
        points.push(new THREE.Vector3(
            Math.sin(i * 0.2) * 0.1,
            i * 0.15,
            Math.cos(i * 0.2) * 0.1
        ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const { stemWidth, stemColor } = useMemo(() => ({
    stemWidth: 0.02,
    stemColor: isGolden ? '#aa8800' : '#2d4d22'
  }), [isGolden]);

  useFrame((state) => {
    if (groupRef.current) {
        // Growth based on scroll would be better, but we'll use a local state or logic
        // For now, let's keep it reactive to a "bloom" state
    }
    if (petalsRef.current) {
        petalsRef.current.rotation.y += 0.01;
    }
  });

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);

  return (
    <group position={position} ref={groupRef} onClick={() => onRoseClick(isGolden)}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Stem */}
        <mesh ref={stemRef}>
          <tubeGeometry args={[curve, 20, stemWidth, 8, false]} />
          <meshStandardMaterial color={stemColor} />
        </mesh>

        {/* Petals (Simplified procedural rose) */}
        <group position={[0, 3, 0]} ref={petalsRef} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
          {[...Array(8)].map((_, i) => (
            <mesh key={i} rotation={[0, (i / 8) * Math.PI * 2, Math.PI / 4]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial 
                color={isGolden ? '#ffd700' : '#ff6eb4'} 
                emissive={isGolden ? '#ffd700' : '#ff6eb4'}
                emissiveIntensity={hovered ? 0.8 : 0.2}
              />
            </mesh>
          ))}
          {hovered && <Sparkles count={20} scale={1.5} size={2} color={isGolden ? "#ffd700" : "#ff6eb4"} />}
        </group>
      </Float>
    </group>
  );
}

export default function RoseGarden({ onGoldenRoseClick }) {
  const [sunshineReveal, setSunshineReveal] = useState(false);

  const handleRoseClick = (isGolden) => {
    if (isGolden) {
        setSunshineReveal(true);
        onGoldenRoseClick();
    }
  };

  const rosePositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < 20; i++) {
        pos.push([
            (i - 10) * 1.5 + (Math.random() - 0.5) * 1,
            -2,
            (Math.random() - 0.5) * 3
        ]);
    }
    return pos;
  }, []);

  return (
    <section id="rose-garden" className="section rose-garden-section">
      <div className="section-title-container">
        <h2 className="garden-title">Garden of 20 Roses 🌹</h2>
        <p className="garden-subtitle">Each one representing a year of your beauty</p>
      </div>

      <div style={{ width: '100%', height: '80vh' }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 40 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Center>
            {rosePositions.map((pos, i) => (
              <Rose 
                key={i} 
                position={pos} 
                index={i} 
                isGolden={i === 19}
                onRoseClick={handleRoseClick}
              />
            ))}
          </Center>
        </Canvas>
      </div>

      {sunshineReveal && (
        <div className="sunshine-overlay active">
          <div className="sunshine-text">YOU ARE MY SUNSHINE ☀️</div>
          <button className="close-sunshine" onClick={() => setSunshineReveal(false)}>Close</button>
        </div>
      )}
    </section>
  );
}
