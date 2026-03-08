import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReveal } from '../hooks/useReveal';

// Flickering flame shader
function Flame({ position = [0, 0, 0], isLit = true }) {
  const meshRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpacity: { value: isLit ? 1.0 : 0.0 },
  }), []);

  const fragmentShader = `
    uniform float uTime;
    uniform float uOpacity;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      float flame = smoothstep(1.0, 0.0, uv.y);
      float flicker = sin(uTime * 8.0 + uv.x * 10.0) * 0.15 + 0.85;
      float shape = smoothstep(0.5, 0.0, abs(uv.x - 0.5)) * flame;
      
      vec3 innerColor = vec3(1.0, 0.95, 0.6);
      vec3 outerColor = vec3(1.0, 0.4, 0.1);
      vec3 color = mix(outerColor, innerColor, shape);
      
      float alpha = shape * flicker * uOpacity;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.x += sin(uTime * 6.0 + position.y * 4.0) * 0.03;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uOpacity.value = isLit ? 1.0 : Math.max(0, uniforms.uOpacity.value - 0.02);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.15, 0.3, 8, 8]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Candle
function Candle({ position, isLit = true }) {
  return (
    <group position={position}>
      {/* Candle body */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#fff5e6" emissive="#ffd700" emissiveIntensity={0.1} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.06, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Flame */}
      <Flame position={[0, 0.42, 0]} isLit={isLit} />
      {/* Flame light */}
      {isLit && (
        <pointLight
          position={[0, 0.45, 0]}
          intensity={0.3}
          color="#ffa500"
          distance={2}
        />
      )}
    </group>
  );
}

// Frosting drips around layer edge
function FrostingDrips({ radius, y, count = 16, color = '#ff6eb4' }) {
  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dripHeight = 0.1 + Math.random() * 0.15;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              -dripHeight / 2,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Smoke particles
function SmokeParticles({ active }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 30;

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.3,
      speed: 0.5 + Math.random() * 1,
      phase: Math.random() * Math.PI * 2,
    })),
  []);

  const startTime = useRef(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !active) return;
    if (!startTime.current) startTime.current = clock.getElapsedTime();

    const elapsed = clock.getElapsedTime() - startTime.current;

    particles.forEach((p, i) => {
      const t = elapsed * p.speed;
      dummy.position.set(
        p.x + Math.sin(t * 2 + p.phase) * 0.1,
        t * 0.8,
        0
      );
      const s = Math.max(0, 0.03 * (1 - elapsed * 0.3));
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#888888" transparent opacity={0.3} />
    </instancedMesh>
  );
}

// Confetti burst
function CakeConfetti({ active, count = 60 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      dir: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2 + 1,
        (Math.random() - 0.5) * 2
      ),
      rotSpeed: Math.random() * 5,
      color: Math.floor(Math.random() * 3),
    })),
  [count]);

  const startTime = useRef(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !active) return;
    if (!startTime.current) startTime.current = clock.getElapsedTime();

    const elapsed = clock.getElapsedTime() - startTime.current;

    particles.forEach((p, i) => {
      const t = elapsed;
      dummy.position.set(
        p.dir.x * t * 2,
        p.dir.y * t * 2 - t * t * 2,
        p.dir.z * t * 2
      );
      dummy.position.y += 1.5;
      dummy.rotation.set(t * p.rotSpeed, t * p.rotSpeed * 0.5, 0);
      const s = Math.max(0, 0.04 * (1 - elapsed * 0.3));
      dummy.scale.set(s, s * 1.5, s * 0.3);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff6eb4" emissive="#ffd700" emissiveIntensity={0.3} />
    </instancedMesh>
  );
}

// Main birthday cake
function BirthdayCake({ onBlow }) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [showSmoke, setShowSmoke] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const cakeRef = useRef();

  useFrame(({ clock }) => {
    if (cakeRef.current) {
      cakeRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  const handleClick = () => {
    if (candlesLit) {
      setCandlesLit(false);
      setShowSmoke(true);
      setTimeout(() => {
        setShowConfetti(true);
        if (onBlow) onBlow();
      }, 1000);
    }
  };

  const candlePositions = [
    [0, 1.55, 0],
    [0.3, 1.55, 0.1],
    [-0.3, 1.55, -0.1],
    [0.15, 1.55, -0.25],
    [-0.15, 1.55, 0.25],
  ];

  return (
    <group ref={cakeRef} onClick={handleClick}>
      {/* Layer 1 (bottom) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.6, 32]} />
        <meshStandardMaterial color="#f5e6cc" roughness={0.8} />
      </mesh>
      <FrostingDrips radius={1.22} y={0.3} count={20} color="#ff6eb4" />

      {/* Layer 2 (middle) */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.5, 32]} />
        <meshStandardMaterial color="#ffe4e8" roughness={0.7} />
      </mesh>
      <FrostingDrips radius={0.92} y={0.8} count={16} color="#ffd700" />

      {/* Layer 3 (top) */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.5, 32]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.6} />
      </mesh>
      <FrostingDrips radius={0.67} y={1.3} count={12} color="#e8c4ff" />

      {/* Top decoration - small spheres */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.4, 1.35, Math.sin(angle) * 0.4]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#ff6eb4' : '#ffd700'}
              emissive={i % 2 === 0 ? '#ff6eb4' : '#ffd700'}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}

      {/* Candles */}
      {candlePositions.map((pos, i) => (
        <Candle key={i} position={pos} isLit={candlesLit} />
      ))}

      {/* Inner glow light */}
      <pointLight position={[0, 1, 0]} intensity={candlesLit ? 0.8 : 0.1} color="#ffa500" distance={4} />

      {/* Smoke particles */}
      <SmokeParticles active={showSmoke} />

      {/* Confetti */}
      <CakeConfetti active={showConfetti} />
    </group>
  );
}

export default function CakeSection() {
  const sectionRef = useReveal({ y: 40 });
  const [blownOut, setBlownOut] = useState(false);

  return (
    <section id="cake" ref={sectionRef} className="section cake-section" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 300,
        color: 'var(--rose-pink)',
        marginBottom: '1rem',
        letterSpacing: '0.1em',
        textAlign: 'center',
        zIndex: 2,
      }}>
        Make a Wish ✦
      </h2>

      <div className="cake-canvas" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Canvas 
          camera={{ position: [3, 3, 3], fov: 40 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 3]} intensity={0.6} />
          <pointLight position={[-3, 3, -3]} intensity={0.3} color="#e8c4ff" />
          <BirthdayCake onBlow={() => setBlownOut(true)} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      <p className="blow-text" style={{ opacity: blownOut ? 0 : 0.7, transition: 'opacity 0.5s' }}>
        {blownOut ? '🎉 Wish granted!' : '✨ Click the cake to blow out the candles ✨'}
      </p>
    </section>
  );
}
