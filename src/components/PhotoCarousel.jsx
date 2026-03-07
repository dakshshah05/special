import React, { useEffect, useRef, memo, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_PHOTOS = 65;
const photos = Array.from({ length: TOTAL_PHOTOS }, (_, i) => ({
  id: i + 1,
  src: `/photos/photo-${String(i + 1).padStart(2, '0')}.jpg`,
}));

const Lightbox = memo(({ photo, onClose }) => {
  return (
    <motion.div 
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button className="lightbox-close interactive">✕</button>
      <motion.img 
        src={photo.src}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="lightbox-image"
      />
    </motion.div>
  );
});

const PhotoCard = memo(({ photo, index, onClick }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    gsap.to(cardRef.current.querySelector('.photo-inner'), {
      rotateX: -y * 20,
      rotateY: x * 20,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current.querySelector('.photo-inner'), {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  return (
    <div 
      className="scroll-photo-card" 
      data-index={index} 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(photo)}
    >
      <div className="photo-inner interactive">
        <img src={photo.src} alt={`Memory ${photo.id}`} loading="lazy" />
        <div className="photo-info">
          <span>Memory #{photo.id}</span>
        </div>
      </div>
    </div>
  );
});

export default memo(function PhotoCarousel() {
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    const horizontal = horizontalRef.current;
    if (!container || !horizontal) return;

    const cards = horizontal.querySelectorAll('.scroll-photo-card');
    
    // First, let's center the container items vertically and start the first one in the middle
    gsap.set(horizontal, { x: '42vw' }); // Roughly centered on start

    // Horizontal scroll timeline
    const totalWidth = horizontal.scrollWidth;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1.5,
        invalidateOnRefresh: true,
      }
    });

    tl.to(horizontal, {
      x: () => -(totalWidth - window.innerWidth * 0.4),
      ease: 'none'
    });

    // Add cinematic 3D effects
    cards.forEach((card, i) => {
      gsap.fromTo(card, 
        { 
          rotationY: 60,
          scale: 0.7,
          opacity: 0,
          z: -500
        },
        {
          rotationY: 0,
          scale: 1,
          opacity: 1,
          z: 0,
          scrollTrigger: {
            trigger: card,
            containerAnimation: tl,
            start: 'left right',
            end: 'center center',
            scrub: true,
          }
        }
      );

      gsap.to(card, {
        rotationY: -60,
        scale: 0.7,
        opacity: 0,
        z: -500,
        scrollTrigger: {
          trigger: card,
          containerAnimation: tl,
          start: 'center center',
          end: 'right left',
          scrub: true,
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="moments" className="scroll-carousel-section" ref={containerRef}>
      <div className="scroll-carousel-bg">
        <div className="ambient-light gold" />
        <div className="ambient-light pink" />
      </div>
      
      <div className="scroll-header">
        <h2 className="scroll-title">Universe of Us</h2>
        <p className="scroll-subtitle">Scroll down to journey through our stars ✦</p>
      </div>

      <div className="horizontal-container" ref={horizontalRef}>
        <div className="cards-wrapper">
          {photos.map((photo, i) => (
            <PhotoCard key={photo.id} photo={photo} index={i} onClick={setSelectedPhoto} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>
    </section>
  );
});
