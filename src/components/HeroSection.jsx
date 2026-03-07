import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Lightweight star system - reduced count, simpler shader
const StarField = memo(function StarField({ count = 2000 }) {
  const pointsRef = useRef();

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 20;
      sizes[i] = Math.random() * 2.5 + 0.5;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, sizes, phases };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" array={sizes} count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" array={phases} count={count} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          uniform float uTime;
          uniform float uPixelRatio;
          attribute float aSize;
          attribute float aPhase;
          varying float vAlpha;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float twinkle = 0.6 + 0.4 * sin(uTime * 1.5 + aPhase);
            gl_PointSize = aSize * uPixelRatio * twinkle * (150.0 / -mvPosition.z);
            gl_PointSize = max(gl_PointSize, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            vAlpha = twinkle;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            float alpha = smoothstep(0.5, 0.0, d) * vAlpha * 0.7;
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
          }
        `}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

// Simplified rose petals - fewer, simpler
const RosePetals = memo(function RosePetals({ count = 15 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const petals = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 15 + 5,
      z: (Math.random() - 0.5) * 10 - 5,
      speed: 0.3 + Math.random() * 0.4,
      rotSpeed: 0.5 + Math.random() * 1.5,
      swayAmp: 0.5 + Math.random() * 1,
      swayFreq: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      scale: 0.08 + Math.random() * 0.1,
    })),
  [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    petals.forEach((p, i) => {
      let y = p.y - (t * p.speed) % 20;
      if (y < -5) y += 20;
      const sway = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp;
      dummy.position.set(p.x + sway, y, p.z);
      dummy.rotation.set(t * p.rotSpeed * 0.3, t * p.rotSpeed * 0.5, p.phase);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <planeGeometry args={[1, 1.3]} />
      <meshBasicMaterial color="#ff6eb4" transparent opacity={0.5} side={THREE.DoubleSide} />
    </instancedMesh>
  );
});

// Interactive Constellation (S shape for Shariya)
const InteractiveConstellation = memo(function InteractiveConstellation() {
  const [activePoints, setActivePoints] = useState([]);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const { viewport } = useThree();

  // Define points for an elegant "S" shape
  const sPoints = useMemo(() => [
    new THREE.Vector3(1.5, 2.5, 0),
    new THREE.Vector3(0, 3, 0),
    new THREE.Vector3(-1.5, 2.5, 0),
    new THREE.Vector3(-2, 1, 0),
    new THREE.Vector3(-1, -0.5, 0),
    new THREE.Vector3(1, -1.5, 0),
    new THREE.Vector3(2, -3, 0),
    new THREE.Vector3(1.5, -4.5, 0),
    new THREE.Vector3(0, -5, 0),
    new THREE.Vector3(-1.5, -4.5, 0),
  ], []);

  // Use a slightly larger invisible hit area for each star
  return (
    <group 
      onPointerDown={() => setIsPointerDown(true)} 
      onPointerUp={() => setIsPointerDown(false)}
      onPointerLeave={() => setIsPointerDown(false)}
    >
      {/* Render the stars in the shape */}
      {sPoints.map((pos, i) => {
        const isActive = activePoints.includes(i);
        return (
          <mesh 
            key={i} 
            position={pos}
            onPointerOver={() => {
              if (isPointerDown && !isActive) {
                setActivePoints(prev => [...prev, i]);
              }
            }}
          >
            {/* The visible star */}
            <sphereGeometry args={[isActive ? 0.15 : 0.08, 16, 16]} />
            <meshBasicMaterial color={isActive ? "#ffd700" : "#ffffff"} />
            {/* Invisible larger hit area for easier dragging */}
            <mesh>
              <sphereGeometry args={[0.8, 8, 8]} />
              <meshBasicMaterial visible={false} />
            </mesh>
            {isActive && (
              <pointLight distance={3} intensity={1} color="#ffd700" />
            )}
          </mesh>
        );
      })}

      {/* Draw the connecting lines */}
      {activePoints.length > 1 && (
        <Line
          points={activePoints.map(i => sPoints[i])}
          color="#ff6eb4"
          lineWidth={3}
          transparent
          opacity={0.8}
        />
      )}
    </group>
  );
});

// Simple 3D elements instead of text geometry
const HeroElements = memo(function HeroElements() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={groupRef}>
        <mesh>
          <torusGeometry args={[2, 0.06, 16, 80]} />
          <meshBasicMaterial color="#ff6eb4" transparent opacity={0.7} />
        </mesh>
        <mesh>
          <torusGeometry args={[2.5, 0.03, 16, 80]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.4} />
        </mesh>
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color={i % 2 === 0 ? "#ff6eb4" : "#ffd700"} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
});

export default function HeroSection() {
  const sectionRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 3.5 });
    tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' },
        '-=0.8'
      );
    }
    return () => tl.kill();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="section" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'auto' }}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          style={{ background: 'transparent' }}
          raycaster={{ computeOffsets: (e) => ({ offsetX: e.clientX, offsetY: e.clientY }) }}
        >
          <StarField count={2000} />
          <RosePetals count={15} />
          <HeroElements />
          <InteractiveConstellation />
        </Canvas>
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 3, pointerEvents: 'none',
      }}>
        <div ref={titleRef} style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(3rem, 10vw, 8rem)',
          fontWeight: 300, letterSpacing: '0.1em',
          background: 'linear-gradient(135deg, #ff6eb4, #ffd700, #e8c4ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 30px rgba(255,110,180,0.3))',
          opacity: 0,
        }}>
          Shariya
        </div>
        <div ref={subtitleRef} className="hero-subtitle"
          style={{ opacity: 0, transform: 'translateY(20px)' }}>
          ✦ Turning 20 · March 11th ✦
        </div>
      </div>
      <div className="hero-overlay" style={{ pointerEvents: 'none' }} />
    </section>
  );
}
