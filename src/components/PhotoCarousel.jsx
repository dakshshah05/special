import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_PHOTOS = 65;
const photos = Array.from({ length: TOTAL_PHOTOS }, (_, i) => ({
  id: i + 1,
  src: `/photos/photo-${String(i + 1).padStart(2, '0')}.jpg`,
}));

// Lightbox for full-size viewing
const Lightbox = memo(function Lightbox({ photo, onClose, onPrev, onNext }) {
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') { setDirection(1); onNext(); }
      if (e.key === 'ArrowLeft') { setDirection(-1); onPrev(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.9 }),
  };

  return (
    <motion.div className="lightbox-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }} onClick={onClose}>

      <button className="lightbox-close interactive" onClick={onClose}>X</button>
      <button className="lightbox-nav lightbox-prev interactive"
        onClick={(e) => { e.stopPropagation(); setDirection(-1); onPrev(); }}>Prev</button>

      <AnimatePresence custom={direction} mode="wait">
        <motion.img
          key={photo.id} src={photo.src} alt="" className="lightbox-image"
          custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()} draggable={false}
        />
      </AnimatePresence>

      <button className="lightbox-nav lightbox-next interactive"
        onClick={(e) => { e.stopPropagation(); setDirection(1); onNext(); }}>Next</button>
      <div className="lightbox-counter">{photo.id} / {TOTAL_PHOTOS}</div>
    </motion.div>
  );
});

// A single scroll-card item
const ScrollCard = memo(function ScrollCard({ photo, index, onClick }) {
  const [loaded, setLoaded] = useState(false);
  
  // Create varying heights and vertical alignments for a dynamic "scattered" look
  const heights = [320, 420, 280, 360, 480, 300, 380, 440];
  const aligns = ['flex-start', 'center', 'flex-end', 'center', 'flex-start', 'flex-end', 'center'];
  
  const h = heights[index % heights.length];
  const align = aligns[index % aligns.length];
  const rotate = (Math.random() - 0.5) * 8; // Slight random tilt

  return (
    <div className="scroll-card-wrapper" style={{ alignItems: align }}>
      <div className="scroll-card interactive" onClick={() => onClick(photo)}
           style={{ height: `${h}px`, transform: `rotate(${rotate}deg)` }}>
        <div className="scroll-card-shimmer" style={{ display: loaded ? 'none' : 'block' }} />
        <img 
          src={photo.src} alt="" loading="lazy" draggable={false}
          onLoad={() => setLoaded(true)} style={{ opacity: loaded ? 1 : 0 }} 
        />
        <div className="scroll-card-overlay">
          <span>{photo.id.toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
});

export default memo(function PhotoScrollCarousel() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!section || !container || !track) return;

    // Calculate total scroll distance based on content width vs window width
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 200);

    // Create the horizontal scroll tween
    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
    });

    // Pin the container and scrub the tween
    const st = ScrollTrigger.create({
      trigger: container,
      pin: true,
      animation: tween,
      scrub: 1, // Smooth scrolling effect
      start: 'top top',
      end: () => `+=${track.scrollWidth}`,
      invalidateOnRefresh: true,
    });

    // Add parallax/floating effects to individual cards during scroll
    const cards = track.querySelectorAll('.scroll-card');
    cards.forEach((card, i) => {
      gsap.to(card, {
        y: (i % 2 === 0 ? -40 : 40),
        rotation: (i % 2 === 0 ? 5 : -5),
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: 'left right',
          end: 'right left',
          scrub: true,
        }
      });
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const openLightbox = useCallback((p) => setSelectedPhoto(p), []);
  const closeLightbox = useCallback(() => setSelectedPhoto(null), []);
  
  const goNext = useCallback(() => {
    setSelectedPhoto(prev => {
      if (!prev) return null;
      return photos[prev.id >= TOTAL_PHOTOS ? 0 : prev.id];
    });
  }, []);
  
  const goPrev = useCallback(() => {
    setSelectedPhoto(prev => {
      if (!prev) return null;
      return photos[prev.id <= 1 ? TOTAL_PHOTOS - 1 : prev.id - 2];
    });
  }, []);

  return (
    <>
      <section id="moments" ref={sectionRef} className="scroll-carousel-section">
        
        <div className="scroll-carousel-header">
          <h2 className="scroll-carousel-title" data-text="Our Moments">Our Moments</h2>
          <p className="scroll-carousel-subtitle">Scroll to explore 65 beautiful memories</p>
          <div className="scroll-indicator">
            <div className="mouse"><div className="wheel"></div></div>
            <span>Scroll</span>
          </div>
        </div>

        <div ref={containerRef} className="scroll-carousel-container">
          <div ref={trackRef} className="scroll-carousel-track">
            
            {/* Title card at the beginning of the track */}
            <div className="scroll-title-card">
              <h3>Chapter 20</h3>
              <p>A collection of smiles, adventures, and starlight.</p>
            </div>

            {/* All the photos scattered along the track */}
            {photos.map((photo, i) => (
              <ScrollCard key={photo.id} photo={photo} index={i} onClick={openLightbox} />
            ))}

            {/* End card */}
            <div className="scroll-end-card">
              <h3>End</h3>
              <p>To many more memories.</p>
            </div>

          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox 
            photo={selectedPhoto} onClose={closeLightbox} 
            onPrev={goPrev} onNext={goNext} 
          />
        )}
      </AnimatePresence>
    </>
  );
});
