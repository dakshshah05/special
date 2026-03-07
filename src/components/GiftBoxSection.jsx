/* eslint-disable no-unused-vars, react-hooks/purity, react-hooks/immutability, react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect, memo, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const REASONS = [
  "You always know how to make me laugh.",
  "Your kindness is literally magnetic.",
  "You light up every room you walk into.",
  "You're the most beautiful person I know, inside and out.",
  "Your smile is my absolute favorite thing.",
  "You give the best advice.",
  "You're fiercely loyal to the people you love.",
  "Your sense of humor perfectly matches mine.",
  "You have the most beautiful soul.",
  "You make the mundane things feel magical.",
  "Your strength inspires me daily.",
  "You never give up on what you want.",
  "Your compassion for others is endless.",
  "You always see the best in me.",
  "You make my worst days instantly better.",
  "You're incredibly smart and driven.",
  "You're my safe space.",
  "You radiate positive energy.",
  "You're undeniably, uniquely, unapologetically *you*.",
  "Because no one else could ever be Shariya."
];

// Mini particle system that bursts when box opens
const ParticleBurst = ({ active }) => {
  const meshRef = useRef();
  const dummy = useRef(new THREE.Object3D());
  const count = 50;
  
  const particles = useMemo(() => 
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(0, 0, 0),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        Math.random() * 15 + 5,
        (Math.random() - 0.5) * 15
      ),
      rot: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      scale: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#ff6eb4' : '#ffd700'
    }))
  , [count]);

  useFrame((_, delta) => {
    if (!active || !meshRef.current) return;
    
    particles.forEach((p, i) => {
      p.pos.addScaledVector(p.vel, delta);
      p.vel.y -= 15 * delta; // Gravity
      
      dummy.current.position.copy(p.pos);
      dummy.current.rotation.x += delta * 2;
      dummy.current.rotation.y += delta * 2;
      dummy.current.scale.setScalar(p.scale);
      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshPhysicalMaterial roughness={0.1} metalness={0.8} color="#fff" />
    </instancedMesh>
  );
};

// Physics-driven gift box using react-spring
const SceneObject = memo(({ isOpen, setOpen }) => {
  // Spring animations for the lid popping off
  const { lidPosition, lidRotation, boxScale } = useSpring({
    lidPosition: isOpen ? [0, 5, -2] : [0, 1.05, 0],
    lidRotation: isOpen ? [Math.PI / 4, 0, 0] : [0, 0, 0],
    boxScale: isOpen ? [1.1, 1.1, 1.1] : [1, 1, 1],
    config: { mass: 2, tension: 170, friction: 12 }
  });

  return (
    <group position={[0, -1, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <animated.group scale={boxScale} onClick={() => setOpen(true)} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'default'}>
          {/* Box Bottom */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#3a0ca3" roughness={0.2} />
          </mesh>
          {/* Vertical Ribbon */}
          <mesh position={[0, 0, 1.01]}>
            <planeGeometry args={[0.4, 2]} />
            <meshStandardMaterial color="#ffd700" roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Golden 20 that floats up */}
          {isOpen && (
            <Float speed={3} rotationIntensity={0.5}>
              <Text
                position={[0, 3, 0]}
                fontSize={2}
                color="#ffd700"
                font="https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYpntKvc6o.woff"
                material-toneMapped={false}
              >
                20
                <meshStandardMaterial roughness={0.1} metalness={0.9} emissive="#ffd700" emissiveIntensity={0.5} />
              </Text>
            </Float>
          )}

          {/* Burst Particles */}
          <ParticleBurst active={isOpen} />

          {/* Box Lid - Physics driven */}
          <animated.group position={lidPosition} rotation={lidRotation}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.1, 0.4, 2.1]} />
              <meshStandardMaterial color="#4361ee" roughness={0.2} />
            </mesh>
            {/* Ribbon Cross on top */}
            <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.4, 2.1]} />
              <meshStandardMaterial color="#ffd700" roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
              <planeGeometry args={[0.4, 2.1]} />
              <meshStandardMaterial color="#ffd700" roughness={0.4} metalness={0.8} />
            </mesh>
            {/* The Bow */}
            <mesh position={[0, 0.5, 0]}>
              <torusGeometry args={[0.3, 0.1, 16, 32]} />
              <meshStandardMaterial color="#ffd700" roughness={0.4} metalness={0.8} />
            </mesh>
          </animated.group>

        </animated.group>
      </Float>

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#ff6eb4" />
    </group>
  );
});

// Typewriter scroll overlay
const MagicalScroll = ({ open }) => {
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setIndex(prev => {
        if (prev < REASONS.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 2000); // Reveal a new reason every 2 seconds
    return () => clearInterval(interval);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="magical-scroll-container"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '70vh' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <div className="scroll-paper">
            <h3 className="scroll-title">20 Reasons Why You're Amazing</h3>
            <ul className="reasons-list">
              <AnimatePresence>
                {REASONS.slice(0, index + 1).map((reason, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8 }}
                  >
                    <span>{i + 1}.</span> {reason}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function GiftBoxSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="section" style={{ position: 'relative', overflow: 'hidden', background: '#0a0010' }}>
      
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'auto' }}>
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }} shadows>
          <SceneObject isOpen={isOpen} setOpen={setIsOpen} />
        </Canvas>
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MagicalScroll open={isOpen} />
      </div>

      {!isOpen && (
        <motion.div 
          style={{ position: 'absolute', bottom: '10%', width: '100%', textAlign: 'center', zIndex: 3, pointerEvents: 'none', color: '#fff', opacity: 0.7, letterSpacing: '0.2em' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          âœ¦ Tap the Gift âœ¦
        </motion.div>
      )}
      
    </section>
  );
}

