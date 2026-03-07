import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useScroll as useDreiScroll } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Custom shader material for the petals to give them a velvety look
const petalMaterial = new THREE.MeshPhysicalMaterial({
  color: '#d10047',
  emissive: '#1a0005',
  roughness: 0.8,
  metalness: 0.1,
  clearcoat: 0.1,
  clearcoatRoughness: 0.4,
  side: THREE.DoubleSide
});

const goldenPetalMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ffd700',
  emissive: '#332a00',
  roughness: 0.2,
  metalness: 0.9,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  side: THREE.DoubleSide
});

const stemMaterial = new THREE.MeshStandardMaterial({
  color: '#0a4214',
  roughness: 0.9,
});

// A single procedural 3D Rose
const Rose = ({ position, isGolden, delay = 0 }) => {
  const groupRef = useRef();
  const petalsRef = useRef();
  const stemRef = useRef();

  // Procedural stem path (a slight bezier curve)
  const stemCurve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, -3, 0),
      new THREE.Vector3((Math.random() - 0.5) * 2, -1, (Math.random() - 0.5) * 2),
      new THREE.Vector3(0, 0, 0)
    );
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    // The rose starts hidden and scaled down
    groupRef.current.scale.setScalar(0);
    groupRef.current.position.y -= 5;

    // Animate growing up from the ground
    gsap.to(groupRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 2,
      delay: delay,
      ease: "elastic.out(1, 0.75)",
      scrollTrigger: {
        trigger: ".roses-container",
        start: "top 70%",
      }
    });

    gsap.to(groupRef.current.position, {
      y: position[1],
      duration: 2,
      delay: delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".roses-container",
        start: "top 70%",
      }
    });
  }, [delay, position]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle wind sway
      const t = clock.getElapsedTime() + delay;
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
      groupRef.current.rotation.x = Math.cos(t * 0.4) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[position[0], position[1] - 5, position[2]]}>
      {/* Stem */}
      <mesh ref={stemRef}>
        <tubeGeometry args={[stemCurve, 20, 0.05, 8, false]} />
        <primitive object={stemMaterial} />
      </mesh>

      {/* Flower Head */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2}>
        <group ref={petalsRef} position={[0, 0.2, 0]}>
          {/* Simple geometric representation of a rose for performance */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 0.3;
            return (
              <mesh 
                key={i} 
                position={[Math.cos(angle) * (radius - 0.1), Math.sin(angle) * 0.2, Math.sin(angle) * (radius - 0.1)]}
                rotation={[Math.PI / 4, angle, 0]}
              >
                <circleGeometry args={[0.3, 16]} />
                <primitive object={isGolden ? goldenPetalMaterial : petalMaterial} />
              </mesh>
            );
          })}
          {/* Inner core */}
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <primitive object={isGolden ? goldenPetalMaterial : petalMaterial} />
          </mesh>
          
          {isGolden && <pointLight distance={3} intensity={5} color="#ffd700" />}
        </group>
      </Float>
    </group>
  );
};

export default function RosesSection() {
  // Generate 20 random positions for the roses
  const rosePositions = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      // The 20th rose is the golden one, place it front and center
      if (i === 19) return [0, -1, 3];
      
      return [
        (Math.random() - 0.5) * 12, // x spread
        (Math.random() - 0.5) * 2 - 1, // y variation (height)
        (Math.random() - 0.5) * 6 - 2 // z depth
      ];
    });
  }, []);

  return (
    <section className="section roses-container" style={{ position: 'relative', height: '120vh', background: 'linear-gradient(to top, #0a0010, var(--deep-void))' }}>
      
      <div style={{ position: 'absolute', top: '10%', width: '100%', textAlign: 'center', zIndex: 2, pointerEvents: 'none' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          color: 'var(--starlight-gold)',
          textShadow: '0 5px 15px rgba(0,0,0,0.5)'
        }}>
          20 Roses for 20 Years
        </h2>
        <p style={{ color: 'var(--rose-pink)', marginTop: '1rem', fontStyle: 'italic', letterSpacing: '0.1em' }}>
          Find the golden rose...
        </p>
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'auto' }}>
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffd700" />
          <pointLight position={[-5, 5, -5]} intensity={1} color="#ff6eb4" />
          
          <group position={[0, -2, 0]}>
            {rosePositions.map((pos, index) => (
              <Rose 
                key={index} 
                position={pos} 
                isGolden={index === 19} // 20th rose is golden
                delay={index * 0.1} // Staggered growth
                onClick={() => {
                  if (index === 19) setSunshineVisible(true);
                }}
              />
            ))}
          </group>
        </Canvas>
      </div>

      <AnimatePresence>
        {sunshineVisible && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.2), rgba(10, 0, 15, 0.95))',
              cursor: 'pointer'
            }}
            onClick={() => setSunshineVisible(false)}
          >
            <motion.h1
              initial={{ scale: 0.8, y: 50, filter: 'blur(10px)' }}
              animate={{ scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ scale: 1.1, filter: 'blur(10px)', opacity: 0 }}
              transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 8vw, 6rem)',
                color: '#ffd700', textAlign: 'center', textShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
                fontStyle: 'italic', padding: '0 2rem'
              }}
            >
              You are my sunshine... 🌻
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
      
    </section>
  );
}
