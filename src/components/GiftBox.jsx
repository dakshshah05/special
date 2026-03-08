import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export default function GiftBox({ isOpen, onClick }) {
  const meshRef = useRef();
  const lidRef = useRef();

  useFrame(() => {
    if (meshRef.current && !isOpen) meshRef.current.rotation.y += 0.005;
  });

  useEffect(() => {
    if (isOpen && lidRef.current) {
        gsap.to(lidRef.current.position, { y: 2.5, duration: 1.5, ease: 'elastic.out(1, 0.3)' });
        gsap.to(lidRef.current.rotation, { x: -Math.PI / 1.5, z: Math.PI / 8, duration: 1.5 });
    }
  }, [isOpen]);

  const ribbonMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffd700', roughness: 0.1, metalness: 0.8 }), []);

  return (
    <group ref={meshRef} onClick={onClick}>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff6eb4" roughness={0.5} />
      </mesh>
      <group position={[0, 0.6, 0]} ref={lidRef}>
        <mesh>
            <boxGeometry args={[2.2, 0.4, 2.2]} />
            <meshStandardMaterial color="#ff6eb4" roughness={0.5} />
        </mesh>
      </group>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2.1, 2.1, 0.3]} />
        <primitive object={ribbonMaterial} attach="material" />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.3, 2.1, 2.1]} />
        <primitive object={ribbonMaterial} attach="material" />
      </mesh>
    </group>
  );
}
