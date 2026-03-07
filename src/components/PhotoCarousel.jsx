import React, { useState, useCallback, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_PHOTOS = 65;
const photos = Array.from({ length: TOTAL_PHOTOS }, (_, i) => ({
  id: i + 1,
  src: `/photos/photo-${String(i + 1).padStart(2, '0')}.jpg`,
}));

// Surprise types that cycle through
const SURPRISE_TYPES = [
  'sparkle',    // sparkles fly out then photo reveals
  'flip',       // card flip reveal
  'shatter',    // glass shatters to reveal
  'curtain',    // curtain pulls apart
  'polaroid',   // drops in like a polaroid
  'glitch',     // glitch reveal
];

function getSurpriseType(index) {
  return SURPRISE_TYPES[index % SURPRISE_TYPES.length];
}

// Sparkle burst overlay
const SparkleReveal = memo(function SparkleReveal({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t); }, [onDone]);
  const sparkles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 60,
    y: 50 + (Math.random() - 0.5) * 60,
    size: 4 + Math.random() * 8,
    delay: Math.random() * 0.4,
    color: ['#ffd700', '#ff6eb4', '#e8c4ff', '#ffffff'][i % 4],
  })), []);

  return (
    <div className="surprise-overlay">
      {sparkles.map(s => (
        <motion.div key={s.id}
          style={{
            position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size, borderRadius: '50%',
            background: s.color, boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, delay: s.delay, ease: 'easeOut' }}
        />
      ))}
      <motion.div className="surprise-text"
        initial={{ scale: 0, rotate: -20 }} animate={{ scale: [0, 1.2, 1], rotate: 0 }}
        transition={{ duration: 0.6, ease: 'backOut' }}>
        ✨
      </motion.div>
    </div>
  );
});

// Glass shatter effect
const ShatterReveal = memo(function ShatterReveal({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1000); return () => clearTimeout(t); }, [onDone]);
  const shards = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i, col: i % 4, row: Math.floor(i / 4),
    tx: (Math.random() - 0.5) * 200, ty: (Math.random() - 0.5) * 200,
    rotate: Math.random() * 180 - 90,
  })), []);

  return (
    <div className="surprise-overlay shatter-grid">
      {shards.map(s => (
        <motion.div key={s.id} className="shard"
          style={{
            position: 'absolute',
            left: `${s.col * 25}%`, top: `${s.row * 33.33}%`,
            width: '25%', height: '33.33%',
            background: 'linear-gradient(135deg, rgba(232,196,255,0.3), rgba(255,110,180,0.15))',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: s.tx, y: s.ty, rotate: s.rotate, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1 + Math.random() * 0.2, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
});

// Curtain pull-apart
const CurtainReveal = memo(function CurtainReveal({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="surprise-overlay" style={{ display: 'flex' }}>
      <motion.div style={{
        width: '50%', height: '100%',
        background: 'linear-gradient(90deg, #1a0533, #0f0520)',
        borderRight: '1px solid rgba(255,110,180,0.3)',
      }}
        initial={{ x: 0 }} animate={{ x: '-105%' }}
        transition={{ duration: 0.8, ease: [0.6, 0, 0.3, 1] }}
      />
      <motion.div style={{
        width: '50%', height: '100%',
        background: 'linear-gradient(270deg, #1a0533, #0f0520)',
        borderLeft: '1px solid rgba(255,110,180,0.3)',
      }}
        initial={{ x: 0 }} animate={{ x: '105%' }}
        transition={{ duration: 0.8, ease: [0.6, 0, 0.3, 1] }}
      />
    </div>
  );
});

// Glitch reveal
const GlitchReveal = memo(function GlitchReveal({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 800); return () => clearTimeout(t); }, [onDone]);
  const slices = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i, top: i * 12.5,
    tx: (Math.random() - 0.5) * 40,
  })), []);

  return (
    <div className="surprise-overlay">
      {slices.map(s => (
        <motion.div key={s.id}
          style={{
            position: 'absolute', left: 0, right: 0,
            top: `${s.top}%`, height: '12.5%',
            background: 'rgba(10,0,16,0.85)',
            borderBottom: '1px solid rgba(255,110,180,0.2)',
          }}
          animate={{
            x: [0, s.tx, -s.tx * 0.5, s.tx * 0.3, 0],
            opacity: [1, 0.9, 0.7, 0.3, 0],
          }}
          transition={{ duration: 0.7, delay: s.id * 0.03 }}
        />
      ))}
    </div>
  );
});

