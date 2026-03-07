import React, { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_PHOTOS = 65;
const photos = Array.from({ length: TOTAL_PHOTOS }, (_, i) => ({
  id: i + 1,
  src: `/photos/photo-${String(i + 1).padStart(2, '0')}.jpg`,
}));

const PhotoCard = memo(({ photo, index }) => {
  return (
    <div className="scroll-photo-card" data-index={index}>
      <div className="photo-inner">
        <img src={photo.src} alt={`Memory ${photo.id}`} loading="lazy" />
        <div className="photo-info">
          <span>#{photo.id}</span>
        </div>
      </div>
    </div>
  );
});

export default memo(function PhotoCarousel() {
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const horizontal = horizontalRef.current;
    if (!container || !horizontal) return;

    const cards = horizontal.querySelectorAll('.scroll-photo-card');
    
    // Horizontal scroll timeline
    const totalWidth = horizontal.scrollWidth - window.innerWidth;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth + window.innerWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    tl.to(horizontal, {
      x: -totalWidth,
      ease: 'none'
    });

    // Add 3D effects to individual cards
    cards.forEach((card, i) => {
      gsap.fromTo(card, 
        { 
          rotationY: 45,
          scale: 0.8,
          opacity: 0.3
        },
        {
          rotationY: 0,
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: card,
            containerAnimation: tl,
            start: 'left center+=20%',
            end: 'center center',
            scrub: true,
          }
        }
      );

      gsap.to(card, {
        rotationY: -45,
        scale: 0.8,
        opacity: 0.3,
        scrollTrigger: {
          trigger: card,
          containerAnimation: tl,
          start: 'center center',
          end: 'right center-=20%',
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
        <h2 className="scroll-title">Moments in Time</h2>
        <p className="scroll-subtitle">Scroll to journey through our universe ✦</p>
      </div>

      <div className="horizontal-container" ref={horizontalRef}>
        <div className="cards-wrapper">
          {photos.map((photo, i) => (
            <PhotoCard key={photo.id} photo={photo} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
});
