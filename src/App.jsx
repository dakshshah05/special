import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
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
  const [showMain, setShowMain] = useState(false);
  const lenisRef = useRef(null);

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true);
    // Short delay to ensure transition starts after state update
    setTimeout(() => setShowMain(true), 100);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => lenis.destroy();
  }, []);

  return (
    <>
      {/* Loader removed from DOM once completely done to prevent loops and memory issues */}
      {!showMain && <Loader onComplete={handleLoadingComplete} />}
      
      {/* Everything else is only truly interactive once loaded */}
      <div style={{ 
          opacity: loaded ? 1 : 0, 
          pointerEvents: loaded ? 'auto' : 'none',
          transition: 'opacity 1s ease' 
      }}>
        <EnhancedCursor />
        <Navigation />
        <Suspense fallback={null}>
            <PetalStorm />
        </Suspense>
        <LoveMeter />
        <ReactionPanel />
        <GrandFinale />
        <ShakeHug />

        {/* Background Atmosphere */}
        <Suspense fallback={null}>
            <DynamicEnvironment />
            <ParallaxLayers />
        </Suspense>

        <main style={{ 
            position: 'relative',
            zIndex: 20,
            visibility: loaded ? 'visible' : 'hidden'
        }}>
            <Suspense fallback={<div style={{ height: '50vh' }}></div>}>
                <SecretGarden />
            </Suspense>
            
            <div style={{ position: 'relative' }}>
                <HeroSection />
                <FloatingBalloons />
            </div>

            <TimelineSection />
            <PhotoCarousel />
            <MessageSection />

            <Suspense fallback={null}>
                <RoseGarden onGoldenRoseClick={() => {}} />
            </Suspense>

            <CakeSection />
            <Suspense fallback={null}>
                <GiftSection />
            </Suspense>
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
                paddingBottom: '5rem'
            }}>
                <p>Made with 💖 for Shariya</p>
                <p>✦ March 11th · Twenty ✦</p>
            </footer>
        </main>
      </div>
    </>
  );
}
