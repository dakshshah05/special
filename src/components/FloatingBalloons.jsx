import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Balloon({ position, color, delay = 0 }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const [popped, setPopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const startY = useRef(position[1] - 8);
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  // Balloon string curve
  const stringCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      points.push(new THREE.Vector3(
        Math.sin(t * Math.PI * 2) * 0.05,
        -t * 1.8,
        0
      ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame(({ clock }) => {
    if (popped || !groupRef.current) return;
    const t = clock.getElapsedTime();
    const elapsed = Math.max(0, t - delay);

    // Rising animation
    const riseProgress = Math.min(1, elapsed * 0.3);
    const targetY = position[1];
    const y = startY.current + (targetY - startY.current) * easeOut(riseProgress);

    // Sway
    const swayX = Math.sin(t * 0.5 + timeOffset.current) * 0.3;
    const swayZ = Math.cos(t * 0.3 + timeOffset.current) * 0.2;

    groupRef.current.position.set(
      position[0] + swayX,
      y,
      position[2] + swayZ
    );

    // Gentle rotation
    groupRef.current.rotation.z = Math.sin(t * 0.8 + timeOffset.current) * 0.1;
  });

  const handlePop = () => {
    if (popped) return;
    setPopped(true);
  };

  if (popped) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Balloon body */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handlePop}
        scale={hovered ? 1.15 : 1}
      >
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.85}
          roughness={0.05}
          metalness={0.1}
          thickness={0.5}
          ior={1.5}
          transparent
          opacity={0.9}
          envMapIntensity={1}
        />
      </mesh>

      {/* Balloon knot */}
      <mesh position={[0, -0.65, 0]}>
        <coneGeometry args={[0.08, 0.15, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Balloon string */}
      <mesh position={[0, -0.65, 0]}>
        <tubeGeometry args={[stringCurve, 20, 0.01, 4, false]} />
        <meshStandardMaterial color="#e8c4ff" transparent opacity={0.4} />
      </mesh>

      {/* Inner glow */}
      <pointLight position={[0, 0, 0]} intensity={0.3} color={color} distance={2} />
    </group>
  );
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function PopParticles({ position, color, count = 20 }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      dir: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize(),
      speed: 1 + Math.random() * 3,
      scale: 0.02 + Math.random() * 0.04,
    })),
  [count]);

  const startTime = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (!startTime.current) startTime.current = clock.getElapsedTime();

    const elapsed = clock.getElapsedTime() - startTime.current;
    if (elapsed > 2) return;

    particles.forEach((p, i) => {
      const progress = elapsed * p.speed;
      dummy.position.set(
        position[0] + p.dir.x * progress,
        position[1] + p.dir.y * progress - elapsed * elapsed * 0.5,
        position[2] + p.dir.z * progress
      );
      dummy.scale.setScalar(p.scale * Math.max(0, 1 - elapsed * 0.5));
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
}

const balloonConfigs = [
  { pos: [-4, 3, -2], color: '#ff6eb4', delay: 0.2 },
  { pos: [-2, 4, -3], color: '#ffd700', delay: 0.5 },
  { pos: [0, 3.5, -1], color: '#e8c4ff', delay: 0.3 },
  { pos: [2, 4.5, -2], color: '#ff6eb4', delay: 0.7 },
  { pos: [4, 3, -3], color: '#ffd700', delay: 0.4 },
  { pos: [-3, 5, -4], color: '#e8c4ff', delay: 0.6 },
  { pos: [1, 5.5, -2], color: '#ff6eb4', delay: 0.9 },
  { pos: [3, 4, -1], color: '#ffd700', delay: 0.8 },
];

export default function FloatingBalloons() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100vh',
      zIndex: 4,
      pointerEvents: 'auto',
    }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        {balloonConfigs.map((b, i) => (
          <Balloon
            key={i}
            position={b.pos}
            color={b.color}
            delay={b.delay + 3.5}
          />
        ))}
      </Canvas>
    </div>
  );
}
