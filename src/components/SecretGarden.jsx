import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, OrbitControls, Float, Text, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Island() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={meshRef}>
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[5, 4, 2, 8, 1]} />
        <meshStandardMaterial color="#3a5a40" roughness={0.8} />
      </mesh>
      
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1} position={[Math.cos(i) * 4, 3, Math.sin(i) * 4]}>
            <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={2} />
            </mesh>
            <pointLight intensity={2} color="#ffd700" distance={5} />
        </Float>
      ))}

      <Text
        position={[0, 2, 0]}
        fontSize={1}
        color="#ff6eb4"
        anchorX="center"
        anchorY="middle"
      >
        SHARIYA
      </Text>
    </group>
  );
}

function PlayerControls() {
  const { camera } = useThree();
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') moveState.current.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') moveState.current.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') moveState.current.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') moveState.current.right = true;
    };
    const handleKeyUp = (e) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') moveState.current.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') moveState.current.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') moveState.current.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') moveState.current.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const speed = 5 * delta;
    if (moveState.current.forward) camera.translateZ(-speed);
    if (moveState.current.backward) camera.translateZ(speed);
    if (moveState.current.left) camera.translateX(-speed);
    if (moveState.current.right) camera.translateX(speed);
  });

  return null;
}

export default function SecretGarden() {
  const [active, setActive] = useState(false);

  return (
    <section id="secret-garden" className="section" style={{ background: '#0a0010', position: 'relative' }}>
      <div className="section-title-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 className="garden-title" style={{ color: '#ff6eb4' }}>The Floating Garden 🪐</h2>
        <button 
            className="wish-button interactive" 
            onClick={() => setActive(!active)}
            style={{ marginTop: '1rem', background: 'none', border: '1px solid #ff6eb4', color: '#ff6eb4', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer' }}
        >
          {active ? 'Exit Exploration' : 'Enter Exploration Mode (WASD)'}
        </button>
      </div>

      <div style={{ width: '100%', height: '80vh' }}>
        <Canvas camera={{ position: [0, 5, 15], fov: 45 }} gl={{ antialias: false }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <Island />
          {active ? <PointerLockControls /> : <OrbitControls enableZoom={false} />}
          {active && <PlayerControls />}
          
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2.5} far={4} />
        </Canvas>
      </div>
      
      {active && (
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white', opacity: 0.6, fontSize: '0.8rem' }}>
              WASD or Arrows to Move | ESC to Unlock Cursor
          </div>
      )}
    </section>
  );
}
