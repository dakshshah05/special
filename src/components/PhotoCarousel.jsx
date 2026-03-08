import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const photoCount = 65;
const photos = Array.from({ length: photoCount }, (_, i) => ({
  src: `/photos/photo-${String(i + 1).padStart(2, '0')}.jpg`,
  id: i + 1
}));

export default function PhotoCarousel() {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const totalWidth = scrollContainer.scrollWidth;
    
    // Smooth horizontal scroll animation
    const tween = gsap.to(scrollContainer, {
      x: () => -(scrollContainer.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${scrollContainer.scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set('.progress-fill', { width: self.progress * 100 + '%' });
        }
      }
    });

    // Parallax effect on images
    const images = scrollContainer.querySelectorAll('.carousel-image-wrapper');
    images.forEach(img => {
      gsap.fromTo(img.querySelector('img'), 
        { x: -50 },
        {
          x: 50,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true
          }
        }
      );
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section 
      id="carousel" 
      ref={containerRef} 
      className="carousel-horizontal-section"
      style={{
        background: 'var(--deep-void)',
        overflow: 'hidden'
      }}
    >
      <div className="carousel-header">
        <h2 className="carousel-title">Gallery of Dreams ✦</h2>
        <p className="carousel-subtitle">{photoCount} Moments Captured in Time</p>
      </div>

      <div ref={scrollRef} className="carousel-horizontal-track">
        {photos.map((photo) => (
          <div key={photo.id} className="carousel-image-wrapper">
            <img 
              src={photo.src} 
              alt={`Moment ${photo.id}`} 
              loading="lazy"
              onLoad={(e) => {
                 // Trigger a refresh after image loads to recalculate widths
                 ScrollTrigger.refresh();
              }}
            />
            <div className="image-overlay">
              <span className="image-number">{String(photo.id).padStart(2, '0')}</span>
            </div>
          </div>
        ))}
        {/* Extra spacer for end of scroll */}
        <div style={{ minWidth: '20vw', height: '100%' }} />
      </div>

      <div className="carousel-progress-bar">
        <div className="progress-fill" />
      </div>
    </section>
  );
}
