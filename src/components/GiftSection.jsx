import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const reasons = [
  "Your smile lights up the darkest rooms. ✨",
  "Your kindness is a gift to everyone you meet. 🎁",
  "You've grown into a person of incredible strength. 💪",
  "Your laugh is the most beautiful melody. 🎵",
  "You support me like no one else ever could. ⚓",
  "Your dreams are as big as your heart. ☁️",
  "You see beauty in everything around you. 🌸",
  "Your resilience inspires me every single day. 🔥",
  "You make every ordinary moment feel special. ✨",
  "Your presence brings a sense of peace and joy. 🕊️",
  "You are unapologetically yourself, and that's rare. 💎",
  "Your intelligence and wit are truly captivating. 🧠",
  "The way you care for others is legendary. ❤️",
  "You have a soul that sparkles with endless magic. ✨",
  "Your courage to face life is my biggest motivation. 🦁",
  "You are the best friend anyone could wish for. 👫",
  "Your eyes hold a universe of stories. 🌌",
  "You make me want to be a better person. 📈",
  "Your love is the anchor of my life. ⚓",
  "You are Shariya - unique, radiant, and loved. 🌹"
];

function GiftBox({ isOpen, onClick }) {
  const meshRef = useRef();
  const lidRef = useRef();

  useFrame((state) => {
    if (meshRef.current && !isOpen) {
        meshRef.current.rotation.y += 0.005;
    }
  });

  useEffect(() => {
    if (isOpen && lidRef.current) {
        gsap.to(lidRef.current.position, {
            y: 2.5,
            duration: 1.5,
            ease: 'elastic.out(1, 0.3)'
        });
        gsap.to(lidRef.current.rotation, {
            x: -Math.PI / 1.5,
            z: Math.PI / 8,
            duration: 1.5,
            ease: 'power2.out'
        });
    }
  }, [isOpen]);

  const ribbonMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
            float shimmer = sin(vUv.x * 10.0 + uTime * 5.0) * 0.5 + 0.5;
            gl_FragColor = vec4(1.0, 0.84, 0.0, 0.8 + shimmer * 0.2);
        }
    `,
    transparent: true
  }), []);

  useFrame(({ clock }) => {
    ribbonMaterial.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <group ref={meshRef} onClick={onClick}>
      {/* Box */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff6eb4" roughness={0.5} />
      </mesh>
      
      {/* Lid */}
      <group position={[0, 0.6, 0]} ref={lidRef}>
        <mesh>
            <boxGeometry args={[2.2, 0.4, 2.2]} />
            <meshStandardMaterial color="#ff6eb4" roughness={0.5} />
        </mesh>
         {/* Bow placeholder */}
        <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <primitive object={ribbonMaterial} attach="material" />
        </mesh>
      </group>

      {/* Ribbons */}
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

export default function GiftSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReason, setCurrentReason] = useState(0);
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    if (isOpen) {
        const fullText = reasons[currentReason];
        let i = 0;
        setTypedText('');
        const timer = setInterval(() => {
            setTypedText(fullText.substring(0, i + 1));
            i++;
            if (i >= fullText.length) {
                clearInterval(timer);
                setTimeout(() => {
                    setCurrentReason(prev => (prev + 1) % reasons.length);
                }, 3500);
            }
        }, 60);
        return () => clearInterval(timer);
    }
  }, [isOpen, currentReason]);

  return (
    <section id="gift" className="section gift-section">
      <div className="section-title-container">
        <h2 className="gift-title">A Surprise for You 🎁</h2>
        <p className="gift-subtitle">{isOpen ? 'Open your heart' : 'Click the box to see what\'s inside'}</p>
      </div>

      <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
        <Canvas dpr={[1, 1.5]}>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Environment preset="city" />
          
          <Center>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <GiftBox isOpen={isOpen} onClick={() => setIsOpen(true)} />
            </Float>
          </Center>

          {isOpen && [...Array(30)].map((_, i) => (
             <Float key={i} position={[(Math.random()-0.5)*15, 5+Math.random()*5, (Math.random()-0.5)*10]}>
                <mesh>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial color="#ffd700" />
                </mesh>
             </Float>
          ))}
          
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </Canvas>

        {isOpen && (
            <div className="gift-reasons-overlay" style={{
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                width: '80%',
                pointerEvents: 'none',
                zIndex: 10
            }}>
                <div style={{
                    fontSize: 'clamp(4rem, 10vw, 8rem)',
                    fontWeight: 'bold',
                    color: 'var(--starlight-gold)',
                    textShadow: '0 0 30px rgba(255, 215, 0, 0.8)',
                    fontFamily: 'var(--font-serif)',
                    animation: 'floatUp 2s ease-out forwards'
                }}>20</div>
                <div className="reason-text" style={{
                    marginTop: '2rem',
                    fontSize: 'clamp(1rem, 3vw, 1.8rem)',
                    fontFamily: 'var(--font-serif)',
                    color: 'white',
                    fontStyle: 'italic',
                    minHeight: '6rem',
                    background: 'rgba(26, 5, 51, 0.6)',
                    padding: '30px',
                    borderRadius: '30px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    {typedText}
                </div>
            </div>
        )}
      </div>
    </section>
  );
}