// The Photo Slide itself — handles per-photo surprise + reveal
const PhotoSlide = memo(function PhotoSlide({ photo, direction, surpriseType }) {
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleRevealDone = useCallback(() => setRevealed(true), []);

  // Reset on photo change
  useEffect(() => {
    setRevealed(false);
    setLoaded(false);
  }, [photo.id]);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 600 : -600,
      scale: 0.85,
      rotateY: dir > 0 ? 25 : -25,
      opacity: 0,
    }),
    center: {
      x: 0, scale: 1, rotateY: 0, opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -600 : 600,
      scale: 0.85,
      rotateY: dir > 0 ? -25 : 25,
      opacity: 0,
    }),
  };

  const flipVariants = {
    enter: { rotateY: 180, opacity: 0 },
    center: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -180, opacity: 0 },
  };

  const polaroidVariants = {
    enter: { y: -400, rotate: (Math.random() - 0.5) * 30, opacity: 0 },
    center: { y: 0, rotate: (Math.random() - 0.5) * 4, opacity: 1 },
    exit: { y: 400, rotate: (Math.random() - 0.5) * 30, opacity: 0 },
  };

  const usedVariants = surpriseType === 'flip' ? flipVariants
    : surpriseType === 'polaroid' ? polaroidVariants
    : slideVariants;

  const transitionConfig = surpriseType === 'flip'
    ? { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
    : surpriseType === 'polaroid'
    ? { type: 'spring', damping: 20, stiffness: 180 }
    : { duration: 0.6, ease: [0.4, 0, 0.2, 1] };

  return (
    <motion.div
      className={`carousel-slide ${surpriseType === 'polaroid' ? 'polaroid-frame' : ''}`}
      custom={direction}
      variants={usedVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transitionConfig}
      style={{ perspective: '1200px' }}
    >
      <div className="carousel-photo-wrapper">
        {!loaded && <div className="carousel-shimmer" />}

        <img
          src={photo.src}
          alt={`Memory ${photo.id}`}
          className="carousel-photo"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
          draggable={false}
        />

        {/* Surprise overlay */}
        <AnimatePresence>
          {loaded && !revealed && (
            <>
              {surpriseType === 'sparkle' && <SparkleReveal onDone={handleRevealDone} />}
              {surpriseType === 'shatter' && <ShatterReveal onDone={handleRevealDone} />}
              {surpriseType === 'curtain' && <CurtainReveal onDone={handleRevealDone} />}
              {surpriseType === 'glitch' && <GlitchReveal onDone={handleRevealDone} />}
              {(surpriseType === 'flip' || surpriseType === 'polaroid') && (() => { setTimeout(handleRevealDone, 100); return null; })()}
            </>
          )}
        </AnimatePresence>

        {/* Glow frame on reveal */}
        <motion.div className="carousel-photo-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {surpriseType === 'polaroid' && (
        <div className="polaroid-caption">Memory #{photo.id} ✦</div>
      )}
    </motion.div>
  );
});

// Progress bar
const ProgressBar = memo(function ProgressBar({ current, total }) {
  return (
    <div className="carousel-progress">
      <div className="carousel-progress-bar">
        <motion.div className="carousel-progress-fill"
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <span className="carousel-progress-text">{current + 1} / {total}</span>
    </div>
  );
});

// Thumbnail strip
const ThumbnailStrip = memo(function ThumbnailStrip({ current, onSelect }) {
  const stripRef = useRef(null);

  useEffect(() => {
    if (stripRef.current) {
      const thumb = stripRef.current.children[current];
      if (thumb) {
        thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [current]);

  // Show subset around current
  const visibleRange = 15;
  const start = Math.max(0, current - Math.floor(visibleRange / 2));
  const end = Math.min(TOTAL_PHOTOS, start + visibleRange);
  const visible = photos.slice(start, end);

  return (
    <div className="carousel-thumbnails" ref={stripRef}>
      {visible.map((photo, i) => (
        <motion.div
          key={photo.id}
          className={`carousel-thumb ${current === start + i ? 'active' : ''}`}
          onClick={() => onSelect(start + i)}
          whileHover={{ scale: 1.15, y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={photo.src} alt="" loading="lazy" draggable={false} />
        </motion.div>
      ))}
    </div>
  );
});

export default memo(function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const autoplayRef = useRef(null);

  const currentPhoto = photos[currentIndex];
  const surpriseType = getSurpriseType(currentIndex);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % TOTAL_PHOTOS);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + TOTAL_PHOTOS) % TOTAL_PHOTOS);
  }, []);

  const goTo = useCallback((idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  }, [currentIndex]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === ' ') { e.preventDefault(); setAutoplay(p => !p); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  // Autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(goNext, 3500);
    }
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [autoplay, goNext]);

  // Touch swipe
  const touchStart = useRef(0);
  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext(); else goPrev();
    }
  }, [goNext, goPrev]);

  return (
    <section id="moments" className="section carousel-section"
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* Section header */}
      <motion.div className="carousel-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}>
        <div className="carousel-header-line" />
        <h2 className="carousel-section-title">Our Moments</h2>
        <p className="carousel-section-subtitle">
          Swipe through {TOTAL_PHOTOS} memories — each one a little surprise ✦
        </p>
        <div className="carousel-header-line" />
      </motion.div>

      {/* Main carousel area */}
      <div className="carousel-stage">
        <button className="carousel-btn carousel-btn-prev interactive" onClick={goPrev}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <div className="carousel-viewport">
          <AnimatePresence custom={direction} mode="wait">
            <PhotoSlide
              key={currentPhoto.id}
              photo={currentPhoto}
              direction={direction}
              surpriseType={surpriseType}
            />
          </AnimatePresence>
        </div>

        <button className="carousel-btn carousel-btn-next interactive" onClick={goNext}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* Controls bar */}
      <div className="carousel-controls">
        <ProgressBar current={currentIndex} total={TOTAL_PHOTOS} />
        <button
          className={`carousel-autoplay interactive ${autoplay ? 'active' : ''}`}
          onClick={() => setAutoplay(p => !p)}
          title="Autoplay (Space)"
        >
          {autoplay ? '⏸' : '▶'}
        </button>
      </div>

      {/* Thumbnail strip */}
      <ThumbnailStrip current={currentIndex} onSelect={goTo} />

      {/* Surprise type indicator */}
      <motion.div className="surprise-indicator"
        key={surpriseType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 0.4 }}>
        {surpriseType === 'sparkle' && '✨ Sparkle'}
        {surpriseType === 'flip' && '🔄 Flip'}
        {surpriseType === 'shatter' && '💎 Shatter'}
        {surpriseType === 'curtain' && '🎭 Curtain'}
        {surpriseType === 'polaroid' && '📸 Polaroid'}
        {surpriseType === 'glitch' && '⚡ Glitch'}
      </motion.div>
    </section>
  );
});
