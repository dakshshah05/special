import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import FloatingBalloons from './components/FloatingBalloons';
import TimelineSection from './components/TimelineSection';
import PhotoCarousel from './components/PhotoCarousel';
import MessageSection from './components/MessageSection';
import CakeSection from './components/CakeSection';
import WishesSection from './components/WishesSection';
import MicroInteractions from './components/MicroInteractions';
import FinalSurprise from './components/FinalSurprise';
import RosesSection from './components/RosesSection';
import CorkboardSection from './components/CorkboardSection';
import GiftBoxSection from './components/GiftBoxSection';
import EmojiParade from './components/EmojiParade';
import useShake from './hooks/useShake';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef(null);

  // --- Shake to Hug Logic ---
  const [hugsSent, setHugsSent] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [floatingHugs, setFloatingHugs] = useState([]);
  
  const handleShake = useCallback(() => {
    setHugsSent(prev => prev + 1);
    setShowToast(true);
    
    // Spawn 5-10 random floating hearts
    const newHugs = Array.from({ length: Math.floor(Math.random() * 5) + 5 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100, // random start X position %
      size: Math.random() * 2 + 1, // random scale
    }));
    
    setFloatingHugs(prev => [...prev, ...newHugs]);

    // Cleanup toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
    
    // Cleanup floating elements after animation ends
    setTimeout(() => {
      setFloatingHugs(prev => prev.filter(hug => !newHugs.find(n => n.id === hug.id)));
    }, 4000);
  }, []);

  const { isSupported, permissionGranted, requestPermission } = useShake(handleShake, { threshold: 20 });
  // --------------------------

  // Initialize Lenis smooth scroll
  useEffect(() => {
    // Console Easter Egg (Secret Love Note)
    console.log(
      '%cEven the code behind this website thinks you\'re beautiful. Happy 20th, Shariya! 🤍',
      'font-size: 18px; font-style: italic; font-family: "Georgia", serif; color: #ff6eb4; background: #0a0010; padding: 20px; border: 2px solid #ffd700; border-radius: 10px; text-shadow: 0 0 10px rgba(255, 110, 180, 0.5);'
    );

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.4,
      smoothWheel: true,
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Prevent scroll during loading
  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [loaded]);

  return (
    <>
      <CustomCursor />
      <MicroInteractions />
      <Navigation />

      {/* Shake to Hug Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{
              position: 'fixed', top: 0, left: '50%', zIndex: 999999,
              background: 'rgba(255, 110, 180, 0.9)', color: '#fff',
              padding: '1rem 2rem', borderRadius: '50px',
              fontFamily: 'var(--font-sans)', fontWeight: 600,
              boxShadow: '0 10px 30px rgba(255, 110, 180, 0.4)',
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}
          >
            <span>🤗</span> Hug sent to Shariya! (Total: {hugsSent})
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Hearts spawned by Shaking */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999998, overflow: 'hidden' }}>
        <AnimatePresence>
          {floatingHugs.map(hug => (
            <motion.div
              key={hug.id}
              initial={{ opacity: 1, y: '100vh', x: `${hug.left}vw`, scale: hug.size }}
              animate={{ opacity: 0, y: '-20vh', x: `${hug.left + (Math.random() * 20 - 10)}vw` }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 + Math.random(), ease: 'easeOut' }}
              style={{ position: 'absolute', fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(255,110,180,0.5))' }}
            >
              🤍
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* iOS 13+ Permission Prompt for Accelerometer */}
      {isSupported && !permissionGranted && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 999999, background: 'rgba(10,0,20,0.9)', padding: '15px 25px',
          borderRadius: '12px', border: '1px solid var(--starlight-gold)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
          fontFamily: 'var(--font-sans)', color: '#fff', textAlign: 'center', fontSize: '0.9rem'
        }}>
          <p>Shake your phone to send a hug! 🤗</p>
          <button 
            onClick={requestPermission}
            style={{ 
              background: 'var(--starlight-gold)', color: '#000', border: 'none',
              padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            Enable Motion
          </button>
        </div>
      )}

      <Loader onComplete={() => setLoaded(true)} />

      <main style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        {/* Hero + Balloons */}
        <div style={{ position: 'relative' }}>
          <HeroSection />
          <FloatingBalloons />
        </div>

        {/* Storytelling Timeline */}
        <TimelineSection />

        {/* 3D Growing Roses */}
        <RosesSection />

        {/* 3D Memories Corkboard */}
        <CorkboardSection />

        {/* Photo Carousel */}
        <PhotoCarousel />

        {/* 3D Interactive Gift Box */}
        <GiftBoxSection />

        {/* Birthday Message */}
        <MessageSection />

        {/* Interactive Cake */}
        <CakeSection />

        {/* Final Wishes + Fireworks */}
        <WishesSection />

        {/* The Final 'Open if you love me' Letter */}
        <FinalSurprise />

        {/* Dancing Emoji Parade */}
        <EmojiParade />

        {/* Footer */}
        <footer style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          fontFamily: 'var(--font-serif)',
          color: 'var(--lavender-glow)',
          fontSize: '0.875rem',
          letterSpacing: '0.2em',
          opacity: 0.5,
          background: 'var(--deep-void)',
        }}>
          <p>Made with 💖 for Shariya</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            ✦ March 11th · Twenty ✦
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.65rem', opacity: 0.6 }}>
            {isSupported ? "Shake your phone to send her a hug!" : ""}
          </p>
        </footer>
      </main>
    </>
  );
}
