import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
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

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef(null);

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

      <Loader onComplete={() => setLoaded(true)} />

      <main style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        {/* Hero + Balloons */}
        <div style={{ position: 'relative' }}>
          <HeroSection />
          <FloatingBalloons />
        </div>

        {/* Storytelling Timeline */}
        <TimelineSection />

        {/* Photo Carousel */}
        <PhotoCarousel />

        {/* Birthday Message */}
        <MessageSection />

        {/* Interactive Cake */}
        <CakeSection />

        {/* Final Wishes + Fireworks */}
        <WishesSection />

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
        </footer>
      </main>
    </>
  );
}
