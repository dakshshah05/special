import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StarField from './StarField';

gsap.registerPlugin(ScrollTrigger);

// Rose Petals component
function RosePetals({ count = 30 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 15 + 5,
      z: (Math.random() - 0.5) * 10 - 5,
      speed: 0.3 + Math.random() * 0.5,
      rotSpeed: 0.5 + Math.random() * 2,
      swayAmp: 0.5 + Math.random() * 1.5,
      swayFreq: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      scale: 0.08 + Math.random() * 0.12,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    petals.forEach((p, i) => {
      let y = p.y - (t * p.speed) % 20;
      if (y < -5) y += 20;

      const sway = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp;

      dummy.position.set(p.x + sway, y, p.z);
      dummy.rotation.set(
        t * p.rotSpeed * 0.3,
        t * p.rotSpeed * 0.5,
        t * p.rotSpeed * 0.2 + p.phase
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <planeGeometry args={[1, 1.3]} />
      <meshStandardMaterial
        color="#ff6eb4"
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
        emissive="#ff6eb4"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}

// Aurora background
function Aurora() {
  const meshRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      vec2 uv = vUv;
      float wave1 = sin(uv.y * 6.0 + uTime * 0.5 + uv.x * 2.0) * 0.5 + 0.5;
      float wave2 = sin(uv.y * 10.0 - uTime * 0.3 + uv.x * 3.0) * 0.5 + 0.5;
      float wave3 = sin(uv.y * 4.0 + uTime * 0.7) * 0.5 + 0.5;
      float n = noise(uv * 4.0 + uTime * 0.2);
      float pattern = (wave1 + wave2 + wave3) / 3.0 + n * 0.3;
      
      vec3 purple = vec3(0.102, 0.02, 0.2);
      vec3 rosePink = vec3(1.0, 0.431, 0.706);
      vec3 lavender = vec3(0.91, 0.769, 1.0);
      
      vec3 color = mix(purple, rosePink, pattern * uv.x);
      color = mix(color, lavender, pattern * 0.3);
      
      float alpha = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y) * 0.35;
      alpha *= pattern;
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} position={[0, -3, -5]}>
      <planeGeometry args={[30, 8]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// Floating hero 3D text
function HeroText() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Center>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={groupRef}>
          <Text3D
            font="/fonts/cormorant.json"
            size={1.5}
            height={0.3}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.01}
            bevelOffset={0}
            bevelSegments={5}
          >
            Shariya
            <meshStandardMaterial
              color="#ff6eb4"
              emissive="#ff6eb4"
              emissiveIntensity={0.3}
              metalness={0.6}
              roughness={0.2}
            />
          </Text3D>
        </group>
      </Float>
    </Center>
  );
}

// Fallback text (in case 3D font isn't available)
function FallbackHeroText() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  // Create text from individual geometries
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Glowing sphere cluster to represent the name visually */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2, 0.08, 16, 100]} />
          <meshStandardMaterial
            color="#ff6eb4"
            emissive="#ff6eb4"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2.5, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
        {/* Floating orbs */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#ff6eb4" : "#ffd700"}
                emissive={i % 2 === 0 ? "#ff6eb4" : "#ffd700"}
                emissiveIntensity={0.6}
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

export default function HeroSection() {
  const sectionRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // Entry animation
    const tl = gsap.timeline({ delay: 3.5 });

    tl.to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' },
        '-=0.8'
      );
    }

    // Scroll zoom effect
    const canvas = sectionRef.current?.querySelector('canvas');
    if (canvas) {
      gsap.to(canvas, {
        scale: 1.3,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="section" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#ff6eb4" />
          <pointLight position={[-5, -5, 5]} intensity={0.5} color="#ffd700" />
          <StarField count={5000} />
          <RosePetals count={40} />
          <Aurora />
          <FallbackHeroText />
        </Canvas>
      </div>

      {/* HTML overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        pointerEvents: 'none',
      }}>
        <div
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            fontWeight: 300,
            letterSpacing: '0.1em',
            background: 'linear-gradient(135deg, #ff6eb4, #ffd700, #e8c4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 30px rgba(255,110,180,0.3))',
            opacity: 0,
          }}
        >
          Shariya
        </div>
        <div
          ref={subtitleRef}
          className="hero-subtitle"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          ✦ Turning 20 · March 11th ✦
        </div>
      </div>

      <div className="hero-overlay" />
    </section>
  );
}
