/* eslint-disable no-unused-vars, react-hooks/purity, react-hooks/immutability, react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const nameRef = useRef(null);
  const counterRef = useRef(null);
  const wipeLeftRef = useRef(null);
  const wipeRightRef = useRef(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Ring expand animation
    tl.fromTo(ringRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
    );

    // Ring glow pulse
    tl.to(ringRef.current, {
      scale: 1.5,
      boxShadow: '0 0 60px rgba(255,110,180,0.6), 0 0 120px rgba(255,110,180,0.3)',
      duration: 0.6,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 1,
    }, '-=0.2');

    // Typewriter effect for name
    const name = 'Shariya';
    tl.to(nameRef.current, {
      duration: 1.2,
      ease: 'none',
      onUpdate: function() {
        const progress = this.progress();
        const chars = Math.floor(progress * name.length);
        if (nameRef.current) {
          nameRef.current.textContent = name.substring(0, chars);
        }
      }
    }, '-=0.5');

    // Counter animation
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        setCounter(Math.floor(counterObj.val));
      }
    }, '-=1');

    // Split wipe
    tl.to(wipeLeftRef.current, {
      x: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
    }, '+=0.3');

    tl.to(wipeRightRef.current, {
      x: '100%',
      duration: 0.8,
      ease: 'power3.inOut',
    }, '<');

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.style.pointerEvents = 'none';
        }
      }
    }, '-=0.3');

    return () => tl.kill();
  }, [onComplete]);

  return (
    <>
      <div ref={containerRef} className="loader-container">
        <div ref={ringRef} className="loader-ring" />
        <div ref={nameRef} className="loader-name"></div>
        <div ref={counterRef} className="loader-counter">{counter}%</div>
      </div>
      <div ref={wipeLeftRef} className="loader-wipe-left" />
      <div ref={wipeRightRef} className="loader-wipe-right" />
    </>
  );
}

