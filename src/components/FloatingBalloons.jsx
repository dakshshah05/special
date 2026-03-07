import React, { useRef, useMemo, useState, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const Balloon = memo(function Balloon({ position, color, delay = 0 }) {
  const groupRef = useRef();
  const [popped, setPopped] = useState(false);
  const startY = useRef(position[1] - 8);
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  const stringCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      points.push(new THREE.Vector3(Math.sin(t * Math.PI * 2) * 0.04, -t * 1.5, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame(({ clock }) => {
    if (popped || !groupRef.current) return;
    const t = clock.getElapsedTime();
    const elapsed = Math.max(0, t - delay);
    const riseProgress = Math.min(1, elapsed * 0.3);
    const y = startY.current + (position[1] - startY.current) * easeOut(riseProgress);
    const swayX = Math.sin(t * 0.4 + timeOffset.current) * 0.25;
    groupRef.current.position.set(position[0] + swayX, y, position[2]);
    groupRef.current.rotation.z = Math.sin(t * 0.6 + timeOffset.current) * 0.08;
  });

  if (popped) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh onClick={() => setPopped(true)}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <coneGeometry args={[0.06, 0.12, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <tubeGeometry args={[stringCurve, 10, 0.008, 3, false]} />
        <meshBasicMaterial color="#e8c4ff" transparent opacity={0.35} />
      </mesh>
    </group>
  );
});

const balloonConfigs = [
  { pos: [-4, 3, -2], color: '#ff6eb4', delay: 0.2 },
  { pos: [-2, 4, -3], color: '#ffd700', delay: 0.5 },
  { pos: [0, 3.5, -1], color: '#e8c4ff', delay: 0.3 },
  { pos: [2, 4.5, -2], color: '#ff6eb4', delay: 0.7 },
  { pos: [4, 3, -3], color: '#ffd700', delay: 0.4 },
  { pos: [-3, 5, -4], color: '#e8c4ff', delay: 0.6 },
];

export default memo(function FloatingBalloons() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 4, pointerEvents: 'auto',
    }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        {balloonConfigs.map((b, i) => (
          <Balloon key={i} position={b.pos} color={b.color} delay={b.delay + 3.5} />
        ))}
      </Canvas>
    </div>
  );
});
