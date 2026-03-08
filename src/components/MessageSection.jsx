import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mini starfield background for message section
function MiniStars({ count = 800 }) {
  const ref = useRef();

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      sizes[i] = Math.random() * 2 + 0.5;
    }
    return { positions, sizes };
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Envelope SVG that opens on scroll
function EnvelopeIcon({ progress }) {
  const flapAngle = Math.min(progress * 180, 180);

  return (
    <div className="envelope-icon">
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        {/* Envelope body */}
        <rect x="2" y="15" width="76" height="43" rx="4" fill="none" stroke="#ff6eb4" strokeWidth="1.5" opacity="0.8" />
        {/* Envelope flap */}
        <path
          d={`M2 15 L40 ${15 + (1 - progress) * 25} L78 15`}
          fill="none"
          stroke="#ffd700"
          strokeWidth="1.5"
          opacity="0.8"
        />
        {/* Heart inside */}
        <text x="40" y="42" textAnchor="middle" fill="#ff6eb4" fontSize="16"
          style={{ opacity: progress, transition: 'opacity 0.5s' }}>
          💌
        </text>
      </svg>
    </div>
  );
}

const message = `Dear Shariya,

As you leave your teenage years behind and step into the beautiful world of your twenties, know that every moment has been a gift. You are not just turning a page — you are writing a whole new chapter, filled with magic, love, and infinite possibility.

The stars themselves seem to shine a little brighter when you smile, and the universe conspires to make your dreams come true. You are brave, you are brilliant, and you are so deeply loved.

Here's to twenty years of you making the world a more beautiful place. May this year bring you everything your heart desires and more.

Happy 20th Birthday, Shariya 🌹`;

export default function MessageSection() {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const [envelopeProgress, setEnvelopeProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const textContainer = textContainerRef.current;
    if (!section || !textContainer) return;

    // Create word spans
    const words = message.split(/(\s+)/);
    textContainer.innerHTML = '';
    words.forEach(word => {
      if (word.trim()) {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        textContainer.appendChild(span);
      } else {
        // Preserve whitespace/newlines
        if (word.includes('\n')) {
          textContainer.appendChild(document.createElement('br'));
          textContainer.appendChild(document.createElement('br'));
        } else {
          const space = document.createTextNode(' ');
          textContainer.appendChild(space);
        }
      }
    });

    // GSAP ScrollTrigger for envelope
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'top 30%',
      scrub: true,
      onUpdate: (self) => {
        setEnvelopeProgress(self.progress);
      }
    });

    // Animate words
    const wordSpans = textContainer.querySelectorAll('.word');
    gsap.fromTo(wordSpans,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textContainer,
          start: 'top 70%',
          toggleActions: 'play none none none',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === section || t.trigger === textContainer) t.kill();
      });
    };
  }, []);

  return (
    <section id="message" ref={sectionRef} className="section" style={{
      background: 'var(--deep-void)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 0',
    }}>
      {/* Star background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <MiniStars count={800} />
        </Canvas>
      </div>

      <div className="message-container" style={{ zIndex: 2 }}>
        <EnvelopeIcon progress={envelopeProgress} />
        <div ref={textContainerRef} className="message-text" />
      </div>
    </section>
  );
}
