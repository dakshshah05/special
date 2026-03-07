import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_PHOTOS = 65;
const photos = Array.from({ length: TOTAL_PHOTOS }, (_, i) => ({
  id: i + 1,
  src: `/photos/photo-${String(i + 1).padStart(2, '0')}.jpg`,
}));

// Lightbox with carousel navigation
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
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <button className="lightbox-close interactive" onClick={onClose}>✕</button>

      <button className="lightbox-nav lightbox-prev interactive"
        onClick={(e) => { e.stopPropagation(); setDirection(-1); onPrev(); }}>
        ‹
      </button>

      <AnimatePresence custom={direction} mode="wait">
        <motion.img
          key={photo.id}
          src={photo.src}
          alt={`Memory ${photo.id}`}
          className="lightbox-image"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      </AnimatePresence>

      <button className="lightbox-nav lightbox-next interactive"
        onClick={(e) => { e.stopPropagation(); setDirection(1); onNext(); }}>
        ›
      </button>

      <div className="lightbox-counter">
        {photo.id} / {TOTAL_PHOTOS}
      </div>
    </motion.div>
  );
});

// Individual photo card with tilt hover
const PhotoCard = memo(function PhotoCard({ photo, index, onClick }) {
  const cardRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.04)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  }, []);

  // Masonry-like varying heights
  const heights = [280, 340, 260, 320, 300, 360, 250, 310];
  const h = heights[index % heights.length];

  return (
    <motion.div
      ref={cardRef}
      className="photo-card interactive"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.06 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(photo)}
      style={{ height: `${h}px` }}
    >
      <div className="photo-card-shimmer" style={{ display: loaded ? 'none' : 'block' }} />
      <img
        src={photo.src}
        alt={`Memory ${photo.id}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
        draggable={false}
      />
      <div className="photo-card-overlay">
        <span className="photo-card-number">#{photo.id}</span>
      </div>
      <div className="photo-card-glow" />
    </motion.div>
  );
});

export default memo(function PhotoCarousel() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const sectionRef = useRef(null);

  const openLightbox = useCallback((photo) => setSelectedPhoto(photo), []);
  const closeLightbox = useCallback(() => setSelectedPhoto(null), []);

  const goNext = useCallback(() => {
    setSelectedPhoto(prev => {
      if (!prev) return null;
      const nextId = prev.id >= TOTAL_PHOTOS ? 1 : prev.id + 1;
      return photos[nextId - 1];
    });
  }, []);

  const goPrev = useCallback(() => {
    setSelectedPhoto(prev => {
      if (!prev) return null;
      const prevId = prev.id <= 1 ? TOTAL_PHOTOS : prev.id - 1;
      return photos[prevId - 1];
    });
  }, []);

  return (
    <section id="moments" ref={sectionRef} className="section album-section">
      <div className="album-header">
        <motion.div
          className="album-title-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.h2
          className="album-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Our Moments ✦
        </motion.h2>
        <motion.p
          className="album-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          65 memories, each one a star in our universe
        </motion.p>
        <motion.div
          className="album-title-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        />
      </div>

      <div className="album-grid">
        {photos.map((photo, i) => (
          <PhotoCard key={photo.id} photo={photo} index={i} onClick={openLightbox} />
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox
            photo={selectedPhoto}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </section>
  );
});
