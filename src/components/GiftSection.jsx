import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, Float, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import GiftBox from './GiftBox';

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
  "You are the best friend anyone could wish for. 👫"
];

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
                setTimeout(() => setCurrentReason(prev => (prev + 1) % reasons.length), 3500);
            }
        }, 50);
        return () => clearInterval(timer);
    }
  }, [isOpen, currentReason]);

  return (
    <section id="gift" className="section gift-section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-title-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 className="gift-title">A Surprise for You 🎁</h2>
        <p className="gift-subtitle">{isOpen ? 'Open your heart' : 'Click the box to see what\'s inside'}</p>
      </div>
      <div style={{ width: '100%', height: '70vh', position: 'relative' }}>
        <Canvas dpr={1} gl={{ antialias: false }}>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <Center>
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
              <GiftBox isOpen={isOpen} onClick={() => setIsOpen(true)} />
            </Float>
          </Center>
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </Canvas>
        {isOpen && (
            <div className="gift-reasons-overlay" style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: '90%', pointerEvents: 'none', zIndex: 10 }}>
                <div style={{ fontSize: '5rem', fontWeight: 'bold', color: '#ff6eb4', fontFamily: 'serif' }}>20</div>
                <div style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'white', background: 'rgba(26, 5, 51, 0.8)', padding: '20px', borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                    {typedText}
                </div>
            </div>
        )}
      </div>
    </section>
  );
}
