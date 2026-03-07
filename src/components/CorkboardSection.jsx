/* eslint-disable no-unused-vars, react-hooks/purity, react-hooks/immutability, react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
import React, { useState, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample memories for the corkboard
const MEMORIES = [
  { id: 1, src: '/photos/photo1.jpg', caption: 'Memories ðŸŒŸ', rotation: -5, x: 10, y: 15 },
  { id: 2, src: '/photos/photo2.jpg', caption: 'Always Smiling âœ¨', rotation: 8, x: 40, y: 5 },
  { id: 3, src: '/photos/photo3.jpg', caption: 'Special Moments ðŸ¤', rotation: -12, x: 75, y: 12 },
  { id: 4, src: '/photos/photo4.jpg', caption: 'Adventures ðŸŒŠ', rotation: 15, x: 20, y: 50 },
  { id: 5, src: '/photos/photo5.jpg', caption: 'Favorite Day ðŸŒ¸', rotation: -8, x: 55, y: 45 },
  { id: 6, src: '/photos/photo6.jpg', caption: 'Just Us ðŸ’«', rotation: 10, x: 80, y: 60 }
];

const Polaroid = memo(({ src, caption, rotation, x, y, onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: rotation - 20, z: -100 }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation, z: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay, type: 'spring', bounce: 0.4 }}
      className="cork-polaroid interactive"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
      whileHover={{ 
        scale: 1.15, 
        rotate: 0, 
        z: 50, // Lifts the polaroid off the corkboard in 3D space
        boxShadow: '0 25px 40px rgba(0,0,0,0.6)'
      }}
    >
      {/* The Push Pin */}
      <div className="push-pin" />
      
      <div className="cork-polaroid-img">
        <img src={src} alt={caption} loading="lazy" />
      </div>
      <div className="cork-polaroid-caption">
        {caption}
      </div>
    </motion.div>
  );
});

export default function CorkboardSection() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* 3D Corkboard Container */}
      <div className="corkboard-container">
        
        {/* Draw strings connecting the photos (SVG) */}
        <svg className="cork-strings" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 15 25 Q 25 10 45 15" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" fill="none" />
          <path d="M 45 15 Q 60 25 80 22" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" fill="none" />
          <path d="M 25 60 Q 40 45 60 55" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" fill="none" />
          <path d="M 60 55 Q 70 70 85 70" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" fill="none" />
          <path d="M 15 25 Q 20 45 25 60" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" fill="none" strokeDasharray="1,1"/>
        </svg>

        {MEMORIES.map((mem, i) => (
          <Polaroid 
            key={mem.id} 
            {...mem} 
            delay={i * 0.15}
            onClick={() => setSelectedImage(mem)}
          />
        ))}
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              className="lightbox-polaroid"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="lightbox-close interactive"
                onClick={() => setSelectedImage(null)}
              >
                âœ•
              </button>
              <div className="lightbox-img-wrapper">
                <img src={selectedImage.src} alt={selectedImage.caption} />
              </div>
              <div className="lightbox-caption">
                {selectedImage.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

