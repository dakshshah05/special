import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Loader from './components/Loader';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import FloatingBalloons from './components/FloatingBalloons';
import TimelineSection from './components/TimelineSection';
import PhotoCarousel from './components/PhotoCarousel';
import MessageSection from './components/MessageSection';
import CakeSection from './components/CakeSection';
import WishesSection from './components/WishesSection';
import ShakeHug from './components/ShakeHug';
import RoseGarden from './components/RoseGarden';
import GiftSection from './components/GiftSection';
import EmojiParade from './components/EmojiParade';
import LoveLetter from './components/LoveLetter';
import EnhancedCursor from './components/EnhancedCursor';
import ParallaxLayers from './components/ParallaxLayers';
import PetalStorm from './components/PetalStorm';
import LoveMeter from './components/LoveMeter';
import ReactionPanel from './components/ReactionPanel';
import DynamicEnvironment from './components/DynamicEnvironment';
import SecretGarden from './components/SecretGarden';
import PhysicsPlayground from './components/PhysicsPlayground';
import GrandFinale from './components/GrandFinale';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.4,
      smoothWheel: true,
      smoothTouch: false,
    });

    lenisRef.current = lenis;
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
      <Loader onComplete={() => setLoaded(true)} />
      
      {/* Background Interactive Environment */}
      <DynamicEnvironment />
      <ParallaxLayers />
      
      {/* Global Interactive Elements - only shown after load */}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s ease' }}>
        <EnhancedCursor />
        <Navigation />
        <PetalStorm />
        <LoveMeter />
        <ReactionPanel />
        <GrandFinale />
        <ShakeHug />
      </div>

      <main style={{ 
        opacity: loaded ? 1 : 0, 
        transition: 'opacity 0.5s ease',
        position: 'relative',
        zIndex: 20 
      }}>
        <SecretGarden />

        <div style={{ position: 'relative' }}>
          <HeroSection />
          <FloatingBalloons />
        </div>

        <TimelineSection />
        <PhotoCarousel />
        <MessageSection />

        <RoseGarden onGoldenRoseClick={() => {}} />

        <CakeSection />
        <GiftSection />
        <WishesSection />
        
        <PhysicsPlayground />
        <EmojiParade />
        <LoveLetter />

        <footer style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          fontFamily: 'var(--font-serif)',
          color: 'var(--lavender-glow)',
          fontSize: '0.875rem',
          letterSpacing: '0.2em',
          opacity: 0.5,
          background: 'transparent',
          position: 'relative',
          zIndex: 10
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
