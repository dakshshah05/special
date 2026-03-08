import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PETAL_COUNT = 300; 

function Petals({ scrollVelocity }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Basic colors as fallback to avoid texture loading issues
  const colors = ['#ff6eb4', '#ffd700', '#e8c4ff', '#ffffff'];

  const petals = useMemo(() => {
    return Array.from({ length: PETAL_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 20 - 10,
      z: (Math.random() - 0.5) * 10,
      speed: 0.1 + Math.random() * 0.4,
      rotSpeed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      size: 0.1 + Math.random() * 0.2,
      color: colors[i % 4]
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const velocity = scrollVelocity.current || 0;
    
    petals.forEach((p, i) => {
      const fallSpeed = p.speed * 0.1;
      const combinedSpeed = fallSpeed + (velocity * 0.005);
      
      p.y -= combinedSpeed;
      if (p.y < -12) p.y = 12;
      if (p.y > 12) p.y = -12;

      const sway = Math.sin(t * 0.4 + p.phase) * 0.6;
      
      dummy.position.set(p.x + sway, p.y, p.z);
      dummy.rotation.set(
        t * p.rotSpeed * 0.2,
        t * p.rotSpeed * 0.4 + p.phase,
        t * p.rotSpeed * 0.1
      );
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, PETAL_COUNT]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        color="#ff6eb4"
        transparent 
        opacity={0.6} 
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

export default function PetalStorm() {
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      scrollVelocity.current = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 60 }} 
        gl={{ 
            alpha: true, 
            antialias: false, 
            powerPreference: 'high-performance'
        }}
        dpr={1} 
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Petals scrollVelocity={scrollVelocity} />
      </Canvas>
    </div>
  );
}
